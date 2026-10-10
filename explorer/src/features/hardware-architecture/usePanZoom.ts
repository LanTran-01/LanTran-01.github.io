import { useCallback, useEffect, useMemo, useRef, type RefObject } from "react";
import type { Box } from "./layout";

/**
 * Pan / zoom for an SVG viewport without React re-renders.
 *
 * The view lives in a ref and is written to the content group's `transform`
 * attribute at most once per animation frame. Supports wheel / trackpad zoom
 * around the cursor, drag to pan (pointer capture once the drag threshold is
 * crossed, so taps still reach nodes), two-finger pinch, double-click zoom and
 * eased programmatic moves (instant under reduced motion).
 */

export interface View {
  x: number;
  y: number;
  k: number;
}

/** Screen-space rectangle relative to the viewport element. */
export interface Rect {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

export const MIN_SCALE = 0.4;
export const MAX_SCALE = 2.5;

const clampK = (k: number) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, k));
const ease = (t: number) => 1 - Math.pow(1 - t, 3);

export interface PanZoomOptions {
  reducedMotion: boolean;
  /** Called after every applied frame (readouts). */
  onView?: (v: View) => void;
  /** Pointer position in world units, or null when the pointer leaves. */
  onPointerWorld?: (p: { x: number; y: number } | null) => void;
  /** Tap / click on empty canvas (no drag). */
  onBackgroundTap?: () => void;
}

export interface PanZoomApi {
  getView: () => View;
  zoomBy: (factor: number, at?: { x: number; y: number }) => void;
  fitTo: (box: Box, area?: Rect, opts?: { animate?: boolean; minK?: number; align?: "center" | "start" }) => void;
  ensureVisible: (box: Box, area: Rect) => void;
  /** True between a drag that just ended and the next pointerdown. Nodes ignore clicks then. */
  wasDrag: () => boolean;
}

const INTERACTIVE = "[data-node], [data-ui]";

