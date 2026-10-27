import { CylinderGeometry, SphereGeometry, type Object3D } from "three";
import { bilateral, group, warp, extrudeGeo, type Kit, type P2, type Piece } from "./primitives";

/**
 * Chest & cockpit assembly. Massive broad chest: centre cockpit hatch, inner and
 * outward-angled outer chest plates carrying louvred intakes, a protruding collar
 * "beak", navy side armor and a ribbed abdomen. Inside: an open torso cage, the
 * cockpit capsule (shell, wrap display, seat, environmental pack), the main
 * computer rack, the upper power distribution box with bus bars running down to
 * the waist power core, and the sensor harness from the neck.
 */
export function buildTorso(kit: Kit, root: Object3D) {
  const { m } = kit;
  const g = group(root, "chest");
  const P = kit.scope(g, "chest");

  /* ---------------- armor ---------------- */

  // Centre cockpit hatch.
  const hatch = kit.memo("cp.hatch", () =>
    warp(
      extrudeGeo(
        [
          [-0.17, -0.33],
          [0.17, -0.33],
          [0.195, 0.22],
          [0.0, 0.34],
          [-0.195, 0.22],
        ],
        0.12,
        "xy",
        0.014,
      ),
      (x, y, z) => [x, y, z > 0 ? z + 0.022 * (1 - Math.min(1, Math.abs(x) / 0.19)) : z],
    ),
  );
  P("cockpit_hatch", hatch, m.armorNavy, "armor", "cp-hatch", {
    pos: [0, 4.08, 0.47],
    rot: [0.15, 0, 0],
    ex: [0, 0, 0.8],
  });
  // Recessed navy centre panel behind the hatch (closes the seams around it).
  const centrePanel = kit.extrude(
    "cp.centrePanel",
    [
      [-0.21, -0.42],
      [0.21, -0.42],
      [0.24, 0.48],
      [-0.24, 0.48],
    ],
    0.06,
    "xy",
    0.01,
  );
  P("centre_panel", centrePanel, m.armorNavy, "armor", "cp-armor", {
    pos: [0, 4.08, 0.39],
    rot: [0.15, 0, 0],
    ex: [0, 0, 0.62],
  });
  // Hatch seam / handle detail.
  const hatchTrim = kit.merge("cp.hatchTrim", () => [
    { geo: kit.rbox(0.2, 0.018, 0.02, 0.004), pos: [0, -0.08, 0] },
    { geo: kit.rbox(0.05, 0.05, 0.02, 0.006), pos: [0, 0.1, 0] },
  ]);
  P("hatch_trim", hatchTrim, m.louvre, "armor", "cp-hatch", {
    pos: [0, 4.08, 0.54],
    rot: [0.15, 0, 0],
    ex: [0, 0, 0.86],
  });

  bilateral(g, "chest.side", [0, 0, 0], (s, side) => {
    const S = kit.scope(s, "chest", side);

    // Inner chest plate, facing forward.
    const inner = group(s, "inner_plate", [0.335, 4.1, 0.43], [0.15, 0.04, 0]);
    const SI = kit.scope(inner, "chest", side);
    const innerGeo = kit.extrude(
      "cp.inner",
      [
        [-0.165, -0.42],
        [0.17, -0.45],
        [0.17, 0.36],
        [-0.07, 0.5],
        [-0.165, 0.46],
      ],
      0.14,
      "xy",
      0.016,
    );
    SI("chest_plate_inner", innerGeo, m.armorWhite, "armor", "cp-armor", { ex: [0, 0, 0.48] });

    // Outer chest plate, angled outward, carrying the louvred intake.
    const outer = group(s, "outer_plate", [0.635, 4.1, 0.33], [0.15, 0.42, 0]);
    const SO = kit.scope(outer, "chest", side);
    const outerGeo = kit.extrude(
      "cp.outer",
      [
        [-0.15, -0.44],
        [0.03, -0.42],
        [0.19, -0.08],
        [0.2, 0.24],
        [0.08, 0.35],
        [-0.15, 0.38],
      ],
      0.14,
      "xy",
      0.016,
    );
    SO("chest_plate_outer", outerGeo, m.armorWhite, "armor", "cp-armor", { ex: [0, 0, 0.46] });
    const ventOutline: P2[] = [
      [-0.11, -0.04],
      [0.12, -0.07],
      [0.15, 0.22],
      [-0.1, 0.28],
    ];
    SO("intake_housing", kit.extrude("cp.ventHousing", ventOutline, 0.05, "xy", 0.01), m.armorNavy, "armor", "cp-intakes", {
      pos: [0, 0, 0.085],
      ex: [0, 0, 0.66],
    });
    const louvres = kit.merge("cp.louvres", () =>
      Array.from({ length: 5 }, (_, i) => ({
        geo: kit.rbox(0.2, 0.026, 0.03, 0.004),
        pos: [0.02 + i * 0.002, -0.0 + i * 0.054, 0] as const,
        rot: [-0.5, 0, -0.07] as const,
      })),
    );
    SO("intake_louvres", louvres, m.ochre, "armor", "cp-intakes", { pos: [0, 0, 0.115], ex: [0, 0, 0.74] });

    // Navy side armor.
    const sideGeo = kit.extrude(
      "cp.side",
      [
        [-0.4, -0.37],
        [0.34, -0.37],
        [0.42, -0.07],
        [0.38, 0.4],
        [-0.4, 0.4],
      ],
      0.12,
      "zy",
      0.016,
    );
    S("side_armor", sideGeo, m.armorNavy, "armor", "cp-armor", { pos: [0.745, 4.05, 0], ex: [0.48, 0, 0] });
  });

  // Collar / upper-chest protrusion with a forward beak.
  const collar = kit.memo("cp.collar", () =>
    warp(
      extrudeGeo(
        [
          [-0.7, -0.38],
          [0.7, -0.38],
          [0.76, 0.24],
          [0.3, 0.6],
          [0.0, 0.74],
          [-0.3, 0.6],
          [-0.76, 0.24],
        ],
        0.2,
        "xz",
        0.02,
      ),
      // extrusion runs along −Y after the plane rotation: y > 0 is the top face
      (x, y, z) =>
        y > 0 ? [x * 0.9, y - Math.max(0, z) * 0.16 + 0.03 * (1 - Math.min(1, Math.abs(x) / 0.6)), z * 0.88 - 0.02] : [x, y, z],
    ),
  );
  P("collar", collar, m.armorWhite, "armor", "cp-armor", { pos: [0, 4.66, 0], ex: [0, 0.42, 0.16] });
  const yoke = kit.extrude(
    "cp.yoke",
    [
      [-0.28, -0.26],
      [0.28, -0.26],
      [0.32, 0.08],
      [0.0, 0.24],
      [-0.32, 0.08],
    ],
    0.08,
    "xz",
    0.016,
  );
  P("neck_yoke", yoke, m.armorNavy, "armor", "cp-armor", { pos: [0, 4.78, -0.02], ex: [0, 0.54, 0.02] });

  // Back plate (backpack mounts over it).
  const back = kit.extrude(
    "cp.back",
    [
      [-0.6, -0.4],
      [0.6, -0.4],
      [0.72, 0.42],
      [-0.72, 0.42],
    ],
    0.12,
    "xy",
    0.016,
  );
  P("back_plate", back, m.armorWhite, "armor", "cp-armor", { pos: [0, 4.08, -0.44], ex: [0, 0.22, -0.4] });

  // Lower chest band and ribbed abdomen.
  const band = kit.extrude(
    "cp.band",
    [
      [-0.56, 0.07],
      [0.56, 0.07],
      [0.44, -0.07],
      [-0.44, -0.07],
    ],
    0.78,
    "xy",
    0.02,
  );
  P("lower_chest_band", band, m.armorNavy, "armor", "cp-armor", { pos: [0, 3.63, 0.01], ex: [0, -0.1, 0.32] });
  const abdomen = kit.merge("cp.abdomen", () => [
    { geo: kit.rbox(0.64, 0.1, 0.52, 0.02), pos: [0, 3.49, 0.02] },
    { geo: kit.rbox(0.58, 0.1, 0.5, 0.02), pos: [0, 3.375, 0.02] },
  ]);
  P("abdomen_plates", abdomen, m.armorNavy, "armor", "cp-armor", { ex: [0, -0.04, 0.4] });

  /* ---------------- frame ---------------- */

  const cage = kit.merge("cp.cage", () => {
    const pieces: Piece[] = [];
    for (const x of [-0.56, 0.56])
      for (const z of [-0.27, 0.25]) pieces.push({ geo: kit.rbox(0.06, 0.86, 0.06, 0.008), pos: [x, 4.08, z] });
    for (const y of [3.68, 4.5]) {
      pieces.push({ geo: kit.rbox(1.18, 0.05, 0.05, 0.008), pos: [0, y, 0.25] });
      pieces.push({ geo: kit.rbox(1.18, 0.05, 0.05, 0.008), pos: [0, y, -0.27] });
      pieces.push({ geo: kit.rbox(0.05, 0.05, 0.56, 0.008), pos: [0.56, y, -0.01] });
      pieces.push({ geo: kit.rbox(0.05, 0.05, 0.56, 0.008), pos: [-0.56, y, -0.01] });
    }
    // keel behind the cockpit
    pieces.push({ geo: kit.rbox(0.32, 0.84, 0.04, 0.008), pos: [0, 4.08, -0.335] });
    return pieces;
  });
  P("torso_cage", cage, m.frame, "frame", "cp-frame");
  const beam = kit.merge("cp.beam", () => [
    { geo: kit.rbox(1.74, 0.12, 0.12, 0.015), pos: [0, 4.46, -0.2] },
    { geo: kit.rbox(0.1, 0.36, 0.1, 0.012), pos: [0.0, 4.6, -0.12] },
  ]);
  P("shoulder_crossbeam", beam, m.frame, "frame", "cp-frame");

  /* ---------------- internals ---------------- */

  // Cockpit capsule: open-front shell, rings, wrap display, seat, env pack.
  const cx = 0;
  const cy = 4.06;
  const cz = 0.1;
  const shell = kit.memo("cp.capsule", () => {
    const s = new SphereGeometry(0.25, 28, 16, Math.PI / 2 + 1.15, Math.PI * 2 - 2.3);
    s.deleteAttribute("uv");
    return s;
  });
  P("capsule_shell", shell, m.shell, "internal", "cp-module", { pos: [cx, cy, cz], ex: [0, 0, 0.22] });
  const rings = kit.merge("cp.capsuleRings", () => [
    { geo: kit.torus(0.252, 0.012, 6, 40), rot: [Math.PI / 2, 0, 0] },
    { geo: kit.torus(0.2, 0.01, 6, 36), pos: [0, 0.15, 0], rot: [Math.PI / 2, 0, 0] },
    { geo: kit.torus(0.2, 0.01, 6, 36), pos: [0, -0.15, 0], rot: [Math.PI / 2, 0, 0] },
    { geo: kit.cyl(0.05, 0.07, 0.08, 12), pos: [0, -0.27, 0] },
  ]);
  P("capsule_frame_rings", rings, m.steel, "internal", "cp-module", { pos: [cx, cy, cz], ex: [0, 0, 0.22] });
  const display = kit.memo("cp.display", () => {
    const d = new CylinderGeometry(0.215, 0.215, 0.12, 40, 1, true, 0.95, Math.PI * 2 - 1.9);
    d.deleteAttribute("uv");
    return d;
  });
  P("wrap_display", display, m.display, "internal", "cp-display", { pos: [cx, cy + 0.07, cz], ex: [0, 0.03, 0.32] });
  const seat = kit.merge("cp.seat", () => [
    { geo: kit.rbox(0.15, 0.035, 0.14, 0.01), pos: [0, -0.11, 0.03] },
    { geo: kit.rbox(0.15, 0.2, 0.035, 0.01), pos: [0, 0.0, -0.06], rot: [-0.18, 0, 0] },
    { geo: kit.rbox(0.09, 0.06, 0.035, 0.008), pos: [0, 0.14, -0.085], rot: [-0.18, 0, 0] },
    { geo: kit.rbox(0.035, 0.05, 0.13, 0.006), pos: [0.1, -0.07, 0.04] },
    { geo: kit.rbox(0.035, 0.05, 0.13, 0.006), pos: [-0.1, -0.07, 0.04] },
    { geo: kit.cyl(0.012, 0.014, 0.05, 8), pos: [0.1, -0.025, 0.08] },
    { geo: kit.cyl(0.012, 0.014, 0.05, 8), pos: [-0.1, -0.025, 0.08] },
    { geo: kit.cyl(0.03, 0.04, 0.1, 10), pos: [0, -0.18, 0.0] },
  ]);
  P("pilot_seat", seat, m.darkSteel, "internal", "cp-seat", { pos: [cx, cy, cz], ex: [0, 0, 0.46] });
  const env = kit.merge("cp.env", () => [
    { geo: kit.rbox(0.32, 0.13, 0.12, 0.012), pos: [0, 3.82, -0.22] },
    { geo: kit.cylX(0.038, 0.28, 14), pos: [0, 3.93, -0.24] },
    ...Array.from({ length: 6 }, (_, i) => ({
      geo: kit.rbox(0.01, 0.1, 0.03, 0.002),
      pos: [-0.125 + i * 0.05, 3.82, -0.15] as const,
    })),
  ]);
  P("environmental_pack", env, m.gunmetal, "internal", "cp-env", { ex: [0, -0.08, -0.24] });

  // Main control computer rack (machine's right, −X).
  const rack = kit.merge("cp.rack", () => {
    const pieces: Piece[] = [
      { geo: kit.rbox(0.16, 0.02, 0.32, 0.004), pos: [0, 0.2, 0] },
      { geo: kit.rbox(0.16, 0.02, 0.32, 0.004), pos: [0, -0.2, 0] },
      { geo: kit.rbox(0.02, 0.42, 0.32, 0.004), pos: [-0.07, 0, 0] },
      { geo: kit.rbox(0.16, 0.42, 0.02, 0.004), pos: [0, 0, -0.15] },
    ];
    for (let i = 0; i < 6; i++) pieces.push({ geo: kit.rbox(0.13, 0.022, 0.27, 0.004), pos: [0.005, -0.16 + i * 0.064, 0.01] });
    return pieces;
  });
  P("computer_rack", rack, m.darkSteel, "internal", "cp-computer", { pos: [-0.42, 4.06, -0.08], ex: [-0.3, 0.05, -0.04] });
  const leds = kit.merge("cp.leds", () =>
    Array.from({ length: 6 }, (_, i) => ({ geo: kit.rbox(0.03, 0.008, 0.008, 0.002), pos: [0.03, -0.16 + i * 0.064, 0.15] as const })),
  );
  P("computer_status_leds", leds, m.sensor, "internal", "cp-computer", { pos: [-0.42, 4.06, -0.08], ex: [-0.3, 0.05, -0.04] });

  // Upper power distribution (machine's left, +X): breaker box + bus bars to the waist core.
  const pdu = kit.merge("cp.pdu", () => {
    const pieces: Piece[] = [{ geo: kit.rbox(0.14, 0.3, 0.26, 0.012), pos: [0, 0, 0] }];
    for (let r = 0; r < 3; r++)
      for (let c = 0; c < 3; c++)
        pieces.push({ geo: kit.rbox(0.03, 0.05, 0.05, 0.005), pos: [-0.08, -0.08 + r * 0.08, -0.07 + c * 0.07] });
    return pieces;
  });
  P("power_distribution", pdu, m.gunmetal, "internal", "cp-power", { pos: [0.42, 4.02, -0.09], ex: [0.3, 0.05, -0.04] });
  const busbars = kit.tubes(
    "cp.bus",
    [-0.06, -0.11, -0.16].map((z) => [
      [0.44, 3.87, z] as const,
      [0.4, 3.75, z] as const,
      [0.22, 3.62, z] as const,
      [0.16, 3.45, z] as const,
      [0.12, 3.21, z + 0.1] as const,
    ]),
    0.013,
    20,
  );
  P("bus_bars", busbars, m.steel, "internal", "cp-power", { ex: [0.18, -0.04, -0.04] });

  // Sensor interface harness: neck → computer, computer → display, computer → spine, shoulders.
  const harness = kit.tubes(
    "cp.sensors",
    [
      [
        [0.0, 4.66, -0.03],
        [-0.08, 4.56, -0.07],
        [-0.28, 4.4, -0.08],
        [-0.4, 4.27, -0.06],
      ],
      [
        [-0.34, 4.14, -0.02],
        [-0.2, 4.16, -0.1],
        [-0.06, 4.14, -0.17],
      ],
      [
        [-0.42, 3.86, -0.06],
        [-0.3, 3.72, -0.1],
        [-0.1, 3.58, -0.14],
        [-0.06, 3.3, -0.17],
      ],
      [
        [-0.46, 4.27, -0.12],
        [-0.62, 4.24, -0.1],
        [-0.84, 4.22, -0.08],
      ],
      [
        [-0.36, 4.27, -0.1],
        [0.0, 4.36, -0.08],
        [0.4, 4.26, -0.1],
        [0.84, 4.22, -0.08],
      ],
    ],
    0.014,
  );
  P("sensor_harness", harness, m.cable, "internal", "cp-sensors", { ex: [0, 0.1, -0.18] });
}
