import type { V3 } from "./primitives";

/**
 * Shared dimensions of the illustrative 3U CubeSat, in scene units.
 *
 * Y up, the satellite's long axis is vertical, the front (+Z) carries body
 * cells and faces the default camera, the payload looks down (nadir, −Y) and
 * the antenna and GNSS patch sit on the zenith end (+Y). The body floats above
 * the stage so its shadow grounds it. Proportions follow the 3U form factor;
 * the scale is arbitrary and no physical dimensions are implied.
 */

/** One standard unit (1U) edge. */
export const U = 1.5;
/** Body bottom above the floor. */
export const Y0 = 1.7;
/** Body length: three units. */
export const BODY_H = 3 * U;
/** Half the body's square cross-section. */
export const HALF = U / 2;
/** Corner rail section. */
export const RAIL = 0.1;
/** Edge of a square stack board. */
export const BOARD = 1.2;
/** Stack rods sit just inside the board corners. */
export const ROD = 0.52;

/** Absolute height of a point given relative to the body bottom. */
export const y = (rel: number) => Y0 + rel;

/** Board heights above the body bottom, nadir → zenith. */
export const STACK = {
  plDetector: 1.02,
  plProc: 1.24,
  adcsBoard: 1.44,
  wheelBase: 1.53,
  mtq: 2.12,
  battery: 2.29,
  bms: 2.66,
  eps: 2.92,
  obc: 3.15,
  imu: 3.38,
  gnss: 3.65,
  comms: 3.92,
  topFrame: 4.465,
  deployer: 4.56,
} as const;

/**
 * Exploded offsets. The stack fans out vertically from the reaction wheels
 * (which stay put) so the boards separate in build order; the panels and wings
 * move outward from the faces they belong to; the rails, rings and stack rods
 * stay as the reference cage.
 */
export const EX = {
  baffle: [0, -1.05, 0] as V3,
  bottomFrame: [0, -0.8, 0] as V3,
  optics: [0, -0.62, 0] as V3,
  plDetector: [0, -0.42, 0] as V3,
  plProc: [0, -0.26, 0] as V3,
  adcsBoard: [0, -0.12, 0] as V3,
  mtq: [0, 0.18, 0] as V3,
  battery: [0, 0.4, 0] as V3,
  bms: [0, 0.62, 0] as V3,
  eps: [0, 0.85, 0] as V3,
  obc: [0, 1.1, 0] as V3,
  imu: [0, 1.36, 0] as V3,
  imuLid: [0, 1.64, 0] as V3,
  gnss: [0, 1.62, 0] as V3,
  comms: [0, 1.9, 0] as V3,
  topFrame: [0, 2.1, 0] as V3,
  deployer: [0, 2.35, 0] as V3,
  patch: [0, 2.55, 0] as V3,
  /** Face-local: outward along the panel normal. */
  panel: [0, 0, 1.15] as V3,
  /** Wing-local (+X side; mirrored for the other wing). */
  wing: [1.1, 0, -0.25] as V3,
};
