import type { FlowKindSpec, LaneSpec, SystemColumn, SystemEdge, SystemNode } from "@/data/types";
import type { FlowKind, SystemLane } from "./ids";

/**
 * Conceptual systems architecture.
 *
 * This graph is an engineering-style illustration of how a machine like the
 * RX-105 *could* be organised. It is not derived from official material.
 *
 * Layout: columns run in flow order —
 *   0 power → 1 inputs (sensing, cockpit) → 2 computing → 3 outputs (actuation,
 *   propulsion, weapons). Rows order nodes within a column.
 */

const C = "conceptual" as const;

/** Lanes use the accent family and greys only. */
export const LANES: Record<SystemLane, LaneSpec> = {
  power: { label: "Power", short: "PWR", tone: "var(--accent)" },
  sensing: { label: "Sensing", short: "SNS", tone: "var(--flow-data)" },
  cockpit: { label: "Cockpit", short: "CPT", tone: "var(--text-dim)" },
  computing: { label: "Computing", short: "CMP", tone: "var(--accent-strong)" },
  actuation: { label: "Actuation", short: "ACT", tone: "var(--flow-data)" },
  propulsion: { label: "Propulsion", short: "PRP", tone: "var(--flow-control)" },
  weapons: { label: "Weapons", short: "WPN", tone: "var(--text-dim)" },
};

/** Flow kinds vary by tone and dash pattern (tokens.css). */
export const FLOW_KINDS: Record<FlowKind, FlowKindSpec> = {
  power: { label: "Power", description: "Electrical supply", stroke: "var(--flow-power)" },
  data: { label: "Data", description: "Sensor and status data", stroke: "var(--flow-data)" },
  control: { label: "Control", description: "Commands and set-points", stroke: "var(--flow-control)", dash: "5 3.5" },
  propellant: { label: "Propellant", description: "Reaction mass feed", stroke: "var(--flow-propellant)", dash: "0.1 3.6" },
};

/** Legend and filter order. */
export const FLOW_ORDER: FlowKind[] = ["power", "data", "control", "propellant"];

export const COLUMNS: SystemColumn[] = [
  { index: 0, title: "Power", lanes: ["power"] },
  { index: 1, title: "Inputs", lanes: ["sensing", "cockpit"] },
  { index: 2, title: "Computing", lanes: ["computing"] },
  { index: 3, title: "Outputs", lanes: ["actuation", "propulsion", "weapons"] },
];

