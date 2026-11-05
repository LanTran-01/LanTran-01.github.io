import { LatheGeometry, Matrix4, Quaternion, Vector2, Vector3, type Object3D } from "three";
import { CUT, EX, FIN_ANGLES, H, NOSE_CUT, WAC, WAC_R, finYaw, profile } from "./layout";
import { extrudeGeo, type Kit, type Piece, type V3 } from "./primitives";

/**
 * Interior of the airframe, on the internal layer (shown in the Internal
 * view): the guidance equipment in the instrument compartment's four bays,
 * the propellant tanks in glass-wool insulation (opened on one side like a
 * museum cutaway), the turbopump, steam generator, peroxide tanks,
 * compressed-air bottles, thrust frame and propellant lines in the tail, the
 * jet-vane servomotors, and the guide rails that held the upper stage's fins.
 *
 * Which equipment existed is documented; its shapes, sizes and arrangement
 * here are representative. Metres, rocket-local heights.
 */

const TAU = Math.PI * 2;
/** Bay centres in the instrument compartment: midway between the fins, behind the hatches. */
const BAYS = [0, 1, 2, 3].map((i) => (i * Math.PI) / 2);

/** Point at angle `phi` (from +Z towards +X), radius `rho`, height `y`. */
const polar = (phi: number, rho: number, y: number): V3 => [Math.sin(phi) * rho, y, Math.cos(phi) * rho];

/** A piece placed in a bay frame: local +Z points outward at angle `phi`, local +X along the tangent. */
function inBay(phi: number, rho: number, y: number, geo: Piece["geo"], local: V3 = [0, 0, 0], rot: V3 = [0, 0, 0]): Piece {
  const m = new Matrix4().makeRotationY(phi);
  const off = new Vector3(...local).applyMatrix4(m);
  const [x, , z] = polar(phi, rho, 0);
  const mtx = new Matrix4()
    .makeRotationY(phi)
    .multiply(new Matrix4().makeRotationX(rot[0]))
    .multiply(new Matrix4().makeRotationY(rot[1]))
    .multiply(new Matrix4().makeRotationZ(rot[2]))
    .setPosition(x + off.x, y + off.y, z + off.z);
  return { geo, matrix: mtx };
}

/** Unit-height cylinder stretched between two points. */
function strut(kit: Kit, a: V3, b: V3, r: number, seg = 10): Piece {
  const pa = new Vector3(...a);
  const pb = new Vector3(...b);
  const d = pb.clone().sub(pa);
  const len = d.length();
  const q = new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), d.normalize());
  const mtx = new Matrix4().compose(pa.clone().add(pb).multiplyScalar(0.5), q, new Vector3(1, len, 1));
  return { geo: kit.cyl(r, r, 1, seg), matrix: mtx };
}

/** Rounded-end pressure vessel, bottom → top. */
function vessel(r: number, y0: number, y1: number, cap = r * 0.7, phi0 = 0, phiLen = TAU, seg = 24): LatheGeometry {
  const pts: Vector2[] = [];
  for (let i = 0; i <= 8; i++) {
    const a = (i / 8) * (Math.PI / 2);
    pts.push(new Vector2(Math.max(0.0008, r * Math.sin(a)), y0 + cap - cap * Math.cos(a)));
  }
  for (let i = 0; i <= 8; i++) {
    const a = (i / 8) * (Math.PI / 2);
    pts.push(new Vector2(Math.max(0.0008, r * Math.cos(a)), y1 - cap + cap * Math.sin(a)));
  }
  const g = new LatheGeometry(pts, seg, phi0, phiLen);
  g.deleteAttribute("uv");
  return g;
}

/* ------------------------------------------------------------------ */
/* Instrument compartment                                              */
/* ------------------------------------------------------------------ */

