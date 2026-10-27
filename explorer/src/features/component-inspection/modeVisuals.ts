import type { ComponentId, InspectionMode, PartLayer } from "@/data/types";
import { subassemblySubtreeIds } from "@/data/components";
import { MACHINE_SCOPE } from "@/data/machine";
import type { ExplorerState } from "@/state/explorerStore";
import type { PartTag } from "@/features/model/modelTypes";

/**
 * Pure mapping from explorer state → per-mesh visual targets.
 *
 * The material controller damps each mesh's current values towards these
 * targets every frame; nothing here touches three.js objects.
 */

export interface VisualTarget {
  /** Multiplier on the material's own opacity. 0 hides the mesh. */
  opacity: number;
  /** 0 = original colour, 1 = fully darkened / desaturated. */
  mute: number;
  /** Accent emissive strength. */
  glow: number;
  /** 0..1 fraction of the mesh's explode vector to apply. */
  explode: number;
}

/** Accent edge-line opacity per component (0 hides them). */
export type EdgeTargets = Map<ComponentId, number>;

/** The subset of store state that drives visuals, with derived sets precomputed. */
export interface VisualInputs {
  selected: ComponentId | null;
  hovered: ComponentId | null;
  mode: InspectionMode;
  explode: number;
  /** Assemblies highlighted from the systems map (linked or clicked). */
  highlighted: Set<ComponentId>;
  /** Subtree of the selected or hovered subassembly; empty when none. */
  focusSubtree: Set<string>;
  /** True when the focus comes from a hover only (lighter treatment). */
  focusIsHover: boolean;
}

export function deriveVisualInputs(s: ExplorerState): VisualInputs {
  const highlighted = new Set<ComponentId>(s.linkedComponents);
  if (s.systemsComponent) highlighted.add(s.systemsComponent);
  const focusId = s.hoveredSubassembly ?? s.selectedSubassembly;
  return {
    selected: s.view === "systems" ? null : s.selected,
    hovered: s.hovered,
    mode: s.mode,
    explode: s.explode,
    highlighted,
    focusSubtree: focusId && s.selected ? subassemblySubtreeIds(focusId) : new Set(),
    focusIsHover: !!s.hoveredSubassembly && s.hoveredSubassembly !== s.selectedSubassembly,
  };
}

/** Same inputs → same output; cheap to diff. */
export function visualInputsKey(v: VisualInputs): string {
  return [
    v.selected,
    v.hovered,
    v.mode,
    v.explode.toFixed(4),
    [...v.highlighted].sort().join(","),
    [...v.focusSubtree].sort().join(","),
    v.focusIsHover,
  ].join("|");
}

/* ---- tuning ------------------------------------------------------ */

const MUTE_OTHERS = 0.78;
const MUTE_OVERVIEW = 0.5;
const MUTE_HOVER_OTHERS = 0.14;
const GLOW_SELECTED = 0.03;
const GLOW_LINKED = 0.13;
const GLOW_HOVER = 0.07;
const GLOW_FOCUS = 0.3;
const GHOST: Record<InspectionMode, number> = { exterior: 1, cutaway: 0.13, exploded: 1, architecture: 0.07 };
const FRAME_OPACITY: Record<InspectionMode, number> = { exterior: 1, cutaway: 1, exploded: 1, architecture: 0.6 };

function revealsInternals(mode: InspectionMode): boolean {
  return mode !== "exterior";
}

export function computeTarget(tag: PartTag, v: VisualInputs, out: VisualTarget): VisualTarget {
  if (MACHINE_SCOPE) return computeMachineTarget(tag, v, out);
  const c = tag.componentId;
  const layer: PartLayer = tag.layer;
  out.opacity = layer === "internal" ? 0 : 1;
  out.mute = 0;
  out.glow = 0;
  out.explode = 0;

  // ---- no selection: overview or systems view
  if (!v.selected) {
    if (v.highlighted.size > 0) {
      if (v.highlighted.has(c)) out.glow = GLOW_LINKED;
      else out.mute = MUTE_OVERVIEW;
    } else if (v.hovered && v.hovered !== c) {
      // A light dim of everything else lets the hovered assembly read at a glance.
      out.mute = MUTE_HOVER_OTHERS;
    }
    if (v.hovered === c) {
      out.glow += GLOW_HOVER;
      out.mute *= 0.4;
    }
    return out;
  }

  // ---- another assembly is selected
  if (v.selected !== c) {
    out.mute = MUTE_OTHERS;
    if (v.hovered === c) {
      out.mute = 0.42;
      out.glow = GLOW_HOVER * 0.7;
    }
    return out;
  }

  // ---- the selected assembly
  const mode = v.mode;
  out.glow = GLOW_SELECTED;
  if (layer === "armor") {
    out.opacity = GHOST[mode];
    // Ghosted shells read as clear glass; the accent edges carry the outline.
    if (out.opacity < 1) out.glow = 0;
  }
  else if (layer === "frame") out.opacity = FRAME_OPACITY[mode];
  else out.opacity = revealsInternals(mode) ? 1 : 0;
  if (mode === "exploded") out.explode = v.explode;

  if (v.focusSubtree.size > 0) {
    const inFocus = !!tag.subassemblyId && v.focusSubtree.has(tag.subassemblyId);
    if (inFocus) {
      out.glow = v.focusIsHover ? GLOW_FOCUS * 0.7 : GLOW_FOCUS;
      // Ghosted shells become readable when they are the focus.
      if (out.opacity < 0.5 && (layer !== "internal" || revealsInternals(mode))) out.opacity = 0.5;
    } else {
      out.glow = 0;
      out.mute = v.focusIsHover ? 0.35 : 0.5;
      if (layer === "armor" && out.opacity < 1) out.opacity *= 0.6;
    }
  }
  return out;
}

