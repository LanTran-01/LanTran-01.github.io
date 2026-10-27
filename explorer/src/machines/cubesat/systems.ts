import type { FlowKindSpec, LaneSpec, SystemColumn, SystemEdge, SystemNode } from "@/data/types";
import type { FlowKind, SystemLane } from "./ids";

/**
 * Illustrative systems architecture of the CubeSat.
 *
 * A high-level picture of how a small satellite's subsystems commonly relate:
 * solar power is conditioned and stored, then switched to the electronics; the
 * onboard computer coordinates sensing, attitude control, the payload and the
 * radio link to the ground. It is an example architecture, not a specific
 * spacecraft, and not every CubeSat has every node.
 *
 * Layout: columns run in flow order —
 *   0 power → 1 sensing → 2 computing → 3 functions (attitude, comms, mission)
 *   → 4 off-board (ground station).
 */

const C = "conceptual" as const;

export const LANES: Record<SystemLane, LaneSpec> = {
  power: { label: "Power", short: "PWR", tone: "var(--accent)" },
  sensing: { label: "Sensing", short: "SNS", tone: "var(--flow-data)" },
  computing: { label: "Computing", short: "CDH", tone: "var(--accent-strong)" },
  attitude: { label: "Attitude", short: "ADC", tone: "var(--flow-control)" },
  comms: { label: "Comms", short: "COM", tone: "var(--flow-rf)" },
  mission: { label: "Mission", short: "PL", tone: "var(--text-dim)" },
  ground: { label: "Ground", short: "GND", tone: "var(--text-faint)" },
};

export const FLOW_KINDS: Record<FlowKind, FlowKindSpec> = {
  power: { label: "Power", description: "Electrical supply", stroke: "var(--flow-power)" },
  data: { label: "Data", description: "Measurements, telemetry and mission data", stroke: "var(--flow-data)" },
  control: { label: "Control", description: "Commands and mode changes", stroke: "var(--flow-control)", dash: "5 3.5" },
  rf: { label: "RF link", description: "Radio signal", stroke: "var(--flow-rf)", dash: "0.1 3.6" },
};

export const FLOW_ORDER: FlowKind[] = ["power", "data", "control", "rf"];

export const COLUMNS: SystemColumn[] = [
  { index: 0, title: "Power", lanes: ["power"] },
  { index: 1, title: "Sensing", lanes: ["sensing"] },
  { index: 2, title: "Computing", lanes: ["computing"] },
  { index: 3, title: "Functions", lanes: ["attitude", "comms", "mission"] },
  { index: 4, title: "Off-board", lanes: ["ground"] },
];

