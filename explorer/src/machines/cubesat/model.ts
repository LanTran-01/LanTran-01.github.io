import type { ModelConfig, ProceduralModel } from "@/data/modelConfig";
import { initialModelSource, modelUrlOverride } from "@/features/model/modelSource";
import { buildCubeSat, disposeCubeSat } from "./procedural/buildCubeSat";

/**
 * Scene units from the stage floor to the top of the antenna deployer. The
 * procedural model floats above the floor; a GLB is scaled to this height.
 */
export const MODEL_HEIGHT = 6.3;

export const modelConfig: ModelConfig = {
  source: initialModelSource(),
  gltfUrl: modelUrlOverride() ?? `${import.meta.env.BASE_URL}models/cubesat.glb`,
  targetHeight: MODEL_HEIGHT,
  fallbackToProcedural: true,
  meshRules: [
    { match: /solar|wing|cell/i, componentId: "solar" },
    { match: /antenna|whip|tape|deploy/i, componentId: "antenna" },
    { match: /gnss|gps|patch/i, componentId: "gnss" },
    { match: /payload|camera|lens|baffle|optic/i, componentId: "payload" },
    { match: /battery|cell_pack/i, componentId: "battery" },
    { match: /eps|power/i, componentId: "eps" },
    { match: /obc|computer|cdh/i, componentId: "obc" },
    { match: /imu|gyro|accel/i, componentId: "imu" },
    { match: /comm|radio|transceiver/i, componentId: "comms" },
    { match: /adcs|wheel|torquer|sun_?sensor|magnet/i, componentId: "adcs" },
    { match: /rail|frame|panel|structure|chassis/i, componentId: "structure" },
  ],
  label: "Procedural model",
  isPrototype: true,
};

export const proceduralModel: ProceduralModel = {
  rootName: "cubesat-procedural",
  build: buildCubeSat,
  dispose: disposeCubeSat,
};
