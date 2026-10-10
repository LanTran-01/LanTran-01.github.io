import { useEffect, useRef } from "react";
import { Raycaster, Vector2, type Intersection, type Object3D } from "three";
import { useThree } from "@react-three/fiber";
import { findSubassembly, getComponent } from "@/data/components";
import type { ComponentId } from "@/data/types";
import { useExplorerStore } from "@/state/explorerStore";
import { useExplorerNavigation } from "@/hooks/useExplorerNavigation";
import { getPartTag, type PartTag } from "@/features/gundam/modelTypes";
import type { MaterialController } from "@/features/gundam/materialController";
import { viewerRuntime } from "./viewerRuntime";

/**
 * Pointer interaction against the real meshes.
 *
 * Raycasts only the controller's `pickables` (visible, not ghosted), so hidden
 * or faded parts never intercept the pointer. Hover writes to the store (so
 * the UI lists stay in sync) but only clears what it set itself. Clicks are
 * distinguished from orbit drags by a 4 px threshold.
 */

const CLICK_SLOP = 4;
const LABEL_OFFSET_X = 16;
const LABEL_OFFSET_Y = 18;

function inspecting(mode: string): boolean {
  return mode === "cutaway" || mode === "architecture" || mode === "exploded";
}

export function useModelInteraction(controller: MaterialController | null) {
  const gl = useThree((s) => s.gl);
  const camera = useThree((s) => s.camera);
  const connected = useThree((s) => s.events.connected) as HTMLElement | undefined;
  const { selectComponent } = useExplorerNavigation();
  const selectRef = useRef(selectComponent);
  selectRef.current = selectComponent;

  useEffect(() => {
    if (!controller) return;
    const el: HTMLElement = connected ?? gl.domElement;
    const raycaster = new Raycaster();
    const ndc = new Vector2();
    const hits: Intersection<Object3D>[] = [];
    const label = viewerRuntime.hoverLabel;

    let ownHover: ComponentId | null = null;
    let ownSub: string | null = null;
    let down: { x: number; y: number; id: number } | null = null;
    let pending: PointerEvent | null = null;
    let raf = 0;

    const pick = (clientX: number, clientY: number): PartTag | null => {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return null;
      ndc.set(((clientX - r.left) / r.width) * 2 - 1, -((clientY - r.top) / r.height) * 2 + 1);
      raycaster.setFromCamera(ndc, camera);
      hits.length = 0;
      raycaster.intersectObjects(controller.pickables, false, hits);
      for (const h of hits) {
        const tag = getPartTag(h.object);
        if (tag) return tag;
      }
      return null;
    };

    const hideLabel = () => {
      if (label.root) label.root.dataset.visible = "false";
    };

    const clearHover = () => {
      const s = useExplorerStore.getState();
      if (ownHover && s.hovered === ownHover) s.setHovered(null);
      if (ownSub && s.hoveredSubassembly === ownSub) s.setHoveredSubassembly(null);
      ownHover = null;
      ownSub = null;
      el.style.cursor = "";
      hideLabel();
    };

    const updateHover = (e: PointerEvent) => {
      const tag = pick(e.clientX, e.clientY);
      const s = useExplorerStore.getState();
      if (!tag) {
        clearHover();
        return;
      }
      const id = tag.componentId;
      if (ownHover !== id || s.hovered !== id) {
        ownHover = id;
        s.setHovered(id);
      }
      const subActive = s.view !== "systems" && s.selected === id && inspecting(s.mode);
      const sub = subActive ? (tag.subassemblyId ?? null) : null;
      if (sub !== ownSub) {
        if (sub) s.setHoveredSubassembly(sub);
        else if (ownSub && s.hoveredSubassembly === ownSub) s.setHoveredSubassembly(null);
        ownSub = sub;
      }
      el.style.cursor = "pointer";

      if (label.root && label.title && label.meta && label.sub) {
        const spec = getComponent(id);
        label.title.textContent = spec.shortName;
        label.meta.textContent = spec.designation;
        const hit = sub ? findSubassembly(sub) : undefined;
        label.sub.textContent = hit ? `${hit.node.code} · ${hit.node.name}` : "";
        label.sub.hidden = !hit;
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left + LABEL_OFFSET_X;
        const y = e.clientY - r.top + LABEL_OFFSET_Y;
        // Flip to the other side of the pointer near the right / bottom edge.
        const w = label.root.offsetWidth;
        const h = label.root.offsetHeight;
        const fx = x + w > r.width - 8 ? x - w - LABEL_OFFSET_X * 2 : x;
        const fy = y + h > r.height - 8 ? y - h - LABEL_OFFSET_Y * 2 : y;
        label.root.style.transform = `translate3d(${Math.round(fx)}px, ${Math.round(fy)}px, 0)`;
        label.root.dataset.visible = "true";
      }
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      if (e.buttons !== 0) {
        // Orbiting / panning: no hover churn.
        if (ownHover || ownSub) clearHover();
        return;
      }
      pending = e;
      if (!raf) {
        raf = requestAnimationFrame(() => {
          raf = 0;
          if (pending) updateHover(pending);
          pending = null;
        });
      }
    };

    const onDown = (e: PointerEvent) => {
      if (e.button !== 0) {
        down = null;
        return;
      }
      down = { x: e.clientX, y: e.clientY, id: e.pointerId };
    };

    const onUp = (e: PointerEvent) => {
      const d = down;
      down = null;
      if (!d || d.id !== e.pointerId || e.button !== 0) return;
      if (Math.hypot(e.clientX - d.x, e.clientY - d.y) > CLICK_SLOP) return;
      const tag = pick(e.clientX, e.clientY);
      if (!tag) return; // empty space: no-op
      const s = useExplorerStore.getState();
      // The camera is about to move under the pointer; drop the stale label.
      hideLabel();
      const id = tag.componentId;
      if (s.view === "systems") {
        s.setSystemsComponent(id);
        return;
      }
      if (s.selected === id) {
        if (inspecting(s.mode) && tag.subassemblyId) {
          s.setSelectedSubassembly(tag.subassemblyId);
        }
        return;
      }
      clearHover();
      selectRef.current(id);
    };

    const onLeave = () => {
      pending = null;
      clearHover();
    };
    const onCancel = () => {
      down = null;
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointerleave", onLeave);
    el.addEventListener("pointercancel", onCancel);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointerleave", onLeave);
      el.removeEventListener("pointercancel", onCancel);
      if (raf) cancelAnimationFrame(raf);
      clearHover();
    };
  }, [controller, camera, gl, connected]);
}
