/** Identifier unions for the V-2 (A-4) exhibit. Shared code sees them through `@/data/types`. */

/** The Bumper-WAC's sections, top to base — upper stage, then the V-2 — plus the firing table. */
export type ComponentId =
  | "upper"
  | "nose"
  | "instrument"
  | "centre"
  | "tail"
  | "fins"
  | "control"
  | "engine"
  | "launch";

export type SystemLane = "ground" | "propellants" | "propulsion" | "guidance" | "control" | "structure" | "payload";

/** `load` is the structural path: thrust and support forces carried through the airframe. */
export type FlowKind = "propellant" | "power" | "control" | "load";
