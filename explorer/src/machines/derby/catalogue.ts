import type { ComponentSpec } from "@/data/types";

/**
 * Sections of the Derby exhibit.
 *
 * Rows marked `basis: "reference"` (shown as DOC) repeat facts published by
 * the manufacturer, reference works or the trade press — see the Sources list
 * in machine.tsx and the README. Rows marked `conceptual` (MODEL) describe
 * approximations or representative details of this visualization, or general
 * engineering practice rather than Derby-specific data. The exhibit covers the
 * external form and encyclopedia-level facts only: no internal layout,
 * warhead, fuzing or guidance details.
 */

const MODEL = "conceptual" as const;
const DOC = "reference" as const;

export const COMPONENTS: ComponentSpec[] = [
  {
    id: "radome",
    slug: "radome",
    prefix: "RD",
    name: "Radome",
    shortName: "Radome",
    designation: "SEC-01 / RD",
    classification: "Nose — radar-transparent cover",
    summary: "Long, pointed nose of radar-transparent material over the active radar seeker.",
    description:
      "The Derby's clearest difference from its infrared-guided Python relatives is its nose: a long, pointed radome where they have a glass dome. It covers the missile's active radar seeker, so it must let radar energy pass with as little distortion as possible while standing up to the heating and loads of supersonic flight.",
    mechanicalFunction: "Protects the seeker while passing its radar signals, and forms the leading aerodynamic surface.",
    role: "Nose of the missile, fixed to the forward body by a metal attachment ring.",
    functionBasis: DOC,
    interfaces: [{ componentId: "forward", relation: "Attachment ring at the forward body" }],
    flows: [
      { kind: "signal", direction: "both", peer: "Active radar seeker", note: "Radar energy passes out and back through the radome" },
      { kind: "load", direction: "out", peer: "Forward body", note: "Aerodynamic loads on the nose" },
    ],
    subassemblies: [
      { id: "rd-shell", code: "RD-100", name: "Radome Shell", layer: "armor", description: "Pointed ogive of radar-transparent material. Proportions approximated from photographs." },
      { id: "rd-tip", code: "RD-200", name: "Nose Tip", layer: "frame", description: "Small rounded tip that takes the highest heating. Representative." },
      { id: "rd-ring", code: "RD-300", name: "Attachment Ring", layer: "frame", description: "Metal ring joining the radome to the forward body. Representative." },
    ],
    techData: [
      { label: "Seeker", value: "Active radar", basis: DOC },
      { label: "Shape", value: "Pointed ogive, approximated from photographs", basis: MODEL },
      { label: "Material shown", value: "Ceramic-white finish; radomes are generally ceramic or composite", basis: MODEL },
    ],
    details: [
      {
        title: "Why a radome",
        body: "A radar antenna needs a cover that is aerodynamically shaped yet nearly invisible to radar waves. Radomes are made of ceramics or composites chosen for how they pass radio energy as much as for strength and heat resistance.",
      },
      {
        title: "Shape trade-offs",
        body: "A long, pointed nose has low drag at supersonic speed, but radar waves passing through a sharply curved wall bend slightly, shifting where the target appears. Radome design balances drag, heating and this electromagnetic distortion.",
      },
      {
        title: "Active radar homing",
        body: "An active radar seeker carries its own transmitter and receiver, so the missile can track its target without help. Earlier semi-active radar missiles homed on energy reflected from a radar on the launching aircraft, which had to keep illuminating the target until impact.",
      },
    ],
    inspectionNotes: [
      "The radome's ceramic-white finish sets it apart from the painted airframe.",
      "In the Sections view the radome lifts highest, off its attachment ring.",
    ],
    camera: { direction: [0.16, 0.3, 1], distanceFactor: 3 },
  },
  {
    id: "forward",
    slug: "forward-body",
    prefix: "FS",
    name: "Forward Body",
    shortName: "Forward Body",
    designation: "SEC-02 / FS",
    classification: "Forward section — guidance and control",
    summary: "Body section behind the radome that carries both rows of canards.",
    description:
      "Behind the radome, the forward body carries the two rows of canards. In guided missiles generally this part of the airframe holds the avionics — the electronics that turn seeker and motion measurements into steering commands — and the actuators that move the control surfaces. The exhibit shows only its exterior: the canard collars, joint rings and a display band.",
    mechanicalFunction: "Carries the canards and, in missiles of this kind, the avionics and actuators that steer them.",
    role: "Between the radome and the centre body.",
    interfaces: [
      { componentId: "radome", relation: "Radome attachment ring" },
      { componentId: "canards", relation: "Both canard rows; control canards turn on shafts through the collars" },
      { componentId: "centre", relation: "Joint ring to the centre body" },
    ],
    flows: [
      { kind: "signal", direction: "in", peer: "Seeker and motion sensors", note: "Measurements for the avionics (general)" },
      { kind: "control", direction: "out", peer: "Control canards", note: "Steering commands to the actuators (general)" },
      { kind: "load", direction: "both", peer: "Radome, centre body", note: "Part of the airframe's load path" },
    ],
    subassemblies: [
      { id: "fs-skin", code: "FS-100", name: "Forward Body Skin", layer: "armor", description: "Cylindrical skin at the published 16 cm diameter." },
      { id: "fs-collars", code: "FS-200", name: "Canard Collars", layer: "frame", description: "Bosses where the control canards' shafts meet the body. Representative." },
      { id: "fs-band", code: "FS-300", name: "Display Band", layer: "armor", description: "Blue band of the kind used to mark inert display and training rounds. Representative." },
      { id: "fs-joint", code: "FS-400", name: "Joint Rings", layer: "frame", description: "Joint to the centre body and screw row at the radome. Positions approximate." },
    ],
    techData: [
      { label: "Diameter", value: "0.16 m", basis: DOC },
      { label: "Section joints", value: "Positions approximated from photographs", basis: MODEL },
      { label: "Display band", value: "Representative exhibit marking", basis: MODEL },
    ],
    details: [
      {
        title: "Avionics as a discipline",
        body: "Avionics — aviation electronics — covers the sensors, processors, power and actuation that let an aircraft or missile sense its situation and act on it. In a guided missile it spans the seeker, motion sensors, the computer that blends their data, and the servo actuators that move the control surfaces.",
      },
      {
        title: "Packaging in a small diameter",
        body: "A 16 cm body leaves little room. Missile electronics are packed into compact, ruggedised modules that must survive high acceleration, vibration and temperature extremes — one reason the forward body is a tightly integrated section rather than an open bay.",
      },
    ],
    inspectionNotes: [
      "The blue display band sits just behind the joint to the centre body.",
      "The collars at the second canard row mark where the control canards turn.",
    ],
    camera: { direction: [0.16, 0.24, 1], distanceFactor: 2.8 },
  },
  {
    id: "canards",
    slug: "canards",
    prefix: "CN",
    name: "Canards",
    shortName: "Canards",
    designation: "SEC-03 / CN",
    classification: "Control surfaces — two rows of four",
    summary: "Two rows of delta surfaces just behind the radome that steer the missile.",
    description:
      "Like the Python family it grew from, the Derby is controlled from the front: two rows of four delta canards sit just behind the radome — a small forward row and a larger row behind it. Control surfaces ahead of the centre of gravity give a quick, agile response, while the large wings at the tail keep the missile stable. Which row moves, and the exact planforms, are shown representatively.",
    mechanicalFunction: "Turn the missile in pitch and yaw, as on the canard-controlled Python family.",
    role: "Forward control surfaces; the larger, rear row is shown as the movable control row.",
    functionBasis: DOC,
    interfaces: [
      { componentId: "forward", relation: "Mounted on the forward body; control canards on shafts through the collars" },
      { componentId: "wings", relation: "Work against the tail wings, which keep the missile stable" },
    ],
    flows: [
      { kind: "control", direction: "in", peer: "Actuators in the forward body", note: "Deflection commands (general)" },
      { kind: "load", direction: "out", peer: "Airframe", note: "Manoeuvring forces" },
    ],
    subassemblies: [
      { id: "cn-fixed", code: "CN-100", name: "Forward Canard Row", layer: "armor", description: "Four small delta surfaces at the front of the forward body. Planform representative." },
      { id: "cn-control", code: "CN-200", name: "Control Canard Row", layer: "armor", description: "Four larger delta surfaces behind them, shown as the movable control canards. Planform representative." },
      { id: "cn-hinge", code: "CN-300", name: "Hinge Fairings", layer: "frame", description: "Root fairings over the control canards' shafts. Representative." },
    ],
    techData: [
      { label: "Layout", value: "Dual canards, as on the Python family", basis: DOC },
      { label: "Number", value: "Two rows of four", basis: MODEL },
      { label: "Planforms and sizes", value: "Approximated from photographs", basis: MODEL },
    ],
    details: [
      {
        title: "Canard control",
        body: "Surfaces ahead of the centre of gravity turn the nose directly, so a canard-controlled missile responds quickly — valuable for an agile, dogfight-derived airframe. The trade-off is that canard deflection also disturbs the airflow reaching the tail, which designers must account for.",
      },
      {
        title: "Stability versus agility",
        body: "A missile is stable when its centre of pressure lies behind its centre of gravity. Large tail wings move the centre of pressure aft for stability; the canards, small but far forward, provide the control. The balance between the two sets how readily the missile manoeuvres.",
      },
    ],
    inspectionNotes: [
      "Orbit to see both rows: the small forward row and the larger control row behind it.",
      "In the Sections view the canards stand off the forward body.",
    ],
    camera: { direction: [0.95, 0.3, 1], distanceFactor: 2.6 },
  },
  {
    id: "centre",
    slug: "centre-body",
    prefix: "CB",
    name: "Centre Body",
    shortName: "Centre Body",
    designation: "SEC-04 / CB",
    classification: "Main body — launch interface",
    summary: "Longest section of the slender body, carrying the launch hangers and umbilical connector.",
    description:
      "The centre body is the longest stretch of the 16 cm tube. Along its top run the hangers that hold the missile on its launcher and the umbilical connector through which aircraft and missile exchange power and data before launch — the standard interface for missiles of this class, shown here representatively. Access panels sit on its sides.",
    mechanicalFunction: "Main structural section; carries the launch hangers and the umbilical connector.",
    role: "Between the forward body and the aft body; the missile's mechanical and electrical link to the aircraft.",
    interfaces: [
      { componentId: "forward", relation: "Joint ring to the forward body" },
      { componentId: "aft", relation: "Joint ring to the aft body" },
    ],
    flows: [
      { kind: "power", direction: "in", peer: "Launching aircraft", note: "Through the umbilical before launch (general)" },
      { kind: "signal", direction: "in", peer: "Launching aircraft", note: "Pre-launch data through the umbilical (general)" },
      { kind: "load", direction: "both", peer: "Forward and aft bodies", note: "Main structural path" },
    ],
    subassemblies: [
      { id: "cb-skin", code: "CB-100", name: "Centre Body Skin", layer: "armor", description: "Cylindrical skin at the published 16 cm diameter." },
      { id: "cb-hangers", code: "CB-200", name: "Launch Hangers", layer: "frame", description: "Fittings that hold the missile on its launcher. Number and shape representative." },
      { id: "cb-umbilical", code: "CB-300", name: "Umbilical Connector", layer: "frame", description: "Power and data connection to the aircraft before launch. Representative." },
      { id: "cb-panels", code: "CB-400", name: "Access Panels", layer: "armor", description: "Panel outlines on the sides. Placement representative." },
      { id: "cb-joints", code: "CB-500", name: "Joint Rings", layer: "frame", description: "Joints to the forward and aft bodies. Positions approximate." },
    ],
    techData: [
      { label: "Overall length", value: "3.62 m", basis: DOC },
      { label: "Diameter", value: "0.16 m (fineness ratio about 23)", basis: DOC },
      { label: "Launch weight", value: "118 kg", basis: DOC },
      { label: "Hangers, umbilical, panels", value: "Representative", basis: MODEL },
    ],
    details: [
      {
        title: "A slender body",
        body: "At 3.62 m long and 16 cm across, the Derby is about 23 diameters long. A small cross-section keeps supersonic drag low — the published top speed is about Mach 4 — and the long body leaves room for a large rocket motor and the electronics.",
      },
      {
        title: "Weight and integration",
        body: "At 118 kg the Derby is light for a medium-range missile, which Rafael presents as the reason it can be fitted to a wide range of fighters. Integration means matching the missile's hangers, umbilical and software to each aircraft's launchers and weapon system.",
      },
    ],
    inspectionNotes: [
      "The hangers and umbilical connector run along one side of the body, between two wings.",
      "Panel outlines are on both sides — orbit to see the far side.",
    ],
    camera: { direction: [0.16, 0.16, 1], distanceFactor: 1.9 },
  },
  {
    id: "aft",
    slug: "aft-body",
    prefix: "AS",
    name: "Aft Body",
    shortName: "Aft Body",
    designation: "SEC-05 / AS",
    classification: "Aft section — rocket motor",
    summary: "Rear body around the solid rocket motor, ending in the nozzle.",
    description:
      "The aft body encloses the rocket motor, which burns solid propellant and exhausts through the nozzle at the tail; the four large wings are fixed along it. The extended-range I-Derby ER, which keeps the same shape and size, uses a dual-pulse motor: a second propellant charge that can be ignited later in flight to stretch the range.",
    mechanicalFunction: "Encloses the rocket motor and carries the tail wings; the nozzle turns combustion gas into thrust.",
    role: "Rear of the missile; its thrust is carried forward through the airframe.",
    functionBasis: DOC,
    interfaces: [
      { componentId: "centre", relation: "Joint ring to the centre body" },
      { componentId: "wings", relation: "Four wings attached along the aft body" },
    ],
    flows: [{ kind: "load", direction: "out", peer: "Airframe", note: "Thrust" }],
    subassemblies: [
      { id: "as-skin", code: "AS-100", name: "Aft Body Skin", layer: "armor", description: "Cylindrical skin with a short boattail at the tail." },
      { id: "as-ring", code: "AS-200", name: "Aft Ring & End Closure", layer: "frame", description: "Ring at the end of the boattail and the closure around the nozzle. Representative." },
      { id: "as-nozzle", code: "AS-300", name: "Nozzle Exit", layer: "frame", description: "Exit of the rocket motor's nozzle. Shape representative." },
      { id: "as-joint", code: "AS-400", name: "Joint Ring", layer: "frame", description: "Joint to the centre body. Position approximate." },
    ],
    techData: [
      { label: "Motor", value: "Solid-propellant rocket", basis: DOC },
      { label: "I-Derby ER", value: "Dual-pulse solid rocket motor", basis: DOC },
      { label: "Nozzle and boattail", value: "Representative", basis: MODEL },
    ],
    details: [
      {
        title: "Solid rocket motors",
        body: "A solid motor stores fuel and oxidiser mixed in a rubbery propellant cast inside the motor case. It is simple, storable for years and ready instantly — the usual choice for air-to-air missiles, at the cost of not being able to throttle or restart a single charge.",
      },
      {
        title: "Dual-pulse propulsion",
        body: "Splitting the propellant into two separately ignited pulses lets a missile coast between burns and use its energy where it matters most, typically for the final approach. It is one of the main ways modern missiles extend their reach without growing in size.",
      },
    ],
    inspectionNotes: [
      "The nozzle exit is visible from behind the missile.",
      "In the Sections view the aft body stays on the floor while the sections above lift away.",
    ],
    camera: { direction: [0.16, 0.18, 1], distanceFactor: 2.3 },
  },
  {
    id: "wings",
    slug: "wings",
    prefix: "WG",
    name: "Rear Wings",
    shortName: "Wings",
    designation: "SEC-06 / WG",
    classification: "Stabilising surfaces — four long-chord wings",
    summary: "Four long, swept wings at the tail that set the 0.64 m span.",
    description:
      "The largest surfaces are at the tail: four long-chord, swept wings that set the published 0.64 m span. They keep the missile stable — holding the centre of pressure behind the centre of gravity — and add lift when the canards turn it. The long, low planform keeps the span compact for carriage on the aircraft while providing enough area for stability.",
    mechanicalFunction: "Provide stability and lift at the tail.",
    role: "Tail surfaces, working with the canards at the front.",
    functionBasis: DOC,
    interfaces: [
      { componentId: "aft", relation: "Fixed along the aft body" },
      { componentId: "canards", relation: "Balance the canards' control forces" },
    ],
    flows: [{ kind: "load", direction: "out", peer: "Airframe", note: "Stabilising forces" }],
    subassemblies: [
      { id: "wg-panels", code: "WG-100", name: "Wing Panels", layer: "armor", description: "Four long-chord, swept surfaces. Planform approximated from photographs; span as published." },
      { id: "wg-roots", code: "WG-200", name: "Root Fairings", layer: "frame", description: "Thickened roots where the wings meet the aft body. Representative." },
    ],
    techData: [
      { label: "Span", value: "0.64 m", basis: DOC },
      { label: "Number", value: "Four", basis: DOC },
      { label: "Planform and thickness", value: "Approximated from photographs", basis: MODEL },
    ],
    details: [
      {
        title: "Long-chord, low-span surfaces",
        body: "A fighter carries missiles close together on pylons and rails, so span matters. Long-chord surfaces get their area from length rather than span, keeping the missile compact while still moving the centre of pressure well aft.",
      },
      {
        title: "Materials",
        body: "Missile surfaces are typically machined aluminium or titanium, sometimes with composite parts, and must stay stiff while heated by supersonic flight. Their leading edges are kept sharp to reduce drag at high Mach numbers.",
      },
    ],
    inspectionNotes: [
      "The wings sit in an ×, in line with the canards; orbit to see their full planform.",
      "In the Sections view they stand off the aft body.",
    ],
    camera: { direction: [0.95, 0.22, 1], distanceFactor: 2.3 },
  },
];
