import type { Object3D } from "three";
import type { ComponentId, PartLayer } from "./types";

/**
 * Model source configuration.
 *
 * Each machine ships with a procedural model. To substitute a real model:
 *   1. Put a GLB in `explorer/public/<machine>/models/` (e.g. `xi-gundam.glb`).
 *   2. Set `source: "gltf"` in `src/machines/<machine>/model.ts`, or open the site
 *      with `?model=gltf`, or build with `VITE_MODEL_URL=/tech/<machine>/models/your-file.glb`.
 *   3. Adjust `meshRules` so mesh / node names map onto assemblies.
 * If loading fails the viewer falls back to the procedural model and says so.
 */

export type ModelSource = "procedural" | "gltf";

export interface MeshRule {
  /** Tested against the mesh name and every ancestor name, nearest first. */
  match: RegExp;
  componentId: ComponentId;
  layer?: PartLayer;
  subassemblyId?: string;
}

export interface ModelConfig {
  source: ModelSource;
  gltfUrl: string;
  /** Loaded models are uniformly scaled so their height matches this (scene units). */
  targetHeight: number;
  /** Falls back to the procedural prototype if the GLB cannot be loaded. */
  fallbackToProcedural: boolean;
  meshRules: MeshRule[];
  /** Display metadata for the identification panel. */
  label: string;
  isPrototype: boolean;
}

/** Builds and releases the machine's procedural model. */
export interface ProceduralModel {
  /** Name of the root group `build()` returns. */
  rootName: string;
  build: () => Object3D;
  dispose: (root: Object3D) => void;
}

export { MODEL_HEIGHT, modelConfig, proceduralModel } from "@machine/model";