function buildInstrumentBays(kit: Kit, rocket: Object3D) {
  const { m } = kit;
  const I = kit.scope(rocket, "instrument");
  const ex = EX.instrument;
  const floor = H.centre + 0.05;
  const deck = H.centre + 0.78;
  const top = H.instrument - 0.07;

  // Frame: floor, mid deck and two crossing walls that divide the compartment into four bays.
  const frame = kit.merge("v2.ic.frame", () => {
    const w0 = profile(floor) - 0.045;
    const w1 = profile(top) - 0.045;
    const wall = kit.tmp(
      extrudeGeo(
        [
          [-w0, floor],
          [w0, floor],
          [w1, top],
          [-w1, top],
        ],
        0.012,
        "xy",
        0.003,
      ),
    );
    return [
      { geo: kit.cyl(profile(floor) - 0.03, profile(floor) - 0.03, 0.02, 48), pos: [0, floor, 0] },
      { geo: kit.cyl(profile(deck) - 0.035, profile(deck) - 0.035, 0.018, 48), pos: [0, deck, 0] },
      { geo: wall, rot: [0, finYaw(FIN_ANGLES[0]), 0] },
      { geo: wall, rot: [0, finYaw(FIN_ANGLES[1]), 0] },
    ] satisfies Piece[];
  });
  I("equipment_frame", frame, m.structure, "internal", "ic-frame", { ex });

  const y0 = floor + 0.01;
  const yD = deck + 0.009;

  // Gyroscopes in the two forward bays: housing, gimbal rings, pivots, base.
  const gyroBodies = kit.merge("v2.ic.gyroBodies", () => {
    const pieces: Piece[] = [];
    for (const [i, phi] of [BAYS[0], BAYS[1]].entries()) {
      pieces.push(inBay(phi, 0.42, y0 + 0.025, kit.rbox(0.32, 0.05, 0.28, 0.01)));
      pieces.push(inBay(phi, 0.42, y0 + 0.2, kit.cyl(0.085, 0.085, 0.13, 20), [0, 0, 0], i === 0 ? [0, 0, 0] : [0, 0, Math.PI / 2]));
      pieces.push(inBay(phi, 0.42, y0 + 0.2, kit.sphere(0.07, 16, 10)));
      for (const s of [-1, 1]) pieces.push(inBay(phi, 0.42, y0 + 0.12, kit.cyl(0.014, 0.014, 0.16, 8), [s * 0.155, 0, 0]));
      pieces.push(inBay(phi, 0.42, y0 + 0.08, kit.rbox(0.1, 0.06, 0.06, 0.008), [0, 0, 0.17]));
    }
    return pieces;
  });
  I("gyros", gyroBodies, m.equipment, "internal", "ic-gyros", { ex });
  const gimbals = kit.merge("v2.ic.gimbals", () =>
    [BAYS[0], BAYS[1]].flatMap((phi): Piece[] => [
      inBay(phi, 0.42, y0 + 0.2, kit.torus(0.15, 0.011, 6, 36)),
      inBay(phi, 0.42, y0 + 0.2, kit.torus(0.12, 0.009, 6, 32), [0, 0, 0], [0, Math.PI / 2, 0]),
    ]),
  );
  I("gimbals", gimbals, m.steel, "internal", "ic-gyros", { ex });

  // Analog computer (Mischgerät): a bakelite case with a row of vacuum tubes and dials.
  const mixer = kit.merge("v2.ic.mixer", () => [
    inBay(BAYS[2], 0.4, y0 + 0.14, kit.rbox(0.38, 0.26, 0.24, 0.012)),
    inBay(BAYS[2], 0.4, y0 + 0.28, kit.rbox(0.36, 0.02, 0.22, 0.004)),
  ]);
  I("mixing_computer", mixer, m.bakelite, "internal", "ic-computer", { ex });
  const tubes = kit.merge("v2.ic.tubes", () => {
    const pieces: Piece[] = [];
    for (let row = 0; row < 2; row++) {
      for (let k = 0; k < 5; k++) {
        const lx = -0.14 + k * 0.07;
        const lz = -0.05 + row * 0.1;
        pieces.push(inBay(BAYS[2], 0.4, y0 + 0.34, kit.cyl(0.019, 0.017, 0.08, 12), [lx, 0, lz]));
        pieces.push(inBay(BAYS[2], 0.4, y0 + 0.39, kit.sphere(0.019, 10, 6), [lx, 0, lz]));
      }
    }
    for (let k = 0; k < 3; k++) pieces.push(inBay(BAYS[2], 0.4, y0 + 0.15, kit.cylZ(0.03, 0.01, 18), [-0.1 + k * 0.1, 0, 0.125]));
    return pieces;
  });
  I("vacuum_tubes", tubes, m.glass, "internal", "ic-computer", { ex });

  // Batteries: two rows of cells with copper terminals.
  const cells = kit.merge("v2.ic.batteries", () => {
    const pieces: Piece[] = [];
    for (let row = 0; row < 2; row++) {
      for (let k = 0; k < 3; k++) pieces.push(inBay(BAYS[3], 0.43, y0 + 0.09, kit.rbox(0.12, 0.17, 0.11, 0.008), [-0.14 + k * 0.14, 0, -0.07 + row * 0.15]));
    }
    return pieces;
  });
  I("batteries", cells, m.battery, "internal", "ic-power", { ex });
  const terminals = kit.merge("v2.ic.terminals", () => {
    const pieces: Piece[] = [];
    for (let row = 0; row < 2; row++) {
      for (let k = 0; k < 3; k++) {
        for (const s of [-1, 1]) pieces.push(inBay(BAYS[3], 0.43, y0 + 0.19, kit.cyl(0.012, 0.012, 0.03, 8), [-0.14 + k * 0.14 + s * 0.03, 0, -0.07 + row * 0.15]));
      }
    }
    // Rotary converter on the upper deck behind the computer bay.
    pieces.push(inBay(BAYS[2], 0.36, yD + 0.09, kit.cylX(0.07, 0.24, 18)));
    pieces.push(inBay(BAYS[2], 0.36, yD + 0.09, kit.cylX(0.075, 0.03, 18), [0.13, 0, 0]));
    return pieces;
  });
  I("terminals_converter", terminals, m.copper, "internal", "ic-power", { ex });

  // Upper deck: radio sets, the cut-off integrator, junction boxes.
  const radio = kit.merge("v2.ic.radio", () => [
    inBay(BAYS[0], 0.36, yD + 0.1, kit.rbox(0.27, 0.2, 0.17, 0.01)),
    inBay(BAYS[3], 0.34, yD + 0.08, kit.rbox(0.22, 0.16, 0.15, 0.01)),
  ]);
  I("radio_sets", radio, m.equipmentDark, "internal", "ic-radio", { ex });
  const dials = kit.merge("v2.ic.dials", () => [
    inBay(BAYS[0], 0.36, yD + 0.12, kit.cylZ(0.035, 0.012, 18), [-0.06, 0, 0.09]),
    inBay(BAYS[0], 0.36, yD + 0.12, kit.cylZ(0.022, 0.012, 14), [0.07, 0, 0.09]),
    inBay(BAYS[3], 0.34, yD + 0.1, kit.cylZ(0.028, 0.012, 16), [0, 0, 0.08]),
  ]);
  I("radio_dials", dials, m.glass, "internal", "ic-radio", { ex });

  const integrator = kit.merge("v2.ic.integrator", () => [
    inBay(BAYS[1], 0.36, yD + 0.03, kit.rbox(0.26, 0.04, 0.16, 0.008)),
    inBay(BAYS[1], 0.36, yD + 0.13, kit.cylX(0.07, 0.22, 20)),
    inBay(BAYS[1], 0.36, yD + 0.13, kit.cylX(0.078, 0.025, 20), [0.1, 0, 0]),
    inBay(BAYS[1], 0.36, yD + 0.13, kit.cylX(0.078, 0.025, 20), [-0.1, 0, 0]),
  ]);
  I("cutoff_integrator", integrator, m.equipment, "internal", "ic-cutoff", { ex });

  const junction = kit.merge("v2.ic.junction", () => [
    inBay(BAYS[3], 0.25, yD + 0.26, kit.rbox(0.16, 0.1, 0.08, 0.008)),
    inBay(BAYS[1], 0.22, yD + 0.3, kit.rbox(0.12, 0.08, 0.07, 0.008)),
  ]);
  I("junction_boxes", junction, m.bakelite, "internal", "ic-harness", { ex });

  // Cable harness: runs from each set to a bundle in the corner of its bay, down through the floor.
  const runs: V3[][] = [];
  for (const phi of BAYS) {
    const corner = (h: number, rho = 0.07) => polar(phi + 0.35, rho, h);
    runs.push([polar(phi, 0.3, yD + 0.05), corner(yD + 0.08, 0.14), corner(yD - 0.05), corner(floor + 0.1), corner(floor - 0.04, 0.05)]);
    runs.push([polar(phi, 0.27, y0 + 0.3), polar(phi + 0.2, 0.15, y0 + 0.32), corner(y0 + 0.25), corner(y0 + 0.05)]);
  }
  runs.push([polar(BAYS[0], 0.36, yD + 0.2), polar(BAYS[0] + 0.3, 0.3, top - 0.05), polar(BAYS[0] + 0.6, 0.2, top - 0.02)]);
  I("cable_harness", kit.tubes("v2.ic.harness", runs, 0.011, 20), m.cable, "internal", "ic-harness", { ex });
}

