import type { ComponentId, ComponentSpec, Subassembly } from "./types";

/**
 * Assembly catalogue.
 *
 * Internal structures, subassembly breakdowns and relationships below are
 * CONCEPTUAL — plausible engineering fiction written for this visualization.
 * They are not the official RX-105 design. Rows marked `basis: "reference"`
 * repeat only broad, non-numeric descriptors that are widely published.
 */

const CONCEPT = "conceptual" as const;
const REF = "reference" as const;

export const COMPONENTS: ComponentSpec[] = [
  {
    id: "head",
    slug: "head",
    prefix: "HD",
    name: "Head & Sensor Assembly",
    shortName: "Head",
    designation: "ASM-01 / HD",
    classification: "Perception — primary sensor head",
    summary: "Optical and wide-area sensors on a gimballed neck mount.",
    description:
      "The head carries the forward-looking optical package and the wide-area sensor antennas. In this visualization it is modelled as an armoured sensor turret: a dual optical unit behind the visor, a main camera module on the centreline and a dedicated signal processor that conditions raw sensor data before it is sent down the neck harness to the main computer.",
    mechanicalFunction:
      "Points the sensor package independently of the torso through a two-axis neck gimbal.",
    interfaces: [{ componentId: "chest", relation: "Neck gimbal mount and sensor data harness" }],
    flows: [
      { kind: "power", direction: "in", peer: "Upper power distribution", note: "Sensor and processor supply" },
      { kind: "data", direction: "out", peer: "Main control computer", note: "Processed sensor tracks" },
      { kind: "control", direction: "in", peer: "Main control computer", note: "Gimbal pointing commands" },
    ],
    subassemblies: [
      {
        id: "hd-armor",
        code: "HD-100",
        name: "Outer Armor Shell",
        layer: "armor",
        description: "Faceted helmet shell protecting the sensor turret.",
        children: [
          { id: "hd-vfin", code: "HD-110", name: "V-Fin Antenna Array", layer: "armor", description: "Swept antenna blades doubling as a wide-area receiver (conceptual role)." },
          { id: "hd-faceplate", code: "HD-120", name: "Faceplate & Vents", layer: "armor", description: "Lower face armor with thermal exhaust slots." },
        ],
      },
      { id: "hd-optics", code: "HD-200", name: "Dual Optical Sensor Unit", layer: "internal", description: "Paired optical sensors behind the visor providing stereo ranging." },
      {
        id: "hd-mainsensor",
        code: "HD-300",
        name: "Main Camera Module",
        layer: "internal",
        description: "Centreline long-range camera module.",
        children: [
          { id: "hd-lens", code: "HD-310", name: "Lens Stack", layer: "internal", description: "Multi-element optical stack with protective cover." },
          { id: "hd-imager", code: "HD-320", name: "Imaging Sensor Board", layer: "internal", description: "Image sensor and readout electronics." },
        ],
      },
      { id: "hd-processor", code: "HD-400", name: "Sensor Signal Processor", layer: "internal", description: "Fuses optical and antenna inputs into tracks before transmission." },
      { id: "hd-neck", code: "HD-500", name: "Neck Gimbal & Frame", layer: "frame", description: "Two-axis gimbal carrying the head on the torso frame." },
    ],
    techData: [
      { label: "Sensor arrangement", value: "Dual optical + centreline camera + antenna array", basis: CONCEPT },
      { label: "Pointing", value: "Two-axis neck gimbal", basis: CONCEPT },
      { label: "Data path", value: "Head processor → neck harness → main computer", basis: CONCEPT },
    ],
    inspectionNotes: [
      "Cutaway removes the helmet shell to show the sensor stack behind the visor.",
      "Exploded view separates the shell, sensor modules and neck frame along the vertical axis.",
    ],
    camera: { direction: [0.55, 0.18, 1], distanceFactor: 2.3 },
  },
  {
    id: "chest",
    slug: "cockpit",
    prefix: "CP",
    name: "Chest & Cockpit Assembly",
    shortName: "Cockpit",
    designation: "ASM-02 / CP",
    classification: "Crew station — command and control",
    summary: "Armoured torso housing the pilot module and main computer.",
    description:
      "The chest is the command centre of the machine. The visualization places an enclosed cockpit module on the centreline, wrapped by the torso structural frame, with the main control computer, upper power distribution and sensor harness packed around it. Chest intakes are shown as part of the outer armor, not as a claim about the real thermal design.",
    mechanicalFunction:
      "Carries upper-body loads between shoulders, head and waist while protecting the crew station.",
    interfaces: [
      { componentId: "head", relation: "Neck mount and sensor harness" },
      { componentId: "shoulders", relation: "Shoulder block attachment points" },
      { componentId: "waist", relation: "Torso-to-spine joint" },
      { componentId: "backpack", relation: "Rear mounting frame and power bus" },
    ],
    flows: [
      { kind: "power", direction: "in", peer: "Primary power core", note: "Main bus from the waist" },
      { kind: "power", direction: "out", peer: "Head, arms, cockpit systems", note: "Upper distribution" },
      { kind: "data", direction: "in", peer: "Sensor signal processor", note: "Sensor tracks" },
      { kind: "control", direction: "out", peer: "Limb controllers, propulsion controller", note: "Motion and flight commands" },
    ],
    subassemblies: [
      {
        id: "cp-armor",
        code: "CP-100",
        name: "Outer Armor",
        layer: "armor",
        description: "Chest plates, collar and side armor.",
        children: [
          { id: "cp-hatch", code: "CP-110", name: "Cockpit Hatch", layer: "armor", description: "Centre chest panel giving crew access." },
          { id: "cp-intakes", code: "CP-120", name: "Chest Intake Vents", layer: "armor", description: "Louvred vent panels on the upper chest." },
        ],
      },
      { id: "cp-frame", code: "CP-200", name: "Torso Structural Frame", layer: "frame", description: "Load-bearing cage tying shoulders, neck and spine together." },
      {
        id: "cp-module",
        code: "CP-300",
        name: "Cockpit Module",
        layer: "internal",
        description: "Self-contained crew capsule on the centreline.",
        children: [
          { id: "cp-seat", code: "CP-310", name: "Pilot Interface", layer: "internal", description: "Seat and control grips; pilot inputs enter the control system here." },
          { id: "cp-display", code: "CP-320", name: "Display System", layer: "internal", description: "Wrap-around display surface fed by the main computer." },
          { id: "cp-env", code: "CP-330", name: "Environmental Control", layer: "internal", description: "Life support and cabin conditioning pack." },
        ],
      },
      { id: "cp-computer", code: "CP-400", name: "Main Control Computer", layer: "internal", description: "Central processing stack coordinating all subsystem controllers." },
      { id: "cp-power", code: "CP-500", name: "Upper Power Distribution", layer: "internal", description: "Bus bars and breakers feeding the upper body." },
      { id: "cp-sensors", code: "CP-600", name: "Sensor Interface Harness", layer: "internal", description: "Data trunk linking the head and torso sensors to the computer." },
    ],
    techData: [
      { label: "Crew", value: "Single pilot", basis: REF },
      { label: "Crew station", value: "Enclosed module on centreline", basis: CONCEPT },
      { label: "Computing", value: "Main control computer behind cockpit", basis: CONCEPT },
    ],
    inspectionNotes: [
      "Cutaway fades the chest armor and hatch to reveal the cockpit module and computer stack.",
      "Architecture mode is the best view for the cockpit: subassemblies are called out individually.",
    ],
    camera: { direction: [0.6, 0.15, 1], distanceFactor: 2.5 },
  },
  {
    id: "shoulders",
    slug: "shoulders",
    prefix: "SH",
    name: "Shoulder Armor Assembly",
    shortName: "Shoulders",
    designation: "ASM-03 / SH",
    classification: "Structural protection — upper flanks",
    summary: "Large flared pauldrons over the shoulder joints.",
    description:
      "The broad, flared shoulder armor is one of the most recognisable parts of the RX-105 silhouette. Here each pauldron is modelled as a layered shell over a shoulder block frame and a two-axis joint actuator, with a conceptual equipment hardpoint inside the block.",
    mechanicalFunction:
      "Protects the shoulder actuators and carries arm loads into the torso frame.",
    interfaces: [
      { componentId: "chest", relation: "Shoulder block bolted to torso frame" },
      { componentId: "arms", relation: "Shoulder joint output to upper arm" },
    ],
    flows: [
      { kind: "power", direction: "in", peer: "Upper power distribution", note: "Actuator supply" },
      { kind: "control", direction: "in", peer: "Arm controllers", note: "Joint commands" },
    ],
    subassemblies: [
      {
        id: "sh-armor",
        code: "SH-100",
        name: "Pauldron Armor Shell",
        layer: "armor",
        description: "Multi-plate shoulder shell.",
        children: [
          { id: "sh-upper", code: "SH-110", name: "Upper Pauldron Plate", layer: "armor", description: "Main top plate of the shoulder shell." },
          { id: "sh-flare", code: "SH-120", name: "Flared Leading Edge", layer: "armor", description: "Swept outer edge giving the shoulder its wide profile." },
        ],
      },
      { id: "sh-frame", code: "SH-200", name: "Shoulder Block Frame", layer: "frame", description: "Box frame anchoring the pauldron and joint." },
      { id: "sh-joint", code: "SH-300", name: "Shoulder Joint Actuator", layer: "internal", description: "Two-axis actuator driving the upper arm." },
      { id: "sh-hardpoint", code: "SH-400", name: "Equipment Hardpoint", layer: "internal", description: "Internal mounting bay (conceptual)." },
    ],
    techData: [
      { label: "Construction", value: "Layered shell over block frame", basis: CONCEPT },
      { label: "Joint", value: "Two-axis actuator per side", basis: CONCEPT },
    ],
    inspectionNotes: [
      "Selecting the shoulders highlights both sides; the assembly is mirrored.",
      "Exploded view lifts the pauldron plates outward to expose the joint actuator.",
    ],
    camera: { direction: [0.75, 0.5, 1], distanceFactor: 2.1 },
  },
  {
    id: "arms",
    slug: "arms",
    prefix: "AR",
    name: "Arms & Manipulators",
    shortName: "Arms",
    designation: "ASM-04 / AR",
    classification: "Actuation — manipulation",
    summary: "Upper arm, elbow, forearm and five-finger manipulator.",
    description:
      "Each arm is modelled as a serial chain: upper arm, elbow actuator, forearm with wrist drive, and a manipulator with palm interface and finger linkages. A control and power harness runs the length of the limb. The right manipulator carries the weapon interface.",
    mechanicalFunction: "Positions and actuates the manipulators and the handheld armament.",
    interfaces: [
      { componentId: "shoulders", relation: "Shoulder joint input" },
      { componentId: "weapons", relation: "Palm weapon interface (right hand)" },
    ],
    flows: [
      { kind: "power", direction: "in", peer: "Upper power distribution", note: "Actuator drives" },
      { kind: "control", direction: "in", peer: "Arm controllers", note: "Joint and finger commands" },
      { kind: "data", direction: "out", peer: "Arm controllers", note: "Joint position feedback" },
    ],
    subassemblies: [
      {
        id: "ar-upper",
        code: "AR-100",
        name: "Upper Arm",
        layer: "frame",
        description: "Upper arm segment.",
        children: [
          { id: "ar-upper-armor", code: "AR-110", name: "Upper Arm Armor", layer: "armor", description: "Cylindrical armor sleeve." },
          { id: "ar-upper-frame", code: "AR-120", name: "Upper Arm Frame", layer: "frame", description: "Structural member carrying the elbow." },
        ],
      },
      { id: "ar-elbow", code: "AR-200", name: "Elbow Joint Actuator", layer: "internal", description: "Single-axis elbow drive." },
      {
        id: "ar-forearm",
        code: "AR-300",
        name: "Forearm",
        layer: "frame",
        description: "Forearm segment.",
        children: [
          { id: "ar-forearm-armor", code: "AR-310", name: "Forearm Armor", layer: "armor", description: "Tapered forearm shell." },
          { id: "ar-forearm-drive", code: "AR-320", name: "Wrist Drive Unit", layer: "internal", description: "Wrist rotation and flex actuators." },
        ],
      },
      {
        id: "ar-hand",
        code: "AR-400",
        name: "Manipulator",
        layer: "frame",
        description: "Five-finger hand.",
        children: [
          { id: "ar-palm", code: "AR-410", name: "Palm Interface Block", layer: "frame", description: "Palm with equipment connector." },
          { id: "ar-fingers", code: "AR-420", name: "Finger Linkages", layer: "frame", description: "Articulated finger segments." },
        ],
      },
      { id: "ar-harness", code: "AR-500", name: "Control & Power Harness", layer: "internal", description: "Cable trunk running the length of the arm." },
    ],
    techData: [
      { label: "Kinematic chain", value: "Shoulder · elbow · wrist · fingers", basis: CONCEPT },
      { label: "Manipulator", value: "Five-finger hand", basis: REF },
    ],
    inspectionNotes: [
      "Cutaway hides the armor sleeves to show the frame, elbow actuator and harness.",
      "Exploded view separates the arm along its own axis so the joint chain stays readable.",
    ],
    camera: { direction: [0.5, 0.12, 1], distanceFactor: 2.2 },
  },
  {
    id: "waist",
    slug: "waist",
    prefix: "WS",
    name: "Waist & Central Frame",
    shortName: "Waist",
    designation: "ASM-05 / WS",
    classification: "Structural core — power generation",
    summary: "Central spine, hip block and the primary power core.",
    description:
      "The waist connects the upper body to the legs. In this visualization it houses the central frame spine, the hip joint block and — following a common mobile-suit convention rather than any published RX-105 layout — the primary power core and lower power distribution unit, all wrapped in skirt armor.",
    mechanicalFunction: "Transfers loads between torso and legs and supplies primary power.",
    interfaces: [
      { componentId: "chest", relation: "Spine-to-torso joint" },
      { componentId: "legs", relation: "Hip joints" },
      { componentId: "thrusters", relation: "Skirt thruster mounts" },
    ],
    flows: [
      { kind: "power", direction: "out", peer: "Power distribution bus", note: "Primary generation" },
      { kind: "control", direction: "in", peer: "Main control computer", note: "Power management" },
    ],
    subassemblies: [
      {
        id: "ws-skirt",
        code: "WS-100",
        name: "Skirt Armor",
        layer: "armor",
        description: "Hinged plates around the hip.",
        children: [
          { id: "ws-front", code: "WS-110", name: "Front Skirt Plates", layer: "armor", description: "Paired front plates." },
          { id: "ws-side", code: "WS-120", name: "Side Skirt Plates", layer: "armor", description: "Hip side plates." },
          { id: "ws-rear", code: "WS-130", name: "Rear Skirt Plate", layer: "armor", description: "Rear plate over the hip block." },
        ],
      },
      { id: "ws-frame", code: "WS-200", name: "Central Frame Spine", layer: "frame", description: "Vertical spine carrying torso loads." },
      { id: "ws-reactor", code: "WS-300", name: "Primary Power Core", layer: "internal", description: "Main power source (conceptual placement)." },
      { id: "ws-hip", code: "WS-400", name: "Hip Joint Block", layer: "internal", description: "Pivot block for both hip joints." },
      { id: "ws-pdu", code: "WS-500", name: "Lower Power Distribution", layer: "internal", description: "Distribution unit feeding legs and thrusters." },
    ],
    techData: [
      { label: "Power core location", value: "Waist block (convention, not canon)", basis: CONCEPT },
      { label: "Structural role", value: "Primary load path, torso ↔ legs", basis: CONCEPT },
    ],
    inspectionNotes: [
      "Cutaway fades the skirt to reveal the power core inside the spine.",
      "Selecting the power core node in the Systems map highlights this assembly.",
    ],
    camera: { direction: [0.7, 0.1, 1], distanceFactor: 2.6 },
  },
  {
    id: "legs",
    slug: "legs",
    prefix: "LG",
    name: "Legs & Joint Assemblies",
    shortName: "Legs",
    designation: "ASM-06 / LG",
    classification: "Actuation — locomotion",
    summary: "Thigh, knee and lower leg with ankle actuators.",
    description:
      "The legs are the largest actuated assemblies. Each is modelled as a thigh, a knee joint with armored cap, and a lower leg carrying a propellant tank and the ankle actuator. A limb control harness runs from the hip block to the ankle.",
    mechanicalFunction: "Supports the machine's weight and provides locomotion and landing articulation.",
    interfaces: [
      { componentId: "waist", relation: "Hip joints" },
      { componentId: "feet", relation: "Ankle actuators" },
      { componentId: "thrusters", relation: "Vernier thruster mounts" },
    ],
    flows: [
      { kind: "power", direction: "in", peer: "Lower power distribution", note: "Knee and ankle drives" },
      { kind: "control", direction: "in", peer: "Leg controllers", note: "Joint commands" },
      { kind: "propellant", direction: "out", peer: "Leg vernier thrusters", note: "Tank feed (conceptual)" },
    ],
    subassemblies: [
      {
        id: "lg-thigh",
        code: "LG-100",
        name: "Thigh",
        layer: "frame",
        description: "Upper leg segment.",
        children: [
          { id: "lg-thigh-armor", code: "LG-110", name: "Thigh Armor", layer: "armor", description: "Thigh shell." },
          { id: "lg-thigh-frame", code: "LG-120", name: "Thigh Frame", layer: "frame", description: "Structural member to the knee." },
        ],
      },
      {
        id: "lg-knee",
        code: "LG-200",
        name: "Knee Joint Assembly",
        layer: "frame",
        description: "Knee joint and armored cap.",
        children: [
          { id: "lg-knee-armor", code: "LG-210", name: "Knee Armor", layer: "armor", description: "Pointed knee cap." },
          { id: "lg-knee-actuator", code: "LG-220", name: "Knee Actuator", layer: "internal", description: "High-torque knee drive." },
        ],
      },
      {
        id: "lg-shin",
        code: "LG-300",
        name: "Lower Leg",
        layer: "frame",
        description: "Shin segment.",
        children: [
          { id: "lg-shin-armor", code: "LG-310", name: "Lower Leg Armor", layer: "armor", description: "Broad shin and calf shell." },
          { id: "lg-shin-frame", code: "LG-320", name: "Lower Leg Frame", layer: "frame", description: "Structural member to the ankle." },
          { id: "lg-propellant", code: "LG-330", name: "Propellant Tank", layer: "internal", description: "Conceptual tank feeding the leg verniers." },
        ],
      },
      { id: "lg-ankle", code: "LG-400", name: "Ankle Actuator", layer: "internal", description: "Two-axis ankle drive." },
      { id: "lg-harness", code: "LG-500", name: "Limb Control Harness", layer: "internal", description: "Power and control trunk from hip to ankle." },
    ],
    techData: [
      { label: "Joints per leg", value: "Hip · knee · ankle", basis: CONCEPT },
      { label: "Internal volume", value: "Propellant tank in lower leg", basis: CONCEPT },
    ],
    inspectionNotes: [
      "Cutaway reveals the knee actuator, propellant tank and harness inside each leg.",
      "Leg vernier nozzles belong to the Thruster Array and are highlighted separately.",
    ],
    camera: { direction: [0.85, 0.08, 1], distanceFactor: 2.45 },
  },
  {
    id: "feet",
    slug: "feet",
    prefix: "FT",
    name: "Feet & Landing Structures",
    shortName: "Feet",
    designation: "ASM-07 / FT",
    classification: "Structure — ground contact",
    summary: "Armored feet with shock absorbers and contact sensors.",
    description:
      "The feet spread landing loads and report ground contact. Each foot is modelled with a toe cap and heel spur over a foot frame, a landing shock absorber between ankle and sole, and contact sensors in the sole pads.",
    mechanicalFunction: "Absorbs landing loads and provides a stable, sensed ground contact.",
    interfaces: [{ componentId: "legs", relation: "Ankle actuator output" }],
    flows: [
      { kind: "data", direction: "out", peer: "Leg controllers", note: "Ground contact state" },
      { kind: "power", direction: "in", peer: "Lower power distribution", note: "Sensor supply" },
    ],
    subassemblies: [
      {
        id: "ft-armor",
        code: "FT-100",
        name: "Foot Armor Shell",
        layer: "armor",
        description: "Upper foot armor.",
        children: [
          { id: "ft-toe", code: "FT-110", name: "Toe Cap", layer: "armor", description: "Forward toe armor." },
          { id: "ft-heel", code: "FT-120", name: "Heel Spur", layer: "armor", description: "Rear heel armor." },
        ],
      },
      { id: "ft-frame", code: "FT-200", name: "Foot Frame", layer: "frame", description: "Structural plate under the shell." },
      { id: "ft-damper", code: "FT-300", name: "Landing Shock Absorber", layer: "internal", description: "Damper between ankle and sole." },
      { id: "ft-contact", code: "FT-400", name: "Ground Contact Sensors", layer: "internal", description: "Load cells reporting contact and balance." },
      { id: "ft-sole", code: "FT-500", name: "Sole Pads", layer: "frame", description: "Replaceable contact pads." },
    ],
    techData: [
      { label: "Load path", value: "Ankle → damper → frame → sole pads", basis: CONCEPT },
      { label: "Sensing", value: "Contact load cells in sole", basis: CONCEPT },
    ],
    inspectionNotes: ["Exploded view drops the sole pads and lifts the shell to show the damper."],
    camera: { direction: [0.8, 0.45, 1], distanceFactor: 2.4 },
  },
  {
    id: "backpack",
    slug: "backpack",
    prefix: "BP",
    name: "Backpack & Flight Systems",
    shortName: "Backpack",
    designation: "ASM-08 / BP",
    classification: "Propulsion — flight system housing",
    summary: "Rear housing for the flight system, controller and energy storage.",
    description:
      "The RX-105 is widely described as carrying a Minovsky flight system that allows sustained atmospheric flight. This visualization represents that idea as a backpack housing with flight binders, a flight system core, a propulsion controller and an energy storage bank. The internal arrangement is invented.",
    mechanicalFunction: "Houses the flight system and anchors the main thrusters and binders.",
    interfaces: [
      { componentId: "chest", relation: "Rear mounting frame and power bus" },
      { componentId: "thrusters", relation: "Main nozzle mounts" },
    ],
    flows: [
      { kind: "power", direction: "in", peer: "Power distribution bus", note: "Flight system supply" },
      { kind: "control", direction: "in", peer: "Main control computer", note: "Flight commands" },
      { kind: "control", direction: "out", peer: "Thruster control units", note: "Nozzle commands" },
    ],
    subassemblies: [
      { id: "bp-housing", code: "BP-100", name: "Backpack Housing", layer: "armor", description: "Outer shell of the backpack." },
      {
        id: "bp-binders",
        code: "BP-200",
        name: "Flight Binders",
        layer: "armor",
        description: "Fin-like binder surfaces.",
        children: [
          { id: "bp-binder-upper", code: "BP-210", name: "Upper Flight Fins", layer: "armor", description: "Upper pair of fins." },
          { id: "bp-binder-lower", code: "BP-220", name: "Lower Stabilizer Fins", layer: "armor", description: "Lower pair of fins." },
        ],
      },
      { id: "bp-flightunit", code: "BP-300", name: "Flight System Core", layer: "internal", description: "Representation of the flight system (internals conceptual)." },
      { id: "bp-controller", code: "BP-400", name: "Propulsion Controller", layer: "internal", description: "Allocates thrust across nozzles." },
      { id: "bp-capacitor", code: "BP-500", name: "Energy Storage Bank", layer: "internal", description: "Buffer storage for peak loads." },
      { id: "bp-mount", code: "BP-600", name: "Backpack Mount Frame", layer: "frame", description: "Frame bolting the backpack to the torso." },
    ],
    techData: [
      { label: "Flight system", value: "Minovsky flight system", basis: REF },
      { label: "Internal layout", value: "Core · controller · storage bank", basis: CONCEPT },
    ],
    inspectionNotes: [
      "Rotate to the rear: the backpack faces away from the default camera.",
      "Cutaway removes the housing to show the flight core and controller.",
    ],
    camera: { direction: [0.7, 0.35, -1], distanceFactor: 2.4 },
  },
  {
    id: "thrusters",
    slug: "thrusters",
    prefix: "TH",
    name: "Thruster Array",
    shortName: "Thrusters",
    designation: "ASM-09 / TH",
    classification: "Propulsion — thrust and attitude control",
    summary: "Main nozzles, leg verniers and skirt thrusters.",
    description:
      "Thrust is distributed across the body: main nozzles on the backpack, verniers on the lower legs and small thrusters under the skirt. Selecting this assembly highlights every nozzle at once, showing that one subsystem can span several structural assemblies.",
    mechanicalFunction: "Generates and vectors thrust for manoeuvring and flight.",
    interfaces: [
      { componentId: "backpack", relation: "Main nozzle mounts" },
      { componentId: "legs", relation: "Vernier mounts" },
      { componentId: "waist", relation: "Skirt thruster mounts" },
    ],
    flows: [
      { kind: "control", direction: "in", peer: "Thruster control units", note: "Throttle and gimbal" },
      { kind: "propellant", direction: "in", peer: "Propellant feed", note: "Tank supply" },
    ],
    subassemblies: [
      {
        id: "th-main",
        code: "TH-100",
        name: "Main Thruster Nozzles",
        layer: "frame",
        description: "Large backpack nozzles.",
        children: [
          { id: "th-main-bell", code: "TH-110", name: "Nozzle Bells", layer: "frame", description: "Expansion bells." },
          { id: "th-main-chamber", code: "TH-120", name: "Thrust Chambers", layer: "internal", description: "Chambers upstream of the bells." },
        ],
      },
      { id: "th-leg", code: "TH-200", name: "Leg Vernier Thrusters", layer: "frame", description: "Verniers on the rear of the lower legs." },
      { id: "th-skirt", code: "TH-300", name: "Skirt Thrusters", layer: "frame", description: "Small nozzles under the skirt armor." },
      { id: "th-gimbal", code: "TH-400", name: "Nozzle Gimbals", layer: "internal", description: "Vectoring mounts for the main nozzles." },
      { id: "th-tcu", code: "TH-500", name: "Thruster Control Units", layer: "internal", description: "Local controllers per nozzle group." },
    ],
    techData: [
      { label: "Distribution", value: "Backpack · legs · skirt", basis: CONCEPT },
      { label: "Control", value: "Propulsion controller → local control units", basis: CONCEPT },
    ],
    inspectionNotes: [
      "This is a distributed subsystem: its parts sit inside three other assemblies.",
      "The camera frames the whole nozzle array; backpack, leg and skirt nozzles highlight together.",
    ],
    camera: { direction: [0.75, 0.2, -1], distanceFactor: 2.1 },
  },
  {
    id: "weapons",
    slug: "weapons",
    prefix: "WP",
    name: "Handheld Armament",
    shortName: "Weapons",
    designation: "ASM-10 / WP",
    classification: "Armament — handheld",
    summary: "Beam rifle carried in the right manipulator.",
    description:
      "The armament is represented by a single handheld beam rifle. It is modelled as an emitter barrel, a targeting sensor, a replaceable energy pack and a grip that mates with the palm interface. The breakdown is conceptual; other armaments associated with the RX-105 are not represented.",
    mechanicalFunction: "Handheld directed-energy weapon interfaced through the right palm.",
    interfaces: [{ componentId: "arms", relation: "Palm weapon interface" }],
    flows: [
      { kind: "power", direction: "in", peer: "Energy pack / hand interface", note: "Charge" },
      { kind: "data", direction: "both", peer: "Fire control system", note: "Targeting and status" },
    ],
    subassemblies: [
      {
        id: "wp-rifle",
        code: "WP-100",
        name: "Beam Rifle",
        layer: "frame",
        description: "Handheld rifle.",
        children: [
          { id: "wp-barrel", code: "WP-110", name: "Emitter Barrel", layer: "frame", description: "Barrel and muzzle." },
          { id: "wp-sensor", code: "WP-120", name: "Targeting Sensor", layer: "frame", description: "Top-mounted sight." },
          { id: "wp-capacitor", code: "WP-130", name: "Energy Pack", layer: "internal", description: "Replaceable charge pack." },
          { id: "wp-grip", code: "WP-140", name: "Grip & Hand Interface", layer: "frame", description: "Grip mating with the palm connector." },
        ],
      },
    ],
    techData: [
      { label: "Represented", value: "Beam rifle only", basis: CONCEPT },
      { label: "Interface", value: "Right palm connector", basis: CONCEPT },
    ],
    inspectionNotes: ["Exploded view separates the barrel, sight, energy pack and grip along the rifle axis."],
    camera: { direction: [-1, 0.25, 0.9], distanceFactor: 2.0 },
  },
];