export const SYSTEM_NODES: SystemNode[] = [
  /* ---------- column 0 : power ---------- */
  {
    id: "pwr-core",
    code: "PWR-01",
    label: "Primary Power Core",
    lane: "power",
    col: 0,
    row: 0,
    description: "Main power source. Placed in the waist block following a common mobile-suit convention.",
    componentIds: ["waist"],
    basis: C,
  },
  {
    id: "pwr-bus",
    code: "PWR-02",
    label: "Power Distribution Bus",
    lane: "power",
    col: 0,
    row: 1,
    description: "Main bus splitting supply between the upper and lower body.",
    componentIds: ["waist", "chest"],
    basis: C,
    children: [
      { id: "pwr-upper", code: "PWR-02A", label: "Upper Distribution", lane: "power", col: 0, row: 0, description: "Feeds head, arms and cockpit systems.", componentIds: ["chest"], basis: C },
      { id: "pwr-lower", code: "PWR-02B", label: "Lower Distribution", lane: "power", col: 0, row: 1, description: "Feeds legs, feet and skirt thrusters.", componentIds: ["waist"], basis: C },
    ],
  },
  {
    id: "pwr-storage",
    code: "PWR-03",
    label: "Energy Storage Bank",
    lane: "power",
    col: 0,
    row: 2,
    description: "Buffer storage in the backpack that covers peak loads from the flight system and weapons.",
    componentIds: ["backpack"],
    basis: C,
  },

  /* ---------- column 1 : sensing + cockpit ---------- */
  {
    id: "sns-head",
    code: "SNS-01",
    label: "Head Sensor Array",
    lane: "sensing",
    col: 1,
    row: 0,
    description: "Optical sensors, main camera and antenna array in the head.",
    componentIds: ["head"],
    basis: C,
    children: [
      { id: "sns-optics", code: "SNS-01A", label: "Dual Optical Unit", lane: "sensing", col: 1, row: 0, description: "Stereo optical sensors behind the visor.", componentIds: ["head"], basis: C },
      { id: "sns-camera", code: "SNS-01B", label: "Main Camera", lane: "sensing", col: 1, row: 1, description: "Centreline long-range camera.", componentIds: ["head"], basis: C },
      { id: "sns-antenna", code: "SNS-01C", label: "Antenna Array", lane: "sensing", col: 1, row: 2, description: "V-fin wide-area receiver (conceptual role).", componentIds: ["head"], basis: C },
    ],
  },
  {
    id: "sns-dsp",
    code: "SNS-02",
    label: "Signal Processing",
    lane: "sensing",
    col: 1,
    row: 1,
    description: "Conditions and fuses raw sensor data into tracks.",
    componentIds: ["head"],
    basis: C,
  },
  {
    id: "sns-imu",
    code: "SNS-03",
    label: "Attitude Reference",
    lane: "sensing",
    col: 1,
    row: 2,
    description: "Inertial attitude and rate sensing in the torso.",
    componentIds: ["chest"],
    basis: C,
  },
  {
    id: "sns-contact",
    code: "SNS-04",
    label: "Ground Contact Sensors",
    lane: "sensing",
    col: 1,
    row: 3,
    description: "Load cells in the sole pads reporting contact and balance.",
    componentIds: ["feet"],
    basis: C,
  },
  {
    id: "cpt-interface",
    code: "CPT-01",
    label: "Pilot Interface",
    lane: "cockpit",
    col: 1,
    row: 4,
    description: "Seat and control grips; pilot commands enter the control system here.",
    componentIds: ["chest"],
    basis: C,
  },
  {
    id: "cpt-display",
    code: "CPT-02",
    label: "Display System",
    lane: "cockpit",
    col: 1,
    row: 5,
    description: "Wrap-around display fed by the main computer.",
    componentIds: ["chest"],
    basis: C,
  },
  {
    id: "cpt-env",
    code: "CPT-03",
    label: "Environmental Control",
    lane: "cockpit",
    col: 1,
    row: 6,
    description: "Cabin life support.",
    componentIds: ["chest"],
    basis: C,
  },

  /* ---------- column 2 : computing ---------- */
  {
    id: "cmp-main",
    code: "CMP-01",
    label: "Main Control Computer",
    lane: "computing",
    col: 2,
    row: 1,
    description: "Coordinates every subsystem controller. Lives behind the cockpit module.",
    componentIds: ["chest"],
    basis: C,
    children: [
      { id: "cmp-flight", code: "CMP-01A", label: "Flight Control", lane: "computing", col: 2, row: 0, description: "Flight path and attitude control laws.", componentIds: ["chest"], basis: C },
      { id: "cmp-motion", code: "CMP-01B", label: "Motion Control", lane: "computing", col: 2, row: 1, description: "Whole-body motion planning.", componentIds: ["chest"], basis: C },
      { id: "cmp-health", code: "CMP-01C", label: "Systems Management", lane: "computing", col: 2, row: 2, description: "Health monitoring and power management.", componentIds: ["chest"], basis: C },
    ],
  },
  {
    id: "cmp-fcs",
    code: "CMP-02",
    label: "Fire Control System",
    lane: "computing",
    col: 2,
    row: 3,
    description: "Targeting solutions from sensor tracks.",
    componentIds: ["chest", "weapons"],
    basis: C,
  },
  {
    id: "cmp-limb",
    code: "CMP-03",
    label: "Limb Controllers",
    lane: "computing",
    col: 2,
    row: 4,
    description: "Per-limb joint controllers closing position loops.",
    componentIds: ["arms", "legs"],
    basis: C,
    children: [
      { id: "cmp-arm", code: "CMP-03A", label: "Arm Controllers", lane: "computing", col: 2, row: 0, description: "Left and right arm loops.", componentIds: ["arms", "shoulders"], basis: C },
      { id: "cmp-leg", code: "CMP-03B", label: "Leg Controllers", lane: "computing", col: 2, row: 1, description: "Left and right leg loops.", componentIds: ["legs", "feet"], basis: C },
    ],
  },

  /* ---------- column 3 : outputs ---------- */
  {
    id: "act-drivers",
    code: "ACT-01",
    label: "Motor Drivers",
    lane: "actuation",
    col: 3,
    row: 0,
    description: "Power stages driving each joint actuator.",
    componentIds: ["arms", "legs", "shoulders"],
    basis: C,
  },
  {
    id: "act-joints",
    code: "ACT-02",
    label: "Joint Actuators",
    lane: "actuation",
    col: 3,
    row: 1,
    description: "Shoulder, elbow, wrist, hip, knee and ankle drives.",
    componentIds: ["shoulders", "arms", "waist", "legs", "feet"],
    basis: C,
  },
  {
    id: "prp-controller",
    code: "PRP-01",
    label: "Propulsion Controller",
    lane: "propulsion",
    col: 3,
    row: 2,
    description: "Allocates thrust between the flight system and nozzles.",
    componentIds: ["backpack"],
    basis: C,
  },
  {
    id: "prp-flight",
    code: "PRP-02",
    label: "Flight System",
    lane: "propulsion",
    col: 3,
    row: 3,
    description: "The RX-105 is described as carrying a Minovsky flight system; its internals here are conceptual.",
    componentIds: ["backpack"],
    basis: "reference",
  },
  {
    id: "prp-tcu",
    code: "PRP-03",
    label: "Thruster Control Units",
    lane: "propulsion",
    col: 3,
    row: 4,
    description: "Local throttle and gimbal control for each nozzle group.",
    componentIds: ["thrusters"],
    basis: C,
    children: [
      { id: "prp-main", code: "PRP-03A", label: "Main Nozzles", lane: "propulsion", col: 3, row: 0, description: "Backpack nozzles.", componentIds: ["thrusters", "backpack"], basis: C },
      { id: "prp-verniers", code: "PRP-03B", label: "Leg Verniers", lane: "propulsion", col: 3, row: 1, description: "Lower-leg verniers.", componentIds: ["thrusters", "legs"], basis: C },
      { id: "prp-skirt", code: "PRP-03C", label: "Skirt Thrusters", lane: "propulsion", col: 3, row: 2, description: "Under-skirt nozzles.", componentIds: ["thrusters", "waist"], basis: C },
    ],
  },
  {
    id: "prp-feed",
    code: "PRP-04",
    label: "Propellant Feed",
    lane: "propulsion",
    col: 3,
    row: 5,
    description: "Tanks and lines supplying the nozzles (conceptual).",
    componentIds: ["legs", "backpack"],
    basis: C,
  },
  {
    id: "wpn-interface",
    code: "WPN-01",
    label: "Weapon Interface",
    lane: "weapons",
    col: 3,
    row: 6,
    description: "Palm connector carrying power and data to the handheld rifle.",
    componentIds: ["arms", "weapons"],
    basis: C,
  },
];

