import { useEffect, type RefObject } from "react";
import { useExplorerStore, type ViewInsets } from "@/state/explorerStore";

type Side = keyof ViewInsets;

const contributions: Record<Side, Map<symbol, number>> = {
  left: new Map(),
  right: new Map(),
  top: new Map(),
  bottom: new Map(),
};

function publish() {
  const sum = (side: Side) => Math.max(0, ...contributions[side].values());
  useExplorerStore.getState().setViewInsets({
    left: sum("left"),
    right: sum("right"),
    top: sum("top"),
    bottom: sum("bottom"),
  });
}

/**
 * Reports how much of the viewport an element covers on one side so the camera
 * rig can centre the model in the remaining free area. Width is used for
 * left/right, height for top/bottom. Pass `enabled = false` when the panel is
 * collapsed or overlays the canvas without needing to offset it.
 */
export function useViewInset(ref: RefObject<HTMLElement | null>, side: Side, enabled = true) {
  useEffect(() => {
    const el = ref.current;
    const key = Symbol(side);
    if (!el || !enabled) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      const v =
        side === "left" ? r.right : side === "right" ? window.innerWidth - r.left : side === "top" ? r.bottom : window.innerHeight - r.top;
      contributions[side].set(key, Math.max(0, Math.round(v)));
      publish();
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
      contributions[side].delete(key);
      publish();
    };
  }, [ref, side, enabled]);
}
