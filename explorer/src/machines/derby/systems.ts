import type { FlowKindSpec, LaneSpec, SystemColumn, SystemEdge, SystemNode } from "@/data/types";
import type { FlowKind, SystemLane } from "./ids";

/**
 * Functional overview of a radar-guided air-to-air missile of the Derby's
 * type, at textbook level: how sensing, avionics, control, propulsion and the
 * airframe relate, and how the launching aircraft connects before launch.
 * Nodes marked `reference` are documented for the Derby (active radar seeker,
 * solid rocket motor, the Python-family dual canards); the rest describe
 * general missile engineering. No design data, internal layout or guidance
 * method is implied.
 *
 * Layout: columns run in flow order —
 *   0 platform → 1 sensing → 2 avionics → 3 control & propulsion → 4 structure.
 */

const D = "reference" as const;
const G = "conceptual" as const;

export const LANES: Record<SystemLane, LaneSpec> = {
  platform: { label: "Platform", short: "PLT", tone: "var(--text-faint)" },
  sensing: { label: "Sensing", short: "SNS", tone: "var(--flow-data)" },
  avionics: { label: "Avionics", short: "AVN", tone: "var(--accent-strong)" },
  control: { label: "Control", short: "CTL", tone: "var(--flow-control)" },
  propulsion: { label: "Propulsion", short: "PRO", tone: "var(--accent)" },
  structure: { label: "Structure", short: "STR", tone: "var(--flow-load)" },
};

export const FLOW_KINDS: Record<FlowKind, FlowKindSpec> = {
  signal: { label: "Signal", description: "Radar energy, measurements and data", stroke: "var(--flow-data)", dash: "1.5 3" },
  control: { label: "Control", description: "Steering commands", stroke: "var(--flow-control)", dash: "5 3.5" },
  power: { label: "Power", description: "Electrical supply", stroke: "var(--flow-power)" },
  load: { label: "Load", description: "Thrust and aerodynamic forces through the structure", stroke: "var(--flow-load)", dash: "0.1 3.6" },
};

export const FLOW_ORDER: FlowKind[] = ["signal", "control", "power", "load"];

export const COLUMNS: SystemColumn[] = [
  { index: 0, title: "Platform", lanes: ["platform"] },
  { index: 1, title: "Sensing", lanes: ["sensing"] },
  { index: 2, title: "Avionics", lanes: ["avionics"] },
  { index: 3, title: "Control & propulsion", lanes: ["control", "propulsion"] },
  { index: 4, title: "Structure", lanes: ["structure"] },
];

