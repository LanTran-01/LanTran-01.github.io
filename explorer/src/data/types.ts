import type { ReactNode } from "react";

/**
 * Domain types shared by the viewer, the inspection UI and the systems map.
 *
 * Everything technical in this project is a *conceptual* visualization. The
 * `basis` field on data rows makes the distinction explicit:
 *   - "reference"  : a broad descriptor that is widely published or generally
 *                    documented (e.g. that the RX-105 carries a Minovsky flight
 *                    system, or that CubeSats are sized in standard units).
 *   - "conceptual" : invented for this visualization.
 *
 * The identifier unions belong to the machine this build explores
 * (`src/machines/<id>/ids.ts`, aliased as `@machine`).
 */

export type { ComponentId, FlowKind, SystemLane } from "@machine/ids";
import type { ComponentId, FlowKind, SystemLane } from "@machine/ids";

/** Inspection modes available once an assembly is selected. */
export type InspectionMode = "exterior" | "cutaway" | "exploded" | "architecture";

/** Where a part lives in an assembly. Mirrors `PartLayer` on model meshes. */
export type PartLayer = "armor" | "frame" | "internal";

export type Basis = "reference" | "conceptual";

export interface Subassembly {
  /** Stable id. Model meshes reference it via `PartTag.subassemblyId`. */
  id: string;
  /** Short engineering code, e.g. "HD-110". */
  code: string;
  name: string;
  layer: PartLayer;
  description: string;
  children?: Subassembly[];
}

export interface TechField {
  label: string;
  value: string;
  basis: Basis;
}

export interface ComponentInterface {
  componentId: ComponentId;
  /** How the two assemblies meet, e.g. "Neck gimbal mount". */
  relation: string;
}

export interface ComponentFlow {
  kind: FlowKind;
  direction: "in" | "out" | "both";
  /** Human-readable peer, usually a subsystem or assembly name. */
  peer: string;
  note: string;
}

export interface CameraHint {
  /** Direction from the assembly centre towards the camera (need not be normalised). */
  direction: [number, number, number];
  /** Multiplier on the assembly's bounding radius for the focus distance. Default 2.6. */
  distanceFactor?: number;
}

export interface ComponentSpec {
  id: ComponentId;
  /** URL segment: /explore/:slug */
  slug: string;
  /** Two-letter assembly prefix, e.g. "HD". */
  prefix: string;
  name: string;
  shortName: string;
  /** Assembly designation shown in the UI, e.g. "ASM-01 / HD". */
  designation: string;
  /** Fictional subsystem classification. */
  classification: string;
  /** One line, used in lists and hover labels. */
  summary: string;
  /** Short technical description for the detail view. */
  description: string;
  mechanicalFunction: string;
  interfaces: ComponentInterface[];
  flows: ComponentFlow[];
  subassemblies: Subassembly[];
  techData: TechField[];
  inspectionNotes: string[];
  camera: CameraHint;
  /** What this part does in this particular machine (shown under Function). */
  role?: string;
  /** Collapsible engineering notes below the technical data. */
  details?: DetailNote[];
}

export interface DetailNote {
  title: string;
  body: string;
}

/* ------------------------------------------------------------------ */
/* Systems architecture                                                */
/* ------------------------------------------------------------------ */

export interface LaneSpec {
  label: string;
  short: string;
  /** CSS colour for the lane bar and swatch. */
  tone: string;
}

export interface FlowKindSpec {
  label: string;
  description: string;
  /** CSS colour for the edge stroke. */
  stroke: string;
  /** SVG dash pattern; omitted = solid. */
  dash?: string;
}

/** A column of the systems map. Columns run left → right in flow order. */
export interface SystemColumn {
  index: number;
  title: string;
  lanes: SystemLane[];
}

export interface SystemNode {
  id: string;
  code: string;
  label: string;
  lane: SystemLane;
  /** Grid placement for the top-level layout. Columns run left → right in flow order. */
  col: number;
  row: number;
  description: string;
  /** 3D assemblies this subsystem physically lives in. Drives 3D ↔ diagram sync. May be empty (e.g. off-board systems). */
  componentIds: ComponentId[];
  /** Optional subsystems revealed when the node is expanded. */
  children?: SystemNode[];
  basis: Basis;
}

export interface SystemEdge {
  id: string;
  /** Node ids; may reference child nodes. Collapsed children resolve to their parent. */
  from: string;
  to: string;
  kind: FlowKind;
  label?: string;
}

/* ------------------------------------------------------------------ */
/* Machine configuration                                               */
/* ------------------------------------------------------------------ */

/**
 * How inspection modes apply:
 *  - "assembly": modes isolate the selected assembly and reset when the selection changes.
 *  - "machine" : modes apply to the whole model (overview included) and persist across selections.
 */
export type ModeScope = "assembly" | "machine";

export interface ModeDescriptor {
  id: InspectionMode;
  label: string;
  /** Keyboard shortcut digit. */
  key: string;
  hint: string;
}

/** Nouns the shared UI uses for the parts and the whole of a machine. */
export interface MachineTerms {
  /** "assembly" */
  part: string;
  /** "assemblies" */
  parts: string;
  /** Short unit in counts, e.g. "ASM". */
  partsShort: string;
  /** "machine" */
  whole: string;
}

export interface IdentityRow {
  label: string;
  value: string;
  basis: Basis;
}

export type AboutSection =
  | { title: string; body: ReactNode; fine?: boolean }
  | { title: string; kind: "basis" }
  | { title: string; kind: "controls" };

/** Everything the shared explorer needs to know about the machine it presents. */
export interface MachineConfig {
  id: string;
  /** Prefix for sessionStorage keys. */
  storagePrefix: string;
  terms: MachineTerms;
  brand: {
    glyph: string;
    wordmark: string;
    wordmarkShort: string;
    /** Accessible name of the home link. */
    label: string;
  };
  badge: { text: string; short: string; title: string };
  /** Short model code for the top bar and the loader, e.g. "RX-105". */
  designation: string;
  /** Accessible name of the 3D canvas. */
  viewerLabel: string;
  /** Overview identification panel. */
  identity: {
    designation: string;
    glyph?: string;
    name: string;
    source: string;
    rows: IdentityRow[];
    /** Word in the "Internals" stat. */
    internals: string;
    internalsNote: string;
    disclosure: string;
  };
  /** Mobile overview peek. */
  overview: { kicker: string; title: string };
  modes: { scope: ModeScope; list: ModeDescriptor[] };
  layers: Record<PartLayer, { short: string; long: string }>;
  basis: Record<Basis, { short: string; title: string; legend: string; label: string; about: ReactNode }>;
  /** Status bar tag, e.g. "CONCEPTUAL VISUALIZATION". */
  statusTag: string;
  /** Status bar model source when built procedurally. */
  proceduralLabel: string;
  systems: { subtitle: string; note: string };
  /** Footnote under an assembly's relationships. */
  flowsNote: string;
  about: { label: string; title: string; lede: string; sections: AboutSection[] };
  stage: {
    /** Overview camera direction, degrees. */
    azimuth: number;
    elevation: number;
    /** Bounds framed until the model is indexed. */
    defaultBounds: [[number, number, number], [number, number, number]];
    /** Box the orbit target may not leave. */
    targetBoundary: [[number, number, number], [number, number, number]];
    /** Radius of the measurement ring on the floor. */
    ringRadius: number;
    /** Height of the scale ruler beside the model; null hides it. */
    ruler: number | null;
  };
}
