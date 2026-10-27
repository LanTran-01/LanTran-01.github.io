import type { Object3D } from "three";
import { LAYOUT } from "./layout";
import { bilateral, clamp01, extrudeGeo, group, lerp, warp, type Kit, type Piece, type V3 } from "./primitives";

/** Lower-leg shell half-width at the knee and its widening factor at the ankle. */
const SHIN_HALF = 0.235;
const SHIN_FLARE = 1.5;

/** Medium nozzle bell pointing down local −Y (inner wall, rim, outer wall). */
export function vernierBell(kit: Kit) {
  return kit.lathe(
    "bell.vernier",
    [
      [0.026, 0.02],
      [0.03, -0.02],
      [0.045, -0.07],
      [0.058, -0.12],
      [0.067, -0.12],
      [0.056, -0.07],
      [0.04, -0.02],
      [0.038, 0.02],
    ],
    20,
  );
}

/**
 * Legs & joint assemblies. Long massive legs: blocky thigh, pointed knee cap,
 * broad lower leg flaring wider toward the bottom-rear with twin verniers in
 * the calf. Inside: thigh / shin frames, knee actuators, a propellant tank
 * feeding the verniers, the ankle actuator and a hip-to-ankle harness.
 */
export function buildLegs(kit: Kit, root: Object3D) {
  const { m } = kit;
  const { kneeDrop: K, ankleDrop: AK, legSplay } = LAYOUT;

  bilateral(root, "legs", LAYOUT.hip, (s, side) => {
    const leg = group(s, "leg", [0, 0, 0], [0, 0, legSplay]);
    const L = kit.scope(leg, "legs", side);
    const T = kit.scope(leg, "thrusters", side);

    /* ---------------- frame ---------------- */
    const thighFrame = kit.merge("lg.thighFrame", () => [
      { geo: kit.sphere(0.1, 16, 12), pos: [0, 0, 0] },
      { geo: kit.rbox(0.13, 0.9, 0.13, 0.015), pos: [0, -0.5, 0.0] },
      { geo: kit.rbox(0.04, 0.26, 0.2, 0.01), pos: [0.13, -K, -0.01] },
      { geo: kit.rbox(0.04, 0.26, 0.2, 0.01), pos: [-0.13, -K, -0.01] },
    ]);
    L("thigh_frame", thighFrame, m.frame, "frame", "lg-thigh-frame");
    L("knee_joint_housing", kit.cylX(0.105, 0.3, 20), m.frameDark, "frame", "lg-knee", { pos: [0, -K, -0.01] });
    const shinFrame = kit.merge("lg.shinFrame", () => [
      { geo: kit.rbox(0.12, 1.24, 0.12, 0.015), pos: [0, -1.74, 0.02] },
      { geo: kit.rbox(0.04, 0.2, 0.18, 0.01), pos: [0.11, -AK + 0.02, 0.0] },
      { geo: kit.rbox(0.04, 0.2, 0.18, 0.01), pos: [-0.11, -AK + 0.02, 0.0] },
      { geo: kit.rbox(0.26, 0.04, 0.16, 0.01), pos: [0, -AK + 0.12, 0.0] },
    ]);
    L("shin_frame", shinFrame, m.frame, "frame", "lg-shin-frame");

    /* ---------------- armor ---------------- */
    const thigh = kit.memo("lg.thigh", () =>
      warp(
        extrudeGeo(
          [
            [-0.255, 0.38],
            [0.255, 0.38],
            [0.27, -0.12],
            [0.215, -0.44],
            [-0.215, -0.44],
            [-0.265, -0.12],
          ],
          0.56,
          "xy",
          0.03,
        ),
        // front face bulges slightly at mid-thigh
        (x, y, z) => [x, y, z > 0 ? z + 0.03 * (1 - Math.abs(y + 0.05) / 0.45) : z],
      ),
    );
    L("thigh_armor", thigh, m.armorWhite, "armor", "lg-thigh-armor", { pos: [0, -0.5, 0.02], ex: [0, 0.04, 0.38] });
    const thighFront = kit.extrude(
      "lg.thighFront",
      [
        [-0.18, 0.22],
        [0.18, 0.22],
        [0.2, -0.16],
        [0.15, -0.38],
        [-0.15, -0.38],
        [-0.19, -0.16],
      ],
      0.06,
      "xy",
      0.014,
    );
    L("thigh_front_plate", thighFront, m.armorWhite, "armor", "lg-thigh-armor", { pos: [0, -0.52, 0.33], ex: [0, 0.04, 0.5] });
    const thighSide = kit.extrude(
      "lg.thighSide",
      [
        [-0.2, 0.2],
        [0.17, 0.2],
        [0.2, -0.3],
        [0.12, -0.4],
        [-0.17, -0.36],
      ],
      0.05,
      "zy",
      0.012,
    );
    L("thigh_side_panel", thighSide, m.armorNavy, "armor", "lg-thigh-armor", { pos: [0.275, -0.55, 0.02], ex: [0.42, 0, 0] });
    L("thigh_side_panel_inner", thighSide, m.armorNavy, "armor", "lg-thigh-armor", {
      pos: [-0.275, -0.55, 0.02],
      scale: [-1, 1, 1],
      ex: [-0.42, 0, 0],
    });

    const knee = kit.memo("lg.knee", () =>
      warp(
        extrudeGeo(
          [
            [0.17, 0.32],
            [0.33, 0.08],
            [0.38, -0.1],
            [0.3, -0.25],
            [0.08, -0.22],
            [0.05, 0.0],
          ],
          0.4,
          "zy",
          0.022,
        ),
        (x, y, z) => [x * lerp(1, 0.3, clamp01((y + 0.02) / 0.34)), y, z],
      ),
    );
    L("knee_cap", knee, m.armorWhite, "armor", "lg-knee-armor", { pos: [0, -K, 0], ex: [0, 0.06, 0.42] });
    const kneeInset = kit.extrude(
      "lg.kneeInset",
      [
        [0.29, -0.04],
        [0.35, -0.1],
        [0.295, -0.21],
        [0.18, -0.19],
      ],
      0.22,
      "zy",
      0.01,
    );
    L("knee_cap_inset", kneeInset, m.armorNavy, "armor", "lg-knee-armor", { pos: [0, -K, 0.022], ex: [0, 0.06, 0.48] });

    // Lower leg: broad shell flaring wider toward the bottom-rear.
    const shin = kit.memo("lg.shin", () =>
      warp(
        extrudeGeo(
          [
            [0.22, -1.12],
            [0.28, -1.6],
            [0.3, -2.1],
            [0.28, -2.44],
            [-0.32, -2.44],
            [-0.56, -2.2],
            [-0.52, -1.7],
            [-0.26, -1.18],
          ],
          SHIN_HALF * 2,
          "zy",
          0.03,
        ),
        (x, y, z) => [x * lerp(1, SHIN_FLARE, clamp01((-y - 1.15) / 1.25)), y, z],
      ),
    );
    L("lower_leg_shell", shin, m.armorWhite, "armor", "lg-shin-armor", { ex: [0, -0.02, -0.4] });
    const shinFront = kit.memo("lg.shinFront", () =>
      warp(
        extrudeGeo(
          [
            [0.24, -1.27],
            [0.325, -1.52],
            [0.345, -2.02],
            [0.325, -2.38],
            [0.25, -2.38],
            [0.235, -1.32],
          ],
          0.3,
          "zy",
          0.014,
        ),
        (x, y, z) => [x * lerp(1, SHIN_FLARE - 0.04, clamp01((-y - 1.15) / 1.25)) * (z > 0.29 ? 0.82 : 1), y, z],
      ),
    );
    L("shin_front_plate", shinFront, m.armorWhite, "armor", "lg-shin-armor", { ex: [0, -0.02, 0.44] });
    // Outer + inner navy inset panels; the lean follows the shell's widening.
    const sidePanel = kit.memo("lg.shinSide", () =>
      warp(
        extrudeGeo(
          [
            [0.12, -1.55],
            [0.2, -1.8],
            [0.21, -2.1],
            [0.17, -2.3],
            [-0.24, -2.3],
            [-0.43, -2.12],
            [-0.38, -1.8],
            [-0.18, -1.55],
          ],
          0.04,
          "zy",
          0.01,
        ),
        (x, y, z) => [x + SHIN_HALF * (SHIN_FLARE - 1) * clamp01((-y - 1.15) / 1.25), y, z],
      ),
    );
    L("shin_side_panel", sidePanel, m.armorNavy, "armor", "lg-shin-armor", { pos: [SHIN_HALF + 0.012, 0, 0], ex: [0.4, -0.02, 0] });
    L("shin_side_panel_inner", sidePanel, m.armorNavy, "armor", "lg-shin-armor", {
      pos: [-SHIN_HALF - 0.012, 0, 0],
      scale: [-1, 1, 1],
      ex: [-0.4, -0.02, 0],
    });
    const kneeGuard = kit.extrude(
      "lg.kneeGuard",
      [
        [-0.2, 0.05],
        [0.2, 0.05],
        [0.22, -0.12],
        [0.0, -0.2],
        [-0.22, -0.12],
      ],
      0.07,
      "xy",
      0.014,
    );
    L("knee_guard", kneeGuard, m.armorNavy, "armor", "lg-shin-armor", {
      pos: [0, -1.2, 0.255],
      rot: [-0.08, 0, 0],
      ex: [0, 0, 0.52],
    });

    /* ---------------- internals ---------------- */
    const kneeAct = kit.merge("lg.kneeAct", () => [
      { geo: kit.cyl(0.036, 0.036, 0.4, 12), pos: [0.1, -0.6, -0.14] },
      { geo: kit.cyl(0.036, 0.036, 0.4, 12), pos: [-0.1, -0.6, -0.14] },
      { geo: kit.cyl(0.018, 0.018, 0.16, 8), pos: [0.1, -0.86, -0.14] },
      { geo: kit.cyl(0.018, 0.018, 0.16, 8), pos: [-0.1, -0.86, -0.14] },
      { geo: kit.cylX(0.03, 0.26, 10), pos: [0, -0.4, -0.14] },
      { geo: kit.rbox(0.26, 0.05, 0.06, 0.008), pos: [0, -0.92, -0.14] },
    ]);
    L("knee_actuator", kneeAct, m.steel, "internal", "lg-knee-actuator", { ex: [0, 0.1, -0.12] });

    const tank = kit.merge("lg.tank", () => {
      const body = kit.lathe(
        "lg.tankBody",
        // capsule profile: hemisphere – cylinder – hemisphere (bottom → top)
        Array.from({ length: 14 }, (_, i) => {
          const j = i <= 6 ? i : i - 1;
          const a = (j / 12) * Math.PI;
          const r = 0.105;
          return [Math.sin(a) * r, (i <= 6 ? -0.15 : 0.15) - Math.cos(a) * r] as const;
        }),
        20,
      );
      return [
        { geo: body },
        { geo: kit.torus(0.108, 0.01, 6, 24), pos: [0, 0.08, 0], rot: [Math.PI / 2, 0, 0] },
        { geo: kit.torus(0.108, 0.01, 6, 24), pos: [0, -0.08, 0], rot: [Math.PI / 2, 0, 0] },
      ];
    });
    L("propellant_tank", tank, m.gunmetal, "internal", "lg-propellant", { pos: [0, -1.8, -0.21], ex: [0, -0.12, -0.2] });
    const feed = kit.tubes("lg.feed", [
      [
        [0.0, -2.05, -0.21],
        [0.03, -2.14, -0.29],
        [0.08, -2.12, -0.41],
      ],
      [
        [0.0, -2.05, -0.21],
        [-0.03, -2.14, -0.29],
        [-0.08, -2.12, -0.41],
      ],
    ]);
    L("propellant_feed", feed, m.steel, "internal", "lg-propellant", { ex: [0, -0.12, -0.24] });

    // Ankle drive: pivot block + two linear actuators running up the front of the shin.
    const ankle = kit.merge("lg.ankle", () => [
      { geo: kit.sphere(0.075, 14, 10), pos: [0, 0, 0] },
      { geo: kit.cylX(0.05, 0.18, 14), pos: [0, 0.0, 0] },
      { geo: kit.cyl(0.03, 0.03, 0.42, 10), pos: [0.09, 0.5, 0.12] },
      { geo: kit.cyl(0.03, 0.03, 0.42, 10), pos: [-0.09, 0.5, 0.12] },
      { geo: kit.cyl(0.015, 0.015, 0.24, 8), pos: [0.09, 0.18, 0.1] },
      { geo: kit.cyl(0.015, 0.015, 0.24, 8), pos: [-0.09, 0.18, 0.1] },
      { geo: kit.rbox(0.24, 0.04, 0.05, 0.006), pos: [0, 0.72, 0.12] },
      { geo: kit.rbox(0.22, 0.035, 0.05, 0.006), pos: [0, 0.07, 0.08] },
    ]);
    L("ankle_actuator", ankle, m.steel, "internal", "lg-ankle", { pos: [0, -AK, 0], ex: [0, -0.24, 0.06] });

    const harnessPts: V3[] = [
      [0.1, -0.06, -0.05],
      [0.11, -0.5, -0.06],
      [0.09, -0.95, -0.17],
      [0.11, -1.4, -0.06],
      [0.12, -1.95, -0.05],
      [0.06, -2.36, -0.05],
    ];
    L("limb_harness", kit.tubes("lg.harness", [harnessPts], 0.014, 40), m.cable, "internal", "lg-harness", {
      ex: [0.16, 0, -0.06],
    });

    /* ---------------- thrusters: calf verniers ---------------- */
    const bells = kit.merge("th.legBells", () => {
      const pieces: Piece[] = [];
      for (const x of [0.095, -0.095]) {
        pieces.push({ geo: vernierBell(kit), pos: [x, -2.12, -0.49], rot: [Math.PI / 2 - 0.32, 0, 0] });
      }
      return pieces;
    });
    T("calf_vernier_bells", bells, m.nozzle, "frame", "th-leg", { ex: [0, -0.06, -0.32] });
    const gimbals = kit.merge("th.legGimbals", () => [
      { geo: kit.torus(0.042, 0.01, 6, 18), pos: [0.095, -2.112, -0.47], rot: [-0.32, 0, 0] },
      { geo: kit.torus(0.042, 0.01, 6, 18), pos: [-0.095, -2.112, -0.47], rot: [-0.32, 0, 0] },
      { geo: kit.rbox(0.28, 0.035, 0.035, 0.006), pos: [0, -2.1, -0.43] },
    ]);
    T("calf_vernier_gimbals", gimbals, m.steel, "internal", "th-gimbal", { ex: [0, -0.05, -0.22] });
    T("calf_thruster_control", kit.rbox(0.14, 0.08, 0.08, 0.01), m.darkSteel, "internal", "th-tcu", {
      pos: [0, -2.27, -0.26],
      ex: [0, -0.04, -0.16],
    });

    /* ---------------- foot ---------------- */
    const ax = Math.sin(legSplay) * AK;
    const ankleY = LAYOUT.hip[1] - Math.cos(legSplay) * AK;
    const foot = group(s, "foot", [ax, -LAYOUT.hip[1], 0], [0, LAYOUT.footYaw, 0]);
    buildFoot(kit, foot, side, ankleY);
  });
}

