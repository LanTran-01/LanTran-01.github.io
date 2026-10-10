import { useLayoutEffect, useRef, useState } from "react";
import type { Layout, LayoutNode } from "./layout";

export interface DisplayNode extends LayoutNode {
  opacity: number;
  /** Collapsing child still animating out; not interactive. */
  exiting: boolean;
}

const easeMech = (t: number) => 1 - Math.pow(1 - t, 3);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function settle(layout: Layout): DisplayNode[] {
  return layout.nodes.map((n) => ({ ...n, opacity: 1, exiting: false }));
}

/**
 * Interpolates node boxes between successive layouts (expand / collapse).
 * Entering children grow out of their parent; leaving children fold back into
 * it. Runs a short rAF tween only while a transition is in flight; with
 * `duration = 0` the new layout is applied immediately.
 */
export function useTweenedLayout(layout: Layout, duration: number): DisplayNode[] {
  const [display, setDisplay] = useState<DisplayNode[]>(() => settle(layout));
  const currentRef = useRef<DisplayNode[]>(display);
  const firstRef = useRef(true);

  useLayoutEffect(() => {
    if (firstRef.current) {
      firstRef.current = false;
      return;
    }
    const commit = (nodes: DisplayNode[]) => {
      currentRef.current = nodes;
      setDisplay(nodes);
    };
    if (duration <= 0) {
      commit(settle(layout));
      return;
    }

    const from = new Map(currentRef.current.map((n) => [n.id, n]));
    type Track = { a: DisplayNode; b: DisplayNode };
    const tracks: Track[] = [];

    for (const n of layout.nodes) {
      const prev = from.get(n.id);
      const target: DisplayNode = { ...n, opacity: 1, exiting: false };
      if (prev && !prev.exiting) {
        tracks.push({ a: prev, b: target });
      } else {
        const parent = n.parentId ? (from.get(n.parentId) ?? layout.byId.get(n.parentId)) : undefined;
        const start: DisplayNode = parent
          ? { ...target, y: parent.y + parent.h - n.h, opacity: 0 }
          : { ...target, opacity: prev ? prev.opacity : 0 };
        if (prev) Object.assign(start, { x: prev.x, y: prev.y });
        tracks.push({ a: start, b: target });
      }
    }
    for (const prev of currentRef.current) {
      if (layout.byId.has(prev.id) || prev.exiting) continue;
      const parent = prev.parentId ? layout.byId.get(prev.parentId) : undefined;
      const end: DisplayNode = parent
        ? { ...prev, y: parent.y + parent.h - prev.h, opacity: 0, exiting: true }
        : { ...prev, opacity: 0, exiting: true };
      tracks.push({ a: { ...prev, exiting: true }, b: end });
    }

    let raf = 0;
    const t0 = performance.now();
    const frame = (now: number) => {
      const t = Math.min(1, (now - t0) / duration);
      if (t >= 1) {
        commit(settle(layout));
        return;
      }
      const k = easeMech(t);
      commit(
        tracks.map(({ a, b }) => ({
          ...b,
          x: lerp(a.x, b.x, k),
          y: lerp(a.y, b.y, k),
          // Children fade in late and out early so they never overlap their neighbours visibly.
          opacity: b.opacity > a.opacity ? lerp(a.opacity, b.opacity, Math.max(0, (k - 0.25) / 0.75)) : lerp(a.opacity, b.opacity, Math.min(1, k / 0.6)),
        })),
      );
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [layout, duration]);

  return display;
}