export const SYSTEM_NODES: SystemNode[] = [
  /* ---------- column 0 : power ---------- */
  {
    id: "pwr-solar",
    code: "PWR-01",
    label: "Solar Arrays",
    lane: "power",
    col: 0,
    row: 0,
    description: "Convert sunlight into electrical power for the power management system.",
    componentIds: ["solar"],
    basis: C,
    children: [
      { id: "pwr-wings", code: "PWR-01A", label: "Deployable Wings", lane: "power", col: 0, row: 0, description: "Two two-panel wings.", componentIds: ["solar"], basis: C },
      { id: "pwr-body", code: "PWR-01B", label: "Body-Mounted Cells", lane: "power", col: 0, row: 1, description: "Cells on three side panels.", componentIds: ["solar", "structure"], basis: C },
    ],
  },
  {
    id: "pwr-eps",
    code: "PWR-02",
    label: "Power Management",
    lane: "power",
    col: 0,
    row: 1,
    description: "Conditions array output, manages the battery and switches supply to every load.",
    componentIds: ["eps"],
    basis: C,
    children: [
      { id: "pwr-input", code: "PWR-02A", label: "Input Conditioning", lane: "power", col: 0, row: 0, description: "Draws power from the arrays.", componentIds: ["eps"], basis: C },
      { id: "pwr-reg", code: "PWR-02B", label: "Regulators", lane: "power", col: 0, row: 1, description: "Produce the regulated supply voltages.", componentIds: ["eps"], basis: C },
      { id: "pwr-switch", code: "PWR-02C", label: "Load Switches", lane: "power", col: 0, row: 2, description: "One commandable, current-limited output per subsystem.", componentIds: ["eps"], basis: C },
    ],
  },
  {
    id: "pwr-battery",
    code: "PWR-03",
    label: "Battery Pack",
    lane: "power",
    col: 0,
    row: 2,
    description: "Stores energy for eclipse and for loads larger than the arrays supply.",
    componentIds: ["battery"],
    basis: C,
  },
  {
    id: "pwr-dsw",
    code: "PWR-04",
    label: "Deployment Switches",
    lane: "power",
    col: 0,
    row: 3,
    description: "Rail-end switches that hold the power system off until the satellite leaves its dispenser.",
    componentIds: ["structure"],
    basis: C,
  },

  /* ---------- column 1 : sensing ---------- */
  {
    id: "sns-gnss",
    code: "SNS-01",
    label: "GNSS Receiver",
    lane: "sensing",
    col: 1,
    row: 0,
    description: "Position, velocity and time from navigation satellites, when enough signals are tracked. Optional on CubeSats.",
    componentIds: ["gnss"],
    basis: C,
    children: [
      { id: "sns-gnss-ant", code: "SNS-01A", label: "Patch Antenna", lane: "sensing", col: 1, row: 0, description: "Zenith-facing antenna.", componentIds: ["gnss"], basis: C },
      { id: "sns-gnss-rx", code: "SNS-01B", label: "Receiver", lane: "sensing", col: 1, row: 1, description: "Tracks signals and computes the solution.", componentIds: ["gnss"], basis: C },
    ],
  },
  {
    id: "sns-imu",
    code: "SNS-02",
    label: "Inertial Measurement Unit",
    lane: "sensing",
    col: 1,
    row: 1,
    description: "Angular rate and specific force along three axes.",
    componentIds: ["imu"],
    basis: C,
    children: [
      { id: "sns-gyro", code: "SNS-02A", label: "Gyroscopes", lane: "sensing", col: 1, row: 0, description: "Angular rate.", componentIds: ["imu"], basis: C },
      { id: "sns-accel", code: "SNS-02B", label: "Accelerometers", lane: "sensing", col: 1, row: 1, description: "Specific force.", componentIds: ["imu"], basis: C },
    ],
  },
  {
    id: "sns-sun",
    code: "SNS-03",
    label: "Sun Sensors",
    lane: "sensing",
    col: 1,
    row: 2,
    description: "Direction of the Sun, measured on several faces.",
    componentIds: ["adcs"],
    basis: C,
  },
  {
    id: "sns-mag",
    code: "SNS-04",
    label: "Magnetometer",
    lane: "sensing",
    col: 1,
    row: 3,
    description: "Direction and strength of Earth's magnetic field.",
    componentIds: ["adcs"],
    basis: C,
  },

  /* ---------- column 2 : computing ---------- */
  {
    id: "cdh-obc",
    code: "CDH-01",
    label: "Onboard Computer",
    lane: "computing",
    col: 2,
    row: 0,
    description: "Runs the flight software that coordinates every subsystem and handles telemetry and telecommands.",
    componentIds: ["obc"],
    basis: C,
    children: [
      { id: "cdh-fsw", code: "CDH-01A", label: "Flight Software", lane: "computing", col: 2, row: 0, description: "Scheduling, command handling, fault management.", componentIds: ["obc"], basis: C },
      { id: "cdh-storage", code: "CDH-01B", label: "Data Storage", lane: "computing", col: 2, row: 1, description: "Telemetry and mission data awaiting downlink.", componentIds: ["obc"], basis: C },
      { id: "cdh-sup", code: "CDH-01C", label: "Supervisor", lane: "computing", col: 2, row: 2, description: "Watchdog that can reset the processor.", componentIds: ["obc"], basis: C },
    ],
  },
  {
    id: "adc",
    code: "ADC-01",
    label: "Attitude Determination & Control",
    lane: "computing",
    col: 2,
    row: 2,
    description: "Estimates orientation from the sensors and commands the actuators. No particular algorithm is implied.",
    componentIds: ["adcs"],
    basis: C,
    children: [
      { id: "adc-est", code: "ADC-01A", label: "Attitude Estimation", lane: "computing", col: 2, row: 0, description: "Blends rate and reference-direction measurements.", componentIds: ["adcs", "imu"], basis: C },
      { id: "adc-ctl", code: "ADC-01B", label: "Attitude Control", lane: "computing", col: 2, row: 1, description: "Turns pointing modes into actuator commands.", componentIds: ["adcs"], basis: C },
    ],
  },

  /* ---------- column 3 : functions ---------- */
  {
    id: "com-trx",
    code: "COM-01",
    label: "Transceiver",
    lane: "comms",
    col: 3,
    row: 0,
    description: "Sends telemetry and receives telecommands. No band, protocol or rate is implied.",
    componentIds: ["comms"],
    basis: C,
    children: [
      { id: "com-tx", code: "COM-01A", label: "Transmitter", lane: "comms", col: 3, row: 0, description: "Telemetry downlink.", componentIds: ["comms"], basis: C },
      { id: "com-rx", code: "COM-01B", label: "Receiver", lane: "comms", col: 3, row: 1, description: "Telecommand uplink.", componentIds: ["comms"], basis: C },
    ],
  },
  {
    id: "com-ant",
    code: "COM-02",
    label: "Antenna",
    lane: "comms",
    col: 3,
    row: 1,
    description: "Deployable elements that radiate and collect the radio signal.",
    componentIds: ["antenna"],
    basis: C,
  },
  {
    id: "act-wheels",
    code: "ACT-01",
    label: "Reaction Wheels",
    lane: "attitude",
    col: 3,
    row: 2,
    description: "Exchange momentum with the body for fine pointing.",
    componentIds: ["adcs"],
    basis: C,
  },
  {
    id: "act-mtq",
    code: "ACT-02",
    label: "Magnetorquers",
    lane: "attitude",
    col: 3,
    row: 3,
    description: "Coils producing torque against Earth's magnetic field.",
    componentIds: ["adcs"],
    basis: C,
  },
  {
    id: "pl-inst",
    code: "PL-01",
    label: "Payload Instrument",
    lane: "mission",
    col: 3,
    row: 4,
    description: "Performs the mission-specific function — here an illustrative imager.",
    componentIds: ["payload"],
    basis: C,
    children: [
      { id: "pl-sensor", code: "PL-01A", label: "Imaging Sensor", lane: "mission", col: 3, row: 0, description: "Optics and detector.", componentIds: ["payload"], basis: C },
      { id: "pl-electronics", code: "PL-01B", label: "Payload Electronics", lane: "mission", col: 3, row: 1, description: "Readout and data processing.", componentIds: ["payload"], basis: C },
    ],
  },

  /* ---------- column 4 : off-board ---------- */
  {
    id: "gnd",
    code: "GND-01",
    label: "Ground Station",
    lane: "ground",
    col: 4,
    row: 1,
    description: "Operators' antenna and equipment on Earth: receives telemetry and sends telecommands during each pass.",
    componentIds: [],
    basis: "reference",
  },
];