/* ------------------------------------------------------------------ */
/* Lookups and helpers                                                 */
/* ------------------------------------------------------------------ */

export const COMPONENT_IDS: ComponentId[] = COMPONENTS.map((c) => c.id);

const byId = new Map(COMPONENTS.map((c) => [c.id, c]));
const bySlug = new Map(COMPONENTS.map((c) => [c.slug, c]));

export function getComponent(id: ComponentId): ComponentSpec {
  const c = byId.get(id);
  if (!c) throw new Error(`Unknown component: ${id}`);
  return c;
}

export function getComponentBySlug(slug: string | undefined): ComponentSpec | undefined {
  return slug ? bySlug.get(slug) : undefined;
}

export function isComponentId(value: unknown): value is ComponentId {
  return typeof value === "string" && byId.has(value as ComponentId);
}

/** Depth-first walk of a subassembly forest. */
export function walkSubassemblies(
  nodes: Subassembly[],
  visit: (node: Subassembly, depth: number, parent: Subassembly | null) => void,
  depth = 0,
  parent: Subassembly | null = null,
): void {
  for (const n of nodes) {
    visit(n, depth, parent);
    if (n.children) walkSubassemblies(n.children, visit, depth + 1, n);
  }
}

export function countSubassemblies(spec: ComponentSpec): number {
  let n = 0;
  walkSubassemblies(spec.subassemblies, () => n++);
  return n;
}