/* ------------------------------------------------------------------ */
/* Centre section: tanks                                               */
/* ------------------------------------------------------------------ */

const TANK_R = 0.74;
const LOX = { y0: 4.68, y1: 7.38 };
const FUEL = { y0: 7.62, y1: 10.38 };

function buildTanks(kit: Kit, rocket: Object3D) {
  const { m } = kit;
  const C = kit.scope(rocket, "centre");
  const ex = EX.centre;
  // Tanks are opened a little less than the insulation, so both layers show at the cut.
  const inset = (12 * Math.PI) / 180;
  const tPhi0 = CUT.to - inset;
  const tLen = TAU - (CUT.to - CUT.from) + 2 * inset;
  const iPhi0 = CUT.to;
  const iLen = TAU - (CUT.to - CUT.from);

  const fuel = kit.memo("v2.cs.fuelTank", () => vessel(TANK_R, FUEL.y0, FUEL.y1, 0.32, tPhi0, tLen, 48));
  C("fuel_tank", fuel, m.tank, "internal", "cs-fuel", { ex });
  const lox = kit.memo("v2.cs.loxTank", () => vessel(TANK_R, LOX.y0, LOX.y1, 0.32, tPhi0, tLen, 48));
  C("lox_tank", lox, m.tank, "internal", "cs-lox", { ex });

  // Glass-wool blanket around the cylindrical walls.
  const wool = kit.memo("v2.cs.insulation", () => {
    const pts = [
      new Vector2(TANK_R + 0.012, LOX.y0 + 0.25),
      new Vector2(TANK_R + 0.032, LOX.y0 + 0.3),
      new Vector2(TANK_R + 0.032, FUEL.y1 - 0.3),
      new Vector2(TANK_R + 0.012, FUEL.y1 - 0.25),
    ];
    const g = new LatheGeometry(pts, 40, iPhi0, iLen);
    g.deleteAttribute("uv");
    return g;
  });
  C("insulation", wool, m.insulation, "internal", "cs-insulation", { ex });

  // Fuel line from the upper tank down through the oxygen tank, and the oxygen outlet.
  const lines = kit.merge("v2.cs.lines", () => [
    { geo: kit.cyl(0.07, 0.07, FUEL.y0 - H.tail - 0.02, 16), pos: [0, (FUEL.y0 + H.tail + 0.02) / 2, 0] },
    { geo: kit.cyl(0.095, 0.095, 0.04, 16), pos: [0, FUEL.y0 - 0.01, 0] },
    { geo: kit.cyl(0.095, 0.095, 0.04, 16), pos: [0, LOX.y1 + 0.03, 0] },
    { geo: kit.cyl(0.06, 0.06, LOX.y0 - H.tail + 0.08, 14), pos: [0.25, (LOX.y0 + 0.08 + H.tail + 0.02) / 2, 0] },
    { geo: kit.cyl(0.085, 0.085, 0.035, 14), pos: [0.25, LOX.y0 + 0.06, 0] },
  ]);
  C("propellant_lines", lines, m.pipe, "internal", "cs-feed", { ex });

  // Rings that carry the tanks inside the skin.
  const mounts = kit.merge("v2.cs.mounts", () =>
    [LOX.y0 - 0.06, (LOX.y1 + FUEL.y0) / 2, FUEL.y1 + 0.08].flatMap((y): Piece[] => [
      { geo: kit.torus(0.79, 0.016, 6, 64), pos: [0, y, 0], rot: [Math.PI / 2, 0, 0] },
      ...[0, 1, 2, 3, 4, 5].map((k) => strut(kit, polar((k * TAU) / 6, 0.79, y), polar((k * TAU) / 6, 0.6, y + (y > 8 ? -0.12 : 0.12)), 0.014)),
    ]),
  );
  C("tank_mounts", mounts, m.structure, "internal", "cs-frames", { ex });
}

