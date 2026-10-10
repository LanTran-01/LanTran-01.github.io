import type { InspectionMode } from "@/data/types";
import type { ComponentCapabilities } from "@/features/gundam/modelTypes";
import { useExplorerStore } from "@/state/explorerStore";

export interface ModeDescriptor {
  id: InspectionMode;
  label: string;
  /** Keyboard shortcut digit. */
  key: string;
  hint: string;
}

export const INSPECTION_MODES: ModeDescriptor[] = [
  { id: "exterior", label: "Exterior", key: "1", hint: "Armor on, assembly isolated" },
  { id: "cutaway", label: "Cutaway", key: "2", hint: "Armor ghosted to reveal frame and internals" },
  { id: "exploded", label: "Exploded", key: "3", hint: "Subassemblies separated along their axes" },
  { id: "architecture", label: "Architecture", key: "4", hint: "Subassemblies called out individually" },
];

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
  if (mode === "cutaway") return "No internal-layer geometry in the current model for this assembly.";
  if (mode === "exploded") return "No separable subassemblies in the current model for this assembly.";
  return "";
}

/** Capabilities of the selected assembly, if the viewer has reported them. */
export function useSelectedCapabilities(): ComponentCapabilities | undefined {
  return useExplorerStore((s) => (s.selected ? s.capabilities[s.selected] : undefined));
}
