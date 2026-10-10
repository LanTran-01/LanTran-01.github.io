import { LANES } from "@/data/subsystems";
import type { FlowKind, SystemLane, SystemNode } from "@/data/types";

/**
 * Visual coding for lanes and flow kinds. Lanes use the accent family and
 * greys only; flow kinds vary by tone and dash pattern (tokens.css).
 */

export const LANE_TONE: Record<SystemLane, string> = {
  power: "var(--accent)",
  sensing: "var(--flow-data)",
  cockpit: "var(--text-dim)",
  computing: "var(--accent-strong)",
  actuation: "var(--flow-data)",
  propulsion: "var(--flow-control)",
  weapons: "var(--text-dim)",
};

export const FLOW_STROKE: Record<FlowKind, string> = {
  power: "var(--flow-power)",
  data: "var(--flow-data)",
  control: "var(--flow-control)",
  propellant: "var(--flow-propellant)",
};

/** SVG dash pattern per kind (undefined = solid). */
export const FLOW_DASH: Record<FlowKind, string | undefined> = {
  power: undefined,
  data: undefined,
  control: "5 3.5",
  propellant: "0.1 3.6",
};

export function basisTag(n: SystemNode): string {
  return n.basis === "reference" ? "REF" : "CONCEPT";
}

export function laneLabel(n: SystemNode): string {
  return LANES[n.lane].label;
}
