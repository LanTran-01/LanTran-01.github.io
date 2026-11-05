import { create } from "zustand";
import type { ComponentId, InspectionMode } from "@/data/types";
import type { ComponentCapabilities } from "@/features/model/modelTypes";
import type { ModelSource } from "@/data/modelConfig";
import { MACHINE_SCOPE, REVEAL_MODE } from "@/data/machine";

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

/** Separation used when the exploded view opens without one (also the reveal default). */
const DEFAULT_EXPLODE = 0.65;

/** Mode change, with a visible separation when it opens the exploded view. */
function modePatch(mode: InspectionMode, explode: number): Partial<ExplorerState> {
  if (mode !== "exploded") return { mode, explode: 0 };
  return { mode, explode: explode === 0 ? DEFAULT_EXPLODE : explode };
}

/** Machine scope: leave the exterior view when every part to focus would be hidden in it. */
function revealPatch(
  s: Pick<ExplorerState, "mode" | "capabilities" | "explode">,
  ids: readonly ComponentId[],
): Partial<ExplorerState> | null {
  if (!MACHINE_SCOPE || !REVEAL_MODE || s.mode !== "exterior" || ids.length === 0) return null;
  return ids.every((id) => s.capabilities[id]?.exterior === false) ? modePatch(REVEAL_MODE, s.explode) : null;
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
  // Entering the exploded view with nothing separated would look like a no-op.
  setMode: (mode) => set(modePatch(mode, get().explode)),
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
    set({ capabilities, ...revealPatch({ mode: s.mode, capabilities, explode: s.explode }, focus) });
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