/* ------------------------------------------------------------------ */
/* Tail: propulsion equipment                                          */
/* ------------------------------------------------------------------ */

const PUMP_Y = 2.55;

function buildTailEquipment(kit: Kit, rocket: Object3D) {
  const { m } = kit;
  const T = kit.scope(rocket, "tail");
  const ex = EX.tail;

  // Thrust frame: a ring around the chamber head tied by struts to a ring under the tanks.
  const frame = kit.merge("v2.ts.frame", () => {
    const lo = 0.47;
    const hi = 0.7;
    const yLo = 1.98;
    const yHi = 3.55;
    const pieces: Piece[] = [
      { geo: kit.torus(lo, 0.022, 8, 48), pos: [0, yLo, 0], rot: [Math.PI / 2, 0, 0] },
      { geo: kit.torus(hi, 0.02, 8, 64), pos: [0, yHi, 0], rot: [Math.PI / 2, 0, 0] },
    ];
    for (let k = 0; k < 6; k++) {
      const a = (k * TAU) / 6;
      pieces.push(strut(kit, polar(a, lo, yLo), polar(a + 0.18, hi, yHi), 0.022));
      pieces.push(strut(kit, polar(a, lo, yLo), polar(a - 0.18, hi, yHi), 0.022));
      pieces.push(strut(kit, polar(a, hi, yHi), polar(a, profile(yHi) - 0.01, yHi + 0.05), 0.018));
    }
    return pieces;
  });
  T("thrust_frame", frame, m.structure, "internal", "ts-frame", { ex });

  // Turbopump: turbine in the middle, fuel and oxygen pumps either side on one shaft.
  const pump = kit.merge("v2.ts.turbopump", () => [
    { geo: kit.cylX(0.2, 0.17, 28), pos: [0, PUMP_Y, 0] },
    { geo: kit.cylX(0.06, 0.82, 14), pos: [0, PUMP_Y, 0] },
    { geo: kit.cylX(0.17, 0.17, 26), pos: [-0.28, PUMP_Y, 0] },
    { geo: kit.cylX(0.17, 0.17, 26), pos: [0.28, PUMP_Y, 0] },
    { geo: kit.cylX(0.075, 0.12, 16), pos: [-0.43, PUMP_Y, 0] },
    { geo: kit.cylX(0.075, 0.12, 16), pos: [0.43, PUMP_Y, 0] },
    { geo: kit.rbox(0.12, 0.12, 0.1, 0.02), pos: [-0.28, PUMP_Y - 0.17, 0.05] },
    { geo: kit.rbox(0.12, 0.12, 0.1, 0.02), pos: [0.28, PUMP_Y - 0.17, 0.05] },
    { geo: kit.torus(0.2, 0.014, 6, 32), pos: [0.09, PUMP_Y, 0], rot: [0, Math.PI / 2, 0] },
    { geo: kit.torus(0.2, 0.014, 6, 32), pos: [-0.09, PUMP_Y, 0], rot: [0, Math.PI / 2, 0] },
  ]);
  T("turbopump", pump, m.engineHead, "internal", "ts-turbopump", { ex });

  // Steam generator behind the turbopump, and the hydrogen-peroxide and permanganate tanks above.
  const steam = kit.merge("v2.ts.steam", () => [
    { geo: kit.tmp(vessel(0.12, 2.78, 3.16, 0.06)), pos: [0, 0, -0.42] },
    { geo: kit.rbox(0.16, 0.1, 0.12, 0.012), pos: [0.15, 2.92, -0.4] },
  ]);
  T("steam_generator", steam, m.equipment, "internal", "ts-steam", { ex });
  const peroxide = kit.merge("v2.ts.peroxide", () => [
    { geo: kit.tmp(vessel(0.17, 3.02, 3.76, 0.12)), pos: polar(Math.PI / 6, 0.38, 0) },
    { geo: kit.tmp(vessel(0.1, 3.12, 3.5, 0.07)), pos: polar((3 * Math.PI) / 4, 0.4, 0) },
  ]);
  T("peroxide_tanks", peroxide, m.tank, "internal", "ts-peroxide", { ex });

  // Compressed-air bottles in two groups near the top of the tail, with a manifold.
  const bottleAngles = [200, 225, 250, 290, 315, 340].map((d) => (d * Math.PI) / 180);
  const bottles = kit.merge("v2.ts.bottles", () =>
    bottleAngles.map((a) => ({ geo: kit.tmp(vessel(0.065, 3.64, 4.08, 0.05, 0, TAU, 16)), pos: polar(a, 0.57, 0) })),
  );
  T("air_bottles", bottles, m.bottle, "internal", "ts-air", { ex });
  const manifold = kit.tubes(
    "v2.ts.manifold",
    [
      bottleAngles.slice(0, 3).map((a) => polar(a, 0.57, 4.12)),
      bottleAngles.slice(3).map((a) => polar(a, 0.57, 4.12)),
      [polar(bottleAngles[2], 0.57, 4.12), polar(Math.PI * 1.5, 0.5, 3.95), polar(Math.PI / 6, 0.4, 3.8)],
    ],
    0.012,
  );
  T("air_manifold", manifold, m.copper, "internal", "ts-air", { ex });

  // Propellant and steam lines: tanks → pumps → chamber head, generator → turbine.
  const lines = kit.tubes(
    "v2.ts.lines",
    [
      [[0, H.tail - 0.01, 0], [-0.05, 3.9, 0.0], [-0.3, 3.25, 0.0], [-0.6, 2.8, 0], [-0.56, PUMP_Y + 0.01, 0]],
      [[0.25, H.tail - 0.01, 0], [0.3, 3.9, -0.06], [0.48, 3.2, -0.06], [0.6, 2.8, 0], [0.56, PUMP_Y + 0.01, 0]],
      [[-0.3, PUMP_Y - 0.2, 0.05], [-0.4, 2.26, 0.08], [-0.5, 2.15, 0.02]],
      [[0.3, PUMP_Y - 0.2, 0.05], [0.18, 2.3, 0.04], [0.04, 2.21, 0]],
      [[0, 2.98, -0.3], [0, 2.85, -0.2], [0, PUMP_Y + 0.18, -0.08]],
      [[0, PUMP_Y + 0.15, 0.1], [0.05, 2.95, 0.35], [0.12, 3.05, 0.6]],
    ],
    0.05,
    28,
  );
  T("propellant_lines", lines, m.pipe, "internal", "ts-lines", { ex });
}

