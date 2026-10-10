import { useEffect } from "react";
import { adjacentComponent } from "@/data/components";
import { useExplorerStore } from "@/state/explorerStore";
import { useExplorerNavigation } from "./useExplorerNavigation";
import { INSPECTION_MODES, isModeSupported } from "./useInspectionModes";

const NON_TEXT_INPUTS = new Set(["range", "checkbox", "radio", "button", "submit", "reset"]);

/** Text entry swallows every key; sliders only need the arrow/paging keys. */
function ownsKey(target: EventTarget | null, key: string): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable || target.closest("textarea, select, [contenteditable='true']")) return true;
  if (target instanceof HTMLInputElement) {
    if (!NON_TEXT_INPUTS.has(target.type)) return true;
    return target.type === "range" && /^(Arrow|Page|Home|End)/.test(key);
  }
  return false;
}

function isDialogOpen(): boolean {
  return document.querySelector("dialog[open], [aria-modal='true']") !== null;
}

/**
 * App-wide keys:
 *   Esc  clear sub-selection, else back to the full machine
 *   R    reset camera
 *   1–4  inspection modes (assembly selected, mode supported)
 *   ←/→  previous / next assembly on a detail page
 */
export function useGlobalShortcuts() {
  const { selectComponent, goHome } = useExplorerNavigation();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey) return;
      if (ownsKey(e.target, e.key) || isDialogOpen()) return;
      const s = useExplorerStore.getState();
      const onDetail = s.view === "explorer" && s.selected !== null;

      if (e.key === "Escape") {
        if (s.selectedSubassembly) {
          s.setSelectedSubassembly(null);
          e.preventDefault();
        } else if (onDetail) {
          goHome();
          e.preventDefault();
        }
        return;
      }
      if (e.key === "r" || e.key === "R") {
        s.resetCamera();
        e.preventDefault();
        return;
      }
      if (!onDetail || !s.selected) return;

      const mode = INSPECTION_MODES.find((m) => m.key === e.key);
      if (mode) {
        if (isModeSupported(mode.id, s.capabilities[s.selected])) s.setMode(mode.id);
        e.preventDefault();
        return;
      }
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        selectComponent(adjacentComponent(s.selected, e.key === "ArrowLeft" ? -1 : 1).id);
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectComponent, goHome]);
}
