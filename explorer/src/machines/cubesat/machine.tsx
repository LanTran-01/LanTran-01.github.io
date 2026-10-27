import type { MachineConfig } from "@/data/types";

/** Presentation of the illustrative 3U CubeSat in the shared explorer. */
export const MACHINE: MachineConfig = {
  id: "cubesat",
  storagePrefix: "cubesat",
  terms: { part: "component", parts: "components", partsShort: "CMP", whole: "satellite" },
  brand: {
    glyph: "3U",
    wordmark: "CUBESAT SYSTEMS EXPLORER",
    wordmarkShort: "CUBESAT",
    label: "CubeSat Systems Explorer — full satellite overview",
  },
  badge: {
    text: "ILLUSTRATIVE MODEL",
    short: "ILLUS",
    title: "Generic educational CubeSat — not a specific spacecraft",
  },
  designation: "3U CUBESAT",
  viewerLabel: "Interactive 3D model of an illustrative 3U CubeSat",
  identity: {
    designation: "3U · GENERIC",
    name: "CUBESAT",
    source: "Illustrative small-satellite architecture",
    rows: [
      { label: "Form factor", value: "CubeSat standard, 3U", basis: "reference" },
      { label: "Architecture", value: "Example design", basis: "conceptual" },
    ],
    internals: "Illustrative",
    internalsNote: "(not a specific spacecraft)",
    disclosure:
      "Generic educational design built from primitives — not a specific satellite. Real CubeSats choose among these subsystems; no ratings, frequencies or algorithms are specified.",
  },
  overview: { kicker: "3U CubeSat", title: "CubeSat — select a component" },
  modes: {
    scope: "machine",
    list: [
      { id: "exterior", label: "Exterior", key: "1", hint: "Complete satellite, panels closed" },
      { id: "cutaway", label: "Internal", key: "2", hint: "Panels cleared to reveal the electronics stack" },
      { id: "exploded", label: "Exploded", key: "3", hint: "Assemblies separated along the stack and outward" },
    ],
  },
  layers: {
    armor: { short: "PNL", long: "Panel" },
    frame: { short: "EXT", long: "Exterior" },
    internal: { short: "INT", long: "Internal" },
  },
  basis: {
    reference: {
      short: "REF",
      title: "Reference — general, widely documented engineering fact",
      legend: "general engineering fact",
      label: "General reference",
      about: (
        <>
          <strong>Reference.</strong> A general fact about CubeSats or spacecraft engineering that is widely documented,
          for example that CubeSat sizes are counted in standard units.
        </>
      ),
    },
    conceptual: {
      short: "CONCEPT",
      title: "Illustrative — part of this example design, not a specific spacecraft",
      legend: "illustrative design",
      label: "Illustrative",
      about: (
        <>
          <strong>Illustrative.</strong> A choice made for this example architecture. Other CubeSats make different
          choices, and many omit some of these subsystems.
        </>
      ),
    },
  },
  statusTag: "ILLUSTRATIVE ARCHITECTURE",
  proceduralLabel: "PROCEDURAL MODEL",
  systems: {
    subtitle: "Illustrative architecture of a generic CubeSat — how power, data, commands and radio links typically connect.",
    note: "Illustrative architecture — not a specific spacecraft.",
  },
  flowsNote: "all flows illustrative",
  about: {
    label: "About · CubeSat Systems Explorer",
    title: "An illustrative small satellite",
    lede: "An interactive explorer for a generic 3U CubeSat: its eleven components, the embedded electronics inside, and an illustrative systems architecture linking power, computing, sensing, attitude control, communications and the payload.",
    sections: [
      {
        title: "What you are looking at",
        body: (
          <>
            <p>
              The 3D satellite is a <strong>procedural model</strong> built from geometric primitives. It follows the
              general CubeSat form factor but is <strong>not a specific spacecraft</strong>.
            </p>
            <p>
              The selection of subsystems is an example. Not every CubeSat carries every component shown — a GNSS
              receiver, reaction wheels or deployable wings are mission choices. No dimensions, electrical ratings,
              radio frequencies, protocols or control algorithms are specified.
            </p>
          </>
        ),
      },
      { title: "Data labels", kind: "basis" },
      {
        title: "Views",
        body: (
          <p>
            <strong>Exterior</strong> shows the complete satellite. <strong>Internal</strong> clears the side panels to
            reveal the electronics stack. <strong>Exploded</strong> separates the assemblies along the stack and outward
            from the faces. The view applies to the whole satellite, so you can select components in any of them.
          </p>
        ),
      },
      { title: "Controls", kind: "controls" },
      {
        title: "Substituting a model",
        body: (
          <p>
            Put a GLB in <code>explorer/public/cubesat/models/</code>, then set <code>source: &quot;gltf&quot;</code> in{" "}
            <code>src/machines/cubesat/model.ts</code> (or open the site with <code>?model=gltf</code>). Edit{" "}
            <code>meshRules</code> so mesh names map onto components. If loading fails, the viewer falls back to the
            procedural model and says so in the status bar.
          </p>
        ),
      },
    ],
  },
  stage: {
    azimuth: 34,
    elevation: 11,
    defaultBounds: [
      [-3.9, 1.3, -0.9],
      [3.9, 6.4, 0.9],
    ],
    targetBoundary: [
      [-4.8, 0.2, -4.8],
      [4.8, 9.6, 4.8],
    ],
    ringRadius: 2.4,
    ruler: null,
  },
};