export const SYSTEM_EDGES: SystemEdge[] = [
  // power generation, storage and distribution
  { id: "e-solar-eps", from: "pwr-solar", to: "pwr-input", kind: "power", label: "Array output" },
  { id: "e-eps-bat", from: "pwr-eps", to: "pwr-battery", kind: "power", label: "Charge" },
  { id: "e-bat-eps", from: "pwr-battery", to: "pwr-eps", kind: "power", label: "Discharge" },
  { id: "e-sw-obc", from: "pwr-switch", to: "cdh-obc", kind: "power" },
  { id: "e-sw-gnss", from: "pwr-switch", to: "sns-gnss", kind: "power" },
  { id: "e-sw-imu", from: "pwr-switch", to: "sns-imu", kind: "power" },
  { id: "e-sw-adc", from: "pwr-switch", to: "adc", kind: "power" },
  { id: "e-sw-trx", from: "pwr-switch", to: "com-trx", kind: "power" },
  { id: "e-sw-pl", from: "pwr-switch", to: "pl-inst", kind: "power" },
  { id: "e-dsw-eps", from: "pwr-dsw", to: "pwr-eps", kind: "control", label: "Inhibit" },

  // sensing → computing
  { id: "e-gant-grx", from: "sns-gnss-ant", to: "sns-gnss-rx", kind: "rf", label: "Navigation signals" },
  { id: "e-gnss-obc", from: "sns-gnss-rx", to: "cdh-obc", kind: "data", label: "Position & time" },
  { id: "e-gyro-est", from: "sns-gyro", to: "adc-est", kind: "data", label: "Angular rate" },
  { id: "e-accel-est", from: "sns-accel", to: "adc-est", kind: "data", label: "Specific force" },
  { id: "e-sun-est", from: "sns-sun", to: "adc-est", kind: "data", label: "Sun direction" },
  { id: "e-mag-est", from: "sns-mag", to: "adc-est", kind: "data", label: "Field direction" },
  { id: "e-eps-obc", from: "pwr-eps", to: "cdh-obc", kind: "data", label: "Power telemetry" },

  // computing
  { id: "e-est-obc", from: "adc-est", to: "cdh-obc", kind: "data", label: "Attitude estimate" },
  { id: "e-fsw-ctl", from: "cdh-fsw", to: "adc-ctl", kind: "control", label: "Pointing mode" },
  { id: "e-fsw-sw", from: "cdh-fsw", to: "pwr-switch", kind: "control", label: "Load switching" },
  { id: "e-sup-fsw", from: "cdh-sup", to: "cdh-fsw", kind: "control", label: "Reset" },

  // computing → functions
  { id: "e-ctl-wheels", from: "adc-ctl", to: "act-wheels", kind: "control", label: "Torque commands" },
  { id: "e-ctl-mtq", from: "adc-ctl", to: "act-mtq", kind: "control", label: "Dipole commands" },
  { id: "e-store-tx", from: "cdh-storage", to: "com-tx", kind: "data", label: "Telemetry" },
  { id: "e-rx-fsw", from: "com-rx", to: "cdh-fsw", kind: "control", label: "Telecommands" },
  { id: "e-fsw-pl", from: "cdh-fsw", to: "pl-inst", kind: "control", label: "Commands" },
  { id: "e-pl-store", from: "pl-electronics", to: "cdh-storage", kind: "data", label: "Mission data" },
  { id: "e-sensor-ple", from: "pl-sensor", to: "pl-electronics", kind: "data", label: "Image data" },

  // radio link
  { id: "e-tx-ant", from: "com-tx", to: "com-ant", kind: "rf", label: "Transmit" },
  { id: "e-ant-rx", from: "com-ant", to: "com-rx", kind: "rf", label: "Receive" },
  { id: "e-ant-gnd", from: "com-ant", to: "gnd", kind: "rf", label: "Downlink" },
  { id: "e-gnd-ant", from: "gnd", to: "com-ant", kind: "rf", label: "Uplink" },
];