/* ---- machine scope ----------------------------------------------- */

/** Others recede less than in assembly scope: they are the context the selection sits in. */
const MUTE_OTHERS_MACHINE = 0.66;
/** Other internals in the internal view: see-through, but still just pickable (≥ 0.3). */
const GHOST_OTHER_INTERNALS = 0.3;

/**
 * Machine-scope modes: the mode shapes the whole model (ghosted panels,
 * revealed internals, separation) whether or not anything is selected, and the
 * selection is picked out within it by muting everything else.
 */
function computeMachineTarget(tag: PartTag, v: VisualInputs, out: VisualTarget): VisualTarget {
  const c = tag.componentId;
  const layer: PartLayer = tag.layer;
  const mode = v.mode;
  out.opacity = layer === "armor" ? GHOST[mode] : layer === "frame" ? FRAME_OPACITY[mode] : revealsInternals(mode) ? 1 : 0;
  out.mute = 0;
  out.glow = 0;
  out.explode = mode === "exploded" ? v.explode : 0;
  const ghosted = layer === "armor" && out.opacity < 1;

  if (!v.selected) {
    if (v.highlighted.size > 0) {
      if (v.highlighted.has(c)) out.glow = GLOW_LINKED;
      else out.mute = MUTE_OVERVIEW;
    } else if (v.hovered && v.hovered !== c) {
      out.mute = MUTE_HOVER_OTHERS;
    }
    if (v.hovered === c) {
      out.glow += GLOW_HOVER;
      out.mute *= 0.4;
    }
    // Ghosted panels read as clear glass; the accent edges carry the outline.
    if (ghosted) out.glow = 0;
    return out;
  }

  if (v.selected !== c) {
    out.mute = MUTE_OTHERS_MACHINE;
    // In the internal view the rest of the stack turns to glass so the selection isn't buried in it.
    const glass = layer === "internal" && mode === "cutaway";
    if (glass) out.opacity = GHOST_OTHER_INTERNALS;
    if (v.hovered === c) {
      out.mute = 0.36;
      if (glass) out.opacity = 0.6;
      if (!ghosted) out.glow = GLOW_HOVER * 0.7;
    }
    return out;
  }

  out.glow = ghosted ? 0 : GLOW_SELECTED;
  if (v.focusSubtree.size > 0) {
    const inFocus = !!tag.subassemblyId && v.focusSubtree.has(tag.subassemblyId);
    if (inFocus) {
      out.glow = v.focusIsHover ? GLOW_FOCUS * 0.7 : GLOW_FOCUS;
      if (out.opacity < 0.5 && (layer !== "internal" || revealsInternals(mode))) out.opacity = 0.5;
    } else {
      out.glow = 0;
      out.mute = v.focusIsHover ? 0.35 : 0.5;
      if (ghosted) out.opacity *= 0.6;
    }
  }
  return out;
}

/** Edge layers drawn per assembly: outer shells and structural frame. */
export type EdgeLayer = "armor" | "frame";

/**
 * Frame edges relative to shell edges. Once the shells are ghosted the frame
 * is solid and readable on its own, so its outlines are thinned out to keep
 * the cutaway from turning into a wireframe tangle.
 */
const FRAME_EDGE_SCALE: Record<InspectionMode, number> = { exterior: 1, cutaway: 0.3, exploded: 1, architecture: 0.45 };

/** Edge-line opacity per assembly: thin accent outlines on the selected (and hovered) one. */
export function edgeOpacity(v: VisualInputs, componentId: ComponentId, layer: EdgeLayer = "armor"): number {
  if (v.selected !== componentId) {
    if (!v.selected && v.highlighted.has(componentId)) return 0.4;
    // Hover (from the 3D pointer or the UI lists) gets a faint outline.
    return v.hovered === componentId ? 0.22 : 0;
  }
  const scale = layer === "frame" ? FRAME_EDGE_SCALE[v.mode] : 1;
  switch (v.mode) {
    case "exterior":
      return 0.32 * scale;
    case "exploded":
      return 0.32 * scale;
    case "cutaway":
      return 0.34 * scale;
    case "architecture":
      return 0.28 * scale;
  }
}
