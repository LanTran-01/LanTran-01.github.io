import type { FlowKindSpec, LaneSpec, SystemColumn, SystemEdge, SystemNode } from "@/data/types";
import type { FlowKind, SystemLane } from "./ids";

/**
 * Functional overview of the V-2 (A-4) as the Bumper-WAC booster, at the level
 * of a museum cutaway: how the propellants reach the engine, how guidance
 * steers it, how loads pass through the airframe from the firing table to the
 * upper stage, and how the upper stage's ignition ended the V-2's burn. Every
 * node is a documented subsystem; no quantities or design data are implied.
 *
 * Layout: columns run in flow order —
 *   0 ground → 1 propellants → 2 propulsion → 3 guidance → 4 control & structure.
 */

const D = "reference" as const;

export const LANES: Record<SystemLane, LaneSpec> = {
  ground: { label: "Ground", short: "GND", tone: "var(--text-faint)" },
  propellants: { label: "Propellants", short: "PRP", tone: "var(--flow-propellant)" },
  propulsion: { label: "Propulsion", short: "PRO", tone: "var(--accent)" },
  guidance: { label: "Guidance", short: "GDC", tone: "var(--accent-strong)" },
  control: { label: "Control", short: "CTL", tone: "var(--flow-control)" },
  structure: { label: "Structure", short: "STR", tone: "var(--flow-load)" },
  payload: { label: "Upper stage", short: "UPR", tone: "var(--text-dim)" },
};

export const FLOW_KINDS: Record<FlowKind, FlowKindSpec> = {
  propellant: { label: "Propellant", description: "Propellant feed and exhaust gas", stroke: "var(--flow-propellant)", dash: "0.1 3.6" },
  power: { label: "Power", description: "Electrical supply", stroke: "var(--flow-power)" },
  control: { label: "Control", description: "Steering and cut-off commands", stroke: "var(--flow-control)", dash: "5 3.5" },
  load: { label: "Load", description: "Thrust and support forces through the structure", stroke: "var(--flow-load)", dash: "1.5 3" },
};

export const FLOW_ORDER: FlowKind[] = ["propellant", "power", "control", "load"];

export const COLUMNS: SystemColumn[] = [
  { index: 0, title: "Ground", lanes: ["ground"] },
  { index: 1, title: "Propellants", lanes: ["propellants"] },
  { index: 2, title: "Propulsion", lanes: ["propulsion"] },
  { index: 3, title: "Guidance", lanes: ["guidance"] },
  { index: 4, title: "Control & structure", lanes: ["control", "structure", "payload"] },
];

