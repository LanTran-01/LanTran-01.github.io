import type { PartLayer } from "@/data/types";
import { MACHINE } from "@/data/machine";

export const LAYER_TEXT: Record<PartLayer, { short: string; long: string }> = MACHINE.layers;

export function layerLabel(layer: PartLayer): string {
  return LAYER_TEXT[layer].long;
}

/** Order of an assembly's relationships in the inspection panel. Kinds a machine doesn't use are skipped. */
export const FLOW_ORDER: readonly string[] = ["power", "control", "data", "rf", "propellant"];

/** "01" … "10" */
export const pad2 = (n: number) => String(n).padStart(2, "0");
