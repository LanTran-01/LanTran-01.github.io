import type { Object3D } from "three";
import { bilateral, extrudeGeo, group, warp, type Kit, type P2, type Piece } from "./primitives";

/** Small downward-facing nozzle bell (lathe), shared by skirt thrusters. */
export function smallBell(kit: Kit, scale = 1) {
  const s = scale;
  return kit.lathe(
    `bell.small.${s}`,
    [
      // inner wall down, rim, outer wall up (keeps faces pointing outward)
      [0.02 * s, 0.0],
      [0.026 * s, -0.024 * s],
      [0.04 * s, -0.062 * s],
      [0.05 * s, -0.095 * s],
      [0.058 * s, -0.095 * s],
      [0.048 * s, -0.06 * s],
      [0.034 * s, -0.02 * s],
      [0.03 * s, 0.0],
    ],
    20,
  );
}

/**
 * Waist & central frame. Narrow waist with a navy hinge belt, a pointed crotch
 * block and the skirt: long pointed front plates angled forward, side plates
 * flaring outward and a rear plate. Inside: the spine and pelvis plate (frame),
 * the primary power core (open cage vessel with a glowing core), the hip joint
 * block and the lower power distribution unit; skirt thrusters sit under the
 * side and rear plates.
 */
export function buildWaist(kit: Kit, root: Object3D) {
  const { m } = kit;
  const g = group(root, "waist");
  const P = kit.scope(g, "waist");
  const T = kit.scope(g, "thrusters");

  /* ---------------- armor ---------------- */

  P("hinge_belt", kit.rbox(0.96, 0.13, 0.64, 0.025), m.armorNavy, "armor", "ws-skirt", {
    pos: [0, 3.245, 0.0],
    ex: [0, 0.16, 0],
  });

  const crotch = kit.memo("ws.crotch", () =>
    warp(
      extrudeGeo(
        [
          [-0.2, 0.21],
          [0.2, 0.21],
          [0.175, -0.1],
          [0.0, -0.26],
          [-0.175, -0.1],
        ],
        0.46,
        "xy",
        0.02,
      ),
      (x, y, z) => [x, y, z > 0 ? z + 0.04 * (1 - Math.min(1, Math.abs(x) / 0.2)) : z],
    ),
  );
  P("crotch_block", crotch, m.armorWhite, "armor", "ws-skirt", { pos: [0, 2.98, 0.02], ex: [0, -0.2, 0.3] });
  const crotchV: P2[] = [
    [-0.08, 0.06],
    [0.08, 0.06],
    [0.0, -0.1],
  ];
  P("crotch_emblem", kit.extrude("ws.crotchV", crotchV, 0.04, "xy", 0.008), m.armorNavy, "armor", "ws-skirt", {
    pos: [0, 2.95, 0.285],
    ex: [0, -0.2, 0.36],
  });

  bilateral(g, "waist.side", [0, 0, 0], (s, side) => {
    // Front skirt plate: hinged at the belt, bottom kicked forward.
    const fg = group(s, "front_skirt", [0.245, 3.2, 0.33], [-0.3, 0.12, 0]);
    const F = kit.scope(fg, "waist", side);
    const front = kit.extrude(
      "ws.front",
      [
        [-0.15, 0.03],
        [0.16, 0.03],
        [0.185, -0.5],
        [0.08, -0.8],
        [-0.13, -0.62],
      ],
      0.075,
      "xy",
      0.014,
    );
    F("front_skirt", front, m.armorWhite, "armor", "ws-front", { ex: [0, -0.05, 0.42] });
    const inset = kit.extrude(
      "ws.frontInset",
      [
        [-0.1, -0.08],
        [0.11, -0.08],
        [0.125, -0.45],
        [0.06, -0.64],
        [-0.085, -0.52],
      ],
      0.024,
      "xy",
      0.006,
    );
    F("front_skirt_inset", inset, m.armorNavy, "armor", "ws-front", { pos: [0, 0, 0.045], ex: [0, -0.05, 0.54] });

    // Side skirt plate: faces +X, flares outward.
    const sg = group(s, "side_skirt", [0.6, 3.2, -0.02], [0, 0, 0.22]);
    const SS = kit.scope(sg, "waist", side);
    const sidePlate = kit.extrude(
      "ws.side",
      [
        [-0.3, 0.02],
        [0.28, 0.02],
        [0.25, -0.46],
        [0.04, -0.6],
        [-0.27, -0.52],
      ],
      0.075,
      "zy",
      0.014,
    );
    SS("side_skirt", sidePlate, m.armorWhite, "armor", "ws-side", { ex: [0.42, -0.04, 0] });
    SS("side_skirt_rib", kit.rbox(0.03, 0.06, 0.4, 0.008), m.armorNavy, "armor", "ws-side", {
      pos: [0.045, -0.12, -0.01],
      ex: [0.5, -0.04, 0],
    });
    // Skirt thruster under the side plate (inner face).
    const ST = kit.scope(sg, "thrusters", side);
    ST("skirt_nozzle", smallBell(kit, 1.1), m.nozzle, "frame", "th-skirt", {
      pos: [-0.08, -0.36, -0.06],
      rot: [0, 0, -0.22],
      ex: [-0.04, -0.3, 0],
    });
  });

  // Rear skirt plate.
  const rg = group(g, "rear_skirt", [0, 3.2, -0.34], [0.32, 0, 0]);
  const R = kit.scope(rg, "waist");
  const rear = kit.extrude(
    "ws.rear",
    [
      [-0.36, 0.03],
      [0.36, 0.03],
      [0.3, -0.4],
      [0.0, -0.5],
      [-0.3, -0.4],
    ],
    0.075,
    "xy",
    0.014,
  );
  R("rear_skirt", rear, m.armorWhite, "armor", "ws-rear", { ex: [0, -0.04, -0.42] });
  const RT = kit.scope(rg, "thrusters");
  const rearNozzles = kit.merge("th.rearNozzles", () => [
    { geo: smallBell(kit, 1.15), pos: [0.17, -0.2, 0.08] },
    { geo: smallBell(kit, 1.15), pos: [-0.17, -0.2, 0.08] },
  ]);
  RT("rear_skirt_nozzles", rearNozzles, m.nozzle, "frame", "th-skirt", { ex: [0, -0.3, 0.04] });

  /* ---------------- frame ---------------- */

  const spine = kit.merge("ws.spine", () => {
    const pieces: Piece[] = [
      { geo: kit.cyl(0.055, 0.06, 0.7, 12), pos: [0, 3.29, -0.165] },
      { geo: kit.rbox(0.56, 0.05, 0.36, 0.01), pos: [0, 2.835, -0.02] },
      { geo: kit.rbox(0.14, 0.12, 0.12, 0.01), pos: [0, 2.92, -0.165] },
      // hip socket housings (visible joint structure)
      { geo: kit.cylX(0.072, 0.12, 18), pos: [0.25, 2.92, -0.02] },
      { geo: kit.cylX(0.072, 0.12, 18), pos: [-0.25, 2.92, -0.02] },
    ];
    for (const y of [3.3, 3.39, 3.48, 3.57]) pieces.push({ geo: kit.cyl(0.1, 0.1, 0.028, 14), pos: [0, y, -0.165] });
    return pieces;
  });
  P("spine_pelvis_frame", spine, m.frame, "frame", "ws-frame");

  /* ---------------- internals ---------------- */

  // Primary power core: open cage vessel around a glowing core.
  const vessel = kit.merge("ws.vessel", () => {
    const cap = kit.lathe(
      "ws.cap",
      [
        [0.0, 0.0],
        [0.15, 0.0],
        [0.15, 0.03],
        [0.12, 0.05],
        [0.07, 0.06],
        [0.0, 0.06],
      ],
      24,
    );
    const pieces: Piece[] = [
      { geo: cap, pos: [0, 0.1, 0] },
      { geo: cap, pos: [0, -0.1, 0], rot: [Math.PI, 0, 0] },
      { geo: kit.torus(0.13, 0.012, 6, 28), pos: [0, 0.0, 0], rot: [Math.PI / 2, 0, 0] },
    ];
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      pieces.push({ geo: kit.rbox(0.025, 0.2, 0.025, 0.004), pos: [Math.cos(a) * 0.135, 0, Math.sin(a) * 0.135] });
    }
    return pieces;
  });
  P("power_core_vessel", vessel, m.gunmetal, "internal", "ws-reactor", { pos: [0, 3.04, 0.05], ex: [0, 0.08, 0.16] });
  P("power_core", kit.cyl(0.07, 0.07, 0.2, 20), m.core, "internal", "ws-reactor", {
    pos: [0, 3.04, 0.05],
    ex: [0, 0.08, 0.16],
  });
  const coolant = kit.tubes(
    "ws.coolant",
    [
      [
        [0.12, 3.12, 0.05],
        [0.17, 3.1, 0.0],
        [0.18, 3.0, -0.07],
        [0.1, 2.94, -0.06],
      ],
      [
        [-0.12, 3.12, 0.05],
        [-0.17, 3.1, 0.0],
        [-0.18, 3.0, -0.07],
        [-0.1, 2.94, -0.06],
      ],
    ],
    0.014,
  );
  P("core_coolant_loops", coolant, m.steel, "internal", "ws-reactor", { ex: [0, 0.08, 0.22] });

  // Hip joint block: rotary drives behind the sockets + cross shaft and yokes.
  const hip = kit.merge("ws.hip", () => [
    { geo: kit.cyl(0.045, 0.045, 0.12, 14), pos: [0.25, 2.98, -0.12] },
    { geo: kit.cyl(0.045, 0.045, 0.12, 14), pos: [-0.25, 2.98, -0.12] },
    { geo: kit.cylX(0.035, 0.42, 12), pos: [0, 2.9, -0.135] },
    { geo: kit.rbox(0.06, 0.14, 0.18, 0.01), pos: [0.2, 2.9, -0.06] },
    { geo: kit.rbox(0.06, 0.14, 0.18, 0.01), pos: [-0.2, 2.9, -0.06] },
  ]);
  P("hip_joint_block", hip, m.steel, "internal", "ws-hip", { ex: [0, -0.22, 0] });

  // Lower power distribution unit and its feeds to the legs.
  const pdu = kit.merge("ws.pdu", () => [
    { geo: kit.rbox(0.3, 0.1, 0.07, 0.01), pos: [0, 0, 0] },
    ...[-0.1, -0.035, 0.035, 0.1].map((x) => ({ geo: kit.cylZ(0.016, 0.03, 8), pos: [x, 0.0, -0.045] as const })),
  ]);
  P("lower_power_distribution", pdu, m.gunmetal, "internal", "ws-pdu", { pos: [0, 3.11, -0.262], ex: [0, 0.22, -0.2] });
  const feeds = kit.tubes(
    "ws.feeds",
    [
      [
        [0.14, 3.08, -0.27],
        [0.26, 3.02, -0.2],
        [0.34, 2.92, -0.12],
        [0.37, 2.82, -0.07],
      ],
      [
        [-0.14, 3.08, -0.27],
        [-0.26, 3.02, -0.2],
        [-0.34, 2.92, -0.12],
        [-0.37, 2.82, -0.07],
      ],
      [
        [0.0, 3.15, -0.23],
        [0.0, 3.17, -0.1],
        [0.0, 3.16, -0.0],
      ],
    ],
    0.013,
  );
  P("leg_power_feeds", feeds, m.cable, "internal", "ws-pdu", { ex: [0, 0.14, -0.2] });

  // Thruster control unit for the skirt group.
  const tcu = kit.merge("th.tcuWaist", () => [
    { geo: kit.rbox(0.08, 0.06, 0.09, 0.008), pos: [0.33, 3.1, -0.14] },
    { geo: kit.rbox(0.08, 0.06, 0.09, 0.008), pos: [-0.33, 3.1, -0.14] },
  ]);
  T("skirt_thruster_control", tcu, m.darkSteel, "internal", "th-tcu", { ex: [0, 0.06, -0.18] });
}