export const SYSTEM_NODES: SystemNode[] = [
  /* ---------- column 0 : ground ---------- */
  {
    id: "gnd-service",
    code: "GND-01",
    label: "Field Servicing",
    lane: "ground",
    col: 0,
    row: 0,
    description: "Road vehicles brought the propellants; liquid oxygen boils away, so the rocket was fuelled shortly before launch.",
    componentIds: [],
    basis: D,
  },
  {
    id: "gnd-table",
    code: "GND-02",
    label: "Firing Table",
    lane: "ground",
    col: 0,
    row: 3,
    description: "Portable stand: the rocket stood on its fins, with a blast deflector beneath the nozzle.",
    componentIds: ["launch"],
    basis: D,
  },

  /* ---------- column 1 : propellants ---------- */
  {
    id: "prp-fuel",
    code: "PRP-01",
    label: "Fuel Tank",
    lane: "propellants",
    col: 1,
    row: 0,
    description: "Ethanol and water mixture (B-Stoff), in the upper tank of the centre section.",
    componentIds: ["centre"],
    basis: D,
  },
  {
    id: "prp-lox",
    code: "PRP-02",
    label: "Liquid-Oxygen Tank",
    lane: "propellants",
    col: 1,
    row: 1,
    description: "Oxidiser (A-Stoff), in the lower tank, insulated with glass wool.",
    componentIds: ["centre"],
    basis: D,
  },
  {
    id: "prp-steam",
    code: "PRP-03",
    label: "Steam Generator",
    lane: "propellants",
    col: 1,
    row: 2,
    description: "Hydrogen peroxide (T-Stoff) decomposed by a permanganate catalyst (Z-Stoff) into steam for the turbine.",
    componentIds: ["tail"],
    basis: D,
  },

  /* ---------- column 2 : propulsion ---------- */
  {
    id: "pro-pump",
    code: "PRO-01",
    label: "Turbopump",
    lane: "propulsion",
    col: 2,
    row: 0,
    description: "Steam turbine driving the fuel and liquid-oxygen pumps, in the tail.",
    componentIds: ["tail"],
    basis: D,
  },
  {
    id: "pro-chamber",
    code: "PRO-02",
    label: "Combustion Chamber",
    lane: "propulsion",
    col: 2,
    row: 1,
    description: "Bulbous chamber fed through eighteen burner cups; cooled by the fuel before it burned.",
    componentIds: ["engine"],
    basis: D,
    children: [
      { id: "pro-cups", code: "PRO-02A", label: "Burner Cups", lane: "propulsion", col: 2, row: 0, description: "Eighteen cups in rings on the chamber head.", componentIds: ["engine"], basis: D },
      { id: "pro-cooling", code: "PRO-02B", label: "Fuel Cooling", lane: "propulsion", col: 2, row: 1, description: "Regenerative and film cooling.", componentIds: ["engine"], basis: D },
    ],
  },
  {
    id: "pro-nozzle",
    code: "PRO-03",
    label: "Nozzle",
    lane: "propulsion",
    col: 2,
    row: 3,
    description: "Accelerates the exhaust to produce thrust; its exit sits in the base of the tail.",
    componentIds: ["engine"],
    basis: D,
  },

  /* ---------- column 3 : guidance ---------- */
  {
    id: "gdc-power",
    code: "GDC-01",
    label: "Electrical Power",
    lane: "guidance",
    col: 3,
    row: 0,
    description: "Onboard batteries and converters for the instruments and servomotors.",
    componentIds: ["instrument"],
    basis: D,
  },
  {
    id: "gdc-gyros",
    code: "GDC-02",
    label: "Gyroscopes",
    lane: "guidance",
    col: 3,
    row: 1,
    description: "Sensed the rocket's deviation from its programmed attitude in pitch, yaw and roll.",
    componentIds: ["instrument"],
    basis: D,
  },
  {
    id: "gdc-computer",
    code: "GDC-03",
    label: "Analog Computer",
    lane: "guidance",
    col: 3,
    row: 2,
    description: "The Mischgerät: mixed the gyroscope signals into commands for the vane servomotors.",
    componentIds: ["instrument"],
    basis: D,
  },
  {
    id: "gdc-cutoff",
    code: "GDC-04",
    label: "Cut-off Integrator",
    lane: "guidance",
    col: 3,
    row: 3,
    description: "Integrating accelerometer that ended powered flight once the planned speed was reached.",
    componentIds: ["instrument"],
    basis: D,
  },

  /* ---------- column 4 : control, structure, payload ---------- */
  {
    id: "ctl-jet",
    code: "CTL-01",
    label: "Jet Vanes",
    lane: "control",
    col: 4,
    row: 0,
    description: "Four graphite vanes deflecting the exhaust — steering from lift-off and in thin air.",
    componentIds: ["control"],
    basis: D,
  },
  {
    id: "ctl-air",
    code: "CTL-02",
    label: "Air Rudders",
    lane: "control",
    col: 4,
    row: 1,
    description: "Four rudders at the fin tips, effective in the dense lower atmosphere.",
    componentIds: ["control", "fins"],
    basis: D,
  },
  {
    id: "str-fins",
    code: "STR-01",
    label: "Stabilising Fins",
    lane: "structure",
    col: 4,
    row: 2,
    description: "Keep the centre of pressure behind the centre of gravity; carry the rocket on the firing table.",
    componentIds: ["fins"],
    basis: D,
  },
  {
    id: "str-airframe",
    code: "STR-02",
    label: "Airframe",
    lane: "structure",
    col: 4,
    row: 3,
    description: "Four bolted sections carrying thrust from the tail's thrust ring forward to the nose.",
    componentIds: ["tail", "centre", "instrument", "nose"],
    basis: D,
    children: [
      { id: "str-tail", code: "STR-02A", label: "Tail & Thrust Ring", lane: "structure", col: 4, row: 0, description: "Takes the engine's thrust.", componentIds: ["tail"], basis: D },
      { id: "str-centre", code: "STR-02B", label: "Centre Section", lane: "structure", col: 4, row: 1, description: "Main body around the tanks.", componentIds: ["centre"], basis: D },
      { id: "str-forward", code: "STR-02C", label: "Forward Sections", lane: "structure", col: 4, row: 2, description: "Instrument compartment and nose.", componentIds: ["instrument", "nose"], basis: D },
    ],
  },
  {
    id: "pay-rails",
    code: "UPR-01",
    label: "Nose Rails",
    lane: "payload",
    col: 4,
    row: 4,
    description: "Rails in the modified nose that held the upper stage's fins until it slid free.",
    componentIds: ["nose"],
    basis: D,
  },
  {
    id: "pay",
    code: "UPR-02",
    label: "WAC Corporal",
    lane: "payload",
    col: 4,
    row: 5,
    description: "Second stage, ignited high in the V-2's climb: nitric acid and furfuryl alcohol fed by compressed air, spun by two small solid rockets.",
    componentIds: ["upper"],
    basis: D,
  },
];

