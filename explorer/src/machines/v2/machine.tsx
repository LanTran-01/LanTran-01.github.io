import type { MachineConfig } from "@/data/types";
import { MODEL_HEIGHT } from "./model";

/** Presentation of the V-2 (A-4) exhibit, in its Bumper-WAC configuration, in the shared explorer. */
export const MACHINE: MachineConfig = {
  id: "v2",
  storagePrefix: "v2",
  terms: { part: "section", parts: "sections", partsShort: "SEC", whole: "missile" },
  brand: {
    glyph: "A4",
    wordmark: "V-2 AEROSPACE EXHIBIT",
    wordmarkShort: "V-2 EXHIBIT",
    label: "V-2 Aerospace Exhibit — full missile overview",
  },
  badge: {
    text: "HISTORICAL STUDY",
    short: "STUDY",
    title: "Procedural study of a historical missile's external form — not a measured replica",
  },
  designation: "A-4 / V-2",
  viewerLabel: "Interactive 3D model of the Bumper-WAC: a V-2 (A-4) rocket carrying a WAC Corporal upper stage, standing on its firing table",
  identity: {
    designation: "A-4 · BUMPER-WAC",
    name: "V-2",
    source: "V-2 booster with a WAC Corporal upper stage",
    rows: [
      { label: "Origin", value: "Peenemünde, Germany", basis: "reference" },
      { label: "Bumper", value: "8 flights, 1948–1950", basis: "reference" },
      { label: "V-2 length", value: "14.0 m · ⌀ 1.65 m", basis: "reference" },
      { label: "Stack", value: "≈ 17–19 m", basis: "reference" },
      { label: "Record", value: "≈ 400 km, Feb 1949", basis: "reference" },
    ],
    internals: "Representative",
    internalsNote: "(documented equipment, representative arrangement)",
    disclosure:
      "Procedural study from published dimensions and museum photographs — not a measured replica. The upper stage is drawn about twice its true width; details and the interior arrangement are approximate; the roll pattern is representative.",
    modelTag: "STUDY",
  },
  indexTitle: "External architecture",
  overview: { kicker: "A-4 · Bumper-WAC", title: "V-2 — select a section" },
  modes: {
    scope: "machine",
    list: [
      { id: "exterior", label: "Exterior", key: "1", hint: "Assembled on its firing table, as museums display it" },
      { id: "cutaway", label: "Internal", key: "2", hint: "Skin cleared to show the equipment, tanks and engine inside" },
      { id: "exploded", label: "Sections", key: "3", hint: "Stages and sections separated at their joints, engine revealed" },
    ],
  },
  layers: {
    armor: { short: "SKIN", long: "Skin" },
    frame: { short: "EXT", long: "External fitting" },
    internal: { short: "INT", long: "Internal" },
  },
  basis: {
    reference: {
      short: "DOC",
      title: "Documented — published by museums, archives or reference works",
      legend: "historically documented",
      label: "Documented",
      about: (
        <>
          <strong>Documented.</strong> Published by a museum, archive or reference work — for example the overall
          dimensions, the propellants or the dates of first flight. The sources are listed in the Exhibit panel.
        </>
      ),
    },
    conceptual: {
      short: "MODEL",
      title: "Model choice — approximated or representative in this visualization",
      legend: "approximated in this model",
      label: "Model choice",
      about: (
        <>
          <strong>Model choice.</strong> Approximated or representative in this visualization, such as the exact fin
          planform, hatch placement, the layout of the roll pattern or the arrangement of the equipment inside.
        </>
      ),
    },
  },
  statusTag: "HISTORICAL STUDY",
  proceduralLabel: "PROCEDURAL STUDY",
  systems: {
    subtitle:
      "Functional overview at the level of a museum cutaway — how propellants, guidance and loads connect the V-2's sections and its upper stage.",
    note: "Documented subsystems — no design data implied.",
  },
  flowsNote: "relationships as documented",
  about: {
    label: "About · V-2 Aerospace Exhibit",
    title: "A historical aerospace exhibit",
    lede: "An interactive museum exhibit of the V-2 (A-4) — the first long-range guided ballistic missile and the first human-made object to reach space — shown as the Bumper-WAC, carrying a WAC Corporal upper stage. Explore its sections, look inside, separate the stages, and read the history and engineering behind each part.",
    sections: [
      {
        title: "What you are looking at",
        body: (
          <>
            <p>
              The rocket is a <strong>procedural study</strong> built from geometric primitives, shown in its{" "}
              <strong>Bumper-WAC</strong> configuration (1948–1950): a V-2 booster carrying a WAC Corporal upper stage
              in its modified nose. The V-2's dimensions and section lengths follow published figures; the shapes in
              between are <strong>approximated from photographs</strong>. The upper stage is{" "}
              <strong>drawn enlarged</strong> — about twice its true width — so it reads clearly beside the V-2; the
              real WAC Corporal was 0.30 m wide. It is not a measured replica.
            </p>
            <p>
              It stands on its firing table, painted in a representative version of the black-and-white roll pattern of
              the Peenemünde test rockets. The <strong>interior</strong> shows equipment that is documented — gyroscopes,
              analog computer, batteries, radio, tanks, turbopump, steam generator — in a representative arrangement.
            </p>
          </>
        ),
      },
      { title: "Data labels", kind: "basis" },
      {
        title: "Views",
        body: (
          <p>
            <strong>Exterior</strong> shows the assembled rocket. <strong>Internal</strong> clears the skin to show the
            equipment inside, with the tanks opened like a museum cutaway. <strong>Sections</strong> separates the
            airframe at its bolted joints, slides the upper stage out of the nose, lifts the V-2 off its engine and
            moves the fins and vanes outward. The view applies to the whole rocket, so you can select sections in any
            of them.
          </p>
        ),
      },
      { title: "Controls", kind: "controls" },
      {
        title: "Context",
        body: (
          <p>
            This exhibit presents the V-2 as a milestone of aerospace engineering history. It was built as a weapon of
            terror, mass-produced by concentration-camp prisoners under lethal conditions, and fired at cities. The
            Exhibit panel records that history alongside the engineering, as museums that display the V-2 do.
          </p>
        ),
      },
    ],
  },
  exhibit: {
    title: "Exhibit",
    lede: "The V-2 — Aggregat 4 to its engineers — was the first long-range guided ballistic missile and, on 20 June 1944, the first human-made object to reach space. Built as a weapon by forced labour, after the war it became the starting point of rocketry and spaceflight. Here it carries a WAC Corporal, as in the Bumper program of 1948–1950: an early two-stage liquid-propellant rocket.",
    groups: [
      {
        title: "Overview",
        notes: [
          {
            title: "Historical background",
            body: "The A-4 was developed by the German Army at the Peenemünde Army Research Center on the Baltic coast, with Wernher von Braun as technical director under Walter Dornberger. It grew out of a series of experimental 'Aggregat' rockets from the 1930s. After earlier failures, the first successful flight on 3 October 1942 reached about 85 km.",
          },
          {
            title: "Wartime use",
            body: "Renamed V-2 by Nazi propaganda in 1944 — from Vergeltungswaffe, 'retaliation weapon' — it was fired from September 1944 at Paris, London, Antwerp and other cities until late March 1945. It fell faster than the speed of sound, so it arrived without warning and could not be intercepted. Attacks killed an estimated 9,000 people.",
          },
          {
            title: "Built by forced labour",
            body: "The V-2 was mass-produced in the Mittelwerk, an underground factory in the Kohnstein, by prisoners of the Mittelbau-Dora concentration camp. An estimated 12,000 forced labourers and prisoners died in its production — more people than its attacks killed.",
          },
          {
            title: "Significance",
            body: "The V-2 was the first long-range guided ballistic missile. On 20 June 1944 a vertically launched test rocket, MW 18014, became the first human-made object to cross the 100 km boundary of space. Its pump-fed liquid-propellant engine, gyroscopic guidance and steering in the exhaust set the pattern for the large rockets that followed.",
          },
          {
            title: "After the war",
            body: "The Allies took V-2 hardware and engineers. At White Sands, New Mexico, US teams fired captured V-2s from 16 April 1946: one returned the first photographs of Earth from space on 24 October 1946, and others carried the first instruments and animals to the edge of space. The Soviet R-1, a copy, first flew in 1948, and the American Redstone, which launched the first US astronauts, descends directly from the V-2.",
          },
          {
            title: "Bumper-WAC",
            body: "In the Bumper program, part of the US Army's Hermes project, General Electric, Caltech's Jet Propulsion Laboratory and Douglas mounted a WAC Corporal sounding rocket in the nose of a V-2 to study two-stage rockets and starting an engine in flight. Eight flew between May 1948 and July 1950. Bumper 5 reached nearly 400 km on 24 February 1949, a record for any human-made object; Bumper 8 was the first rocket launched from Cape Canaveral, on 24 July 1950, and Bumper 7's upper stage reached about Mach 9 a few days later.",
          },
          {
            title: "Classification",
            body: "The V-2 is a single-stage, liquid-propellant, guided ballistic missile: powered and steered for about the first minute of flight, then coasting on an unpowered, largely ballistic arc, launched vertically from a portable firing table. As the Bumper-WAC it became the first stage of a two-stage research rocket.",
          },
        ],
      },
      {
        title: "Engineering context",
        notes: [
          {
            title: "Aerodynamic stability",
            body: "A rocket flies nose-first when its centre of pressure lies behind its centre of gravity. The V-2 achieved this with four large fins at the tail and its heavy equipment forward. The shape was refined in a supersonic wind tunnel at Peenemünde — early work on a problem every rocket designer still checks first.",
          },
          {
            title: "Guidance and control",
            body: "Gyroscopes sensed deviations from the programmed attitude, an analog computer turned them into commands, and servomotors moved graphite vanes in the exhaust and rudders on the fins. Steering by deflecting the exhaust worked from lift-off, when the fins were useless; an integrating accelerometer ended powered flight at the planned speed.",
          },
          {
            title: "Propulsion",
            body: "The engine burned an ethanol–water mixture with liquid oxygen. A turbine, driven by steam made from hydrogen peroxide, pumped the propellants into a chamber fed by eighteen burner cups, and fuel flowing around the chamber wall kept it from melting. Pump-fed engines with propellant cooling remain the basis of large liquid rockets.",
          },
          {
            title: "Materials and manufacture",
            body: "A thin sheet-metal airframe built as four bolted sections, aluminium–magnesium alloy tanks packed in glass wool, a steel engine and graphite jet vanes. Building the rocket in sections let them be made separately and joined, transported and serviced in the field.",
          },
          {
            title: "Design considerations",
            body: "Liquid oxygen boils away, so the rocket was fuelled shortly before launch. Launch from a portable table made batteries mobile and hard to find. Early production rockets often broke up as they fell back through the lower atmosphere; strengthening the forward structure reduced the problem — an early lesson in the loads and heating of re-entry.",
          },
          {
            title: "Staging",
            body: "Bumper's upper stage ignited while still in the V-2's nose rails; its exhaust burned through a wire that told the V-2 engine to shut down, and as the V-2 slowed, the upper stage slid free. Shedding the spent booster's mass lets the small second stage, already moving fast, reach far higher — the principle behind every multi-stage launcher since.",
          },
          {
            title: "Paint schemes",
            body: "Test rockets were painted in black-and-white patterns so observers and cameras could see them roll; the layout changed many times. Operational rockets were camouflaged, and late in the war painted plain greenish grey. The Smithsonian displayed its V-2 in a black-and-white test scheme from 1976 and has since repainted it greenish grey. This exhibit uses a representative test pattern.",
          },
        ],
      },
    ],
    sources: [
      {
        label: "Smithsonian NASM — Restoring the Museum's V-2",
        href: "https://airandspace.si.edu/stories/editorial/restoring-museums-v-2-missile",
        note: "provenance, paint schemes, launch stand colour",
      },
      {
        label: "Smithsonian NASM — V-2 (A-4) collection record",
        href: "https://www.si.edu/object/missile-surface-surface-v-2-4:nasm_A19600342000",
        note: "sections, instrument compartment quadrants",
      },
      {
        label: "Smithsonian NASM — V-2 combustion chamber",
        href: "https://www.si.edu/object/rocket-engine-combustion-chamber-v-2:nasm_A19601992000",
        note: "eighteen injectors on the chamber head",
      },
      {
        label: "White Sands Missile Range Museum — The V-2 program",
        href: "https://wsmrmuseum.com/2020/10/06/the-v-2-program-operation-backfire-to-the-hermes-project/3/",
        note: "dimensions, fins, launch support, instrument warheads",
      },
      {
        label: "V2Rocket.com — Markings, colours and camouflage",
        href: "https://www.v2rocket.com/start/makeup/markings.html",
        note: "roll pattern and camouflage schemes",
      },
      {
        label: "German explosive ordnance — rockets, part 6",
        href: "https://ww2data.blogspot.com/2019/12/german-explosive-ordnance-rockets-part-6.html",
        note: "section lengths, transcribed from a German handbook",
      },
      {
        label: "Wikipedia — V-2 rocket",
        href: "https://en.wikipedia.org/wiki/V-2_rocket",
        note: "chronology, propellants, materials, production",
      },
      {
        label: "Wikipedia — V-2 sounding rocket",
        href: "https://en.wikipedia.org/wiki/V-2_sounding_rocket",
        note: "US research flights from 1946",
      },
      {
        label: "Wikipedia — RTV-G-4 Bumper",
        href: "https://en.wikipedia.org/wiki/RTV-G-4_Bumper",
        note: "Bumper program, height, Bumper 5, 7 and 8",
      },
      {
        label: "Designation-Systems.net — RTV-G-4 Bumper",
        href: "https://designation-systems.net/dusrm/app1/rtv-g-4.html",
        note: "nose modification, four fins in rails, spin rockets, staging",
      },
      {
        label: "Wikipedia — WAC Corporal",
        href: "https://en.wikipedia.org/wiki/WAC_Corporal",
        note: "developer, first flight, propellants, diameter",
      },
      {
        label: "V2 Rocket History — graphite jet vane",
        href: "https://v2rockethistory.com/?p=476",
        note: "jet vane material and operating conditions",
      },
    ],
  },
  stage: {
    azimuth: 30,
    elevation: 8,
    defaultBounds: [
      [-0.7, 0, -0.7],
      [0.7, MODEL_HEIGHT, 0.7],
    ],
    targetBoundary: [
      [-3, 0.2, -3],
      [3, 9.6, 3],
    ],
    ringRadius: 1.0,
    ruler: MODEL_HEIGHT,
  },
};
