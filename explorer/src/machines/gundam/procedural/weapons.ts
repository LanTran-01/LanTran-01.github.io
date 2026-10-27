import { Group, Matrix4, Vector3, type Object3D } from "three";
import { group, type Kit } from "./primitives";

/**
 * Long beam rifle. Local frame: origin at the grip centre, barrel along +Z,
 * top along +Y. Split receiver housing (armor) hides the energy pack, so the
 * cutaway reveals it; the barrel shroud hides the emitter coil.
 */
export function buildRifle(kit: Kit, parent: Object3D): Group {
  const { m } = kit;
  const g = group(parent, "rifle");
  g.scale.setScalar(1.2);
  const W = kit.scope(g, "weapons");

  const grip = kit.merge("wp.grip", () => [
    { geo: kit.rbox(0.075, 0.25, 0.1, 0.014), pos: [0, -0.01, -0.01], rot: [0.22, 0, 0] },
    { geo: kit.rbox(0.022, 0.022, 0.14, 0.005), pos: [0, 0.06, 0.1] },
    { geo: kit.rbox(0.022, 0.07, 0.022, 0.005), pos: [0, 0.09, 0.165] },
    { geo: kit.rbox(0.016, 0.05, 0.02, 0.004), pos: [0, 0.1, 0.06], rot: [0.3, 0, 0] },
  ]);
  W("grip", grip, m.frameDark, "frame", "wp-grip", { ex: [0, -0.2, 0] });

  const halfOutline = [
    [-0.32, 0.12],
    [0.5, 0.12],
    [0.57, 0.2],
    [0.5, 0.3],
    [-0.2, 0.31],
    [-0.34, 0.24],
  ] as const;
  const half = kit.extrude("wp.half", halfOutline, 0.065, "zy", 0.012);
  W("receiver_housing_l", half, m.armorNavy, "armor", "wp-rifle", { pos: [0.034, 0, 0], ex: [0.18, 0, 0] });
  W("receiver_housing_r", half, m.armorNavy, "armor", "wp-rifle", { pos: [-0.034, 0, 0], ex: [-0.18, 0, 0] });
  const stock = kit.extrude(
    "wp.stock",
    [
      [-0.3, 0.27],
      [-0.56, 0.24],
      [-0.6, 0.1],
      [-0.54, 0.07],
      [-0.4, 0.13],
      [-0.3, 0.15],
    ],
    0.07,
    "zy",
    0.012,
  );
  W("stock", stock, m.frame, "frame", "wp-rifle", { ex: [0, 0, -0.3] });

  const barrel = kit.merge("wp.barrel", () => {
    const muzzle = kit.lathe(
      "wp.muzzle",
      [
        [0.03, -0.06],
        [0.03, 0.04],
        [0.05, 0.06],
        [0.058, 0.06],
        [0.052, -0.02],
        [0.045, -0.06],
      ].reverse() as [number, number][],
      18,
    );
    return [
      { geo: kit.cylZ(0.034, 0.86, 16), pos: [0, 0.2, 0.96] },
      { geo: muzzle, pos: [0, 0.2, 1.42], rot: [Math.PI / 2, 0, 0] },
      { geo: kit.rbox(0.05, 0.05, 0.12, 0.008), pos: [0, 0.12, 1.2] },
    ];
  });
  W("emitter_barrel", barrel, m.frame, "frame", "wp-barrel", { ex: [0, 0, 0.34] });
  W("barrel_shroud", kit.rbox(0.1, 0.12, 0.44, 0.018), m.armorNavy, "armor", "wp-barrel", {
    pos: [0, 0.2, 0.74],
    ex: [0, 0.14, 0.18],
  });
  W("emitter_coil", kit.cylZ(0.042, 0.36, 16), m.steel, "internal", "wp-barrel", { pos: [0, 0.2, 0.74], ex: [0, 0.07, 0.24] });

  const scope = kit.merge("wp.scope", () => [
    { geo: kit.cylZ(0.042, 0.3, 16), pos: [0, 0.39, 0.12] },
    { geo: kit.rbox(0.04, 0.07, 0.1, 0.008), pos: [0, 0.335, 0.12] },
  ]);
  W("targeting_sensor", scope, m.frame, "frame", "wp-sensor", { ex: [0, 0.24, 0] });
  W("sensor_lens", kit.cylZ(0.032, 0.012, 16), m.sensor, "frame", "wp-sensor", { pos: [0, 0.39, 0.272], ex: [0, 0.24, 0.04] });

  const pack = kit.merge("wp.pack", () => [
    { geo: kit.rbox(0.06, 0.12, 0.3, 0.01), pos: [0, 0.215, 0.06] },
    { geo: kit.cylZ(0.016, 0.3, 8), pos: [0, 0.22, 0.36] },
    { geo: kit.rbox(0.05, 0.05, 0.04, 0.006), pos: [0, 0.215, 0.23] },
  ]);
  W("energy_pack", pack, m.steel, "internal", "wp-capacitor", { ex: [0, 0.05, 0] });

  return g;
}

/**
 * Seat the rifle in the right hand: grip centre on the anchor, barrel along the
 * hand's −Y (finger) axis, rifle top towards the hand's +Z (index side).
 * Uses direction vectors, so it works under the mirrored right-side group.
 */
export function seatRifle(rifle: Object3D, anchor: Object3D) {
  anchor.updateWorldMatrix(true, false);
  const w = anchor.matrixWorld;
  const pos = new Vector3().setFromMatrixPosition(w);
  const fwd = new Vector3(0, -1, 0).transformDirection(w);
  const up = new Vector3(0, 0, 1).transformDirection(w);
  up.addScaledVector(fwd, -up.dot(fwd)).normalize();
  const side = new Vector3().crossVectors(up, fwd).normalize();
  rifle.position.copy(pos);
  rifle.quaternion.setFromRotationMatrix(new Matrix4().makeBasis(side, up, fwd));
}
