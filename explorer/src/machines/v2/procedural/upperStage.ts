import { LatheGeometry, Vector2, type Object3D } from "three";
import { EX, FIN_ANGLES, WAC, WAC_SHOW, finYaw } from "./layout";
import { extrudeGeo, group, type Kit, type P2, type Piece } from "./primitives";

/**
 * The WAC Corporal as the Bumper second stage: a slender body (published
 * diameter 0.305 m) with an ogival nose and four enlarged fins (published span
 * 1.22 m), seated in the V-2's nose with its fins recessed into the cone. Two
 * small solid spin rockets set it spinning after separation. Inside, the
 * nitric-acid and fuel tanks, the compressed-air bottle that pushed the
 * propellants into the motor, and an instrument section in the nose.
 *
 * Authored at true size in a local frame with y = 0 at the base of the stage,
 * then drawn enlarged (`WAC_SHOW`) so it reads clearly on the much wider V-2.
 * Length, fin planform, spin-rocket placement and the interior layout are
 * approximations.
 */

const R = WAC.radius;
const L = WAC.length;
/** Start of the ogival nose cone. */
const NOSE_Y = 3.45;

function lathe(points: readonly P2[], seg = 32): LatheGeometry {
  const g = new LatheGeometry(points.map(([r, h]) => new Vector2(r, h)), seg);
  g.deleteAttribute("uv");
  return g;
}

/** Capsule-shaped tank profile (r, y) from y0 to y1 with rounded ends, bottom → top. */
function capsule(r: number, y0: number, y1: number, cap = r * 0.6): P2[] {
  const pts: P2[] = [];
  for (let i = 0; i <= 6; i++) {
    const a = (i / 6) * (Math.PI / 2);
    pts.push([Math.max(0.0005, r * Math.sin(a)), y0 + cap - cap * Math.cos(a)]);
  }
  for (let i = 0; i <= 6; i++) {
    const a = (i / 6) * (Math.PI / 2);
    pts.push([Math.max(0.0005, r * Math.cos(a)), y1 - cap + cap * Math.sin(a)]);
  }
  return pts;
}