export const SYSTEM_NODES: SystemNode[] = [
  /* ---------- column 0 : platform ---------- */
  {
    id: "plt-aircraft",
    code: "PLT-01",
    label: "Aircraft & Launcher",
    lane: "platform",
    col: 0,
    row: 1,
    description: "Carries the missile on its hangers and connects through the umbilical before launch. Platforms include the F-16, F-5, Kfir, Sea Harrier and Tejas.",
    componentIds: ["centre"],
    basis: D,
  },

  /* ---------- column 1 : sensing ---------- */
  {
    id: "sns-radome",
    code: "SNS-01",
    label: "Radome",
    lane: "sensing",
    col: 1,
    row: 0,
    description: "Radar-transparent nose that protects the seeker.",
    componentIds: ["radome"],
    basis: D,
  },
  {
    id: "sns-seeker",
    code: "SNS-02",
    label: "Active Radar Seeker",
    lane: "sensing",
    col: 1,
    row: 1,
    description: "Transmits and receives its own radar signals to find and track the target. Documented for the Derby; Rafael describes the I-Derby ER's seeker as solid-state and software-defined.",
    componentIds: ["radome"],
    basis: D,
  },
  {
    id: "sns-motion",
    code: "SNS-03",
    label: "Motion Sensors",
    lane: "sensing",
    col: 1,
    row: 2,
    description: "Measure the missile's own motion, as in guided missiles generally.",
    componentIds: ["forward"],
    basis: G,
  },

  /* ---------- column 2 : avionics ---------- */
  {
    id: "av-computer",
    code: "AVN-01",
    label: "Guidance & Control Electronics",
    lane: "avionics",
    col: 2,
    row: 1,
    description: "Combines seeker and motion data into steering commands — the core of a missile's avionics (general).",
    componentIds: ["forward"],
    basis: G,
  },
  {
    id: "av-power",
    code: "AVN-02",
    label: "Onboard Power",
    lane: "avionics",
    col: 2,
    row: 2,
    description: "Supplies the electronics and actuators after launch (general).",
    componentIds: ["forward", "centre"],
    basis: G,
  },

  /* ---------- column 3 : control and propulsion ---------- */
  {
    id: "ctl-actuators",
    code: "CTL-01",
    label: "Canard Actuators",
    lane: "control",
    col: 3,
    row: 0,
    description: "Move the control canards on command (general).",
    componentIds: ["forward"],
    basis: G,
  },
  {
    id: "ctl-canards",
    code: "CTL-02",
    label: "Dual Canards",
    lane: "control",
    col: 3,
    row: 1,
    description: "Two rows of four canards behind the radome, as on the canard-controlled Python family.",
    componentIds: ["canards"],
    basis: D,
  },
  {
    id: "pro-motor",
    code: "PRO-01",
    label: "Solid Rocket Motor",
    lane: "propulsion",
    col: 3,
    row: 2,
    description: "Solid propellant in the aft body; dual-pulse on the I-Derby ER.",
    componentIds: ["aft"],
    basis: D,
  },
  {
    id: "pro-nozzle",
    code: "PRO-02",
    label: "Nozzle",
    lane: "propulsion",
    col: 3,
    row: 3,
    description: "Expands the motor's exhaust into thrust.",
    componentIds: ["aft"],
    basis: G,
  },

  /* ---------- column 4 : structure ---------- */
  {
    id: "str-airframe",
    code: "STR-01",
    label: "Airframe",
    lane: "structure",
    col: 4,
    row: 1,
    description: "The 3.62 m, 16 cm-diameter body in four sections, carrying thrust and aerodynamic loads.",
    componentIds: ["radome", "forward", "centre", "aft"],
    basis: D,
  },
  {
    id: "str-wings",
    code: "STR-02",
    label: "Rear Wings",
    lane: "structure",
    col: 4,
    row: 2,
    description: "Four long-chord wings, 0.64 m span: stability and lift at the tail.",
    componentIds: ["wings"],
    basis: D,
  },
];

export const SYSTEM_EDGES: SystemEdge[] = [
  // before launch
  { id: "e-plt-av", from: "plt-aircraft", to: "av-computer", kind: "signal", label: "Pre-launch data" },
  { id: "e-plt-pwr", from: "plt-aircraft", to: "av-power", kind: "power", label: "Power before launch" },
  { id: "e-plt-air", from: "plt-aircraft", to: "str-airframe", kind: "load", label: "Carried on the hangers" },

  // sensing → avionics
  { id: "e-radome-seeker", from: "sns-radome", to: "sns-seeker", kind: "signal", label: "Radar energy" },
  { id: "e-seeker-av", from: "sns-seeker", to: "av-computer", kind: "signal", label: "Target information" },
  { id: "e-motion-av", from: "sns-motion", to: "av-computer", kind: "signal", label: "Missile motion" },

  // power
  { id: "e-pwr-av", from: "av-power", to: "av-computer", kind: "power" },
  { id: "e-pwr-seeker", from: "av-power", to: "sns-seeker", kind: "power" },
  { id: "e-pwr-act", from: "av-power", to: "ctl-actuators", kind: "power" },

  // control
  { id: "e-av-act", from: "av-computer", to: "ctl-actuators", kind: "control", label: "Steering commands" },
  { id: "e-act-canards", from: "ctl-actuators", to: "ctl-canards", kind: "control", label: "Deflection" },

  // loads
  { id: "e-canards-air", from: "ctl-canards", to: "str-airframe", kind: "load", label: "Manoeuvring forces" },
  { id: "e-motor-nozzle", from: "pro-motor", to: "pro-nozzle", kind: "load", label: "Exhaust" },
  { id: "e-nozzle-air", from: "pro-nozzle", to: "str-airframe", kind: "load", label: "Thrust" },
  { id: "e-wings-air", from: "str-wings", to: "str-airframe", kind: "load", label: "Stability" },
];
