import type { ComponentId, PartLayer } from "./types";

/**
 * Model source configuration.
 *
 * The explorer ships with a procedural prototype. To substitute a real model:
 *   1. Put a GLB in `explorer/public/models/` (e.g. `xi-gundam.glb`).
 *   2. Set `source: "gltf"` below, or open the site with `?model=gltf`,
 *      or build with `VITE_MODEL_URL=/models/your-file.glb`.
 *   3. Adjust `meshRules` so mesh / node names map onto assemblies.
 * If loading fails the viewer falls back to the procedural prototype and says so.
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

const envUrl = import.meta.env.VITE_MODEL_URL as string | undefined;
const query = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
const querySource = query?.get("model");

/** Scene units. The procedural prototype is built to this height; feet rest on y = 0. */
export const MODEL_HEIGHT = 6;

export const modelConfig: ModelConfig = {
  source: querySource === "gltf" || envUrl ? "gltf" : "procedural",
  gltfUrl: envUrl ?? `${import.meta.env.BASE_URL}models/xi-gundam.glb`,
  targetHeight: MODEL_HEIGHT,
  fallbackToProcedural: true,
  meshRules: [
    { match: /v_?fin|antenna|head|face|visor/i, componentId: "head" },
    { match: /cockpit|chest|torso|hatch/i, componentId: "chest" },
    { match: /shoulder|pauldron/i, componentId: "shoulders" },
    { match: /rifle|weapon|saber|gun/i, componentId: "weapons" },
    { match: /arm|elbow|hand|finger|wrist/i, componentId: "arms" },
    { match: /waist|skirt|hip|crotch|pelvis/i, componentId: "waist" },
    { match: /foot|feet|toe|heel/i, componentId: "feet" },
    { match: /leg|thigh|knee|shin|calf|ankle/i, componentId: "legs" },
    { match: /nozzle|thruster|vernier/i, componentId: "thrusters" },
    { match: /backpack|binder|wing|fin/i, componentId: "backpack" },
  ],
  label: "Procedural prototype",
  isPrototype: true,
};
