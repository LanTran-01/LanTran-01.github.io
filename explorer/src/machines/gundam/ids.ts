/** Identifier unions for the RX-105 Ξ machine. Shared code sees them through `@/data/types`. */

export type ComponentId =
  | "head"
  | "chest"
  | "shoulders"
  | "arms"
  | "waist"
  | "legs"
  | "feet"
  | "backpack"
  | "thrusters"
  | "weapons";

export type SystemLane =
  | "power"
  | "sensing"
  | "cockpit"
  | "computing"
  | "actuation"
  | "propulsion"
  | "weapons";

export type FlowKind = "power" | "data" | "control" | "propellant";
