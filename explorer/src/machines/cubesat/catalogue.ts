import type { ComponentSpec } from "@/data/types";

/**
 * Component catalogue of the illustrative 3U CubeSat.
 *
 * This is a generic educational spacecraft, not a specific satellite. Rows
 * marked `basis: "reference"` state general, widely documented facts about
 * CubeSats or spacecraft engineering. Everything marked `conceptual` describes
 * the example architecture chosen for this model. No dimensions, electrical
 * ratings, frequencies, protocols or control algorithms are specified, and
 * not every CubeSat carries every component listed here.
 */

const CONCEPT = "conceptual" as const;
const REF = "reference" as const;

export const COMPONENTS: ComponentSpec[] = [
  {
    id: "obc",
    slug: "onboard-computer",
    prefix: "OB",
    name: "Onboard Computer",
    shortName: "Onboard Computer",
    designation: "CMP-01 / OBC",
    classification: "Command & data handling — flight computer",
    summary: "Embedded computer that runs the flight software and coordinates the spacecraft.",
    description:
      "The onboard computer is the satellite's central embedded processor. It runs the flight software that schedules operations, gathers housekeeping data from the other subsystems, stores it, and executes commands received from the ground. Here it is one board in the avionics stack, linked to its neighbours through the stack connector.",
    mechanicalFunction: "Executes flight software, coordinates onboard functions and processes system data.",
    role: "Hub of the avionics stack: telemetry leaves through it and telecommands arrive through it.",
    interfaces: [
      { componentId: "comms", relation: "Telemetry out, telecommands in" },
      { componentId: "eps", relation: "Regulated supply, power telemetry, load-switch commands" },
      { componentId: "adcs", relation: "Pointing modes out, attitude estimate in" },
      { componentId: "gnss", relation: "Position, velocity and time" },
      { componentId: "payload", relation: "Commands out, mission data in" },
    ],
    flows: [
      { kind: "power", direction: "in", peer: "Power management", note: "Regulated supply" },
      { kind: "data", direction: "in", peer: "GNSS receiver, ADCS, power management", note: "Position, attitude and power status" },
      { kind: "data", direction: "out", peer: "Communications transceiver", note: "Housekeeping and mission telemetry" },
      { kind: "control", direction: "in", peer: "Communications transceiver", note: "Telecommands from the ground" },
      { kind: "control", direction: "out", peer: "Payload, ADCS, power management", note: "Modes, schedules and switching" },
    ],
    subassemblies: [
      { id: "obc-board", code: "OB-100", name: "Circuit Board & Stack Connector", layer: "internal", description: "Board carrying the computer, joined to the rest of the stack by its edge connector." },
      { id: "obc-proc", code: "OB-200", name: "Processor", layer: "internal", description: "Runs the flight software." },
      { id: "obc-mem", code: "OB-300", name: "Memory", layer: "internal", description: "Program storage and data storage for telemetry awaiting downlink." },
      { id: "obc-sup", code: "OB-400", name: "Supervisor", layer: "internal", description: "Independent watchdog circuit that can reset the processor if the software stops responding." },
      { id: "obc-io", code: "OB-500", name: "Interface Connectors", layer: "internal", description: "Connections to subsystems outside the stack, such as the payload." },
    ],
    techData: [
      { label: "Inclusion", value: "Core — some form of onboard computer is found on essentially every satellite", basis: REF },
      { label: "Software", value: "Scheduling, housekeeping, command handling, fault management", basis: CONCEPT },
      { label: "Elements shown", value: "Processor, memory, supervisor, connectors", basis: CONCEPT },
    ],
    details: [
      {
        title: "Flight software",
        body: "Flight software is usually organised as cooperating tasks: a scheduler, handlers for incoming telecommands, collection and packaging of housekeeping telemetry, and fault detection that can put the spacecraft into a safe mode. Whether it runs on a real-time operating system or directly on the hardware is a design choice this model leaves open.",
      },
      {
        title: "Why a supervisor",
        body: "Radiation effects and software faults can leave a processor stuck. A watchdog that the software must service periodically gives the system an independent way to recover by resetting it.",
      },
      {
        title: "Data handling",
        body: "The computer reads status values from the other subsystems over onboard data buses, timestamps and stores them, and hands them to the radio for downlink when a ground station is in view.",
      },
    ],
    inspectionNotes: [
      "Internal view shows the board in the avionics stack, between the power system and the IMU.",
      "Exploded view lifts the avionics boards apart along the satellite's long axis.",
    ],
    camera: { direction: [0.85, 0.72, 1], distanceFactor: 3.2 },
  },
  {
    id: "gnss",
    slug: "gnss",
    prefix: "GN",
    name: "GNSS Receiver",
    shortName: "GNSS Receiver",
    designation: "CMP-02 / GNS",
    classification: "Navigation — satellite positioning",
    summary: "Receives navigation-satellite signals to estimate position, velocity and time.",
    description:
      "A GNSS receiver tracks signals broadcast by navigation-satellite constellations and, when enough are in view, solves for its own position, velocity and a precise time reference. On a spacecraft that gives the onboard computer an orbit estimate without waiting for ground tracking. It is optional here: a patch antenna on the zenith end and a receiver board in the stack.",
    mechanicalFunction: "Estimates position, velocity and time from navigation-satellite signals.",
    role: "Optional navigation source: supplies position and time to the onboard computer when signals permit.",
    interfaces: [
      { componentId: "obc", relation: "Position, velocity and time" },
      { componentId: "antenna", relation: "Patch antenna shares the zenith face of the deployer" },
      { componentId: "eps", relation: "Switched supply" },
    ],
    flows: [
      { kind: "power", direction: "in", peer: "Power management", note: "Switched supply" },
      { kind: "data", direction: "out", peer: "Onboard computer", note: "Position, velocity and time, when a solution is available" },
    ],
    subassemblies: [
      { id: "gnss-antenna", code: "GN-100", name: "Patch Antenna", layer: "frame", description: "Flat antenna facing away from Earth, where the navigation satellites are." },
      { id: "gnss-cable", code: "GN-200", name: "Antenna Cable", layer: "internal", description: "Coaxial cable from the patch down to the receiver board." },
      { id: "gnss-rf", code: "GN-300", name: "RF Front End", layer: "internal", description: "Shielded section that amplifies and filters the weak incoming signal." },
      { id: "gnss-proc", code: "GN-400", name: "Baseband Processor", layer: "internal", description: "Tracks the satellite signals and computes the navigation solution." },
      { id: "gnss-board", code: "GN-500", name: "Receiver Board", layer: "internal", description: "Carrier board with its stack connector." },
    ],
    techData: [
      { label: "Inclusion", value: "Optional — many CubeSats rely on ground-based tracking data instead", basis: REF },
      { label: "Outputs", value: "Position, velocity and time, when enough signals are tracked", basis: REF },
      { label: "Antenna placement", value: "Zenith end, opposite the payload", basis: CONCEPT },
    ],
    details: [
      {
        title: "How positioning works",
        body: "Each navigation satellite broadcasts its position and a precise time. By measuring signal travel times from at least four satellites, a receiver solves for three position coordinates and its own clock error. Repeated measurements, or the Doppler shift of each signal, give velocity.",
      },
      {
        title: "Why availability is conditional",
        body: "Reception depends on the antenna's orientation, the receiver's design and the orbit. In orbit a receiver must cope with far higher velocities and Doppler shifts than on the ground, and some receivers are restricted from operating at those speeds. That is why this model treats GNSS as optional.",
      },
    ],
    inspectionNotes: [
      "Exterior view shows only the patch antenna on top; the internal view reveals the receiver board.",
      "Exploded view lifts the patch with the antenna deployer and separates the receiver board from the stack.",
    ],
    camera: { direction: [0.8, 0.8, 1], distanceFactor: 2.8 },
  },
  {
    id: "imu",
    slug: "imu",
    prefix: "IM",
    name: "Inertial Measurement Unit",
    shortName: "IMU",
    designation: "CMP-03 / IMU",
    classification: "Sensing — inertial measurement",
    summary: "Gyroscopes and accelerometers measuring angular rate and specific force.",
    description:
      "An IMU combines gyroscopes, which measure angular rate about three axes, with accelerometers, which measure specific force — the non-gravitational acceleration the sensor feels. On a satellite the gyroscopes matter most: their rates track how the attitude changes between absolute fixes from sensors such as sun sensors.",
    mechanicalFunction: "Measures angular rate and specific force along three axes.",
    role: "Supplies high-rate motion data to attitude estimation.",
    interfaces: [
      { componentId: "adcs", relation: "Angular rate for attitude estimation" },
      { componentId: "obc", relation: "Shares the avionics stack" },
      { componentId: "eps", relation: "Supply" },
    ],
    flows: [
      { kind: "power", direction: "in", peer: "Power management", note: "Supply" },
      { kind: "data", direction: "out", peer: "Attitude determination", note: "Angular rate and specific force" },
    ],
    subassemblies: [
      { id: "imu-gyro", code: "IM-100", name: "Three-Axis Gyroscope", layer: "internal", description: "Measures angular rate about three axes." },
      { id: "imu-accel", code: "IM-200", name: "Three-Axis Accelerometer", layer: "internal", description: "Measures specific force along three axes." },
      { id: "imu-housing", code: "IM-300", name: "Housing & Lid", layer: "internal", description: "Rigid enclosure that keeps the sensors aligned with the structure." },
      { id: "imu-board", code: "IM-400", name: "Carrier Board", layer: "internal", description: "Board mounting the module in the stack." },
    ],
    techData: [
      { label: "Inclusion", value: "Common but not universal — some designs rely on other attitude sensors alone", basis: REF },
      { label: "Outputs", value: "Angular rate (gyroscope), specific force (accelerometer)", basis: REF },
      { label: "Form shown", value: "Compact enclosed module on its own carrier board", basis: CONCEPT },
    ],
    details: [
      {
        title: "Gyroscopes",
        body: "A gyroscope reports angular rate. Integrating the rate gives a change in orientation, but small biases accumulate as drift, so the estimate must be corrected periodically with absolute references such as the Sun direction or the magnetic field.",
      },
      {
        title: "Accelerometers in orbit",
        body: "In free fall an accelerometer does not sense gravity; it measures specific force, which in orbit is close to zero apart from drag, thrust and shocks. That makes accelerometers more useful for events such as deployments or manoeuvres than for attitude.",
      },
      {
        title: "Sensor fusion",
        body: "Attitude estimation typically blends fast gyroscope data with slower absolute measurements, weighting each by how far it can be trusted. This model does not specify an estimation algorithm.",
      },
    ],
    inspectionNotes: [
      "Internal view shows the enclosed module on its carrier board in the avionics stack.",
      "Exploded view lifts the lid off the module.",
    ],
    camera: { direction: [0.85, 0.72, 1], distanceFactor: 3.4 },
  },
  {
    id: "eps",
    slug: "power",
    prefix: "EP",
    name: "Power Management System",
    shortName: "Power Management",
    designation: "CMP-04 / EPS",
    classification: "Electrical power — conditioning & distribution",
    summary: "Conditions solar and battery power and distributes it to every subsystem.",
    description:
      "The power management electronics sit between the energy sources and the loads. They condition solar-panel output, control battery charge and discharge, convert power to the regulated voltages the electronics need, and switch individual loads on and off — reporting voltages, currents and temperatures so the onboard computer can manage the energy budget.",
    mechanicalFunction: "Conditions, routes and distributes electrical power, and monitors the power budget.",
    role: "Junction between generation (solar), storage (battery) and every electrical load.",
    interfaces: [
      { componentId: "solar", relation: "Array input" },
      { componentId: "battery", relation: "Charge and discharge path" },
      { componentId: "obc", relation: "Supply, power telemetry and switch commands" },
      { componentId: "payload", relation: "Switched supply" },
    ],
    flows: [
      { kind: "power", direction: "in", peer: "Solar power system", note: "Array output" },
      { kind: "power", direction: "both", peer: "Battery", note: "Charge and discharge" },
      { kind: "power", direction: "out", peer: "All onboard electronics", note: "Regulated, individually switched supplies" },
      { kind: "data", direction: "out", peer: "Onboard computer", note: "Voltages, currents, temperatures" },
      { kind: "control", direction: "in", peer: "Onboard computer", note: "Load switching" },
    ],
    subassemblies: [
      { id: "eps-input", code: "EP-100", name: "Solar Input Conditioning", layer: "internal", description: "Regulates how power is drawn from the solar panels." },
      { id: "eps-conv", code: "EP-200", name: "Voltage Regulators", layer: "internal", description: "Convert battery and solar power to the supply voltages the electronics use." },
      { id: "eps-switch", code: "EP-300", name: "Load Switches", layer: "internal", description: "Commandable, current-limited outputs, one per subsystem." },
      { id: "eps-mon", code: "EP-400", name: "Power Telemetry", layer: "internal", description: "Measures voltages, currents and temperatures for the onboard computer." },
      { id: "eps-board", code: "EP-500", name: "Circuit Board & Stack Connector", layer: "internal", description: "Board joining the power stages to the stack." },
    ],
    techData: [
      { label: "Inclusion", value: "Core — every powered spacecraft needs power conditioning and distribution", basis: REF },
      { label: "Energy path", value: "Solar → conditioning → battery and regulators → switched loads", basis: CONCEPT },
      { label: "Ratings", value: "Not specified in this model", basis: CONCEPT },
    ],
    details: [
      {
        title: "Solar input conditioning",
        body: "Solar-cell output varies with illumination, temperature and load. The input stage controls how much power is drawn from the panels; many designs track the panels' maximum power point, others use simpler direct-energy-transfer schemes. This model does not commit to either.",
      },
      {
        title: "Load switching",
        body: "Each subsystem is fed through a switch that the onboard computer can command and that trips on overcurrent. The spacecraft can then shed non-essential loads when energy runs short, or power-cycle a module that misbehaves.",
      },
      {
        title: "Eclipse operation",
        body: "In Earth's shadow there is no solar input and the battery carries every load, so the power system and the flight software decide together which loads stay on.",
      },
    ],
    inspectionNotes: [
      "Internal view shows the board at the top of the middle unit, above the battery.",
      "Exploded view separates it from the battery below and the avionics boards above.",
    ],
    camera: { direction: [0.85, 0.72, 1], distanceFactor: 3.2 },
  },
  {
    id: "battery",
    slug: "battery",
    prefix: "BT",
    name: "Battery Pack",
    shortName: "Battery",
    designation: "CMP-05 / BAT",
    classification: "Electrical power — energy storage",
    summary: "Rechargeable cells that carry the satellite through eclipse and peak loads.",
    description:
      "The battery stores energy collected by the solar panels and returns it when generation falls short: in eclipse, before the wings deploy, and during loads larger than the arrays can supply. It is drawn as cylindrical rechargeable cells in a holder with a monitoring board. No chemistry, capacity or voltage is implied.",
    mechanicalFunction: "Stores electrical energy and supplies it when solar generation is insufficient or unavailable.",
    role: "Energy buffer of the power subsystem, charged and discharged through the power management electronics.",
    interfaces: [
      { componentId: "eps", relation: "Charge and discharge path, cell telemetry" },
      { componentId: "structure", relation: "Mounted in the middle unit, near the centre of mass" },
    ],
    flows: [
      { kind: "power", direction: "both", peer: "Power management", note: "Charge and discharge" },
      { kind: "data", direction: "out", peer: "Power management", note: "Cell voltages and temperatures" },
    ],
    subassemblies: [
      { id: "bat-cells", code: "BT-100", name: "Rechargeable Cells", layer: "internal", description: "Four cylindrical cells (illustrative arrangement)." },
      { id: "bat-holder", code: "BT-200", name: "Cell Holder & Brackets", layer: "internal", description: "Clamps the cells against launch vibration and ties them to the stack." },
      { id: "bat-bms", code: "BT-300", name: "Monitoring & Protection Board", layer: "internal", description: "Watches cell voltages and temperatures and can disconnect the pack on a fault." },
    ],
    techData: [
      { label: "Inclusion", value: "Common — most solar-powered CubeSats also carry a rechargeable battery", basis: REF },
      { label: "Cells shown", value: "Four cylindrical cells (illustrative)", basis: CONCEPT },
      { label: "Ratings", value: "Not specified in this model", basis: CONCEPT },
    ],
    details: [
      {
        title: "Charge cycles",
        body: "In low Earth orbit a satellite passes in and out of Earth's shadow many times a day, so the battery cycles constantly. Limiting how deeply it is discharged is one common way to extend its life.",
      },
      {
        title: "Thermal care",
        body: "Rechargeable cells are sensitive to temperature, especially when charged in the cold, so packs are monitored closely and some include heaters.",
      },
    ],
    inspectionNotes: [
      "Internal view shows the cells lying across the middle unit.",
      "Exploded view separates the monitoring board from the cell holder.",
    ],
    camera: { direction: [0.85, 0.95, 1], distanceFactor: 3.2 },
  },
  {
    id: "solar",
    slug: "solar",
    prefix: "SA",
    name: "Solar Power System",
    shortName: "Solar Arrays",
    designation: "CMP-06 / SOL",
    classification: "Electrical power — generation",
    summary: "Deployable wings and body-mounted cells converting sunlight into electricity.",
    description:
      "Solar cells are semiconductor devices that convert incident sunlight directly into electric current through the photovoltaic effect. This satellite carries cells on three body faces and on two deployable wings that unfold after launch. Their output feeds the power management electronics, which charge the battery and supply the loads.",
    mechanicalFunction: "Converts incident sunlight into electrical power.",
    role: "Primary energy source: feeds the power management system, which charges the battery.",
    interfaces: [
      { componentId: "eps", relation: "Array output into the input conditioning" },
      { componentId: "battery", relation: "Charges it, through the power management system" },
      { componentId: "structure", relation: "Wing hinges on the rear rails; body cells on the side panels" },
      { componentId: "adcs", relation: "Pointing sets how much sunlight the cells receive" },
    ],
    flows: [{ kind: "power", direction: "out", peer: "Power management", note: "Array output" }],
    subassemblies: [
      {
        id: "sol-wings",
        code: "SA-100",
        name: "Deployable Wings",
        layer: "frame",
        description: "Two two-panel wings, folded against the sides for launch and swung out in orbit.",
        children: [
          { id: "sol-cells", code: "SA-110", name: "Solar Cell Strings", layer: "frame", description: "Cells wired in series strings on the sun-facing side." },
          { id: "sol-substrate", code: "SA-120", name: "Panel Substrates", layer: "frame", description: "Stiff panels carrying the cells and their wiring." },
          { id: "sol-hinges", code: "SA-130", name: "Hinges", layer: "frame", description: "Spring hinges that swing each panel into place after release." },
        ],
      },
      { id: "sol-body", code: "SA-200", name: "Body-Mounted Cells", layer: "armor", description: "Cells bonded to three of the side panels." },
    ],
    techData: [
      { label: "Inclusion", value: "Common — most CubeSats are solar-powered", basis: REF },
      { label: "Output depends on", value: "Sun angle, temperature and cell condition; none in eclipse", basis: REF },
      { label: "Configuration", value: "Two two-panel wings plus three body-mounted faces", basis: CONCEPT },
    ],
    details: [
      {
        title: "Photovoltaic conversion",
        body: "Photons with enough energy free charge carriers in the cell's semiconductor junction; the junction's built-in field separates them and drives a current through the external circuit. Only part of the incident energy is converted; the rest becomes heat.",
      },
      {
        title: "Why deployable wings",
        body: "A CubeSat's body offers little surface area. Wings that fold against the sides for launch and swing out in orbit multiply the area that can face the Sun, at the cost of hinges and release mechanisms.",
      },
    ],
    inspectionNotes: [
      "The wings stay visible in the internal view; the body-mounted cells clear with the side panels.",
      "Exploded view moves each wing outward from its hinge line.",
    ],
    camera: { direction: [0.45, 0.32, 1], distanceFactor: 1.7 },
  },
  {
    id: "comms",
    slug: "comms",
    prefix: "CM",
    name: "Telemetry & Communications",
    shortName: "Communications",
    designation: "CMP-07 / COM",
    classification: "Communications — radio transceiver",
    summary: "Radio that sends telemetry to the ground and receives telecommands.",
    description:
      "The communications subsystem is the satellite's link to its operators. It transmits telemetry — status and mission data packaged by the onboard computer — and receives telecommands sent up from a ground station. It is drawn as a transceiver board with a shielded radio section, fed to the antenna by coaxial cable. No frequency band, protocol or data rate is implied.",
    mechanicalFunction: "Transmits telemetry and receives telecommands over a radio link.",
    role: "Bridge between the onboard computer and the ground station, through the antenna.",
    interfaces: [
      { componentId: "obc", relation: "Telemetry in, telecommands out" },
      { componentId: "antenna", relation: "Coaxial RF feed" },
      { componentId: "eps", relation: "Switched supply" },
    ],
    flows: [
      { kind: "power", direction: "in", peer: "Power management", note: "Switched supply" },
      { kind: "data", direction: "in", peer: "Onboard computer", note: "Telemetry to downlink" },
      { kind: "control", direction: "out", peer: "Onboard computer", note: "Received telecommands" },
      { kind: "rf", direction: "both", peer: "Antenna", note: "Transmit and receive signal" },
    ],
    subassemblies: [
      { id: "com-trx", code: "CM-100", name: "Transceiver", layer: "internal", description: "Converts data to a radio signal and back (modulation and demodulation)." },
      { id: "com-pa", code: "CM-200", name: "RF Front End", layer: "internal", description: "Amplifies the transmit signal and protects the sensitive receive path." },
      { id: "com-rf", code: "CM-300", name: "RF Connector & Cable", layer: "internal", description: "Coaxial feed up to the antenna." },
      { id: "com-board", code: "CM-400", name: "Circuit Board & Stack Connector", layer: "internal", description: "Board joining the radio to the stack." },
    ],
    techData: [
      { label: "Inclusion", value: "Core — an operated satellite needs a link to the ground", basis: REF },
      { label: "Link", value: "Telemetry down, telecommands up", basis: REF },
      { label: "Band, protocol, rate", value: "Not specified in this model", basis: CONCEPT },
    ],
    details: [
      {
        title: "Telemetry",
        body: "Telemetry is the stream of measurements a spacecraft reports about itself — voltages, temperatures, modes, error counters — together with mission data. Operators use it to judge the satellite's health and plan the next commands.",
      },
      {
        title: "Telecommands",
        body: "Telecommands are instructions sent from the ground: change a mode, switch a load, upload a schedule or new software. Because a wrong command can be costly, command systems usually verify and acknowledge what they receive.",
      },
      {
        title: "Contact windows",
        body: "A satellite in low Earth orbit is in view of a given ground station only for a few minutes per pass, so data is stored on board and sent down during these contact windows.",
      },
    ],
    inspectionNotes: [
      "Internal view shows the radio board at the top of the stack, closest to the antenna.",
      "Exploded view lifts it clear of the other avionics boards.",
    ],
    camera: { direction: [0.85, 0.72, 1], distanceFactor: 3.2 },
  },
  {
    id: "antenna",
    slug: "antenna",
    prefix: "AN",
    name: "Antenna Assembly",
    shortName: "Antenna",
    designation: "CMP-08 / ANT",
    classification: "Communications — deployable antenna",
    summary: "Deployable tape-spring elements that radiate and collect the radio signal.",
    description:
      "The antenna converts the transceiver's electrical signal into radio waves and back. This one is a deployable assembly: four flexible tape-spring elements stay wound inside a housing for launch and spring out to their working shape once released in orbit. The exact geometry here is illustrative.",
    mechanicalFunction: "Radiates the transmit signal and captures the uplink signal.",
    role: "External end of the radio link, fed by the communications board.",
    interfaces: [
      { componentId: "comms", relation: "Coaxial RF feed" },
      { componentId: "structure", relation: "Mounted on the zenith end frame" },
      { componentId: "gnss", relation: "Carries the GNSS patch on its top face" },
    ],
    flows: [
      { kind: "rf", direction: "both", peer: "Communications transceiver", note: "Transmit and receive signal" },
      { kind: "rf", direction: "both", peer: "Ground station", note: "Radio link across space" },
    ],
    subassemblies: [
      { id: "ant-elements", code: "AN-100", name: "Tape-Spring Elements", layer: "frame", description: "Four flexible metal tapes that form the radiating elements once deployed." },
      { id: "ant-deployer", code: "AN-200", name: "Deployer Housing", layer: "frame", description: "Holds the wound elements for launch and routes the RF feed." },
      { id: "ant-release", code: "AN-300", name: "Release Mechanism", layer: "frame", description: "Holds the elements until a commanded release." },
    ],
    techData: [
      { label: "Inclusion", value: "Needed wherever there is a radio link", basis: REF },
      { label: "Type shown", value: "Four deployable tape-spring elements", basis: CONCEPT },
      { label: "Deployment", value: "Held for launch, released after separation", basis: CONCEPT },
    ],
    details: [
      {
        title: "Why deployable",
        body: "An antenna's effective size is tied to the wavelength it works at; for lower-frequency links a good antenna can be longer than the satellite is wide. Spring-metal tapes that coil up for launch solve that.",
      },
      {
        title: "Release timing",
        body: "CubeSat launch requirements typically keep deployables stowed for a set period after the satellite leaves its dispenser, so release is triggered by a timer or a command rather than at separation.",
      },
    ],
    inspectionNotes: ["Exploded view lifts the deployer and its elements off the zenith end."],
    camera: { direction: [0.6, 1.1, 1], distanceFactor: 1.6 },
  },
  {
    id: "payload",
    slug: "payload",
    prefix: "PL",
    name: "Payload",
    shortName: "Payload",
    designation: "CMP-09 / PAY",
    classification: "Mission — instrument (illustrative imager)",
    summary: "The mission-specific instrument: here an illustrative imaging camera.",
    description:
      "The payload is what the satellite is flown to do; every other subsystem exists to support it. It might be an imaging instrument, a scientific sensor, a communications experiment or a technology demonstration. This model shows a generic imager — a baffled lens on the nadir end, a detector board and payload electronics — not a specific instrument.",
    mechanicalFunction: "Performs the mission-specific function — here, collecting images.",
    role: "Mission instrument: commanded by the onboard computer, powered by the power system, its data returned over the radio link.",
    interfaces: [
      { componentId: "obc", relation: "Commands in, mission data out" },
      { componentId: "eps", relation: "Switched supply" },
      { componentId: "adcs", relation: "Pointing decides what the instrument sees" },
      { componentId: "structure", relation: "Occupies the nadir unit" },
    ],
    flows: [
      { kind: "power", direction: "in", peer: "Power management", note: "Switched supply" },
      { kind: "control", direction: "in", peer: "Onboard computer", note: "Commands and schedules" },
      { kind: "data", direction: "out", peer: "Onboard computer", note: "Mission data" },
    ],
    subassemblies: [
      { id: "pl-baffle", code: "PL-100", name: "Baffle", layer: "frame", description: "Hood that blocks light arriving from outside the field of view." },
      { id: "pl-lens", code: "PL-200", name: "Front Lens", layer: "frame", description: "Entrance optic behind the baffle." },
      { id: "pl-optics", code: "PL-300", name: "Optics Barrel", layer: "internal", description: "Holds the lens elements in alignment; wrapped in insulation." },
      { id: "pl-detector", code: "PL-400", name: "Detector Board", layer: "internal", description: "Image sensor at the focal plane." },
      { id: "pl-proc", code: "PL-500", name: "Payload Electronics", layer: "internal", description: "Reads out, processes and buffers the instrument data." },
    ],
    techData: [
      { label: "Inclusion", value: "Every mission has a payload; its type varies widely", basis: REF },
      { label: "Type shown", value: "Generic imaging instrument", basis: CONCEPT },
      { label: "Performance", value: "Not specified in this model", basis: CONCEPT },
    ],
    details: [
      {
        title: "Payload options",
        body: "CubeSat payloads range from cameras and spectrometers to radiation detectors, communications experiments and demonstrations of new components. The supporting bus — power, computing, attitude control, communications — is often similar from mission to mission.",
      },
      {
        title: "Data volume",
        body: "Instruments such as imagers can produce more data than the radio returns in one contact, so payload electronics may compress or select data before it is stored for downlink.",
      },
    ],
    inspectionNotes: [
      "Exterior view shows the baffle on the nadir end; the internal view reveals the optics and electronics.",
      "Exploded view lowers the instrument out of the bottom unit.",
    ],
    camera: { direction: [0.8, -0.1, 1], distanceFactor: 2.8 },
  },
  {
    id: "adcs",
    slug: "adcs",
    prefix: "AD",
    name: "Attitude Determination & Control",
    shortName: "ADCS",
    designation: "CMP-10 / ADC",
    classification: "Guidance — attitude determination and control",
    summary: "Estimates and controls which way the satellite is pointing.",
    description:
      "The ADCS works out the satellite's orientation from its sensors and turns it where the mission needs: payload toward the target, antenna toward the ground, cells toward the Sun. Shown here: sun sensors on the outer faces, a magnetometer and drivers on an interface board, three reaction wheels and magnetorquers. Real designs choose among these and other options.",
    mechanicalFunction: "Estimates orientation from sensors and applies torques to control it.",
    role: "Keeps the payload, antenna and solar cells pointed as the mission requires.",
    interfaces: [
      { componentId: "imu", relation: "Angular rate" },
      { componentId: "obc", relation: "Pointing modes in, attitude estimate out" },
      { componentId: "eps", relation: "Supply for wheels and torquers" },
      { componentId: "structure", relation: "Sun sensors on the outer panels" },
    ],
    flows: [
      { kind: "power", direction: "in", peer: "Power management", note: "Supply for electronics and actuators" },
      { kind: "data", direction: "in", peer: "IMU, sun sensors, magnetometer", note: "Rate and reference directions" },
      { kind: "control", direction: "in", peer: "Onboard computer", note: "Pointing mode" },
      { kind: "data", direction: "out", peer: "Onboard computer", note: "Attitude estimate and status" },
    ],
    subassemblies: [
      { id: "adcs-sun", code: "AD-100", name: "Sun Sensors", layer: "frame", description: "Measure the direction of the Sun relative to the body." },
      {
        id: "adcs-board",
        code: "AD-200",
        name: "Interface Board",
        layer: "internal",
        description: "Collects the attitude sensors and drives the actuators.",
        children: [
          { id: "adcs-mag", code: "AD-210", name: "Magnetometer", layer: "internal", description: "Measures the direction and strength of Earth's magnetic field." },
          { id: "adcs-drv", code: "AD-220", name: "Actuator Drivers", layer: "internal", description: "Power stages for the wheel motors and torquer coils." },
        ],
      },
      { id: "adcs-wheels", code: "AD-300", name: "Reaction Wheels", layer: "internal", description: "Three wheels on orthogonal axes that exchange momentum with the body." },
      { id: "adcs-mtq", code: "AD-400", name: "Magnetorquers", layer: "internal", description: "Two rods and a flat coil that push against Earth's magnetic field." },
    ],
    techData: [
      { label: "Inclusion", value: "Most CubeSats have some attitude control; its sophistication varies widely", basis: REF },
      { label: "Sensors shown", value: "Sun sensors, magnetometer, plus the separate IMU", basis: CONCEPT },
      { label: "Actuators shown", value: "Three reaction wheels, magnetorquers", basis: CONCEPT },
      { label: "Control law", value: "Not specified in this model", basis: CONCEPT },
    ],
    details: [
      {
        title: "Determination",
        body: "No single sensor gives the full attitude. Sun sensors give the Sun's direction and a magnetometer the magnetic field's; compared with models of where those directions should be, two independent vectors fix the orientation, and gyroscope data fills the gaps between measurements.",
      },
      {
        title: "Reaction wheels",
        body: "Speeding a wheel up or slowing it down exchanges angular momentum with the spacecraft, turning the body the opposite way. Wheels allow fine, continuous control but slowly accumulate momentum from external disturbances.",
      },
      {
        title: "Magnetorquers",
        body: "Magnetorquers are coils that create a magnetic dipole; interacting with Earth's field they produce a small torque. They are commonly used to slow an initial tumble and to unload momentum from reaction wheels.",
      },
    ],
    inspectionNotes: [
      "Sun sensors sit on the outer panels and stay visible in every view.",
      "Internal view shows the wheels and torquers in the lower half of the middle unit.",
    ],
    camera: { direction: [0.9, 0.7, 1], distanceFactor: 2.6 },
  },
  {
    id: "structure",
    slug: "structure",
    prefix: "ST",
    name: "Structure & Chassis",
    shortName: "Structure",
    designation: "CMP-11 / STR",
    classification: "Structure — 3U frame and panels",
    summary: "Rails, frames and panels that carry every other subsystem.",
    description:
      "The structure is a 3U frame — three standard CubeSat units end to end — built around four corner rails, which slide along the guides of the launch dispenser. End frames and unit rings tie the rails together, side panels close the faces and carry cells and sensors, and stack rods hold the electronics boards.",
    mechanicalFunction: "Carries launch loads, mounts every subsystem and interfaces with the launch dispenser.",
    role: "Backbone of the satellite and its mechanical interface to the launch vehicle.",
    interfaces: [
      { componentId: "solar", relation: "Wing hinges and body-cell panels" },
      { componentId: "payload", relation: "Nadir unit" },
      { componentId: "antenna", relation: "Zenith end frame" },
      { componentId: "adcs", relation: "Sun sensor mounts" },
    ],
    flows: [
      { kind: "control", direction: "out", peer: "Power management", note: "Deployment switches hold power off until release" },
    ],
    subassemblies: [
      { id: "st-rails", code: "ST-100", name: "Corner Rails", layer: "frame", description: "Four rails that carry the loads and guide the satellite out of its dispenser." },
      { id: "st-rings", code: "ST-200", name: "End Frames & Unit Rings", layer: "frame", description: "Frames tying the rails together at the ends and between units." },
      { id: "st-panels", code: "ST-300", name: "Side Panels", layer: "armor", description: "Panels closing the faces; three carry solar cells." },
      { id: "st-stack", code: "ST-400", name: "Stack Rods", layer: "internal", description: "Threaded rods and spacers holding the boards at fixed heights." },
      { id: "st-switches", code: "ST-500", name: "Deployment Switches", layer: "frame", description: "Rail-end switches that keep the power system off inside the dispenser." },
    ],
    techData: [
      { label: "Standard", value: "Sizes in units (U); 1U is nominally a 10 cm cube", basis: REF },
      { label: "Rails", value: "Interface with the dispenser's guide rails", basis: REF },
      { label: "Size shown", value: "3U — three units long", basis: CONCEPT },
    ],
    details: [
      {
        title: "Standard units",
        body: "The CubeSat standard defines sizes in units: 1U is nominally a 10 cm cube, and larger sizes such as 3U or 6U combine several. Shared sizes let many satellites use standard dispensers and launch opportunities.",
      },
      {
        title: "Deployment switches",
        body: "Switches at the rail ends are held down while the satellite sits in its dispenser, keeping its electrical system off during launch. They release when the satellite is ejected.",
      },
    ],
    inspectionNotes: [
      "Internal view clears the side panels; the rails, rings and stack rods stay.",
      "Exploded view moves the panels outward and the end frames away from the stack.",
    ],
    camera: { direction: [0.75, 0.3, 1], distanceFactor: 1.6 },
  },
];
