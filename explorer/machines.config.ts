/**
 * Build targets of the shared explorer. One codebase, one build per machine:
 * `MACHINE=<id> vite build` aliases `@machine` to `src/machines/<id>` and writes
 * `dist/<id>`, served at `base` (see scripts/publish-site.mjs).
 */
export interface MachineTarget {
  base: string;
  title: string;
  description: string;
}

export const MACHINES = {
  gundam: {
    base: "/tech/gundam/",
    title: "Ξ Hardware Explorer — RX-105 Inspection Prototype",
    description:
      "An interactive engineering-style explorer for a procedural prototype of the RX-105 Ξ Gundam: select assemblies, cut away armor, explode subassemblies and trace a conceptual systems architecture.",
  },
  cubesat: {
    base: "/tech/cubesat/",
    title: "CubeSat Systems Explorer — Illustrative 3U Spacecraft",
    description:
      "An interactive explorer for an illustrative 3U CubeSat: open the structure, separate the electronics stack and trace how power, data, commands and radio links connect its subsystems.",
  },
} satisfies Record<string, MachineTarget>;

export type MachineId = keyof typeof MACHINES;

export function resolveMachine(value: string | undefined): MachineId {
  const id = (value ?? "gundam") as MachineId;
  if (!(id in MACHINES)) throw new Error(`Unknown MACHINE "${value}". Expected one of: ${Object.keys(MACHINES).join(", ")}`);
  return id;
}