export function usePanZoom(
  viewportRef: RefObject<SVGSVGElement | null>,
  contentRef: RefObject<SVGGElement | null>,
  options: PanZoomOptions,
): PanZoomApi {
  const view = useRef<View>({ x: 0, y: 0, k: 1 });
  const raf = useRef(0);
  const tween = useRef(0);
  const dragged = useRef(false);
  const opts = useRef(options);
  useEffect(() => {
    opts.current = options;
  });

  const apply = useCallback(() => {
    if (raf.current) return;
    raf.current = requestAnimationFrame(() => {
      raf.current = 0;
      const g = contentRef.current;
      const v = view.current;
      if (g) g.setAttribute("transform", `translate(${v.x.toFixed(2)} ${v.y.toFixed(2)}) scale(${v.k.toFixed(4)})`);
      opts.current.onView?.(v);
    });
  }, [contentRef]);

  const stopTween = () => {
    if (tween.current) cancelAnimationFrame(tween.current);
    tween.current = 0;
  };

  const animateTo = useCallback(
    (target: View, duration = 300) => {
      stopTween();
      if (opts.current.reducedMotion || duration <= 0) {
        view.current = target;
        apply();
        return;
      }
      const from = { ...view.current };
      const t0 = performance.now();
      const step = (now: number) => {
        const t = Math.min(1, (now - t0) / duration);
        const e = ease(t);
        view.current = {
          x: from.x + (target.x - from.x) * e,
          y: from.y + (target.y - from.y) * e,
          k: from.k + (target.k - from.k) * e,
        };
        apply();
        tween.current = t < 1 ? requestAnimationFrame(step) : 0;
      };
      tween.current = requestAnimationFrame(step);
    },
    [apply],
  );

  const zoomAround = useCallback(
    (k: number, at: { x: number; y: number }, animate: boolean) => {
      const v = view.current;
      const nk = clampK(k);
      const wx = (at.x - v.x) / v.k;
      const wy = (at.y - v.y) / v.k;
      const next = { k: nk, x: at.x - wx * nk, y: at.y - wy * nk };
      if (animate) animateTo(next, 220);
      else {
        stopTween();
        view.current = next;
        apply();
      }
    },
    [animateTo, apply],
  );

  /* ---------------- pointer / wheel listeners ---------------- */
  useEffect(() => {
    const svg = viewportRef.current;
    if (!svg) return;
    const pointers = new Map<number, { x: number; y: number }>();
    let start: { x: number; y: number; view: View; id: number } | null = null;
    let dragging = false;
    let pinch: { d: number; mid: { x: number; y: number }; view: View } | null = null;
    let pinched = false;

    const local = (e: { clientX: number; clientY: number }) => {
      const r = svg.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const world = (p: { x: number; y: number }) => {
      const v = view.current;
      return { x: (p.x - v.x) / v.k, y: (p.y - v.y) / v.k };
    };
    const pinchState = () => {
      const [a, b] = [...pointers.values()];
      return { d: Math.hypot(a.x - b.x, a.y - b.y) || 1, mid: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 } };
    };

    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      const target = e.target as Element;
      if (target.closest("[data-ui]")) return;
      stopTween();
      dragged.current = false;
      const p = local(e);
      pointers.set(e.pointerId, p);
      if (pointers.size === 1) {
        start = { ...p, view: { ...view.current }, id: e.pointerId };
        dragging = false;
        pinched = false;
      } else if (pointers.size === 2) {
        pinch = { ...pinchState(), view: { ...view.current } };
        pinched = true;
        for (const id of pointers.keys()) {
          if (!svg.hasPointerCapture(id)) {
            try {
              svg.setPointerCapture(id);
            } catch {
              /* pointer already released */
            }
          }
        }
      }
    };

    const onMove = (e: PointerEvent) => {
      const p = local(e);
      if (e.pointerType === "mouse") opts.current.onPointerWorld?.(world(p));
      if (!pointers.has(e.pointerId)) return;
      pointers.set(e.pointerId, p);
      if (pinch && pointers.size >= 2) {
        const now = pinchState();
        const k = clampK(pinch.view.k * (now.d / pinch.d));
        const wx = (pinch.mid.x - pinch.view.x) / pinch.view.k;
        const wy = (pinch.mid.y - pinch.view.y) / pinch.view.k;
        view.current = { k, x: now.mid.x - wx * k, y: now.mid.y - wy * k };
        dragged.current = true;
        apply();
        return;
      }
      if (!start || e.pointerId !== start.id) return;
      const dx = p.x - start.x;
      const dy = p.y - start.y;
      if (!dragging) {
        const threshold = e.pointerType === "mouse" ? 4 : 8;
        if (Math.hypot(dx, dy) < threshold) return;
        dragging = true;
        dragged.current = true;
        svg.setPointerCapture(e.pointerId);
        svg.dataset.dragging = "true";
      }
      view.current = { k: start.view.k, x: start.view.x + dx, y: start.view.y + dy };
      apply();
    };

    const onUp = (e: PointerEvent) => {
      if (!pointers.has(e.pointerId)) return;
      const wasTap = e.type === "pointerup" && pointers.size === 1 && !dragging && !pinched;
      pointers.delete(e.pointerId);
      if (svg.hasPointerCapture(e.pointerId)) svg.releasePointerCapture(e.pointerId);
      if (pointers.size < 2) pinch = null;
      if (pointers.size === 1) {
        // Continue as a pan with the remaining finger.
        const [[id, p]] = [...pointers.entries()];
        start = { ...p, view: { ...view.current }, id };
        dragging = true;
      }
      if (pointers.size === 0) {
        start = null;
        dragging = false;
        delete svg.dataset.dragging;
        if (wasTap && !(e.target as Element).closest(INTERACTIVE)) opts.current.onBackgroundTap?.();
      }
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      stopTween();
      const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? 400 : 1;
      const dy = e.deltaY * unit;
      // Trackpad pinch arrives as ctrl+wheel with small deltas; scale it up.
      const factor = Math.exp(-dy * (e.ctrlKey ? 0.012 : 0.0016));
      zoomAround(view.current.k * factor, local(e), false);
    };

    const onDbl = (e: MouseEvent) => {
      if ((e.target as Element).closest(INTERACTIVE)) return;
      zoomAround(view.current.k * 1.6, local(e), true);
    };

    const onLeave = () => opts.current.onPointerWorld?.(null);

    svg.addEventListener("pointerdown", onDown);
    svg.addEventListener("pointermove", onMove);
    svg.addEventListener("pointerup", onUp);
    svg.addEventListener("pointercancel", onUp);
    svg.addEventListener("pointerleave", onLeave);
    svg.addEventListener("wheel", onWheel, { passive: false });
    svg.addEventListener("dblclick", onDbl);
    return () => {
      svg.removeEventListener("pointerdown", onDown);
      svg.removeEventListener("pointermove", onMove);
      svg.removeEventListener("pointerup", onUp);
      svg.removeEventListener("pointercancel", onUp);
      svg.removeEventListener("pointerleave", onLeave);
      svg.removeEventListener("wheel", onWheel);
      svg.removeEventListener("dblclick", onDbl);
    };
  }, [viewportRef, apply, zoomAround]);

  useEffect(
    () => () => {
      cancelAnimationFrame(raf.current);
      cancelAnimationFrame(tween.current);
    },
    [],
  );

  return useMemo<PanZoomApi>(() => {
    const viewportSize = () => {
      const r = viewportRef.current?.getBoundingClientRect();
      return { w: r?.width ?? 0, h: r?.height ?? 0 };
    };
    return {
      getView: () => view.current,
      zoomBy: (factor, at) => {
        const { w, h } = viewportSize();
        zoomAround(view.current.k * factor, at ?? { x: w / 2, y: h / 2 }, true);
      },
      fitTo: (box, area, o) => {
        const { w, h } = viewportSize();
        if (w < 10 || h < 10) return;
        const a = area ?? { left: 0, top: 0, right: w, bottom: h };
        const aw = a.right - a.left;
        const ah = a.bottom - a.top;
        const k = clampK(Math.max(o?.minK ?? 0, Math.min(aw / box.w, ah / box.h)));
        const x = o?.align === "start" && box.w * k > aw ? a.left - box.x * k : a.left + (aw - box.w * k) / 2 - box.x * k;
        const y = box.h * k > ah ? a.top - box.y * k : a.top + (ah - box.h * k) / 2 - box.y * k;
        const next = { k, x, y };
        if (o?.animate) animateTo(next, 320);
        else {
          stopTween();
          view.current = next;
          apply();
        }
      },
      ensureVisible: (box, area) => {
        const v = view.current;
        const pad = 28;
        const sx0 = box.x * v.k + v.x;
        const sy0 = box.y * v.k + v.y;
        const sx1 = sx0 + box.w * v.k;
        const sy1 = sy0 + box.h * v.k;
        const inside = sx0 >= area.left + pad && sx1 <= area.right - pad && sy0 >= area.top + pad && sy1 <= area.bottom - pad;
        if (inside) return;
        let dx = 0;
        let dy = 0;
        const fitsX = sx1 - sx0 <= area.right - area.left - pad * 2;
        const fitsY = sy1 - sy0 <= area.bottom - area.top - pad * 2;
        if (!fitsX || sx0 < area.left + pad) dx = area.left + pad - sx0;
        else if (sx1 > area.right - pad) dx = area.right - pad - sx1;
        if (!fitsY || sy0 < area.top + pad) dy = area.top + pad - sy0;
        else if (sy1 > area.bottom - pad) dy = area.bottom - pad - sy1;
        animateTo({ k: v.k, x: v.x + dx, y: v.y + dy }, 320);
      },
      wasDrag: () => dragged.current,
    };
  }, [viewportRef, zoomAround, animateTo, apply]);
}
