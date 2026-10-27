import { useMemo } from "react";
import { MACHINE, MACHINE_SCOPE, TERMS } from "@/data/machine";
import type { ComponentId, InspectionMode, ModeDescriptor } from "@/data/types";
import type { ComponentCapabilities } from "@/features/model/modelTypes";
import { useExplorerStore, type ExplorerState } from "@/state/explorerStore";

export type { ModeDescriptor };

/** The machine's inspection modes, in shortcut order. */
export const INSPECTION_MODES: ModeDescriptor[] = MACHINE.modes.list;

/**
 * Whether a mode can show anything for an assembly. Unknown capabilities
 * (model still loading) count as supported so controls don't flicker.
 */
export function isModeSupported(mode: InspectionMode, caps: ComponentCapabilities | undefined): boolean {
  if (!caps) return true;
  if (mode === "cutaway") return caps.cutaway;
  if (mode === "exploded") return caps.exploded;
  return true;
}

export function unsupportedReason(mode: InspectionMode): string {
  const scope = MACHINE_SCOPE ? `the ${TERMS.whole}` : `this ${TERMS.part}`;
  if (mode === "cutaway") return `No internal-layer geometry in the current model for ${scope}.`;
  if (mode === "exploded") return `No separable subassemblies in the current model for ${scope}.`;
  return "";
}

/** Capabilities of the selected assembly, if the viewer has reported them. */
export function useSelectedCapabilities(): ComponentCapabilities | undefined {
  return useExplorerStore((s) => (s.selected ? s.capabilities[s.selected] : undefined));
}

/**
 * Capabilities the mode controls depend on: the selected assembly's, or the
 * whole model's when modes apply to the whole machine.
 */
export function modeCapabilities(
  capabilities: ExplorerState["capabilities"],
  selected: ComponentId | null,
): ComponentCapabilities | undefined {
  if (!MACHINE_SCOPE) return selected ? capabilities[selected] : undefined;
  const all = Object.values(capabilities) as ComponentCapabilities[];
  if (all.length === 0) return undefined;
  return {
    cutaway: all.some((c) => c.cutaway),
    exploded: all.some((c) => c.exploded),
    exterior: all.some((c) => c.exterior),
    subassemblies: all.flatMap((c) => c.subassemblies),
  };
}

export function useModeCapabilities(): ComponentCapabilities | undefined {
  const capabilities = useExplorerStore((s) => s.capabilities);
  const selected = useExplorerStore((s) => s.selected);
  return useMemo(() => modeCapabilities(capabilities, selected), [capabilities, selected]);
}
