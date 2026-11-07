import type { V3 } from "./primitives";

/**
 * Dimensions of the Derby exhibit.
 *
 * The missile stands upright on its tail, nose up. It is authored in metres
 * along Y — tail at y = 0, nose tip at y = LENGTH — and scaled to scene units
 * by `SCALE`. Angles (phi, from +Z towards +X) put the wings and canards in
 * an × seen from above.
 *
 * Published: length 3.62 m, diameter 0.16 m, span 0.64 m (the rear wings).
 * Approximate (from public photographs; not published): the radome shape,
 * section joint positions, canard and wing planforms, hangers, panels and
 * nozzle.
 */

/** Scene units per metre: the 3.62 m missile stands ≈ 6.4 units tall, like the other exhibits. */
export const SCALE = 1.77;

/** Published overall length, metres. */
export const LENGTH = 3.62;
/** Published body radius (diameter 0.16 m). */
export const R = 0.08;
/** Wing tip radius (published span 0.64 m). */
export const R_WING = 0.64 / 2;

/** Section joints, metres from the tail (approximate). */
export const STATION = {
  /** Boattail ends; aft ring. */
  boattail: 0.06,
  /** Aft body / centre body joint. */
  aftJoint: 1.1,
  /** Centre body / forward body joint. */
  fwdJoint: 2.55,
  /** Forward body / radome joint. */
  radome: 3.16,
  tip: LENGTH,
} as const;

/** The tail sits just above the floor so the nozzle rim clears it. */
export const BASE_Y = 0.006;

const deg = (d: number) => (d * Math.PI) / 180;
/** Wing and canard planes: an × seen from above. */
export const FIN_ANGLES = [45, 135, 225, 315].map(deg);
/** Side of the body that carries the launch hangers and umbilical (−X, between two wings). */
export const HANGER_SIDE = deg(270);

/** Rotation about the axis that turns a part authored with x radial into the plane at angle `phi`. */
export const finYaw = (phi: number) => phi - Math.PI / 2;

/* ------------------------------------------------------------------ */
/* Body profile                                                        */
/* ------------------------------------------------------------------ */

const RADOME_L = STATION.tip - STATION.radome;
const OGIVE_RHO = (R * R + RADOME_L * RADOME_L) / (2 * R);
/** Radius of the small rounded tip of the radome. */
const TIP_R = 0.005;

/**
 * Body radius at height `h` along the axis: a short boattail at the tail, the
 * 16 cm cylinder, and a tangent-ogive radome to a small rounded tip.
 */
export function profile(h: number): number {
  if (h < STATION.boattail) return R - 0.006 * ((STATION.boattail - h) / STATION.boattail);
  if (h <= STATION.radome) return R;
  const x = Math.min(RADOME_L, Math.max(0, STATION.tip - h));
  const r = Math.sqrt(Math.max(0, OGIVE_RHO * OGIVE_RHO - (RADOME_L - x) * (RADOME_L - x))) + R - OGIVE_RHO;
  return Math.max(TIP_R, r);
}

/* ------------------------------------------------------------------ */
/* Sections view                                                       */
/* ------------------------------------------------------------------ */

/**
 * The airframe separates upward at its section joints — the aft body stays on
 * the floor — and canards and wings stand off their sections. Fin-local
 * vectors are x radial, y along the axis. Metres.
 */
export const EX = {
  aft: [0, 0, 0] as V3,
  /** Fin-local. */
  wing: [0.1, 0, 0] as V3,
  centre: [0, 0.24, 0] as V3,
  forward: [0, 0.48, 0] as V3,
  /** Fin-local. */
  canard: [0.07, 0.48, 0] as V3,
  radome: [0, 0.72, 0] as V3,
};
