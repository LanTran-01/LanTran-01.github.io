import type { ModelConfig, ProceduralModel } from "@/data/modelConfig";
import { initialModelSource, modelUrlOverride } from "@/features/model/modelSource";
import { buildV2, disposeV2 } from "./procedural/buildV2";
import { SCALE, STACK_TOP, TABLE_H } from "./procedural/layout";

/**
 * Scene units from the floor to the tip of the upper stage: the firing table
 * plus the 17.25 m Bumper-WAC stack, at `SCALE` units per metre (≈ 6.4). A GLB
 * is scaled to this height.
 */
export const MODEL_HEIGHT = Math.round((TABLE_H + STACK_TOP) * SCALE * 100) / 100;

export const modelConfig: ModelConfig = {
  source: initialModelSource(),
  gltfUrl: modelUrlOverride() ?? `${import.meta.env.BASE_URL}models/v2.glb`,
  targetHeight: MODEL_HEIGHT,
  fallbackToProcedural: true,
  meshRules: [
    { match: /wac|upper_?stage|second_?stage/i, componentId: "upper" },
    { match: /warhead|nose/i, componentId: "nose" },
    { match: /instrument|guidance|hatch/i, componentId: "instrument" },
    { match: /rudder|jet_?vane|vane/i, componentId: "control" },
    { match: /fin/i, componentId: "fins" },
    { match: /nozzle|chamber|engine|burner/i, componentId: "engine" },
    { match: /tail|thrust_?ring/i, componentId: "tail" },
    { match: /table|stand|deflector|launch/i, componentId: "launch" },
    { match: /centre|center|tank|body|mid/i, componentId: "centre" },
  ],
  label: "Procedural study",
  isPrototype: true,
};

export const proceduralModel: ProceduralModel = {
  rootName: "v2-procedural",
  build: buildV2,
  dispose: disposeV2,
};