export function buildUpperStage(kit: Kit, rocket: Object3D) {
  const { m } = kit;
  const g = group(rocket, "upper_stage", [0, WAC.tail, 0]);
  g.scale.set(WAC_SHOW.radial, WAC_SHOW.length, WAC_SHOW.radial);
  const U = kit.scope(g, "upper");
  // Explode offsets are parent-local: undo the group's stretch so the stage lifts by EX.upper.
  const ex = [EX.upper[0] / WAC_SHOW.radial, EX.upper[1] / WAC_SHOW.length, EX.upper[2] / WAC_SHOW.radial] as const;

  /* ---- body and nose cone ---- */
  const body = kit.memo("v2.wac.body", () =>
    lathe([
      [0.085, 0],
      [0.13, 0.06],
      [R, 0.15],
      [R, NOSE_Y],
    ]),
  );
  U("body", body, m.paintWhite, "armor", "wc-body", { ex });
  const nose = kit.memo("v2.wac.nose", () => {
    const len = L - NOSE_Y;
    const rho = (R * R + len * len) / (2 * R);
    const pts: P2[] = [];
    for (let i = 0; i <= 20; i++) {
      const x = (i / 20) * len; // up from the nose base
      const r = Math.sqrt(Math.max(0, rho * rho - x * x)) + R - rho;
      pts.push([Math.max(0.0005, r), NOSE_Y + x]);
    }
    return lathe(pts);
  });
  U("nose_cone", nose, m.paintBlack, "armor", "wc-body", { ex });
  const band = kit.torus(R + 0.002, 0.006, 6, 48);
  U("nose_joint", band, m.seam, "armor", "wc-body", { pos: [0, NOSE_Y, 0], rot: [Math.PI / 2, 0, 0], ex });

  /* ---- motor nozzle (sits in the V-2's nose) ---- */
  const nozzle = kit.memo("v2.wac.nozzle", () =>
    lathe([
      [0.105, -0.17],
      [0.085, -0.08],
      [0.062, 0.0],
      [0.07, 0.03],
    ]),
  );
  U("nozzle", nozzle, m.engine, "frame", "wc-nozzle", { ex });

  /* ---- four fins, recessed into the V-2's nose cone ---- */
  const fin = kit.memo("v2.wac.fin", () =>
    extrudeGeo(
      [
        [R - 0.01, 0.06],
        [WAC.finR, 0.12],
        [WAC.finR, 0.42],
        [R - 0.01, 0.98],
      ],
      0.026,
      "xy",
      0.007,
    ),
  );
  FIN_ANGLES.forEach((phi, i) => {
    const f = group(g, `wac_fin.${i + 1}`, [0, 0, 0], [0, finYaw(phi), 0]);
    kit.scope(f, "upper")(`fin.${i + 1}`, fin, m.paintBlack, "armor", "wc-fins", { ex });
  });

  /* ---- two spin rockets, mounted tangentially on opposite sides ---- */
  const spin = kit.merge("v2.wac.spin", () =>
    [0, Math.PI].flatMap((phi): Piece[] => {
      const rr = R + 0.028;
      const pos = [Math.sin(phi) * rr, 1.2, Math.cos(phi) * rr] as const;
      return [
        { geo: kit.cylX(0.024, 0.22, 12), pos, rot: [0, phi, 0] },
        { geo: kit.rbox(0.05, 0.04, 0.03, 0.006), pos: [Math.sin(phi) * (R + 0.01), 1.2, Math.cos(phi) * (R + 0.01)], rot: [0, phi, 0] },
      ];
    }),
  );
  U("spin_rockets", spin, m.darkSteel, "frame", "wc-spin", { ex });

  /* ---- interior ---- */
  U("motor", kit.merge("v2.wac.motor", () => [
    { geo: kit.cyl(0.075, 0.07, 0.42, 20), pos: [0, 0.27, 0] },
    { geo: kit.cyl(0.095, 0.095, 0.05, 20), pos: [0, 0.5, 0] },
  ]), m.engine, "internal", "wc-motor", { ex });

  const oxTank = kit.memo("v2.wac.oxTank", () => lathe(capsule(R - 0.018, 1.3, 2.45)));
  U("oxidiser_tank", oxTank, m.tank, "internal", "wc-oxidiser", { ex });
  const fuelTank = kit.memo("v2.wac.fuelTank", () => lathe(capsule(R - 0.018, 2.53, 3.15)));
  U("fuel_tank", fuelTank, m.tank, "internal", "wc-fuel", { ex });
  // Feed lines from both tanks down to the motor.
  const feeds = kit.tubes(
    "v2.wac.feeds",
    [
      [
        [0.06, 1.33, 0.06],
        [0.08, 0.9, 0.08],
        [0.06, 0.55, 0.05],
      ],
      [
        [-0.11, 2.56, 0.0],
        [-0.12, 1.6, 0.03],
        [-0.11, 0.9, 0.0],
        [-0.06, 0.55, 0.0],
      ],
    ],
    0.011,
  );
  U("feed_lines", feeds, m.pipe, "internal", "wc-fuel", { ex });

  const air = kit.merge("v2.wac.air", () => [
    { geo: kit.sphere(R - 0.03, 18, 12), pos: [0, 3.3, 0] },
    { geo: kit.cyl(0.02, 0.02, 0.1, 10), pos: [0, 3.17, 0] },
  ]);
  U("air_bottle", air, m.bottle, "internal", "wc-air", { ex });

  const instruments = kit.merge("v2.wac.instruments", () => [
    { geo: kit.cyl(0.12, 0.12, 0.015, 24), pos: [0, 3.48, 0] },
    { geo: kit.rbox(0.15, 0.12, 0.12, 0.01), pos: [0, 3.56, 0] },
    { geo: kit.rbox(0.11, 0.1, 0.1, 0.01), pos: [0, 3.73, 0] },
    { geo: kit.cyl(0.045, 0.045, 0.16, 14), pos: [0, 3.9, 0] },
    { geo: kit.cyl(0.08, 0.08, 0.012, 20), pos: [0, 3.65, 0] },
  ]);
  U("instruments", instruments, m.equipment, "internal", "wc-instruments", { ex });
}
