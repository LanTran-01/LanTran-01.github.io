import type { Object3D } from "three";
import { CANARD_HINGE } from "./airframe";
import { EX, FIN_ANGLES, R, R_WING } from "./layout";
import { clamp01, extrudeGeo, group, lerp, warp, type Kit, type P2 } from "./primitives";

/**
 * Aerodynamic surfaces in the Python-family layout seen in public
 * photographs: two rows of four delta canards just behind the radome — a
 * small forward row and a larger row of control canards — and four long-chord
 * swept wings at the tail that set the published 0.64 m span. Authored once in
 * a fin-local frame (x radial, y along the axis, z across the surface) and
 * turned into each plane. Planforms are approximations.
 */

/** Thin, bevelled surface whose thickness falls from root to tip. */
function surface(outline: P2[], thickness: number, bevel: number, rootX: number, tipX: number, tipScale: number) {
  return warp(extrudeGeo(outline, thickness, "xy", bevel), (x, y, z) => [
    x,
    y,
    z * lerp(1, tipScale, clamp01((x - rootX) / (tipX - rootX))),
  ]);
}

export function buildSurfaces(kit: Kit, body: Object3D) {
  const { m } = kit;
  const rootIn = R - 0.004;

  const fixedCanard = kit.memo("db.canard.fixed", () =>
    surface(
      [
        [rootIn, 3.125],
        [R + 0.052, 3.032],
        [R + 0.052, 3.014],
        [rootIn, 3.0],
      ],
      0.005,
      0.0015,
      R,
      R + 0.052,
      0.6,
    ),
  );
  const controlCanard = kit.memo("db.canard.control", () =>
    surface(
      [
        [rootIn, 2.985],
        [R + 0.135, 2.802],
        [R + 0.135, 2.776],
        [rootIn, 2.752],
      ],
      0.0075,
      0.002,
      R,
      R + 0.135,
      0.5,
    ),
  );
  const hinge = kit.cylX(0.0085, 0.02, 12);

  const wing = kit.memo("db.wing", () =>
    surface(
      [
        [rootIn, 0.075],
        [R_WING, 0.075],
        [R_WING, 0.3],
        [rootIn, 0.98],
      ],
      0.012,
      0.003,
      R,
      R_WING,
      0.55,
    ),
  );
  const wingRoot = kit.extrude(
    "db.wing.root",
    [
      [R - 0.006, 0.082],
      [R + 0.011, 0.082],
      [R + 0.011, 0.93],
      [R - 0.006, 0.965],
    ],
    0.02,
    "xy",
    0.004,
  );

  FIN_ANGLES.forEach((phi, i) => {
    const n = i + 1;
    const g = group(body, `surfaces.${n}`, [0, 0, 0], [0, phi - Math.PI / 2, 0]);
    const C = kit.scope(g, "canards");
    const W = kit.scope(g, "wings");
    C(`fixed.${n}`, fixedCanard, m.surface, "armor", "cn-fixed", { ex: EX.canard });
    C(`control.${n}`, controlCanard, m.surface, "armor", "cn-control", { ex: EX.canard });
    C(`hinge.${n}`, hinge, m.dark, "frame", "cn-hinge", { pos: [R + 0.012, CANARD_HINGE, 0], ex: EX.canard });
    W(`wing.${n}`, wing, m.surface, "armor", "wg-panels", { ex: EX.wing });
    W(`root.${n}`, wingRoot, m.paint, "frame", "wg-roots", { ex: EX.wing });
  });
}