function buildFoot(kit: Kit, foot: Object3D, side: "L" | "R", ankleY: number) {
  const { m } = kit;
  const F = kit.scope(foot, "feet", side);

  /* ---- frame ---- */
  const sole = kit.merge("ft.sole", () => [
    { geo: kit.rbox(0.3, 0.045, 0.36, 0.012), pos: [0, 0.0225, 0.43] },
    { geo: kit.rbox(0.36, 0.045, 0.3, 0.012), pos: [0, 0.0225, 0.06] },
    { geo: kit.rbox(0.3, 0.045, 0.24, 0.012), pos: [0, 0.0225, -0.26] },
  ]);
  F("sole_pads", sole, m.frameDark, "frame", "ft-sole");
  const frame = kit.merge("ft.frame", () => [
    { geo: kit.rbox(0.32, 0.05, 0.94, 0.012), pos: [0, 0.07, 0.12] },
    { geo: kit.rbox(0.04, 0.3, 0.12, 0.008), pos: [0.105, 0.24, 0.0] },
    { geo: kit.rbox(0.04, 0.3, 0.12, 0.008), pos: [-0.105, 0.24, 0.0] },
    { geo: kit.rbox(0.24, 0.04, 0.12, 0.008), pos: [0, ankleY - 0.1, 0.0] },
  ]);
  F("foot_frame", frame, m.frame, "frame", "ft-frame");

  /* ---- internals ---- */
  const damper = kit.merge("ft.damper", () => {
    const pts: V3[] = [];
    for (let i = 0; i <= 64; i++) {
      const a = (i / 64) * Math.PI * 2 * 5;
      pts.push([Math.cos(a) * 0.058, 0.12 + (i / 64) * 0.22, Math.sin(a) * 0.058]);
    }
    return [
      { geo: kit.cyl(0.04, 0.04, 0.16, 14), pos: [0, 0.19, 0] },
      { geo: kit.cyl(0.02, 0.02, 0.14, 10), pos: [0, 0.32, 0] },
      { geo: kit.tmp(kit.tube(pts, 0.008, 160, 5)) },
    ];
  });
  F("landing_damper", damper, m.steel, "internal", "ft-damper", { pos: [0, 0, 0.0], ex: [0, 0.16, 0] });
  const cells = kit.merge("ft.cells", () =>
    (
      [
        [0.09, 0.5],
        [-0.09, 0.5],
        [0.0, 0.25],
        [0.09, -0.24],
        [-0.09, -0.24],
      ] as const
    ).map(([x, z]) => ({ geo: kit.cyl(0.034, 0.034, 0.03, 12), pos: [x, 0.105, z] as const })),
  );
  F("ground_contact_sensors", cells, m.darkSteel, "internal", "ft-contact", { ex: [0, 0.08, 0] });

  /* ---- armor ---- */
  const toe = kit.memo("ft.toe", () =>
    warp(
      extrudeGeo(
        [
          [0.12, 0.34],
          [0.42, 0.28],
          [0.7, 0.135],
          [0.8, 0.06],
          [0.78, 0.04],
          [0.12, 0.04],
        ],
        0.46,
        "zy",
        0.02,
      ),
      (x, y, z) => [x * lerp(1, 0.46, clamp01((z - 0.22) / 0.58)) * (y > 0.2 ? 0.86 : 1), y, z],
    ),
  );
  F("toe_cap", toe, m.armorWhite, "armor", "ft-toe", { ex: [0, 0.02, 0.36] });
  const instep = kit.memo("ft.instep", () =>
    warp(
      extrudeGeo(
        [
          [-0.16, ankleY - 0.02],
          [0.1, ankleY - 0.03],
          [0.25, 0.34],
          [0.22, 0.2],
          [-0.18, 0.2],
        ],
        0.38,
        "zy",
        0.018,
      ),
      (x, y, z) => [x * (y > 0.4 ? 0.82 : 1), y, z],
    ),
  );
  F("instep_armor", instep, m.armorNavy, "armor", "ft-armor", { ex: [0, 0.3, 0.12] });
  const guard = kit.extrude(
    "ft.guard",
    [
      [-0.24, ankleY - 0.05],
      [0.1, ankleY - 0.06],
      [0.24, 0.2],
      [0.22, 0.06],
      [-0.32, 0.06],
    ],
    0.05,
    "zy",
    0.012,
  );
  F("ankle_guard_outer", guard, m.armorWhite, "armor", "ft-armor", { pos: [0.235, 0, 0], ex: [0.3, 0, 0] });
  F("ankle_guard_inner", guard, m.armorWhite, "armor", "ft-armor", { pos: [-0.235, 0, 0], scale: [-1, 1, 1], ex: [-0.3, 0, 0] });
  const heel = kit.memo("ft.heel", () =>
    warp(
      extrudeGeo(
        [
          [-0.14, 0.34],
          [-0.32, 0.26],
          [-0.49, 0.08],
          [-0.45, 0.04],
          [-0.14, 0.04],
        ],
        0.32,
        "zy",
        0.016,
      ),
      (x, y, z) => [x * lerp(1, 0.55, clamp01((-z - 0.2) / 0.29)), y, z],
    ),
  );
  F("heel_spur", heel, m.armorNavy, "armor", "ft-heel", { ex: [0, 0.02, -0.34] });
}