/* ------------------------------------------------------------------ */
/* Jet-vane servomotors                                                */
/* ------------------------------------------------------------------ */

function buildServos(kit: Kit, rocket: Object3D) {
  const { m } = kit;
  const V = kit.scope(rocket, "control");
  // Inside the tail above each vane mount; they lift with the tail in the Sections view.
  const ex = EX.tail;
  const servos = kit.merge("v2.cv.servos", () =>
    FIN_ANGLES.flatMap((phi): Piece[] => {
      const yaw = finYaw(phi);
      return [
        { geo: kit.rbox(0.12, 0.18, 0.13, 0.012), pos: polar(phi, 0.47, 0.66), rot: [0, yaw, 0] },
        { geo: kit.cylX(0.045, 0.1, 14), pos: polar(phi, 0.47, 0.8), rot: [0, yaw + Math.PI / 2, 0] },
      ];
    }),
  );
  V("servos", servos, m.equipment, "internal", "cv-servos", { ex });
  const linkages = kit.merge("v2.cv.linkages", () =>
    FIN_ANGLES.map((phi) => strut(kit, polar(phi, 0.47, 0.56), polar(phi, 0.55, 0.37), 0.012, 8)),
  );
  V("servo_linkages", linkages, m.steel, "internal", "cv-servos", { ex });
}

