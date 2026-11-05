import type { ComponentSpec } from "@/data/types";

/**
 * Sections of the V-2 (A-4) exhibit.
 *
 * Rows marked `basis: "reference"` (shown as DOC) repeat facts published by
 * museums, archives and reference works — see the Sources list in machine.tsx
 * and the README. Rows marked `conceptual` (shown as MODEL) describe choices
 * made for this visualization: approximated shapes and representative
 * details. The content stays at the level of a museum placard: history,
 * external form, materials and general principles. No design or performance
 * data beyond widely published overall figures is given.
 */

const MODEL = "conceptual" as const;
const DOC = "reference" as const;

export const COMPONENTS: ComponentSpec[] = [
  {
    id: "upper",
    slug: "wac-corporal",
    prefix: "WC",
    name: "WAC Corporal Upper Stage",
    shortName: "WAC Corporal",
    designation: "SEC-01 / WC",
    classification: "Second stage — liquid-propellant sounding rocket",
    summary: "Slender American sounding rocket carried in the V-2's nose as the Bumper second stage.",
    description:
      "The WAC Corporal was designed at Caltech's Jet Propulsion Laboratory and built by Douglas — the first operational US sounding rocket, first flown on 11 October 1945. For the Bumper program it rode in the V-2's nose with four enlarged fins in place of its usual three, for stability at high speed in thin air. Ignited high in the V-2's climb, it slid out of its rails and flew on alone: on 24 February 1949 Bumper 5's upper stage climbed to nearly 400 km, higher than any human-made object before it.",
    mechanicalFunction: "Second stage: carries instruments far higher than the V-2 alone could reach.",
    role: "Upper stage of the two-stage Bumper-WAC; ignited in flight and released from the V-2's nose rails.",
    functionBasis: DOC,
    interfaces: [
      { componentId: "nose", relation: "Fins held in rails in the modified nose cone" },
      { componentId: "engine", relation: "Its ignition signalled V-2 engine cut-off" },
    ],
    flows: [
      { kind: "load", direction: "in", peer: "V-2 nose section", note: "Carried in the nose rails until separation" },
      { kind: "control", direction: "out", peer: "V-2 engine", note: "Ignition burned through a wire, signalling V-2 cut-off" },
      { kind: "propellant", direction: "both", peer: "Own tanks and motor", note: "Nitric acid and fuel, pushed by compressed air" },
    ],
    subassemblies: [
      { id: "wc-body", code: "WC-100", name: "Body & Nose Cone", layer: "armor", description: "Slender body (0.305 m diameter in reality, drawn about twice as wide here) with an ogival nose. Paint representative." },
      { id: "wc-fins", code: "WC-200", name: "Four Fins", layer: "armor", description: "Enlarged for Bumper — four instead of the standard three — and recessed into the V-2's nose. Planform representative." },
      { id: "wc-spin", code: "WC-300", name: "Spin Rockets", layer: "frame", description: "Two small solid rockets that spun the stage for stability above the atmosphere. Placement representative." },
      { id: "wc-nozzle", code: "WC-400", name: "Motor Nozzle", layer: "frame", description: "Exit of the liquid-propellant motor, seated inside the V-2's nose." },
      {
        id: "wc-internals",
        code: "WC-500",
        name: "Propulsion & Instruments",
        layer: "internal",
        description: "Shown in the Internal view; sizes and arrangement are representative.",
        children: [
          { id: "wc-motor", code: "WC-510", name: "Rocket Motor", layer: "internal", description: "Liquid-propellant motor at the base of the stage." },
          { id: "wc-oxidiser", code: "WC-520", name: "Nitric-Acid Tank", layer: "internal", description: "Oxidiser: red fuming nitric acid." },
          { id: "wc-fuel", code: "WC-530", name: "Fuel Tank & Lines", layer: "internal", description: "Fuel (furfuryl alcohol) and the feed lines to the motor." },
          { id: "wc-air", code: "WC-540", name: "Compressed-Air Bottle", layer: "internal", description: "Pressurising air that pushed both propellants into the motor." },
          { id: "wc-instruments", code: "WC-550", name: "Instrument Section", layer: "internal", description: "Instruments and telemetry in the nose." },
        ],
      },
    ],
    techData: [
      { label: "Diameter", value: "0.305 m", basis: DOC },
      { label: "Fins", value: "Four, span 1.22 m (standard WAC Corporal: three)", basis: DOC },
      { label: "Propellants", value: "Red fuming nitric acid and furfuryl alcohol, fed by compressed air", basis: DOC },
      { label: "Stabilisation", value: "Two small solid rockets spun it after separation", basis: DOC },
      { label: "Record", value: "Bumper 5, 24 Feb 1949: nearly 400 km", basis: DOC },
      { label: "Length", value: "About 4.6 m as adapted for Bumper; sources differ", basis: MODEL },
      { label: "Drawn size", value: "Enlarged about 2× in width and 1.25× in length so it reads clearly — not to scale with the V-2", basis: MODEL },
    ],
    details: [
      {
        title: "Why stack two rockets",
        body: "A rocket carries the mass of its own empty tanks and engine all the way up. Dropping the spent first stage and continuing with a small, light second stage — already moving fast — reaches far higher speeds and altitudes than one large rocket can. Bumper tested that idea, and the problem of starting an engine in flight, at a time when nobody had done it with large liquid-propellant rockets.",
      },
      {
        title: "Staging in flight",
        body: "Near the end of the V-2's burn the upper stage ignited while still in its rails; its exhaust burned through a wire that signalled the V-2's engine to shut down. As the V-2 slowed, the WAC Corporal slid out of the nose and flew on alone.",
      },
      {
        title: "Spin and fins",
        body: "Above the atmosphere fins have nothing to push against. Spinning the stage with two small solid rockets made it behave like a gyroscope and hold its direction, while the four enlarged fins kept it stable at high speed lower down.",
      },
      {
        title: "Propellants",
        body: "Nitric acid and furfuryl alcohol ignite on contact, so the motor needed no igniter, and both stay liquid at room temperature, unlike the V-2's liquid oxygen. Compressed air pushed them from the tanks — simpler than a turbopump for a small rocket.",
      },
    ],
    inspectionNotes: [
      "Drawn about twice its true width: the real stage was only a fifth as wide as the V-2, a needle on its nose.",
      "Its fins sit in slots in the V-2's nose cone; the Internal view shows the rails holding them.",
      "In the Sections view the upper stage slides out of the nose, as it did in flight.",
    ],
    camera: { direction: [0.14, 0.28, 1], distanceFactor: 2.6 },
  },
  {
    id: "nose",
    slug: "nose",
    prefix: "NS",
    name: "Nose Section",
    shortName: "Nose Section",
    designation: "SEC-02 / NS",
    classification: "Forward section — modified for the upper stage",
    summary: "The V-2's ogival nose, altered for Bumper to carry the WAC Corporal in rails.",
    description:
      "The foremost of the V-2's four main sections. Its ogival shape — a curved taper rather than a straight cone — lets the nose meet the air smoothly at high speed. On wartime rockets it was the warhead, with an impact fuze at the tip. For the Bumper program the nose cone was the only part of the V-2 that had to change: it was altered to carry the WAC Corporal, whose fins sat recessed in rails inside the cone until it slid free in flight.",
    mechanicalFunction: "Carries the payload — here the upper stage — and forms the leading aerodynamic surface of the V-2.",
    role: "First section of the V-2 airframe; holds the upper stage and bolts to the instrument compartment below.",
    functionBasis: DOC,
    interfaces: [
      { componentId: "upper", relation: "Rails hold the upper stage's fins until it slides free" },
      { componentId: "instrument", relation: "Bolted joint at the base of the nose" },
    ],
    flows: [
      { kind: "load", direction: "out", peer: "WAC Corporal", note: "Carries the upper stage until separation" },
      { kind: "load", direction: "in", peer: "Instrument compartment", note: "Supported at the forward joint" },
    ],
    subassemblies: [
      { id: "ns-shell", code: "NS-100", name: "Ogive Shell", layer: "armor", description: "Curved, tapering outer shell, cut back to an opening for the upper stage." },
      { id: "ns-slots", code: "NS-200", name: "Fin Slots", layer: "armor", description: "Slots where the upper stage's fins are recessed into the cone. Layout representative." },
      { id: "ns-collar", code: "NS-300", name: "Opening Collar", layer: "frame", description: "Rim of the opening the upper stage rises from. Representative." },
      { id: "ns-joint", code: "NS-400", name: "Aft Joint Ring", layer: "frame", description: "Bolted flange joining the nose to the instrument compartment." },
      { id: "ns-rails", code: "NS-500", name: "Guide Rails", layer: "internal", description: "Rails in which the upper stage's fins sat until it slid out in flight." },
      { id: "ns-cradle", code: "NS-600", name: "Upper-Stage Seat", layer: "internal", description: "Ring and struts the upper stage rests on. Representative." },
    ],
    techData: [
      { label: "Section length", value: "2.01 m on the standard V-2", basis: DOC },
      { label: "Bumper change", value: "Nose altered to carry the WAC Corporal; fins recessed in rails", basis: DOC },
      { label: "Wartime payload", value: "Conventional high explosive, about one tonne", basis: DOC },
      { label: "Opening, slots, rails", value: "Representative", basis: MODEL },
    ],
    details: [
      {
        title: "Why an ogive",
        body: "A nose shaped as a curved taper (an ogive) spreads the pressure rise of supersonic flight along its length. It also has more internal volume than a straight cone of the same length, which mattered for a section that had to carry a heavy payload.",
      },
      {
        title: "Aerodynamic heating",
        body: "The V-2 re-entered the lower atmosphere at several times the speed of sound, and friction heated the skin. Heating at the nose and the forward sections was one of the problems the developers had to understand — an early encounter with an issue that later dominated re-entry vehicle design.",
      },
      {
        title: "From warhead to science payload",
        body: "When the US Army fired captured V-2s at White Sands from 1946, the Naval Research Laboratory and others designed replacement nose sections packed with instruments, adding ballast where the instruments were lighter than the original payload. Bumper took the idea furthest: the payload became a second rocket.",
      },
    ],
    inspectionNotes: [
      "The upper stage's fins emerge through four slots in the cone, in line with the V-2's own fins.",
      "The Internal view shows the guide rails and the seat the upper stage rests on.",
    ],
    camera: { direction: [0.14, 0.3, 1], distanceFactor: 2.5 },
  },
  {
    id: "instrument",
    slug: "instrument-compartment",
    prefix: "IC",
    name: "Instrument Compartment",
    shortName: "Instrument Compartment",
    designation: "SEC-03 / IC",
    classification: "Guidance section — Geräteraum",
    summary: "Ring of four equipment bays behind access hatches: guidance, radio and electrical systems.",
    description:
      "Between the nose and the propellant tanks sat the instrument compartment, divided into four quadrants for guidance and control, radio and electrical equipment, each reached through its own hatch. Its gyroscopes sensed when the rocket strayed from its programmed path, and an analog computer turned that into steering commands for the vanes in the tail — one of the first guidance systems of its kind to fly.",
    mechanicalFunction: "Houses the guidance, control, radio and electrical equipment that steer the rocket and end powered flight.",
    role: "The rocket's guidance section: senses attitude, commands the control vanes and signals engine cut-off.",
    functionBasis: DOC,
    interfaces: [
      { componentId: "nose", relation: "Forward joint" },
      { componentId: "centre", relation: "Aft joint" },
      { componentId: "control", relation: "Steering commands to the vane servos in the tail" },
      { componentId: "engine", relation: "Cut-off command ends powered flight" },
    ],
    flows: [
      { kind: "power", direction: "out", peer: "Vane servos and instruments", note: "Onboard batteries and converters" },
      { kind: "control", direction: "out", peer: "Jet vanes and air rudders", note: "Steering commands from the gyroscopes and analog computer" },
      { kind: "control", direction: "out", peer: "Engine", note: "Cut-off at the planned speed" },
      { kind: "load", direction: "both", peer: "Nose section, centre section", note: "Carries the nose; rests on the centre section" },
    ],
    subassemblies: [
      { id: "ic-shell", code: "IC-100", name: "Compartment Shell", layer: "armor", description: "Tapering ring continuing the ogive of the nose." },
      { id: "ic-hatches", code: "IC-200", name: "Access Hatches", layer: "armor", description: "One hatch per equipment quadrant. Placement and outline are representative." },
      { id: "ic-joints", code: "IC-300", name: "Joint Rings", layer: "frame", description: "Bolted flanges to the nose above and the centre section below." },
      {
        id: "ic-equipment",
        code: "IC-400",
        name: "Guidance & Control Equipment",
        layer: "internal",
        description: "The documented equipment, shown in the Internal view in a representative arrangement across the four bays.",
        children: [
          { id: "ic-frame", code: "IC-410", name: "Equipment Frame", layer: "internal", description: "Floor, mid deck and the walls dividing the four bays. Representative." },
          { id: "ic-gyros", code: "IC-420", name: "Gyroscopes", layer: "internal", description: "Sensed deviations in pitch, yaw and roll from the programmed flight path; shown in gimbal rings in the two forward bays." },
          { id: "ic-computer", code: "IC-430", name: "Analog Computer (Mischgerät)", layer: "internal", description: "Combined the gyroscope signals into commands for the vane servos; a vacuum-tube unit." },
          { id: "ic-cutoff", code: "IC-440", name: "Cut-off Integrator", layer: "internal", description: "Integrating accelerometer that ended powered flight once the planned speed was reached." },
          { id: "ic-power", code: "IC-450", name: "Batteries & Converter", layer: "internal", description: "Onboard batteries and a rotary converter supplying the instruments and servomotors." },
          { id: "ic-radio", code: "IC-460", name: "Radio Equipment", layer: "internal", description: "Radio sets for telemetry and ground commands." },
          { id: "ic-harness", code: "IC-470", name: "Cable Harness", layer: "internal", description: "Wiring between the sets, running down to the servomotors in the tail." },
        ],
      },
    ],
    techData: [
      { label: "Section length", value: "1.41 m", basis: DOC },
      { label: "Layout", value: "Four quadrants: guidance and control, radio, electrical", basis: DOC },
      { label: "Guidance", value: "Gyroscopes with an analog computer (Mischgerät)", basis: DOC },
      { label: "Hatches shown", value: "One per quadrant, outline representative", basis: MODEL },
      { label: "Interior shown", value: "Representative arrangement of the documented equipment", basis: MODEL },
    ],
    details: [
      {
        title: "Inertial guidance, 1940s style",
        body: "Gyroscopes hold their orientation in space, so the instruments could measure how far the rocket's body had turned away from its programmed attitude. An analog computer mixed those signals and drove servomotors on the vanes in the tail. Measuring and correcting motion without outside references is the principle behind every inertial guidance system since.",
      },
      {
        title: "Ending powered flight",
        body: "A ballistic rocket's range is set mainly by its speed and direction at the moment the engine stops. The V-2 used an integrating accelerometer to sense when the planned speed had been reached and command cut-off; the Smithsonian holds an example of this instrument.",
      },
      {
        title: "Why it sits forward",
        body: "Placing the instruments high on the rocket keeps them away from the vibration and heat of the engine, and their mass helps keep the centre of gravity well forward of the fins — part of what makes the rocket aerodynamically stable.",
      },
    ],
    inspectionNotes: [
      "The Internal view shows the equipment bay by bay: gyroscopes at the front, the analog computer and batteries behind, radio sets on the upper deck.",
      "The hatch outlines and fasteners are raised slightly from the skin; orbit to see all four.",
      "The roll pattern here is inverted relative to the nose and centre section, forming the checkerboard.",
    ],
    camera: { direction: [0.14, 0.24, 1], distanceFactor: 2.6 },
  },
  {
    id: "centre",
    slug: "centre-section",
    prefix: "CS",
    name: "Centre Section",
    shortName: "Centre Section",
    designation: "SEC-04 / CS",
    classification: "Main body — propellant tanks",
    summary: "The long cylindrical body around the two propellant tanks.",
    description:
      "The largest section and the rocket's main structural member. Inside its two half-shells sat the fuel tank — a mixture of ethanol and water — above the liquid-oxygen tank, both of aluminium–magnesium alloy and wrapped in glass-wool insulation. Liquid oxygen boils away at room temperature, so the rocket was fuelled shortly before launch.",
    mechanicalFunction: "Encloses the propellant tanks and carries loads between the tail and the forward sections.",
    role: "Main body of the airframe, between the instrument compartment and the tail.",
    functionBasis: DOC,
    interfaces: [
      { componentId: "instrument", relation: "Forward joint" },
      { componentId: "tail", relation: "Aft joint; propellant lines run down into the tail" },
    ],
    flows: [
      { kind: "propellant", direction: "out", peer: "Turbopump in the tail", note: "Fuel (ethanol–water) and liquid oxygen" },
      { kind: "load", direction: "both", peer: "Tail section, instrument compartment", note: "Main structural path from the thrust ring to the nose" },
    ],
    subassemblies: [
      { id: "cs-skin", code: "CS-100", name: "Outer Skin", layer: "armor", description: "Cylindrical skin at the full body diameter, built as two half-shells." },
      { id: "cs-seams", code: "CS-200", name: "Longitudinal Seams", layer: "armor", description: "Where the two half-shells meet, one on each side. Rivet lines are representative." },
      { id: "cs-joints", code: "CS-300", name: "Joint Rings", layer: "frame", description: "Bolted flanges to the instrument compartment and the tail." },
      {
        id: "cs-tanks",
        code: "CS-400",
        name: "Propellant Tanks",
        layer: "internal",
        description: "Shown in the Internal view, opened on one side like a museum cutaway.",
        children: [
          { id: "cs-fuel", code: "CS-410", name: "Fuel Tank", layer: "internal", description: "Ethanol and water mixture, in the upper tank." },
          { id: "cs-lox", code: "CS-420", name: "Liquid-Oxygen Tank", layer: "internal", description: "Oxidiser, in the lower tank." },
          { id: "cs-feed", code: "CS-430", name: "Propellant Lines", layer: "internal", description: "Fuel line down from the upper tank past the oxygen tank, and the oxygen outlet, both leading to the pumps in the tail." },
          { id: "cs-insulation", code: "CS-440", name: "Glass-Wool Insulation", layer: "internal", description: "Packed between the tanks and the outer skin." },
          { id: "cs-frames", code: "CS-450", name: "Tank Mounts", layer: "internal", description: "Rings and struts carrying the tanks inside the skin. Representative." },
        ],
      },
    ],
    techData: [
      { label: "Section length", value: "6.215 m", basis: DOC },
      { label: "Body diameter", value: "1.65 m", basis: DOC },
      { label: "Propellants", value: "Ethanol–water fuel (B-Stoff), liquid oxygen (A-Stoff)", basis: DOC },
      { label: "Tank material", value: "Aluminium–magnesium alloy, glass-wool insulation", basis: DOC },
      { label: "Construction", value: "Two half-shells joined along the sides", basis: DOC },
    ],
    details: [
      {
        title: "Why two separate propellants",
        body: "A liquid-propellant rocket carries its own oxidiser so its engine works without air. Keeping fuel and oxidiser in separate tanks until they meet in the combustion chamber lets the engine be started, throttled and shut down — something a solid rocket of the time could not do.",
      },
      {
        title: "Living with liquid oxygen",
        body: "Liquid oxygen is extremely cold and boils away continuously. Insulation slowed the loss, but the rocket still had to be filled shortly before launch, which shaped how launch crews operated in the field.",
      },
      {
        title: "Structure and mass",
        body: "Most of a rocket's lift-off mass is propellant, so the structure around it must be as light as possible. Lightweight alloy tanks inside a thin outer skin were an early answer to a problem every launch-vehicle designer still faces: maximising the share of mass that is propellant.",
      },
    ],
    inspectionNotes: [
      "The Internal view opens the tanks and their insulation on the side facing the default camera.",
      "The two longitudinal seams sit midway between the fins, at the front and back of the default view.",
      "In the Sections view the centre section lifts away from the tail at its bolted joint.",
    ],
    camera: { direction: [0.16, 0.14, 1], distanceFactor: 1.9 },
  },
  {
    id: "tail",
    slug: "tail-section",
    prefix: "TS",
    name: "Tail Section",
    shortName: "Tail Section",
    designation: "SEC-05 / TS",
    classification: "Aft section — Heck",
    summary: "Tapered aft shell around the engine and turbopump, carrying the fins.",
    description:
      "The tail tapers from the full body diameter towards a heavy thrust ring at the base. Inside sat the engine with its steam-driven turbopump; outside, the four fins were attached along the taper. The thrust ring took the engine's push into the airframe and carried the mountings for the jet vanes, and access doors let crews reach the equipment inside.",
    mechanicalFunction: "Encloses the propulsion system, transmits thrust into the airframe and carries the fins.",
    role: "Aft section of the airframe; the rocket's structural base.",
    functionBasis: DOC,
    interfaces: [
      { componentId: "centre", relation: "Forward joint; propellant lines enter from the tanks" },
      { componentId: "fins", relation: "Four fins attached along the tapered shell" },
      { componentId: "engine", relation: "Engine mounted inside, nozzle at the base" },
      { componentId: "control", relation: "Thrust ring carries the jet-vane mounts" },
    ],
    flows: [
      { kind: "propellant", direction: "in", peer: "Centre section tanks", note: "Fuel and liquid oxygen to the turbopump" },
      { kind: "propellant", direction: "out", peer: "Engine", note: "Pumped propellants to the combustion chamber" },
      { kind: "load", direction: "in", peer: "Engine", note: "Thrust through the engine mount" },
      { kind: "load", direction: "out", peer: "Centre section", note: "Thrust carried forward into the airframe" },
    ],
    subassemblies: [
      { id: "ts-shell", code: "TS-100", name: "Tapered Tail Shell", layer: "armor", description: "Aft skin, narrowing towards the base. Taper approximated from photographs." },
      { id: "ts-doors", code: "TS-200", name: "Access Doors", layer: "armor", description: "Panels between the fins. Placement and outline are representative." },
      { id: "ts-joint", code: "TS-300", name: "Forward Joint Ring", layer: "frame", description: "Bolted flange to the centre section." },
      { id: "ts-ring", code: "TS-400", name: "Thrust Ring", layer: "frame", description: "Heavy ring at the base that carries the jet-vane mounts." },
      { id: "ts-base", code: "TS-500", name: "Base Plate", layer: "frame", description: "Closes the base around the nozzle opening." },
      {
        id: "ts-equipment",
        code: "TS-600",
        name: "Propulsion Equipment",
        layer: "internal",
        description: "Shown in the Internal view; which equipment existed is documented, its arrangement here is representative.",
        children: [
          { id: "ts-turbopump", code: "TS-610", name: "Turbopump", layer: "internal", description: "Steam turbine between the fuel pump and the oxygen pump, on one shaft." },
          { id: "ts-steam", code: "TS-620", name: "Steam Generator", layer: "internal", description: "Decomposed hydrogen peroxide into the steam that drove the turbine." },
          { id: "ts-peroxide", code: "TS-630", name: "Peroxide & Permanganate Tanks", layer: "internal", description: "Hydrogen peroxide (T-Stoff) and the permanganate catalyst (Z-Stoff)." },
          { id: "ts-air", code: "TS-640", name: "Compressed-Air Bottles", layer: "internal", description: "Air for pressurising and operating valves. Number and placement representative." },
          { id: "ts-frame", code: "TS-650", name: "Engine Thrust Frame", layer: "internal", description: "Struts carrying the engine's thrust into the airframe." },
          { id: "ts-lines", code: "TS-660", name: "Propellant & Steam Lines", layer: "internal", description: "From the tanks to the pumps, the pumps to the chamber head, and the steam generator to the turbine." },
        ],
      },
    ],
    techData: [
      { label: "Section length", value: "4.401 m, fins included", basis: DOC },
      { label: "Turbopump drive", value: "Steam from hydrogen peroxide (T-Stoff) with a permanganate catalyst (Z-Stoff)", basis: DOC },
      { label: "Taper and base diameter", value: "Approximated from photographs", basis: MODEL },
      { label: "Access doors", value: "Representative placement", basis: MODEL },
      { label: "Interior shown", value: "Representative arrangement of the documented equipment", basis: MODEL },
    ],
    details: [
      {
        title: "Pumping instead of pressurising",
        body: "Smaller rockets push propellant out of their tanks with gas pressure, which needs heavy, thick-walled tanks. The V-2 instead used a turbine-driven pump, letting the large tanks be thin and light. The turbine was spun by steam made from hydrogen peroxide — an arrangement whose descendants still feed most large liquid-rocket engines.",
      },
      {
        title: "A tapered tail",
        body: "Narrowing the tail towards the base reduces drag and leaves room for the fins to sit well aft, where their stabilising effect is greatest, without making the fins themselves impractically large.",
      },
    ],
    inspectionNotes: [
      "The thrust ring is the dark band at the base; the base plate and nozzle opening are visible from low angles.",
      "The Internal view shows the turbopump above the engine, with the steam generator, peroxide tanks and air bottles around it.",
      "In the Sections view the tail lifts clear of the engine to show it.",
    ],
    camera: { direction: [0.14, 0.2, 1], distanceFactor: 2.2 },
  },
  {
    id: "fins",
    slug: "fins",
    prefix: "FN",
    name: "Stabilising Fins",
    shortName: "Fins",
    designation: "SEC-06 / FN",
    classification: "Aerodynamic stabilisers — four fins",
    summary: "Four large fins that kept the rocket pointing into the airflow.",
    description:
      "Four fins, numbered I to IV, spread the rocket's tail to a span of about 3.56 m. In the lower atmosphere they kept the rocket stable, like the feathers of an arrow; higher up, where the air was too thin for them to work, steering was left to the jet vanes in the exhaust. Before launch the fuelled rocket stood on the bearing surfaces at the bottom of its fins.",
    mechanicalFunction: "Provide aerodynamic stability and carry the air rudders; support the rocket on its firing table.",
    role: "Passive stabilisers at the tail; their bearing surfaces are the rocket's feet on the firing table.",
    functionBasis: DOC,
    interfaces: [
      { componentId: "tail", relation: "Attached along the tapered tail shell" },
      { componentId: "control", relation: "Air rudders at the fin tips" },
      { componentId: "launch", relation: "Bearing surfaces rest on the table supports" },
    ],
    flows: [
      { kind: "load", direction: "out", peer: "Tail section", note: "Stabilising aerodynamic forces" },
      { kind: "load", direction: "in", peer: "Firing table", note: "Weight of the fuelled rocket before launch" },
    ],
    subassemblies: [
      {
        id: "fn-panels",
        code: "FN-100",
        name: "Fin Panels",
        layer: "armor",
        description: "The four fins. Planform approximated from photographs; span as published.",
        children: [
          { id: "fn-1", code: "FN-110", name: "Fin I", layer: "armor", description: "Fin at the front right in the default view." },
          { id: "fn-2", code: "FN-120", name: "Fin II", layer: "armor", description: "Fin at the right." },
          { id: "fn-3", code: "FN-130", name: "Fin III", layer: "armor", description: "Fin at the back." },
          { id: "fn-4", code: "FN-140", name: "Fin IV", layer: "armor", description: "Fin at the left." },
        ],
      },
      { id: "fn-fairings", code: "FN-200", name: "Root Fairings", layer: "armor", description: "Thickened roots where the fins meet the tail. Representative." },
      { id: "fn-shoes", code: "FN-300", name: "Bearing Shoes", layer: "frame", description: "Bearing surfaces the rocket stood on. Shape representative." },
    ],
    techData: [
      { label: "Number", value: "Four, numbered I–IV", basis: DOC },
      { label: "Span", value: "About 3.56 m across the fins", basis: DOC },
      { label: "Launch support", value: "Rocket stood on the bearing surfaces of its fins", basis: DOC },
      { label: "Planform and thickness", value: "Approximated from photographs", basis: MODEL },
      { label: "Paint", value: "Alternating light and dark, after the test rockets", basis: MODEL },
    ],
    details: [
      {
        title: "Weathercock stability",
        body: "A rocket is aerodynamically stable when the centre of pressure — the point where the combined air forces act — lies behind the centre of gravity. Large fins at the very tail move the centre of pressure aft, so any disturbance that turns the nose creates a force that turns it back, like a weathervane.",
      },
      {
        title: "When fins stop working",
        body: "Fins only work where there is air. Above the dense lower atmosphere they lost their effect, and once the engine stopped the rocket could tumble, regaining a nose-first attitude only as it fell back into denser air. Active steering in the exhaust filled that gap during powered flight.",
      },
      {
        title: "Wind tunnels",
        body: "The fin shape was refined with supersonic wind-tunnel testing at Peenemünde, among the first such work on a full rocket configuration. The Smithsonian holds a later 1:48-scale wind-tunnel model of the V-2.",
      },
    ],
    inspectionNotes: [
      "Fins II and IV are seen side-on from this angle; fin I points towards the camera.",
      "In the Sections view the fins move outward from the tail with their rudders.",
    ],
    camera: { direction: [0.95, 0.32, 1], distanceFactor: 2.1 },
  },
  {
    id: "control",
    slug: "control-vanes",
    prefix: "CV",
    name: "Control Vanes",
    shortName: "Control Vanes",
    designation: "SEC-07 / CV",
    classification: "Steering — air rudders and jet vanes",
    summary: "Air rudders on the fin tips and graphite jet vanes in the exhaust.",
    description:
      "The V-2 steered in two ways at once. Four small air rudders at the fin tips worked like the rudder of an aircraft, but only where the air was dense. Four graphite vanes sat in the engine's exhaust itself and deflected the jet, so they could steer even at lift-off — when the rocket was too slow for its fins to matter — and in the thin upper air. Both sets were moved by servomotors commanded from the instrument compartment.",
    mechanicalFunction: "Turn the rocket in pitch, yaw and roll on command from the guidance system.",
    role: "The rocket's steering effectors, at the tail where they have the most leverage.",
    functionBasis: DOC,
    interfaces: [
      { componentId: "fins", relation: "Air rudders hinged at the fin tips" },
      { componentId: "tail", relation: "Jet vanes mounted on the thrust ring" },
      { componentId: "instrument", relation: "Steering commands" },
      { componentId: "engine", relation: "Jet vanes sit in the exhaust below the nozzle exit" },
    ],
    flows: [
      { kind: "control", direction: "in", peer: "Instrument compartment", note: "Steering commands to the servomotors" },
      { kind: "propellant", direction: "in", peer: "Engine exhaust", note: "Jet vanes deflect the exhaust stream" },
      { kind: "power", direction: "in", peer: "Instrument compartment", note: "Supply for the servomotors" },
    ],
    subassemblies: [
      { id: "cv-rudders", code: "CV-100", name: "Air Rudders", layer: "armor", description: "Four movable surfaces at the trailing edge of the fin tips. Shape representative." },
      { id: "cv-hinges", code: "CV-200", name: "Rudder Hinges", layer: "armor", description: "Hinge line across the top of each rudder." },
      { id: "cv-jet", code: "CV-300", name: "Jet Vanes", layer: "frame", description: "Four graphite vanes in the exhaust, in line with the fins." },
      { id: "cv-mounts", code: "CV-400", name: "Vane Mounts", layer: "frame", description: "Bearing housings and shafts on the thrust ring. Representative." },
      { id: "cv-servos", code: "CV-500", name: "Jet-Vane Servomotors", layer: "internal", description: "Servomotors inside the tail that moved the jet vanes, with their linkages. Shape representative." },
    ],
    techData: [
      { label: "Air rudders", value: "Four, at the fin tips", basis: DOC },
      { label: "Jet vanes", value: "Four, graphite, in the exhaust stream", basis: DOC },
      { label: "Actuation", value: "Servomotors commanded by the guidance system", basis: DOC },
      { label: "Vane and rudder shapes", value: "Representative", basis: MODEL },
    ],
    details: [
      {
        title: "Thrust vector control",
        body: "Deflecting the exhaust turns the rocket even when it is barely moving, because the steering force comes from the engine's own thrust rather than from airflow. Jet vanes were an early form of thrust vector control; later rockets gimbal the whole engine or its nozzle instead, avoiding the thrust lost to vanes in the jet.",
      },
      {
        title: "Why graphite",
        body: "The vanes sat in exhaust at well over 2,000 °C. Graphite survives such temperatures for the minute or so of powered flight, slowly eroding as it does. It is also brittle, and uneven heating could crack a vane — one of the reliability problems of the design.",
      },
      {
        title: "Two systems, one command",
        body: "The jet vanes did most of the steering at low speed and in thin air, the rudders added authority in the dense lower atmosphere, and both answered the same commands, so the rocket could be controlled across its whole climb.",
      },
    ],
    inspectionNotes: [
      "The jet vanes hang below the tail between the fins; lower the camera to see them.",
      "In the Sections view the vanes stand off the nozzle exit and the rudders move outward from the fins.",
    ],
    camera: { direction: [0.95, 0.14, 1], distanceFactor: 2.3 },
  },
  {
    id: "engine",
    slug: "engine",
    prefix: "EN",
    name: "Rocket Engine",
    shortName: "Engine",
    designation: "SEC-08 / EN",
    classification: "Propulsion — liquid-propellant engine",
    summary: "Combustion chamber with eighteen burner cups and a conical nozzle.",
    description:
      "The engine burned the ethanol–water fuel with liquid oxygen in a large, bulbous combustion chamber fed through eighteen burner cups on its head, then accelerated the exhaust through a nozzle. Fuel flowing around the chamber wall before it burned kept the metal from melting. It produced about 25 tonnes of thrust at lift-off and ran for about a minute. Shown inside the tail in the Internal view, or on its own when the Sections view lifts the airframe off it.",
    mechanicalFunction: "Burns the propellants and expands the hot gas through a nozzle to produce thrust.",
    role: "Main propulsion, mounted in the tail; its exhaust also carries the steering forces of the jet vanes.",
    functionBasis: DOC,
    interfaces: [
      { componentId: "tail", relation: "Engine mount and thrust ring" },
      { componentId: "control", relation: "Exhaust flows past the jet vanes" },
      { componentId: "instrument", relation: "Cut-off command" },
    ],
    flows: [
      { kind: "propellant", direction: "in", peer: "Turbopump", note: "Fuel and liquid oxygen" },
      { kind: "propellant", direction: "out", peer: "Jet vanes", note: "Exhaust stream" },
      { kind: "control", direction: "in", peer: "Instrument compartment", note: "Cut-off ends powered flight" },
      { kind: "load", direction: "out", peer: "Tail section", note: "Thrust" },
    ],
    subassemblies: [
      { id: "en-nozzle", code: "EN-100", name: "Nozzle", layer: "internal", description: "Expands and accelerates the exhaust; the exit sits in the base of the tail." },
      { id: "en-chamber", code: "EN-200", name: "Combustion Chamber", layer: "internal", description: "Bulbous chamber where the propellants burn, cooled by fuel flowing around its wall." },
      { id: "en-heads", code: "EN-300", name: "Burner Cups", layer: "internal", description: "Eighteen cups on the chamber head that mixed the propellants; feed lines shown simplified." },
    ],
    techData: [
      { label: "Thrust", value: "About 25 tonnes-force at lift-off", basis: DOC },
      { label: "Burn time", value: "About one minute", basis: DOC },
      { label: "Cooling", value: "Regenerative and film cooling with the fuel", basis: DOC },
      { label: "Burner cups", value: "Eighteen, on the chamber head", basis: DOC },
      { label: "Silhouette", value: "Approximated from museum examples", basis: MODEL },
    ],
    details: [
      {
        title: "How a nozzle makes thrust",
        body: "Burning propellants produce hot, high-pressure gas. The nozzle first squeezes it through a narrow throat, where it reaches the speed of sound, then lets it expand through a widening cone that accelerates it further. Throwing that mass of gas backwards at high speed pushes the rocket forwards — Newton's third law.",
      },
      {
        title: "Keeping the chamber intact",
        body: "Combustion gas is far hotter than the melting point of steel. Running the fuel through a jacket around the chamber before burning it (regenerative cooling), and letting a thin film of fuel flow along the inner wall (film cooling), carried enough heat away for the engine to survive its burn.",
      },
      {
        title: "A scaled-up design",
        body: "Rather than one large injector, the engine combined eighteen proven smaller burner cups on one chamber — a pragmatic way to scale up a working design quickly. Later engines replaced the cups with flat injector plates.",
      },
    ],
    inspectionNotes: [
      "The engine is inside the tail: selecting it opens the Internal view, and the Sections view lifts the tail off it.",
      "The nozzle exit is the opening in the tail's base plate.",
    ],
    camera: { direction: [0.12, 0.24, 1], distanceFactor: 2.9 },
  },
  {
    id: "launch",
    slug: "firing-table",
    prefix: "FT",
    name: "Firing Table",
    shortName: "Firing Table",
    designation: "GSE-09 / FT",
    classification: "Ground equipment — Brennstand",
    summary: "Portable launch stand the rocket stood on, with a blast deflector beneath the nozzle.",
    description:
      "The V-2 was launched vertically from a small, portable firing table rather than a fixed pad. A transporter-erector raised the rocket onto the table, where it stood on the bearing surfaces of its fins; a deflector underneath turned the exhaust aside. Because launch crews could set up in a forest clearing or on a road and leave soon after firing, launch sites were very hard to find and attack.",
    mechanicalFunction: "Supports the fuelled rocket upright for launch and deflects the exhaust at ignition.",
    role: "Ground support equipment; not part of the rocket.",
    functionBasis: DOC,
    interfaces: [
      { componentId: "fins", relation: "Supports under the fin bearing surfaces" },
      { componentId: "engine", relation: "Blast deflector beneath the nozzle" },
    ],
    flows: [{ kind: "load", direction: "out", peer: "Fins", note: "Carries the rocket's weight until lift-off" }],
    subassemblies: [
      { id: "ft-ring", code: "FT-100", name: "Support Ring", layer: "frame", description: "Load ring around the rocket's base." },
      { id: "ft-supports", code: "FT-200", name: "Fin Supports", layer: "frame", description: "Pads under each fin's bearing surface." },
      { id: "ft-legs", code: "FT-300", name: "Legs & Levelling Jacks", layer: "frame", description: "Four legs with jacks to level the table." },
      { id: "ft-deflector", code: "FT-400", name: "Blast Deflector", layer: "frame", description: "Cone beneath the nozzle that turned the exhaust aside." },
    ],
    techData: [
      { label: "Launch mode", value: "Vertical, from a portable table", basis: DOC },
      { label: "Support", value: "On the bearing surfaces of the fins", basis: DOC },
      { label: "Colour", value: "Dark yellow, after the Smithsonian's restored stand", basis: DOC },
      { label: "Proportions", value: "Approximated", basis: MODEL },
    ],
    details: [
      {
        title: "Mobile launch",
        body: "A fixed launch site can be found and bombed. Mobile batteries with road vehicles, a transporter-erector (the Meillerwagen) and a portable table could fire and move on. Road-mobile launch has remained a defining feature of ballistic missiles ever since.",
      },
      {
        title: "Lift-off",
        body: "The rocket rose vertically, slowly at first, before the guidance system tilted it over onto its trajectory. At that low speed the fins had almost no airflow to work with, which is why steering in the exhaust was essential.",
      },
    ],
    inspectionNotes: [
      "The table stays in place in the Sections view; the airframe lifts off it.",
      "Fin supports line up under the bearing shoes at the bottom of each fin.",
    ],
    camera: { direction: [0.9, 0.42, 1], distanceFactor: 2.1 },
  },
];
