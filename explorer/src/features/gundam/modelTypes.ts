import type { Box3, Mesh, Object3D } from "three";
import type { ComponentId, PartLayer } from "@/data/types";

/**
 * Contract between model producers (procedural builder, GLB loader) and the viewer.
 *
 * Every selectable mesh carries a `PartTag` at `mesh.userData.xi`.
 *
 * Coordinate system: Y up, the machine faces +Z, its feet rest on y = 0 and it is
 * centred on x = z = 0. Total height ≈ MODEL_HEIGHT (6 scene units). The machine's
 * own right side is at −X.
 */
export interface PartTag {
  componentId: ComponentId;
  layer: PartLayer;
  /** Matches a `Subassembly.id` in data/components.ts. */
  subassemblyId?: string;
  /**
   * Offset applied to `mesh.position` (parent-local space, scene units) when the
   * exploded view is fully open. The viewer interpolates base → base + explode.
   */
  explode?: [number, number, number];
}

export const PART_TAG_KEY = "xi" as const;

export function getPartTag(obj: Object3D): PartTag | undefined {
  return obj.userData?.[PART_TAG_KEY] as PartTag | undefined;
}

export function setPartTag(obj: Object3D, tag: PartTag): void {
  obj.userData[PART_TAG_KEY] = tag;
}

/** Runtime capabilities derived from the geometry that is actually present. */
export interface ComponentCapabilities {
  /** Has internal-layer meshes, so cutaway reveals something. */
  cutaway: boolean;
  /** Has at least one mesh with an explode vector. */
  exploded: boolean;
  /** Subassembly ids with at least one mesh. */
  subassemblies: string[];
}

export interface ModelIndex {
  root: Object3D;
  meshes: Mesh[];
  byComponent: Map<ComponentId, Mesh[]>;
  bySubassembly: Map<string, Mesh[]>;
  /** World-space bounds per component at rest (explode = 0). */
  bounds: Map<ComponentId, Box3>;
  capabilities: Record<ComponentId, ComponentCapabilities>;
}
