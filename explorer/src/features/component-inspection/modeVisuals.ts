import type { ComponentId, InspectionMode, PartLayer } from "@/data/types";
import { subassemblySubtreeIds } from "@/data/components";
import type { ExplorerState } from "@/state/explorerStore";
import type { PartTag } from "@/features/gundam/modelTypes";

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
const GLOW_SELECTED = 0.1;
const GLOW_LINKED = 0.42;
const GLOW_HOVER = 0.12;
const GLOW_FOCUS = 0.55;
const GHOST: Record<InspectionMode, number> = { exterior: 1, cutaway: 0.13, exploded: 1, architecture: 0.07 };
const FRAME_OPACITY: Record<InspectionMode, number> = { exterior: 1, cutaway: 1, exploded: 1, architecture: 0.6 };

function revealsInternals(mode: InspectionMode): boolean {
  return mode !== "exterior";
}

export function computeTarget(tag: PartTag, v: VisualInputs, out: VisualTarget): VisualTarget {
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
  if (layer === "armor") out.opacity = GHOST[mode];
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

/** Edge-line opacity for the selected assembly: thin accent outlines. */
export function edgeOpacity(v: VisualInputs, componentId: ComponentId): number {
  if (v.selected !== componentId) return 0;
  switch (v.mode) {
    case "exterior":
      return 0.32;
    case "exploded":
      return 0.38;
    case "cutaway":
      return 0.55;
    case "architecture":
      return 0.42;
  }
}
