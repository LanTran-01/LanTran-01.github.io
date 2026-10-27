import { useEffect, useMemo, useRef } from "react";
import { Box3, Vector3, type Mesh } from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { subassemblySubtreeIds } from "@/data/components";
import { calloutItems } from "./calloutItems";
import type { ComponentId, Subassembly } from "@/data/types";
import { useExplorerStore, type ViewInsets } from "@/state/explorerStore";
import type { ViewerModelIndex } from "@/features/model/annotateModel";
import { MaterialController } from "@/features/model/materialController";
import { viewerRuntime } from "./viewerRuntime";
import styles from "./Viewer.module.css";

/**
 * Architecture-mode callouts: one label per top-level subassembly of the
 * selected assembly that has geometry, laid out in screen space in two
 * columns beside the assembly with thin elbow leader lines. Labels are spread
 * vertically so they never overlap.
 *
 * `SubassemblyCalloutTracker` lives inside the Canvas and positions the DOM
 * every rendered frame; `SubassemblyCallouts` renders the DOM overlay.
 */

function useCalloutsActive(): ComponentId | null {
  return useExplorerStore((s) => (s.view !== "systems" && s.mode === "architecture" ? s.selected : null));
}

/* ------------------------------------------------------------------ */
/* In-canvas layout                                                   */
/* ------------------------------------------------------------------ */

const ROW_GAP = 30;
const COLUMN_GAP = 44;
const EDGE_PAD = 14;
const ELBOW = 18;
const SIDE_EPS = 0.12;

interface Slot {
  id: string;
  ax: number;
  ay: number;
  y: number;
  left: boolean;
  visible: boolean;
}

export function SubassemblyCalloutTracker({ model }: { model: ViewerModelIndex }) {
  const active = useCalloutsActive();
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);
  const invalidate = useThree((s) => s.invalidate);
  const items = useMemo(() => calloutItems(model, active), [model, active]);

  useEffect(() => {
    viewerRuntime.callouts.invalidate = invalidate;
    return () => {
      viewerRuntime.callouts.invalidate = null;
    };
  }, [invalidate]);

  const scratch = useMemo(
    () => ({
      box: new Box3(),
      tmp: new Box3(),
      v: new Vector3(),
      corner: new Vector3(),
      slots: [] as Slot[],
      widths: new Map<string, { w: number; h: number }>(),
      sideMeshes: [] as Mesh[],
    }),
    [],
  );

  // Label sizes change with the item set and the responsive breakpoint.
  useEffect(() => {
    scratch.widths.clear();
  }, [items, scratch, size.width]);

  useFrame(() => {
    const dom = viewerRuntime.callouts;
    const container = dom.container;
    if (!container) return;
    if (!active || items.length === 0) {
      container.dataset.visible = "false";
      return;
    }
    const insets: ViewInsets = useExplorerStore.getState().viewInsets;
    const W = size.width;
    const H = size.height;
    const { box, tmp, v, corner, slots, widths, sideMeshes } = scratch;

    // Screen bounds of the whole assembly (current pose).
    const compMeshes = model.byComponent.get(active) ?? [];
    MaterialController.currentBounds(compMeshes, box, tmp);
    let minX = Infinity;
    let maxX = -Infinity;
    for (let i = 0; i < 8; i++) {
      corner.set(i & 1 ? box.max.x : box.min.x, i & 2 ? box.max.y : box.min.y, i & 4 ? box.max.z : box.min.z);
      corner.project(camera);
      const sx = ((corner.x + 1) / 2) * W;
      minX = Math.min(minX, sx);
      maxX = Math.max(maxX, sx);
    }
    const mid = (minX + maxX) / 2;
    const camSide = camera.position.x >= 0 ? 1 : -1;

    slots.length = items.length;
    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      // Mirrored pairs: anchor on the copy facing the camera.
      let hasL = false;
      let hasR = false;
      for (const m of it.meshes) {
        m.getWorldPosition(v);
        if (v.x > SIDE_EPS) hasL = true;
        else if (v.x < -SIDE_EPS) hasR = true;
      }
      sideMeshes.length = 0;
      for (const m of it.meshes) {
        if (!(hasL && hasR)) {
          sideMeshes.push(m);
          continue;
        }
        m.getWorldPosition(v);
        if (Math.abs(v.x) <= SIDE_EPS || Math.sign(v.x) === camSide) sideMeshes.push(m);
      }
      MaterialController.currentBounds(sideMeshes, box, tmp);
      box.getCenter(v).project(camera);
      const slot = slots[i] ?? (slots[i] = { id: "", ax: 0, ay: 0, y: 0, left: false, visible: true });
      slot.id = it.sub.id;
      slot.ax = ((v.x + 1) / 2) * W;
      slot.ay = ((1 - v.y) / 2) * H;
      slot.visible = v.z < 1;
      slot.left = slot.ax < mid;
    }

    // Balance columns so one side never carries everything.
    balance(slots);

    const top = insets.top + EDGE_PAD + 10;
    const bottom = H - insets.bottom - EDGE_PAD - 10;
    const leftEdge = Math.max(insets.left + EDGE_PAD, 0);
    const rightEdge = Math.min(W - insets.right - EDGE_PAD, W);
    layoutColumn(slots, true, top, bottom);
    layoutColumn(slots, false, top, bottom);

    for (const s of slots) {
      const el = dom.labels.get(s.id);
      const path = dom.paths.get(s.id);
      const dot = dom.dots.get(s.id);
      if (!el || !path || !dot) continue;
      let size = widths.get(s.id);
      if (!size || size.w === 0) {
        size = { w: el.offsetWidth, h: el.offsetHeight };
        widths.set(s.id, size);
      }
      const { w, h } = size;
      let lx: number; // label box left
      let edgeX: number; // where the leader meets the label
      if (s.left) {
        edgeX = Math.max(leftEdge + w, Math.min(minX - COLUMN_GAP, s.ax - ELBOW * 2));
        lx = edgeX - w;
      } else {
        edgeX = Math.min(rightEdge - w, Math.max(maxX + COLUMN_GAP, s.ax + ELBOW * 2));
        lx = edgeX;
      }
      const elbowX = s.left ? edgeX + ELBOW : edgeX - ELBOW;
      el.style.transform = `translate3d(${Math.round(lx)}px, ${Math.round(s.y - h / 2)}px, 0)`;
      el.style.visibility = s.visible ? "visible" : "hidden";
      path.setAttribute(
        "d",
        `M${s.ax.toFixed(1)} ${s.ay.toFixed(1)}L${elbowX.toFixed(1)} ${s.y.toFixed(1)}L${edgeX.toFixed(1)} ${s.y.toFixed(1)}`,
      );
      path.style.visibility = s.visible ? "visible" : "hidden";
      dot.setAttribute("cx", s.ax.toFixed(1));
      dot.setAttribute("cy", s.ay.toFixed(1));
      dot.style.visibility = s.visible ? "visible" : "hidden";
    }
    container.dataset.visible = viewerRuntime.rigTransitioning ? "false" : "true";
  });

  return null;
}

