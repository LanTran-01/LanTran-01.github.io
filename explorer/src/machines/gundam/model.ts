import type { ModelConfig, ProceduralModel } from "@/data/modelConfig";
import { initialModelSource, modelUrlOverride } from "@/features/model/modelSource";
import { buildProceduralXi, disposeProceduralXi } from "./procedural/buildProceduralXi";

/** Scene units. The procedural prototype is built to this height; feet rest on y = 0. */
export const MODEL_HEIGHT = 6;

export const modelConfig: ModelConfig = {
  source: initialModelSource(),
  gltfUrl: modelUrlOverride() ?? `${import.meta.env.BASE_URL}models/xi-gundam.glb`,
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

export const proceduralModel: ProceduralModel = {
  rootName: "xi-procedural",
  build: buildProceduralXi,
  dispose: disposeProceduralXi,
};