export const SYSTEM_EDGES: SystemEdge[] = [
  // power
  { id: "e-core-bus", from: "pwr-core", to: "pwr-bus", kind: "power", label: "Main supply" },
  { id: "e-bus-storage", from: "pwr-bus", to: "pwr-storage", kind: "power", label: "Charge" },
  { id: "e-upper-cmp", from: "pwr-upper", to: "cmp-main", kind: "power" },
  { id: "e-upper-head", from: "pwr-upper", to: "sns-head", kind: "power" },
  { id: "e-upper-cpt", from: "pwr-upper", to: "cpt-env", kind: "power" },
  { id: "e-upper-drv", from: "pwr-upper", to: "act-drivers", kind: "power", label: "Upper drives" },
  { id: "e-lower-drv", from: "pwr-lower", to: "act-drivers", kind: "power", label: "Lower drives" },
  { id: "e-storage-prp", from: "pwr-storage", to: "prp-flight", kind: "power", label: "Peak supply" },
  { id: "e-storage-wpn", from: "pwr-storage", to: "wpn-interface", kind: "power", label: "Weapon charge" },

  // sensing → computing
  { id: "e-optics-dsp", from: "sns-optics", to: "sns-dsp", kind: "data" },
  { id: "e-camera-dsp", from: "sns-camera", to: "sns-dsp", kind: "data" },
  { id: "e-antenna-dsp", from: "sns-antenna", to: "sns-dsp", kind: "data" },
  { id: "e-dsp-cmp", from: "sns-dsp", to: "cmp-main", kind: "data", label: "Tracks" },
  { id: "e-dsp-fcs", from: "sns-dsp", to: "cmp-fcs", kind: "data", label: "Targets" },
  { id: "e-imu-flight", from: "sns-imu", to: "cmp-flight", kind: "data", label: "Attitude" },
  { id: "e-contact-leg", from: "sns-contact", to: "cmp-leg", kind: "data", label: "Contact" },

  // cockpit ↔ computing
  { id: "e-pilot-cmp", from: "cpt-interface", to: "cmp-motion", kind: "control", label: "Pilot input" },
  { id: "e-cmp-display", from: "cmp-health", to: "cpt-display", kind: "data", label: "Status" },
  { id: "e-cmp-env", from: "cmp-health", to: "cpt-env", kind: "control" },

  // computing → outputs
  { id: "e-motion-arm", from: "cmp-motion", to: "cmp-arm", kind: "control" },
  { id: "e-motion-leg", from: "cmp-motion", to: "cmp-leg", kind: "control" },
  { id: "e-limb-drv", from: "cmp-limb", to: "act-drivers", kind: "control", label: "Set-points" },
  { id: "e-drv-joints", from: "act-drivers", to: "act-joints", kind: "power", label: "Drive current" },
  { id: "e-joints-limb", from: "act-joints", to: "cmp-limb", kind: "data", label: "Feedback" },
  { id: "e-flight-prp", from: "cmp-flight", to: "prp-controller", kind: "control", label: "Thrust demand" },
  { id: "e-prp-flight", from: "prp-controller", to: "prp-flight", kind: "control" },
  { id: "e-prp-tcu", from: "prp-controller", to: "prp-tcu", kind: "control" },
  { id: "e-feed-main", from: "prp-feed", to: "prp-main", kind: "propellant" },
  { id: "e-feed-vern", from: "prp-feed", to: "prp-verniers", kind: "propellant" },
  { id: "e-feed-skirt", from: "prp-feed", to: "prp-skirt", kind: "propellant" },
  { id: "e-fcs-wpn", from: "cmp-fcs", to: "wpn-interface", kind: "control", label: "Fire control" },
  { id: "e-wpn-fcs", from: "wpn-interface", to: "cmp-fcs", kind: "data", label: "Weapon status" },
];

