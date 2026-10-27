import type { Object3D } from "three";
import { bilateral, clamp01, extrudeGeo, group, lerp, warp, type Kit, type Piece } from "./primitives";

/**
 * Backpack & flight systems. A deep housing bolted to the torso through an open
 * mount frame, two large wing-like flight binders sweeping up and back, a pair
 * of lower stabilizer fins and two main nozzles underneath. Inside, stacked
 * front-to-back: capacitor bank, thrust chambers + gimbals + control unit,
 * the flight-system core (ring + drum + emitter) and the propulsion controller.
 */
export function buildBackpack(kit: Kit, root: Object3D) {
  const { m } = kit;
  const g = group(root, "backpack");
  const P = kit.scope(g, "backpack");
  const T = kit.scope(g, "thrusters");

  /* ---------------- frame ---------------- */
  const mount = kit.merge("bp.mount", () => {
    const pieces: Piece[] = [];
    for (const x of [-0.22, 0.22]) {
      pieces.push({ geo: kit.rbox(0.06, 0.82, 0.06, 0.008), pos: [x, 4.1, -0.585] });
      for (const y of [3.8, 4.4]) pieces.push({ geo: kit.cylZ(0.028, 0.1, 10), pos: [x, y, -0.53] });
    }
    for (const y of [3.78, 4.42]) pieces.push({ geo: kit.rbox(0.6, 0.06, 0.06, 0.008), pos: [0, y, -0.585] });
    // binder axle + hinge knuckles
    pieces.push({ geo: kit.cylX(0.045, 0.98, 14), pos: [0, 4.46, -0.82] });
    pieces.push({ geo: kit.cylX(0.07, 0.08, 16), pos: [0.5, 4.46, -0.82] });
    pieces.push({ geo: kit.cylX(0.07, 0.08, 16), pos: [-0.5, 4.46, -0.82] });
    return pieces;
  });
  P("mount_frame", mount, m.frame, "frame", "bp-mount");

  /* ---------------- armor ---------------- */
  const housing = kit.memo("bp.housing", () =>
    warp(
      extrudeGeo(
        [
          [-0.55, 3.64],
          [-0.55, 4.6],
          [-0.66, 4.71],
          [-0.92, 4.62],
          [-1.02, 4.3],
          [-1.0, 3.8],
          [-0.9, 3.64],
        ],
        0.86,
        "zy",
        0.03,
      ),
      (x, y, z) => [x * lerp(1, 0.84, clamp01((-z - 0.55) / 0.47)) * (y > 4.55 ? 0.92 : 1), y, z],
    ),
  );
  P("housing", housing, m.armorWhite, "armor", "bp-housing", { ex: [0, 0.02, -0.48] });
  const rearPanel = kit.extrude(
    "bp.rear",
    [
      [-0.3, -0.24],
      [0.3, -0.24],
      [0.32, 0.18],
      [0.2, 0.34],
      [-0.2, 0.34],
      [-0.32, 0.18],
    ],
    0.05,
    "xy",
    0.01,
  );
  P("rear_panel", rearPanel, m.armorNavy, "armor", "bp-housing", {
    pos: [0, 4.07, -1.015],
    rot: [0.04, 0, 0],
    ex: [0, 0.02, -0.66],
  });
  const rearVent = kit.merge("bp.rearVent", () =>
    Array.from({ length: 4 }, (_, i) => ({
      geo: kit.rbox(0.34, 0.025, 0.03, 0.004),
      pos: [0, i * 0.06, 0] as const,
      rot: [0.5, 0, 0] as const,
    })),
  );
  P("rear_vent", rearVent, m.ochre, "armor", "bp-housing", { pos: [0, 3.96, -1.05], ex: [0, 0.02, -0.72] });

  bilateral(g, "backpack.side", [0, 0, 0], (s, side) => {
    const S = kit.scope(s, "backpack", side);
    S("binder_root_pod", kit.rbox(0.13, 0.36, 0.42, 0.02), m.armorNavy, "armor", "bp-housing", {
      pos: [0.43, 4.42, -0.8],
      ex: [0.34, 0, -0.12],
    });

    // Upper flight binder: long axis = local +Y, broad face = local Z.
    const ub = group(s, "upper_binder", [0.5, 4.48, -0.84], [-0.5, 0.25, -0.5]);
    const U = kit.scope(ub, "backpack", side);
    const blade = kit.memo("bp.binder", () =>
      warp(
        extrudeGeo(
          [
            [-0.13, -0.05],
            [0.15, -0.05],
            [0.25, 0.95],
            [0.15, 1.56],
            [0.05, 1.68],
            [-0.04, 1.32],
            [-0.18, 0.45],
          ],
          0.085,
          "xy",
          0.02,
        ),
        (x, y, z) => [x, y, z * lerp(1, 0.45, clamp01(y / 1.68))],
      ),
    );
    U("upper_binder", blade, m.armorWhite, "armor", "bp-binder-upper", { ex: [0, 0.34, -0.1] });
    const panel = kit.extrude(
      "bp.binderPanel",
      [
        [-0.08, 0.12],
        [0.1, 0.12],
        [0.17, 0.9],
        [0.1, 1.28],
        [-0.02, 1.2],
        [-0.11, 0.5],
      ],
      0.026,
      "xy",
      0.006,
    );
    U("upper_binder_panel_front", panel, m.armorNavy, "armor", "bp-binder-upper", { pos: [0, 0, 0.04], ex: [0, 0.34, 0.04] });
    U("upper_binder_panel_rear", panel, m.armorNavy, "armor", "bp-binder-upper", { pos: [0, 0, -0.04], ex: [0, 0.34, -0.24] });

    // Lower stabilizer fin: long axis = local −Y.
    const lb = group(s, "lower_fin", [0.3, 3.72, -0.93], [0.55, 0.2, 0.32]);
    const LF = kit.scope(lb, "backpack", side);
    const fin = kit.memo("bp.fin", () =>
      warp(
        extrudeGeo(
          [
            [-0.08, 0.05],
            [0.1, 0.05],
            [0.13, -0.5],
            [0.05, -0.84],
            [-0.03, -0.62],
            [-0.1, -0.25],
          ],
          0.06,
          "xy",
          0.016,
        ),
        (x, y, z) => [x, y, z * lerp(1, 0.5, clamp01(-y / 0.84))],
      ),
    );
    LF("lower_stabilizer", fin, m.armorWhite, "armor", "bp-binder-lower", { ex: [0, -0.3, -0.06] });
    const finTip = kit.extrude(
      "bp.finTip",
      [
        [0.04, -0.52],
        [0.12, -0.52],
        [0.05, -0.8],
        [0.0, -0.64],
      ],
      0.03,
      "xy",
      0.006,
    );
    LF("lower_stabilizer_tip", finTip, m.armorNavy, "armor", "bp-binder-lower", { pos: [0, 0, 0.03], ex: [0, -0.34, 0.0] });
  });

  /* ---------------- internals ---------------- */
  const caps = kit.merge("bp.caps", () => {
    const pieces: Piece[] = [];
    for (let i = 0; i < 6; i++) pieces.push({ geo: kit.cyl(0.036, 0.036, 0.18, 14), pos: [-0.25 + i * 0.1, 3.8, -0.63] });
    pieces.push({ geo: kit.rbox(0.62, 0.025, 0.09, 0.005), pos: [0, 3.74, -0.63] });
    pieces.push({ geo: kit.rbox(0.62, 0.025, 0.09, 0.005), pos: [0, 3.86, -0.63] });
    return pieces;
  });
  P("capacitor_bank", caps, m.steel, "internal", "bp-capacitor", { ex: [0, -0.1, -0.08] });

  const core = kit.merge("bp.core", () => [
    { geo: kit.torus(0.2, 0.045, 10, 36), pos: [0, 0, 0] },
    { geo: kit.cylZ(0.11, 0.22, 20), pos: [0, 0, 0] },
    ...[0, 1, 2, 3].map((i) => ({
      geo: kit.rbox(0.16, 0.025, 0.04, 0.005),
      pos: [Math.cos((i * Math.PI) / 2 + Math.PI / 4) * 0.15, Math.sin((i * Math.PI) / 2 + Math.PI / 4) * 0.15, 0] as const,
      rot: [0, 0, (i * Math.PI) / 2 + Math.PI / 4] as const,
    })),
  ]);
  P("flight_system_core", core, m.gunmetal, "internal", "bp-flightunit", { pos: [0, 4.15, -0.78], ex: [0, 0, -0.26] });
  P("flight_core_emitter", kit.torus(0.2, 0.018, 6, 40), m.core, "internal", "bp-flightunit", {
    pos: [0, 4.15, -0.84],
    ex: [0, 0, -0.34],
  });

  const ctrl = kit.merge("bp.ctrl", () => [
    { geo: kit.rbox(0.28, 0.09, 0.18, 0.01), pos: [0, 0, 0] },
    ...Array.from({ length: 6 }, (_, i) => ({ geo: kit.rbox(0.01, 0.03, 0.15, 0.002), pos: [-0.11 + i * 0.044, 0.055, 0] as const })),
  ]);
  P("propulsion_controller", ctrl, m.darkSteel, "internal", "bp-controller", { pos: [0, 4.51, -0.74], ex: [0, 0.2, -0.16] });
  const ctrlCables = kit.tubes("bp.ctrlCables", [
    [
      [0.1, 4.47, -0.72],
      [0.24, 4.3, -0.72],
      [0.24, 3.95, -0.78],
      [0.2, 3.84, -0.8],
    ],
    [
      [-0.1, 4.47, -0.72],
      [-0.24, 4.3, -0.72],
      [-0.24, 3.95, -0.78],
      [-0.2, 3.84, -0.8],
    ],
  ]);
  P("controller_harness", ctrlCables, m.cable, "internal", "bp-controller", { ex: [0, 0.1, -0.16] });

  /* ---------------- thrusters: main nozzles ---------------- */
  const bell = kit.lathe(
    "bell.main",
    [
      [0.06, 0.02],
      [0.068, -0.05],
      [0.1, -0.18],
      [0.15, -0.33],
      [0.163, -0.33],
      [0.113, -0.18],
      [0.082, -0.05],
      [0.076, 0.02],
    ],
    28,
  );
  const bells = kit.merge("th.mainBells", () => [
    { geo: bell, pos: [0.21, 3.64, -0.8], rot: [0.2, 0, 0] },
    { geo: bell, pos: [-0.21, 3.64, -0.8], rot: [0.2, 0, 0] },
  ]);
  T("main_nozzle_bells", bells, m.nozzle, "frame", "th-main-bell", { ex: [0, -0.42, -0.08] });
  const chambers = kit.merge("th.chambers", () => {
    const dome = kit.lathe(
      "th.dome",
      [
        [0.0, 0.06],
        [0.04, 0.05],
        [0.07, 0.02],
        [0.075, 0.0],
        [0.0, 0.0],
      ].reverse() as [number, number][],
      18,
    );
    return [0.2, -0.2].flatMap((x) => [
      { geo: kit.cyl(0.07, 0.06, 0.14, 18), pos: [x, 3.73, -0.8] as const },
      { geo: dome, pos: [x, 3.8, -0.8] as const },
    ]);
  });
  T("thrust_chambers", chambers, m.gunmetal, "internal", "th-main-chamber", { ex: [0, -0.22, -0.04] });
  const gimbals = kit.merge("th.mainGimbals", () =>
    [0.2, -0.2].flatMap((x) => [
      { geo: kit.torus(0.085, 0.014, 6, 24), pos: [x, 3.655, -0.8] as const, rot: [Math.PI / 2 + 0.2, 0, 0] as const },
      { geo: kit.rbox(0.03, 0.08, 0.03, 0.005), pos: [x + 0.09, 3.67, -0.8] as const },
      { geo: kit.rbox(0.03, 0.08, 0.03, 0.005), pos: [x - 0.09, 3.67, -0.8] as const },
    ]),
  );
  T("nozzle_gimbals", gimbals, m.steel, "internal", "th-gimbal", { ex: [0, -0.32, -0.06] });
  T("main_thruster_control", kit.rbox(0.12, 0.07, 0.1, 0.01), m.darkSteel, "internal", "th-tcu", {
    pos: [0, 3.72, -0.88],
    ex: [0, -0.14, -0.2],
  });
}
