import type { ModelConfig, ProceduralModel } from "@/data/modelConfig";
import { initialModelSource, modelUrlOverride } from "@/features/model/modelSource";
import { buildDerby, disposeDerby } from "./procedural/buildDerby";
import { BASE_Y, LENGTH, SCALE } from "./procedural/layout";

/**
 * Scene units from the floor to the nose tip: the published 3.62 m length,
 * standing upright, at `SCALE` units per metre (≈ 6.4). A GLB is scaled to
 * this height.
 */
export const MODEL_HEIGHT = Math.round((LENGTH + BASE_Y) * SCALE * 100) / 100;

export const modelConfig: ModelConfig = {
  source: initialModelSource(),
  gltfUrl: modelUrlOverride() ?? `${import.meta.env.BASE_URL}models/derby.glb`,
  targetHeight: MODEL_HEIGHT,
  fallbackToProcedural: true,
  meshRules: [
    { match: /radome|nose|seeker/i, componentId: "radome" },
    { match: /canard/i, componentId: "canards" },
    { match: /wing|fin|tail_?surface/i, componentId: "wings" },
    { match: /nozzle|motor|aft/i, componentId: "aft" },
    { match: /forward|guidance|front/i, componentId: "forward" },
    { match: /hanger|umbilical|centre|center|body|mid/i, componentId: "centre" },
  ],
  label: "Procedural study",
  isPrototype: true,
};

export const proceduralModel: ProceduralModel = {
  rootName: "derby-procedural",
  build: buildDerby,
  dispose: disposeDerby,
};
