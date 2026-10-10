/**
 * Domain types shared by the viewer, the inspection UI and the systems map.
 *
 * Everything technical in this project is a *conceptual* visualization. The
 * `basis` field on data rows makes the distinction explicit:
 *   - "reference"  : a non-numeric descriptor widely published for the RX-105
 *                    (e.g. that it carries a Minovsky flight system).
 *   - "conceptual" : invented for this visualization. Never canon.
 */

export type ComponentId =
  | "head"
  | "chest"
  | "shoulders"
  | "arms"
  | "waist"
  | "legs"
  | "feet"
  | "backpack"
  | "thrusters"
  | "weapons";

/** Inspection modes available once an assembly is selected. */
export type InspectionMode = "exterior" | "cutaway" | "exploded" | "architecture";

/** Where a part lives in an assembly. Mirrors `PartLayer` on model meshes. */
export type PartLayer = "armor" | "frame" | "internal";

export type Basis = "reference" | "conceptual";

export type FlowKind = "power" | "data" | "control" | "propellant";

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
}

/* ------------------------------------------------------------------ */
/* Systems architecture                                                */
/* ------------------------------------------------------------------ */

export type SystemLane =
  | "power"
  | "sensing"
  | "cockpit"
  | "computing"
  | "actuation"
  | "propulsion"
  | "weapons";

export interface SystemNode {
  id: string;
  code: string;
  label: string;
  lane: SystemLane;
  /** Grid placement for the top-level layout. Columns run left → right in flow order. */
  col: number;
  row: number;
  description: string;
  /** 3D assemblies this subsystem physically lives in. Drives 3D ↔ diagram sync. */
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
