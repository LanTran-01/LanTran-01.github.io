import { ExtrudeGeometry, Path, Shape, type Object3D } from "three";
import { FIN_ANGLES, TABLE_H, finYaw } from "./layout";
import type { Kit, Piece, V3 } from "./primitives";

/**
 * Firing table (Brennstand): the portable stand the V-2 was launched from,
 * standing on the bearing surfaces of its fins. A load ring with a support
 * under each fin, four legs with levelling jacks between the fins, and a
 * blast deflector under the nozzle. Wartime dark yellow, after the
 * Smithsonian's restored stand. Proportions are approximate. Metres, floor at y = 0.
 */

const RING_IN = 0.8;
const RING_OUT = 1.08;
const RING_T = 0.08;
const PAD_T = 0.04;
/** Top of the ring; the fin supports sit on it. */
const RING_TOP = TABLE_H - PAD_T;
const FOOT_R = 1.42;

export function buildFiringTable(kit: Kit, table: Object3D) {
  const { m } = kit;
  const T = kit.scope(table, "launch");

  const ring = kit.memo("v2.table.ring", () => {
    const shape = new Shape();
    shape.absarc(0, 0, RING_OUT, 0, Math.PI * 2, false);
    const hole = new Path();
    hole.absarc(0, 0, RING_IN, 0, Math.PI * 2, true);
    shape.holes.push(hole);
    const g = new ExtrudeGeometry(shape, {
      depth: RING_T - 0.02,
      bevelEnabled: true,
      bevelThickness: 0.01,
      bevelSize: 0.01,
      bevelOffset: -0.01,
      bevelSegments: 1,
      curveSegments: 64,
    });
    g.deleteAttribute("uv");
    g.rotateX(-Math.PI / 2);
    g.translate(0, RING_TOP - RING_T + 0.01, 0);
    return g;
  });
  T("ring", ring, m.stand, "frame", "ft-ring");

  // One support under each fin's bearing shoe, with a raised lip on each side of the shoe.
  const supports = kit.merge("v2.table.supports", () =>
    FIN_ANGLES.flatMap((phi): Piece[] => {
      const yaw = finYaw(phi);
      const at = (x: number, y: number, z: number): V3 => [
        Math.cos(yaw) * x + Math.sin(yaw) * z,
        y,
        -Math.sin(yaw) * x + Math.cos(yaw) * z,
      ];
      return [
        { geo: kit.rbox(0.46, PAD_T, 0.3, 0.008), pos: at(0.95, RING_TOP + PAD_T / 2, 0), rot: [0, yaw, 0] },
        { geo: kit.rbox(0.4, 0.05, 0.03, 0.006), pos: at(0.95, TABLE_H + 0.02, 0.125), rot: [0, yaw, 0] },
        { geo: kit.rbox(0.4, 0.05, 0.03, 0.006), pos: at(0.95, TABLE_H + 0.02, -0.125), rot: [0, yaw, 0] },
      ];
    }),
  );
  T("supports", supports, m.stand, "frame", "ft-supports");

  // Legs between the fins: an inclined box beam from under the ring to a jack and foot.
  const legs = kit.merge("v2.table.legs", () => {
    const pieces: Piece[] = [];
    const top: [number, number] = [0.95, RING_TOP - RING_T];
    const foot: [number, number] = [FOOT_R, 0.1];
    const dx = foot[0] - top[0];
    const dy = foot[1] - top[1];
    const len = Math.hypot(dx, dy);
    const tilt = Math.atan2(dx, -dy); // lean outward from vertical
    for (let i = 0; i < 4; i++) {
      const phi = (i * Math.PI) / 2;
      const yaw = finYaw(phi);
      const mid: [number, number] = [(top[0] + foot[0]) / 2, (top[1] + foot[1]) / 2];
      pieces.push({
        geo: kit.rbox(0.11, len, 0.13, 0.012),
        pos: [Math.sin(phi) * mid[0], mid[1], Math.cos(phi) * mid[0]],
        rot: [0, yaw, tilt],
      });
      pieces.push({ geo: kit.cyl(0.05, 0.05, 0.12, 16), pos: [Math.sin(phi) * FOOT_R, 0.1, Math.cos(phi) * FOOT_R] });
    }
    return pieces;
  });
  T("legs", legs, m.stand, "frame", "ft-legs");

  const feet = kit.merge("v2.table.feet", () =>
    [0, 1, 2, 3].map((i): Piece => {
      const phi = (i * Math.PI) / 2;
      return { geo: kit.cyl(0.14, 0.15, 0.04, 24), pos: [Math.sin(phi) * FOOT_R, 0.02, Math.cos(phi) * FOOT_R] };
    }),
  );
  T("feet", feet, m.deflector, "frame", "ft-legs");

  // Four-sided blast deflector under the nozzle; its faces turn the jet out between the legs.
  T("deflector", kit.cyl(0.02, 0.66, 0.46, 4), m.deflector, "frame", "ft-deflector", { pos: [0, 0.23, 0] });
}
