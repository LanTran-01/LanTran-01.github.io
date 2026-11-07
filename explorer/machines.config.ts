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
  v2: {
    base: "/tech/v2/",
    title: "V-2 Aerospace Exhibit — A-4 Rocket, 1942–1945",
    description:
      "An interactive museum exhibit of the V-2 (A-4), the first long-range guided ballistic missile and the first human-made object to reach space: explore its external sections, separate the airframe and read the history and engineering behind each part.",
  },
  derby: {
    base: "/tech/derby/",
    title: "Derby Aerospace Exhibit — Rafael BVR Air-to-Air Missile",
    description:
      "An interactive exhibit of the Rafael Derby, a beyond-visual-range air-to-air missile with an active radar seeker: explore its external sections, separate the airframe and read the aerodynamics, avionics and history behind it.",
  },
} satisfies Record<string, MachineTarget>;

export type MachineId = keyof typeof MACHINES;

export function resolveMachine(value: string | undefined): MachineId {
  const id = (value ?? "gundam") as MachineId;
  if (!(id in MACHINES)) throw new Error(`Unknown MACHINE "${value}". Expected one of: ${Object.keys(MACHINES).join(", ")}`);
  return id;
}