function balance(slots: Slot[]): void {
  const max = Math.ceil(slots.length / 2) + 1;
  let left = 0;
  for (const s of slots) if (s.left) left++;
  let right = slots.length - left;
  while (left > max || right > max) {
    const fromLeft = left > max;
    // Move the slot nearest the other side.
    let best: Slot | null = null;
    for (const s of slots) {
      if (s.left !== fromLeft) continue;
      if (!best || (fromLeft ? s.ax > best.ax : s.ax < best.ax)) best = s;
    }
    if (!best) break;
    best.left = !fromLeft;
    if (fromLeft) {
      left--;
      right++;
    } else {
      right--;
      left++;
    }
  }
}

const column: Slot[] = [];
function layoutColumn(slots: Slot[], left: boolean, top: number, bottom: number): void {
  column.length = 0;
  for (const s of slots) if (s.left === left) column.push(s);
  column.sort((a, b) => a.ay - b.ay);
  let prev = -Infinity;
  for (const s of column) {
    s.y = Math.max(s.ay, prev + ROW_GAP, top);
    prev = s.y;
  }
  // Shift up if the column overflows the free area's bottom.
  const overflow = prev - bottom;
  if (overflow > 0) {
    let next = Infinity;
    for (let i = column.length - 1; i >= 0; i--) {
      const s = column[i];
      s.y = Math.min(s.y - overflow, next - ROW_GAP);
      next = s.y;
    }
  }
}

/* ------------------------------------------------------------------ */
/* DOM overlay                                                        */
/* ------------------------------------------------------------------ */

export function SubassemblyCallouts({ model }: { model: ViewerModelIndex | null }) {
  const active = useCalloutsActive();
  const selectedSub = useExplorerStore((s) => s.selectedSubassembly);
  const hoveredSub = useExplorerStore((s) => s.hoveredSubassembly);
  const items = useMemo(() => calloutItems(model, active), [model, active]);
  const containerRef = useRef<HTMLDivElement>(null);
  const dom = viewerRuntime.callouts;

  useEffect(() => {
    dom.container = containerRef.current;
    dom.invalidate?.();
    return () => {
      dom.container = null;
    };
  }, [dom, items]);

  if (items.length === 0) return null;

  const isOn = (sub: Subassembly) => {
    const focus = hoveredSub ?? selectedSub;
    return !!focus && subassemblySubtreeIds(sub.id).has(focus);
  };

  return (
    <div ref={containerRef} className={styles.callouts} data-visible="false" aria-label="Subassembly callouts">
      <svg className={styles.calloutLines} aria-hidden="true">
        {items.map(({ sub }) => (
          <g key={sub.id} data-on={isOn(sub)}>
            <path
              ref={(el) => {
                if (el) dom.paths.set(sub.id, el);
                else dom.paths.delete(sub.id);
              }}
              className={styles.calloutPath}
            />
            <circle
              ref={(el) => {
                if (el) dom.dots.set(sub.id, el);
                else dom.dots.delete(sub.id);
              }}
              r={2.2}
              className={styles.calloutDot}
            />
          </g>
        ))}
      </svg>
      {items.map(({ sub }) => (
        <button
          key={sub.id}
          type="button"
          ref={(el) => {
            if (el) dom.labels.set(sub.id, el);
            else dom.labels.delete(sub.id);
          }}
          className={styles.callout}
          data-on={isOn(sub)}
          aria-pressed={selectedSub === sub.id}
          onPointerEnter={() => useExplorerStore.getState().setHoveredSubassembly(sub.id)}
          onPointerLeave={() => {
            const s = useExplorerStore.getState();
            if (s.hoveredSubassembly === sub.id) s.setHoveredSubassembly(null);
          }}
          onFocus={() => useExplorerStore.getState().setHoveredSubassembly(sub.id)}
          onBlur={() => {
            const s = useExplorerStore.getState();
            if (s.hoveredSubassembly === sub.id) s.setHoveredSubassembly(null);
          }}
          onClick={() => {
            const s = useExplorerStore.getState();
            s.setSelectedSubassembly(s.selectedSubassembly === sub.id ? null : sub.id);
          }}
        >
          <span className={styles.calloutCode}>{sub.code}</span>
          <span className={styles.calloutName}>{sub.name}</span>
        </button>
      ))}
    </div>
  );
}
