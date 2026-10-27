import type { MachineConfig } from "@/data/types";
import { MODEL_HEIGHT } from "./model";

/** Presentation of the RX-105 Ξ Gundam in the shared explorer. */
export const MACHINE: MachineConfig = {
  id: "gundam",
  storagePrefix: "xi",
  terms: { part: "assembly", parts: "assemblies", partsShort: "ASM", whole: "machine" },
  brand: {
    glyph: "Ξ",
    wordmark: "XI HARDWARE EXPLORER",
    wordmarkShort: "XI EXPLORER",
    label: "Ξ Hardware Explorer — full machine overview",
  },
  badge: {
    text: "PROTOTYPE MODEL",
    short: "PROTO",
    title: "Procedural prototype silhouette — not an accurate or licensed model",
  },
  designation: "RX-105",
  viewerLabel: "Interactive 3D model of the RX-105 Xi Gundam prototype",
  identity: {
    designation: "RX-105",
    glyph: "Ξ",
    name: "GUNDAM",
    source: "Mobile Suit Gundam: Hathaway",
    rows: [
      { label: "Flight system", value: "Minovsky flight system", basis: "reference" },
      { label: "Pilot", value: "Single", basis: "reference" },
    ],
    internals: "Conceptual",
    internalsNote: "(not canon)",
    disclosure:
      "Silhouette study built from primitives — not an accurate or licensed model. Internal hardware is a conceptual visualization, not canon.",
  },
  overview: { kicker: "RX-105", title: "Ξ Gundam — select an assembly" },
  modes: {
    scope: "assembly",
    list: [
      { id: "exterior", label: "Exterior", key: "1", hint: "Armor on, assembly isolated" },
      { id: "cutaway", label: "Cutaway", key: "2", hint: "Armor ghosted to reveal frame and internals" },
      { id: "exploded", label: "Exploded", key: "3", hint: "Subassemblies separated along their axes" },
      { id: "architecture", label: "Architecture", key: "4", hint: "Subassemblies called out individually" },
    ],
  },
  layers: {
    armor: { short: "ARM", long: "Armor" },
    frame: { short: "FRM", long: "Frame" },
    internal: { short: "INT", long: "Internal" },
  },
  basis: {
    reference: {
      short: "REF",
      title: "Reference — broad, non-numeric published descriptor",
      legend: "broadly published",
      label: "Reference descriptor",
      about: (
        <>
          <strong>Reference.</strong> A broad, non-numeric descriptor that is widely published for the RX-105, for
          example that it carries a Minovsky flight system.
        </>
      ),
    },
    conceptual: {
      short: "CONCEPT",
      title: "Conceptual — invented for this visualization, not canon",
      legend: "invented for this study",
      label: "Conceptual",
      about: (
        <>
          <strong>Conceptual.</strong> Invented for this visualization to make the machine explorable.
        </>
      ),
    },
  },
  statusTag: "CONCEPTUAL VISUALIZATION",
  proceduralLabel: "PROCEDURAL PROTOTYPE",
  systems: {
    subtitle: "Conceptual illustration of how the RX-105’s subsystems could be organised — not official design data.",
    note: "Conceptual illustration — not official design data.",
  },
  flowsNote: "all flows conceptual",
  about: {
    label: "About · Ξ Hardware Explorer",
    title: "An unofficial engineering study",
    lede: "An interactive explorer for investigating the RX-105 Ξ Gundam as a machine: its ten assemblies, a conceptual internal hardware breakdown and a conceptual systems architecture.",
    sections: [
      {
        title: "What you are looking at",
        body: (
          <>
            <p>
              The 3D machine is a <strong>procedural prototype silhouette</strong> built from geometric primitives. It
              is not an accurate or licensed Ξ Gundam model.
            </p>
            <p>
              Internal hardware, subassemblies, data flows and the systems map are <strong>conceptual
              visualizations</strong> written for this study. They are not canon and are not taken from official
              technical material. No precise measurements, ratings or materials are claimed.
            </p>
          </>
        ),
      },
      { title: "Data labels", kind: "basis" },
      {
        title: "Substituting a model",
        body: (
          <p>
            Put a GLB in <code>explorer/public/gundam/models/</code>, then set <code>source: &quot;gltf&quot;</code> in{" "}
            <code>src/machines/gundam/model.ts</code> (or open the site with <code>?model=gltf</code>, or build with{" "}
            <code>VITE_MODEL_URL</code>). Edit <code>meshRules</code> so mesh names map onto assemblies. If loading
            fails, the viewer falls back to the prototype and says so in the status bar.
          </p>
        ),
      },
      { title: "Controls", kind: "controls" },
      {
        title: "Trademarks",
        fine: true,
        body: (
          <>
            RX-105 Ξ Gundam and Mobile Suit Gundam: Hathaway are trademarks of their respective owners (© Sotsu ·
            Sunrise / Bandai Namco Filmworks). This is an unofficial, non-commercial fan engineering study. It is not
            affiliated with or endorsed by the rights holders.
          </>
        ),
      },
    ],
  },
  stage: {
    azimuth: 32,
    elevation: 7,
    defaultBounds: [
      [-1.4, 0, -0.9],
      [1.4, MODEL_HEIGHT, 0.9],
    ],
    targetBoundary: [
      [-3.5, 0.15, -3.5],
      [3.5, MODEL_HEIGHT + 0.6, 3.5],
    ],
    ringRadius: 1.85,
    ruler: MODEL_HEIGHT,
  },
};
