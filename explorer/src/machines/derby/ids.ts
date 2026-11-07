/** Identifier unions for the Derby exhibit. Shared code sees them through `@/data/types`. */

/** The missile's visible sections, nose to tail. */
export type ComponentId = "radome" | "forward" | "canards" | "centre" | "aft" | "wings";

export type SystemLane = "platform" | "sensing" | "avionics" | "control" | "propulsion" | "structure";

/** `signal` carries information (radar returns, sensor data); `load` is force carried through the airframe. */
export type FlowKind = "signal" | "control" | "power" | "load";
