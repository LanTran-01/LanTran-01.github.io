import type { Object3D } from "three";
import { LAYOUT } from "./layout";
import { bilateral, clamp01, composeMatrix, extrudeGeo, group, lerp, warp, type Kit, type P2 } from "./primitives";

/**
 * Head & sensor assembly. Small faceted helmet, tall swept twin V-fin with a
 * short centre crest, dark visor with two eye sensors, pointed faceplate and
 * side "ear" sensor blocks. Internals: dual optical unit behind the visor, a
 * centreline camera (lens stack + imager board) under the crest, and a signal
 * processor at the back feeding the neck harness.
 */
export function buildHead(kit: Kit, root: Object3D) {
  const { m } = kit;
  const g = group(root, "head", LAYOUT.head);
  g.scale.setScalar(LAYOUT.headScale);
  const P = kit.scope(g, "head");

  /* ---- frame: neck gimbal ---- */
  const neck = kit.merge("hd.neck", () => [
    { geo: kit.cyl(0.08, 0.095, 0.24, 16), pos: [0, -0.1, -0.01] },
    { geo: kit.torus(0.11, 0.022, 8, 24), pos: [0, -0.06, -0.01], rot: [Math.PI / 2, 0, 0] },
    { geo: kit.rbox(0.25, 0.05, 0.08, 0.01), pos: [0, -0.06, -0.01] },
    { geo: kit.cylX(0.03, 0.3, 12), pos: [0, -0.06, -0.01] },
  ]);
  P("neck_gimbal", neck, m.frame, "frame", "hd-neck");

  /* ---- armor: helmet ---- */
  const helmet = kit.memo("hd.helmet", () =>
    warp(
      extrudeGeo(
        [
          [0.205, 0.215],
          [0.218, 0.29],
          [0.14, 0.385],
          [0.02, 0.43],
          [-0.13, 0.415],
          [-0.21, 0.33],
          [-0.215, 0.15],
          [-0.11, 0.12],
          [0.07, 0.2],
          [0.12, 0.21],
        ],
        0.32,
        "zy",
        0.014,
      ),
      (x, y, z) => [x * lerp(1, 0.66, clamp01((y - 0.27) / 0.16)) * lerp(1, 0.9, clamp01(-z / 0.2)), y, z],
    ),
  );
  P("helmet", helmet, m.armorWhite, "armor", "hd-armor", { ex: [0, 0.24, -0.04] });

  // Centre crest (short blade on the centreline) and forehead emblem.
  const crest = kit.extrude(
    "hd.crest",
    [
      [0.1, 0.38],
      [0.17, 0.33],
      [0.19, 0.36],
      [0.11, 0.53],
      [0.065, 0.51],
      [0.05, 0.41],
    ],
    0.026,
    "zy",
    0.006,
  );
  P("crest", crest, m.armorWhite, "armor", "hd-vfin", { ex: [0, 0.34, 0.02] });

  const emblem = kit.extrude(
    "hd.emblem",
    [
      [-0.045, 0.245],
      [0.045, 0.245],
      [0.055, 0.295],
      [0, 0.335],
      [-0.055, 0.295],
    ],
    0.05,
    "xy",
    0.008,
  );
  P("forehead_emblem", emblem, m.armorNavy, "armor", "hd-vfin", { pos: [0, 0, 0.205], ex: [0, 0.12, 0.26] });

  // Twin swept V-fin (+ short secondary blades), mirrored into one geometry.
  const vfin = kit.merge("hd.vfin", () => {
    const blade = kit.tmp(
      extrudeGeo(
        [
          [0.0, 0.0],
          [0.05, -0.022],
          [0.3, 0.44],
          [0.33, 0.6],
          [0.27, 0.56],
          [0.012, 0.045],
        ],
        0.018,
        "xy",
        0.005,
      ),
    );
    const sub = kit.tmp(
      extrudeGeo(
        [
          [0.0, 0.0],
          [0.035, -0.014],
          [0.19, 0.1],
          [0.18, 0.135],
          [0.01, 0.03],
        ],
        0.016,
        "xy",
        0.004,
      ),
    );
    const L = composeMatrix([0.03, 0.27, 0.215], [-0.22, 0.42, -0.2]);
    const Ls = composeMatrix([0.04, 0.255, 0.205], [-0.1, 0.7, -0.25]);
    const mirror = composeMatrix([0, 0, 0], [0, 0, 0], [-1, 1, 1]);
    return [
      { geo: blade, matrix: L },
      { geo: blade, matrix: mirror.clone().multiply(L) },
      { geo: sub, matrix: Ls },
      { geo: sub, matrix: mirror.clone().multiply(Ls) },
    ];
  });
  P("vfin", vfin, m.ochre, "armor", "hd-vfin", { ex: [0, 0.38, 0.12] });

  /* ---- face: visor, eyes, faceplate ---- */
  P("visor", kit.rbox(0.28, 0.066, 0.05, 0.01), m.glass, "frame", "hd-optics", {
    pos: [0, 0.18, 0.175],
    ex: [0, 0, 0.2],
  });
  const eye: P2[] = [
    [0.025, 0.163],
    [0.103, 0.17],
    [0.112, 0.198],
    [0.035, 0.192],
  ];
  const eyes = kit.extrude("hd.eyes", [eye, eye.map(([x, y]) => [-x, y] as P2).reverse()], 0.012, "xy", 0.002);
  P("eye_sensors", eyes, m.sensor, "frame", "hd-optics", { pos: [0, 0, 0.203], ex: [0, 0, 0.22] });

  const faceplate = kit.memo("hd.faceplate", () =>
    warp(
      extrudeGeo(
        [
          [-0.12, 0.15],
          [0.12, 0.15],
          [0.105, 0.06],
          [0.045, -0.015],
          [-0.045, -0.015],
          [-0.105, 0.06],
        ],
        0.1,
        "xy",
        0.01,
      ),
      (x, y, z) => [x, y, z > 0 ? z + 0.022 * (1 - Math.min(1, Math.abs(x) / 0.12)) : z],
    ),
  );
  P("faceplate", faceplate, m.armorWhite, "armor", "hd-faceplate", { pos: [0, 0, 0.145], ex: [0, -0.06, 0.26] });
  const chin = kit.extrude(
    "hd.chin",
    [
      [-0.05, 0.005],
      [0.05, 0.005],
      [0, -0.065],
    ],
    0.07,
    "xy",
    0.008,
  );
  P("chin", chin, m.armorNavy, "armor", "hd-faceplate", { pos: [0, 0, 0.15], ex: [0, -0.12, 0.28] });
  const slot: P2[] = [
    [0.022, 0.104],
    [0.08, 0.088],
    [0.076, 0.07],
    [0.022, 0.084],
  ];
  const vents = kit.extrude("hd.vents", [slot, slot.map(([x, y]) => [-x, y] as P2).reverse()], 0.022, "xy", 0.003);
  P("face_vents", vents, m.louvre, "armor", "hd-faceplate", { pos: [0, 0, 0.21], ex: [0, -0.06, 0.32] });

  /* ---- sides: cheek plates, ear sensor blocks ---- */
  bilateral(g, "head.side", [0, 0, 0], (s, side) => {
    const S = kit.scope(s, "head", side);
    const cheek = kit.extrude(
      "hd.cheek",
      [
        [-0.14, 0.3],
        [0.12, 0.275],
        [0.18, 0.14],
        [0.12, 0.02],
        [-0.04, 0.0],
        [-0.16, 0.08],
      ],
      0.045,
      "zy",
      0.008,
    );
    S("cheek_plate", cheek, m.armorWhite, "armor", "hd-armor", { pos: [0.163, 0, 0], ex: [0.24, 0, 0.02] });
    S("ear_block", kit.rbox(0.07, 0.13, 0.15, 0.012), m.armorNavy, "armor", "hd-armor", {
      pos: [0.205, 0.175, -0.03],
      ex: [0.34, 0, 0],
    });
    S("ear_sensor", kit.cylX(0.036, 0.03, 16), m.frameDark, "armor", "hd-armor", {
      pos: [0.25, 0.175, -0.03],
      ex: [0.42, 0, 0],
    });
  });

  P("rear_guard", kit.rbox(0.24, 0.12, 0.08, 0.012), m.armorNavy, "armor", "hd-armor", {
    pos: [0, 0.075, -0.165],
    ex: [0, -0.04, -0.24],
  });

  /* ---- internals ---- */
  const optics = kit.merge("hd.optics", () => [
    { geo: kit.rbox(0.19, 0.05, 0.07, 0.008), pos: [0, 0.18, 0.11] },
    { geo: kit.cylZ(0.022, 0.05, 14), pos: [0.065, 0.18, 0.15] },
    { geo: kit.cylZ(0.022, 0.05, 14), pos: [-0.065, 0.18, 0.15] },
    { geo: kit.rbox(0.08, 0.035, 0.04, 0.006), pos: [0, 0.18, 0.06] },
  ]);
  P("optical_unit", optics, m.gunmetal, "internal", "hd-optics", { ex: [0, 0, 0.1] });

  P("main_camera_housing", kit.rbox(0.09, 0.06, 0.12, 0.008), m.darkSteel, "internal", "hd-mainsensor", {
    pos: [0, 0.315, 0.05],
    ex: [0, 0.09, 0.02],
  });
  const lens = kit.lathe(
    "hd.lens",
    [
      [0.0, 0.0],
      [0.03, 0.0],
      [0.03, 0.018],
      [0.026, 0.022],
      [0.026, 0.042],
      [0.021, 0.05],
      [0.0, 0.05],
    ],
    18,
  );
  P("lens_stack", lens, m.steel, "internal", "hd-lens", {
    pos: [0, 0.315, 0.11],
    rot: [Math.PI / 2, 0, 0],
    ex: [0, 0.09, 0.16],
  });
  P("lens_glass", kit.cylZ(0.019, 0.008, 16), m.sensor, "internal", "hd-lens", {
    pos: [0, 0.315, 0.162],
    ex: [0, 0.09, 0.2],
  });
  const imager = kit.merge("hd.imager", () => [
    { geo: kit.rbox(0.1, 0.075, 0.012, 0.003), pos: [0, 0, 0] },
    { geo: kit.rbox(0.035, 0.035, 0.01, 0.002), pos: [0, 0.005, 0.009] },
    { geo: kit.rbox(0.02, 0.015, 0.008, 0.002), pos: [0.035, -0.022, 0.008] },
    { geo: kit.rbox(0.02, 0.015, 0.008, 0.002), pos: [-0.035, -0.022, 0.008] },
  ]);
  P("imaging_board", imager, m.darkSteel, "internal", "hd-imager", { pos: [0, 0.315, -0.02], ex: [0, 0.09, -0.1] });

  const processor = kit.merge("hd.processor", () => {
    const fins = Array.from({ length: 6 }, (_, i) => ({
      geo: kit.rbox(0.008, 0.03, 0.09, 0.002),
      pos: [-0.06 + i * 0.024, 0.05, 0] as const,
    }));
    return [{ geo: kit.rbox(0.16, 0.075, 0.1, 0.01), pos: [0, 0, 0] }, ...fins];
  });
  P("signal_processor", processor, m.gunmetal, "internal", "hd-processor", {
    pos: [0, 0.085, -0.065],
    ex: [0, -0.04, -0.14],
  });
  const harness = kit.tubes("hd.harness", [
    [
      [0.03, 0.085, -0.02],
      [0.03, 0.03, 0.0],
      [0.02, -0.06, -0.01],
      [0.02, -0.2, -0.02],
    ],
    [
      [-0.03, 0.085, -0.02],
      [-0.03, 0.03, 0.0],
      [-0.02, -0.06, -0.01],
      [-0.02, -0.2, -0.02],
    ],
    [
      [0, 0.18, 0.07],
      [0, 0.15, 0.02],
      [0, 0.12, -0.02],
    ],
  ]);
  P("sensor_harness", harness, m.cable, "internal", "hd-processor", { ex: [0, -0.06, -0.1] });
}
