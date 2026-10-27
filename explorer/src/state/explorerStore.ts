import { create } from "zustand";
import type { ComponentId, InspectionMode } from "@/data/types";
import type { ComponentCapabilities } from "@/features/model/modelTypes";
import type { ModelSource } from "@/data/modelConfig";
import { MACHINE, MACHINE_SCOPE } from "@/data/machine";

/**
 * Global explorer state.
 *
 * Source-of-truth rules:
 *  - The URL owns *which assembly is selected* (`/explore/:slug`) and whether the
 *    systems map is open (`/systems`). `RouteSync` mirrors it into `selected` /
 *    `view`. To select something, navigate (see hooks/useExplorerNavigation).
 *  - Everything else (hover, mode, explode amount, sub-selection) lives here.
 *
 * With machine-scope modes (MACHINE.modes.scope) the mode belongs to the whole
 * model: it survives selection changes, and the exterior view switches to the
 * internal one when the part being focused has nothing to show from outside.
 */

export type ExplorerView = "explorer" | "systems";

export type ModelStatus =
  | { state: "loading"; source: ModelSource; progress: number }
  | { state: "ready"; source: ModelSource; note?: string }
  | { state: "error"; source: ModelSource; message: string };

/** Pixels of the viewport covered by UI panels; the viewer centres the model in the free area. */
export interface ViewInsets {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

export interface ExplorerState {
  view: ExplorerView;
  selected: ComponentId | null;
  hovered: ComponentId | null;
  mode: InspectionMode;
  /** Exploded distance, 0 (assembled) … 1 (fully separated). */
  explode: number;
  selectedSubassembly: string | null;
  hoveredSubassembly: string | null;

  /** Selected node in the systems map, and the assemblies it maps to. */
  systemsNode: string | null;
  linkedComponents: ComponentId[];
  /** Assembly clicked in the 3D view while the systems map is open; the map highlights its nodes. */
  systemsComponent: ComponentId | null;

  capabilities: Partial<Record<ComponentId, ComponentCapabilities>>;
  modelStatus: ModelStatus;
  viewInsets: ViewInsets;
  /** Incremented to ask the camera rig to return to its framing for the current selection. */
  cameraResetNonce: number;
  reducedMotion: boolean;

  /* ---- actions ---- */
  /** Called by RouteSync only. Resets per-assembly inspection state when the selection changes. */
  syncRoute: (view: ExplorerView, selected: ComponentId | null) => void;
  setHovered: (id: ComponentId | null) => void;
  setMode: (mode: InspectionMode) => void;
  setExplode: (value: number) => void;
  setSelectedSubassembly: (id: string | null) => void;
  setHoveredSubassembly: (id: string | null) => void;
  setSystemsNode: (id: string | null, linked: ComponentId[]) => void;
  setSystemsComponent: (id: ComponentId | null) => void;
  setCapabilities: (caps: Partial<Record<ComponentId, ComponentCapabilities>>) => void;
  setModelStatus: (status: ModelStatus) => void;
  setViewInsets: (insets: ViewInsets) => void;
  resetCamera: () => void;
  setReducedMotion: (value: boolean) => void;
}

const HAS_INTERNAL_VIEW = MACHINE.modes.list.some((m) => m.id === "cutaway");

/** Machine scope: leave the exterior view when every part to focus would be hidden in it. */
function revealPatch(
  s: Pick<ExplorerState, "mode" | "capabilities">,
  ids: readonly ComponentId[],
): Partial<ExplorerState> | null {
  if (!MACHINE_SCOPE || !HAS_INTERNAL_VIEW || s.mode !== "exterior" || ids.length === 0) return null;
  return ids.every((id) => s.capabilities[id]?.exterior === false) ? { mode: "cutaway" } : null;
}

const prefersReducedMotion =
  typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

export const useExplorerStore = create<ExplorerState>()((set, get) => ({
  view: "explorer",
  selected: null,
  hovered: null,
  mode: "exterior",
  explode: 0,
  selectedSubassembly: null,
  hoveredSubassembly: null,
  systemsNode: null,
  linkedComponents: [],
  systemsComponent: null,
  capabilities: {},
  modelStatus: { state: "loading", source: "procedural", progress: 0 },
  viewInsets: { left: 0, right: 0, top: 0, bottom: 0 },
  cameraResetNonce: 0,
  reducedMotion: !!prefersReducedMotion,

  syncRoute: (view, selected) => {
    const prev = get();
    if (prev.view === view && prev.selected === selected) return;
    const selectionChanged = prev.selected !== selected;
    const reset = MACHINE_SCOPE
      ? { selectedSubassembly: null, hoveredSubassembly: null, ...revealPatch(prev, selected ? [selected] : []) }
      : { mode: "exterior" as InspectionMode, explode: 0, selectedSubassembly: null, hoveredSubassembly: null };
    set({
      view,
      selected,
      ...(selectionChanged ? reset : null),
      ...(view !== "systems" ? { systemsNode: null, linkedComponents: [], systemsComponent: null } : null),
    });
  },
  setHovered: (id) => {
    if (get().hovered !== id) set({ hovered: id });
  },
  setMode: (mode) => {
    const patch: Partial<ExplorerState> = { mode };
    // Entering the exploded view with nothing separated would look like a no-op.
    if (mode === "exploded" && get().explode === 0) patch.explode = 0.65;
    if (mode !== "exploded") patch.explode = 0;
    set(patch);
  },
  setExplode: (value) => set({ explode: Math.min(1, Math.max(0, value)) }),
  setSelectedSubassembly: (id) => set({ selectedSubassembly: id }),
  setHoveredSubassembly: (id) => {
    if (get().hoveredSubassembly !== id) set({ hoveredSubassembly: id });
  },
  setSystemsNode: (id, linked) =>
    set({ systemsNode: id, linkedComponents: id ? linked : [], ...(id ? revealPatch(get(), linked) : null) }),
  setSystemsComponent: (systemsComponent) => set({ systemsComponent }),
  setCapabilities: (capabilities) => {
    // A deep link may select a part before the model has reported what it contains.
    const s = get();
    const focus = s.view === "systems" ? s.linkedComponents : s.selected ? [s.selected] : [];
    set({ capabilities, ...revealPatch({ mode: s.mode, capabilities }, focus) });
  },
  setModelStatus: (modelStatus) => set({ modelStatus }),
  setViewInsets: (insets) => {
    const v = get().viewInsets;
    if (v.left === insets.left && v.right === insets.right && v.top === insets.top && v.bottom === insets.bottom) return;
    set({ viewInsets: insets });
  },
  resetCamera: () => set((s) => ({ cameraResetNonce: s.cameraResetNonce + 1 })),
  setReducedMotion: (reducedMotion) => set({ reducedMotion }),
}));
