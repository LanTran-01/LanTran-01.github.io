import type { FlowKind, PartLayer } from "@/data/types";

export const LAYER_TEXT: Record<PartLayer, { short: string; long: string }> = {
  armor: { short: "ARM", long: "Armor" },
  frame: { short: "FRM", long: "Frame" },
  internal: { short: "INT", long: "Internal" },
};

export function layerLabel(layer: PartLayer): string {
  return LAYER_TEXT[layer].long;
}

export const FLOW_ORDER: FlowKind[] = ["power", "control", "data", "propellant"];

/** "01" … "10" */
export const pad2 = (n: number) => String(n).padStart(2, "0");