export const TOTAL_SUBASSEMBLIES = COMPONENTS.reduce((sum, c) => sum + countSubassemblies(c), 0);

/** Finds a subassembly anywhere in the catalogue, with its owning component. */
export function findSubassembly(
  id: string,
): { component: ComponentSpec; node: Subassembly; parent: Subassembly | null } | undefined {
  for (const component of COMPONENTS) {
    let found: { node: Subassembly; parent: Subassembly | null } | undefined;
    walkSubassemblies(component.subassemblies, (node, _d, parent) => {
      if (!found && node.id === id) found = { node, parent };
    });
    if (found) return { component, ...found };
  }
  return undefined;
}

/** The id itself plus every descendant id. Selecting a parent selects its whole subtree. */
export function subassemblySubtreeIds(id: string): Set<string> {
  const out = new Set<string>();
  const hit = findSubassembly(id);
  if (!hit) return out;
  out.add(hit.node.id);
  if (hit.node.children) walkSubassemblies(hit.node.children, (n) => out.add(n.id));
  return out;
}

/** Neighbour in catalogue order, wrapping around. */
export function adjacentComponent(id: ComponentId, step: 1 | -1): ComponentSpec {
  const i = COMPONENT_IDS.indexOf(id);
  const n = COMPONENTS.length;
  return COMPONENTS[(i + step + n) % n];
}