/* ------------------------------------------------------------------ */
/* Nose: rails and seat for the upper stage                            */
/* ------------------------------------------------------------------ */

function buildNoseRails(kit: Kit, rocket: Object3D) {
  const { m } = kit;
  const N = kit.scope(rocket, "nose");
  const ex = EX.nose;
  const y0 = WAC.tail - 0.02;
  const y1 = NOSE_CUT - 0.06;
  const rails = kit.merge("v2.ns.rails", () =>
    FIN_ANGLES.flatMap((phi): Piece[] => {
      const yaw = finYaw(phi);
      return [-1, 1].map((s) => {
        const [x, , z] = polar(phi, WAC_R + 0.05, 0);
        const off = polar(phi + Math.PI / 2, 0.045 * s, 0);
        return { geo: kit.rbox(0.06, y1 - y0, 0.016, 0.004), pos: [x + off[0], (y0 + y1) / 2, z + off[2]], rot: [0, yaw, 0] };
      });
    }),
  );
  N("guide_rails", rails, m.structure, "internal", "ns-rails", { ex });
  const seatY = WAC.tail - 0.03;
  const seatR = WAC_R * 0.8;
  const seat = kit.merge("v2.ns.seat", () => [
    { geo: kit.torus(seatR, 0.022, 8, 40), pos: [0, seatY, 0], rot: [Math.PI / 2, 0, 0] },
    ...[0, 1, 2, 3].map((k) => {
      const a = FIN_ANGLES[k] + Math.PI / 4;
      return strut(kit, polar(a, seatR, seatY), polar(a, profile(H.instrument + 0.12) - 0.03, H.instrument + 0.12), 0.018, 8);
    }),
  ]);
  N("upper_stage_seat", seat, m.structure, "internal", "ns-cradle", { ex });
}

/** Everything inside the airframe. */
export function buildInterior(kit: Kit, rocket: Object3D) {
  buildInstrumentBays(kit, rocket);
  buildTanks(kit, rocket);
  buildTailEquipment(kit, rocket);
  buildServos(kit, rocket);
  buildNoseRails(kit, rocket);
}