export const SYSTEM_EDGES: SystemEdge[] = [
  // propellant feed
  { id: "e-svc-fuel", from: "gnd-service", to: "prp-fuel", kind: "propellant", label: "Fuelling" },
  { id: "e-svc-lox", from: "gnd-service", to: "prp-lox", kind: "propellant", label: "Topped up before launch" },
  { id: "e-svc-steam", from: "gnd-service", to: "prp-steam", kind: "propellant" },
  { id: "e-fuel-pump", from: "prp-fuel", to: "pro-pump", kind: "propellant", label: "Fuel" },
  { id: "e-lox-pump", from: "prp-lox", to: "pro-pump", kind: "propellant", label: "Liquid oxygen" },
  { id: "e-steam-pump", from: "prp-steam", to: "pro-pump", kind: "propellant", label: "Steam drives the turbine" },
  { id: "e-pump-chamber", from: "pro-pump", to: "pro-cups", kind: "propellant", label: "Pumped propellants" },
  { id: "e-cool-chamber", from: "pro-pump", to: "pro-cooling", kind: "propellant", label: "Fuel through the jacket" },
  { id: "e-chamber-nozzle", from: "pro-chamber", to: "pro-nozzle", kind: "propellant", label: "Hot gas" },
  { id: "e-nozzle-jet", from: "pro-nozzle", to: "ctl-jet", kind: "propellant", label: "Exhaust jet" },

  // guidance and control
  { id: "e-pwr-gyro", from: "gdc-power", to: "gdc-gyros", kind: "power" },
  { id: "e-pwr-comp", from: "gdc-power", to: "gdc-computer", kind: "power" },
  { id: "e-pwr-jet", from: "gdc-power", to: "ctl-jet", kind: "power", label: "Servomotors" },
  { id: "e-gyro-comp", from: "gdc-gyros", to: "gdc-computer", kind: "control", label: "Attitude deviation" },
  { id: "e-comp-jet", from: "gdc-computer", to: "ctl-jet", kind: "control", label: "Steering commands" },
  { id: "e-comp-air", from: "gdc-computer", to: "ctl-air", kind: "control", label: "Steering commands" },
  { id: "e-cutoff", from: "gdc-cutoff", to: "pro-chamber", kind: "control", label: "Engine cut-off" },

  // loads
  { id: "e-table-fins", from: "gnd-table", to: "str-fins", kind: "load", label: "Rocket stands on its fins" },
  { id: "e-nozzle-thrust", from: "pro-nozzle", to: "str-tail", kind: "load", label: "Thrust" },
  { id: "e-fins-frame", from: "str-fins", to: "str-tail", kind: "load", label: "Stabilising forces" },
  { id: "e-tail-centre", from: "str-tail", to: "str-centre", kind: "load" },
  { id: "e-centre-fwd", from: "str-centre", to: "str-forward", kind: "load" },
  { id: "e-frame-rails", from: "str-forward", to: "pay-rails", kind: "load", label: "Nose carries the rails" },
  { id: "e-rails-pay", from: "pay-rails", to: "pay", kind: "load", label: "Holds the upper stage" },
  { id: "e-pay-cutoff", from: "pay", to: "pro-chamber", kind: "control", label: "Ignition signals V-2 cut-off" },
];
