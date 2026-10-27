/** Identifier unions for the illustrative 3U CubeSat. Shared code sees them through `@/data/types`. */

export type ComponentId =
  | "obc"
  | "gnss"
  | "imu"
  | "eps"
  | "battery"
  | "solar"
  | "comms"
  | "antenna"
  | "payload"
  | "adcs"
  | "structure";

export type SystemLane = "power" | "sensing" | "computing" | "attitude" | "comms" | "mission" | "ground";

/** `rf` is a radio link: between the transceiver and its antenna, and across space to the ground. */
export type FlowKind = "power" | "data" | "control" | "rf";
