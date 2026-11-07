import type { MachineConfig } from "@/data/types";
import { MODEL_HEIGHT } from "./model";

/** Presentation of the Derby exhibit in the shared explorer. */
export const MACHINE: MachineConfig = {
  id: "derby",
  storagePrefix: "derby",
  terms: { part: "section", parts: "sections", partsShort: "SEC", whole: "missile" },
  brand: {
    glyph: "DB",
    wordmark: "DERBY AEROSPACE EXHIBIT",
    wordmarkShort: "DERBY",
    label: "Derby Aerospace Exhibit — full missile overview",
  },
  badge: {
    text: "EXTERIOR STUDY",
    short: "STUDY",
    title: "Procedural study of the missile's external form — not a measured replica or manufacturer model",
  },
  designation: "RAFAEL DERBY",
  viewerLabel: "Interactive 3D model of the Rafael Derby air-to-air missile, standing upright",
  identity: {
    designation: "RAFAEL · BVR AAM",
    name: "DERBY",
    source: "Active radar-guided air-to-air missile · Israel",
    rows: [
      { label: "Maker", value: "Rafael, Israel", basis: "reference" },
      { label: "Service", value: "From 1998", basis: "reference" },
      { label: "Class", value: "BVR, active radar", basis: "reference" },
      { label: "Length", value: "3.62 m · ⌀ 0.16 m", basis: "reference" },
      { label: "Span", value: "0.64 m · 118 kg", basis: "reference" },
    ],
    internals: "Not shown",
    internalsNote: "(exterior study)",
    disclosure:
      "Procedural study of the external form from published dimensions and public photographs — not a measured replica or manufacturer model. Planforms, panels and the display band are approximated or representative; no manufacturer markings are reproduced.",
    modelTag: "STUDY",
  },
  indexTitle: "External architecture",
  overview: { kicker: "Rafael · BVR air-to-air", title: "Derby — select a section" },
  modes: {
    scope: "machine",
    list: [
      { id: "exterior", label: "Exterior", key: "1", hint: "Assembled, standing upright" },
      { id: "exploded", label: "Sections", key: "2", hint: "Airframe separated upward at the section joints" },
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
      title: "Documented — published by the manufacturer, reference works or the trade press",
      legend: "publicly documented",
      label: "Documented",
      about: (
        <>
          <strong>Documented.</strong> Published by the manufacturer, reference works or the aviation press — for
          example the dimensions, the active radar seeker or the year it entered service. The sources are listed in
          the Exhibit panel.
        </>
      ),
    },
    conceptual: {
      short: "MODEL",
      title: "Model choice or general practice — approximated, representative, or not Derby-specific",
      legend: "approximated or general",
      label: "Model choice",
      about: (
        <>
          <strong>Model choice.</strong> Approximated or representative in this visualization — such as the
          planforms, panel and hanger details or the display band — or general aerospace practice rather than
          Derby-specific data.
        </>
      ),
    },
  },
  statusTag: "EXTERIOR STUDY",
  proceduralLabel: "PROCEDURAL STUDY",
  systems: {
    subtitle:
      "Textbook-level functional overview of a radar-guided air-to-air missile of this type — how sensing, avionics, control, propulsion and the airframe relate.",
    note: "General overview — no design data implied.",
  },
  flowsNote: "relationships general unless documented",
  about: {
    label: "About · Derby Aerospace Exhibit",
    title: "A modern aerospace exhibit",
    lede: "An interactive exhibit of the Rafael Derby, a beyond-visual-range air-to-air missile with an active radar seeker. Explore its external sections, separate the airframe along its axis, and read the aerodynamics, avionics and history behind it.",
    sections: [
      {
        title: "What you are looking at",
        body: (
          <>
            <p>
              The missile is a <strong>procedural study</strong> built from geometric primitives. Its length (3.62 m),
              diameter (0.16 m) and span (0.64 m) follow published figures; its radome shape, section joints, canard
              and wing planforms are <strong>approximated from public photographs</strong>, and hangers, panels and the
              blue display band are representative. It is not a measured replica or a manufacturer model.
            </p>
            <p>It stands upright on its tail, nose up. Only the exterior is modelled.</p>
          </>
        ),
      },
      { title: "Data labels", kind: "basis" },
      {
        title: "Views",
        body: (
          <p>
            <strong>Exterior</strong> shows the assembled missile. <strong>Sections</strong> lifts the airframe apart
            at the section joints — aft body, centre body, forward body, radome — and moves the canards and wings off
            their sections. The view applies to the whole missile, so you can select sections in either.
          </p>
        ),
      },
      { title: "Controls", kind: "controls" },
      {
        title: "Scope",
        body: (
          <p>
            This exhibit covers the missile's external form and encyclopedia-level facts about its history and the
            engineering disciplines behind it. It does not describe internal construction, warhead, fuzing, guidance
            methods or operational use.
          </p>
        ),
      },
      {
        title: "Trademarks",
        fine: true,
        body: (
          <>
            Derby, I-Derby, Python and SPYDER are names of Rafael Advanced Defense Systems Ltd. This is an independent,
            non-commercial educational study; it is not affiliated with or endorsed by Rafael, and no manufacturer
            markings are reproduced.
          </>
        ),
      },
    ],
  },
  exhibit: {
    title: "Exhibit",
    lede: "The Derby is a medium-range, beyond-visual-range air-to-air missile from Rafael Advanced Defense Systems of Israel. In service since 1998, it pairs an active radar seeker with an airframe derived from the agile Python short-range missiles, and its extended-range successor, the I-Derby ER, keeps the same shape and size.",
    groups: [
      {
        title: "Overview",
        notes: [
          {
            title: "Development background",
            body: "Rafael began developing the Derby in the early 1980s; it was introduced in the mid-1990s and entered service in 1998. It is described as an enlarged version of Rafael's Python-4 short-range missile with an active radar seeker in place of the infrared one — taking a proven, agile airframe into the beyond-visual-range class.",
          },
          {
            title: "Classification",
            body: "A medium-range, beyond-visual-range (BVR) air-to-air missile with active radar homing. BVR missiles engage targets too far away to see, relying on radar rather than an infrared seeker; an active radar seeker lets the missile home independently once its own radar takes over.",
          },
          {
            title: "Family and derivatives",
            body: "The Derby shares its general layout with the Python-5, and Rafael's SPYDER ground-based air defence system fires surface-launched versions of both. The I-Derby ER, whose existence Rafael confirmed in 2015, is identical in shape and size but adds a dual-pulse rocket motor; its quoted range is about 100 km, against about 50 km for the original.",
          },
          {
            title: "Operators and platforms",
            body: "The Derby has been exported to air forces including those of Brazil, Chile, Colombia and Ecuador, and integrated on aircraft such as the F-16, F-5, Kfir and Sea Harrier. India selected the I-Derby ER for its Tejas light combat aircraft in 2018 and test-fired it from a Tejas in 2021.",
          },
          {
            title: "Significance",
            body: "The Derby carried the Python family's canard-controlled airframe into the medium-range, radar-guided class, giving a light (118 kg) missile the fire-and-forget capability of active radar homing. With the I-Derby ER it shows how an established airframe can be extended by new seekers and propulsion rather than redesigned.",
          },
        ],
      },
      {
        title: "Technology & context",
        notes: [
          {
            title: "Aerodynamics: canards and tail wings",
            body: "Surfaces ahead of the centre of gravity turn the nose directly, so canard-controlled missiles respond quickly; large wings at the tail move the centre of pressure aft and keep the missile stable. The balance between the two sets how readily it manoeuvres.",
          },
          {
            title: "Slender bodies at high speed",
            body: "At about 23 diameters long, the Derby keeps its cross-section — and so its supersonic drag — small; its published top speed is about Mach 4. Long-chord, low-span surfaces give the area needed for stability while keeping the missile compact on the aircraft.",
          },
          {
            title: "Avionics",
            body: "Avionics — aviation electronics — spans the sensors, processors, power and actuators that let an aircraft or missile sense and act. In a guided missile that means the seeker, motion sensors, a computer that blends their data, and servo actuators that move the control surfaces, all packed into a small, rugged airframe. Rafael describes the I-Derby ER's seeker as solid-state with software-defined parameters.",
          },
          {
            title: "Evolution of air-to-air missiles",
            body: "The first guided air-to-air missiles of the 1950s used infrared seekers or semi-active radar, which relied on the launching aircraft's radar until impact. Active radar seekers, carrying their own transmitter, reached service with the American AIM-120 AMRAAM in 1991, followed by others including the Russian R-77 and the Derby; ramjet-powered missiles such as the European Meteor later pushed range further. Israel's own line ran from the Shafrir of the 1960s through the Python series.",
          },
          {
            title: "Materials and manufacture",
            body: "Missile airframes are generally aluminium or titanium, with composite parts where weight and heating allow; radomes are ceramic or composite, chosen for how they pass radar energy; solid rocket motors are cast into steel or composite cases. Sections are built and tested separately and joined at bolted rings, as this exhibit's Sections view shows.",
          },
        ],
      },
    ],
    sources: [
      {
        label: "Wikipedia — Derby (missile)",
        href: "https://en.wikipedia.org/wiki/Derby_(missile)",
        note: "dimensions, weight, speed, range, Python-4 lineage, I-Derby ER, operators, SPYDER",
      },
      {
        label: "Airforce Technology — Derby",
        href: "https://www.airforce-technology.com/?p=4915",
        note: "development dates, service entry, wings and fins, aircraft",
      },
      {
        label: "Airforce Technology — I-Derby ER",
        href: "https://www.airforce-technology.com/projects/i-derby-er-air-to-air-missile/",
        note: "extended-range version, dual-pulse motor",
      },
      {
        label: "EDR Magazine — I-Derby ER milestone",
        href: "https://www.edrmagazine.eu/rafael-marks-another-milestone-in-the-development-of-the-i-derby-er-air-to-air-missile",
        note: "identical shape and size, seeker description, light weight",
      },
      {
        label: "Flight Global — Python-5",
        href: "https://www.flightglobal.com/rafael-launches-fifth-generation-python-missile/48862.article",
        note: "Python-family dual canards and rear fins",
      },
      {
        label: "Army Technology — SPYDER",
        href: "https://www.army-technology.com/projects/spyder/",
        note: "surface-launched Python-5 and Derby",
      },
    ],
  },
  stage: {
    azimuth: 14,
    elevation: 8,
    defaultBounds: [
      [-0.6, 0, -0.6],
      [0.6, MODEL_HEIGHT, 0.6],
    ],
    targetBoundary: [
      [-3, 0.2, -3],
      [3, 8.5, 3],
    ],
    ringRadius: 1.0,
    ruler: MODEL_HEIGHT,
  },
};
