import { MACHINE } from "@machine/machine";
import type { InspectionMode } from "./types";

/** Presentation config of the machine this build explores (see `@machine` in vite.config.ts). */
export { MACHINE };

export const TERMS = MACHINE.terms;

/** True when inspection modes apply to the whole model rather than the selected part. */
export const MACHINE_SCOPE = MACHINE.modes.scope === "machine";

export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Display label of a mode, e.g. "Cutaway" (falls back to the id). */
export function modeLabel(mode: InspectionMode): string {
  return MACHINE.modes.list.find((m) => m.id === mode)?.label ?? capitalize(mode);
}
