import type { V3 } from "./primitives";

/**
 * Dimensions of the V-2 exhibit, shown in its Bumper-WAC configuration: a V-2
 * booster carrying a WAC Corporal upper stage in its modified nose.
 *
 * Geometry is authored in metres inside a group scaled by `SCALE`, so the
 * numbers below can be read against published figures. Y is up; the rocket
 * stands on its fins on a firing table, with fins I–IV at 45°, 135°, 225° and
 * 315° from +Z (the front, towards the default camera).
 *
 * Published (see catalogue.ts): V-2 length 14.036 m; body diameter 1.651 m;
 * fin span 3.564 m; section lengths 2.010 m (warhead), 1.410 m (instrument
 * compartment), 6.215 m (centre section) and 4.401 m (tail). WAC Corporal as
 * the Bumper upper stage: 0.305 m diameter, four fins spanning 1.22 m, about
 * 15 ft (4.6 m) long; Bumper overall 17.25 m (sources range to 62 ft). The
 * upper stage is drawn enlarged (`WAC_SHOW`), so the stack as drawn is ≈ 18 m.
 * Approximate (estimated from photographs and drawings, not published):
 * the exact ogive, the tail taper and base diameter, the fin planforms, how
 * deep the upper stage sits in the nose, every detail dimension — rudders,
 * vanes, hatches, nozzle, firing table — and the arrangement of the interior.
 */

/** Scene units per metre. The exhibit (table + Bumper stack as drawn) is ≈ 6.4 units tall. */
export const SCALE = 0.345;

/** Published section lengths, metres. */
export const LEN = { warhead: 2.01, instrument: 1.41, centre: 6.215, tail: 4.401 } as const;
export const TOTAL = LEN.warhead + LEN.instrument + LEN.centre + LEN.tail; // 14.036

/** Heights above the fin bearing surfaces (rocket-local y), metres. */
export const H = {
  /** Top of the tail section = tail / centre joint. */
  tail: LEN.tail,
  /** Centre / instrument-compartment joint. */
  centre: LEN.tail + LEN.centre,
  /** Instrument-compartment / warhead joint. */
  instrument: LEN.tail + LEN.centre + LEN.instrument,
  /** Nose tip. */
  tip: TOTAL,
  /** Bottom of the tail shell (thrust ring). The fins reach below it. */
  base: 0.34,
  /** Nozzle exit plane. */
  nozzleExit: 0.36,
  /** Top of the fin root (leading edge meets the body). */
  finRoot: 3.94,
} as const;

/** Body radius (published diameter 1.651 m). */
export const R_MAX = 1.651 / 2;
/** Tail radius at the thrust ring (approximate). */
export const R_BASE = 0.6;
/** Fin tip radius (published span 3.564 m). */
export const R_FIN = 3.564 / 2;
/** Nozzle exit radius (approximate). */
export const R_EXIT = 0.37;

/** Height of the firing table's fin supports above the floor (approximate). */
export const TABLE_H = 0.62;

/** Fin plane angles from +Z towards +X, radians: fins I–IV. */
export const FIN_ANGLES = [45, 135, 225, 315].map((d) => (d * Math.PI) / 180);

/**
 * Rotation about Y that turns a part authored in a fin-local frame (x radial
 * outward, y up, z across the fin) into the fin plane at angle `phi`.
 */
export const finYaw = (phi: number) => phi - Math.PI / 2;

/* ------------------------------------------------------------------ */
/* Bumper upper stage                                                  */
/* ------------------------------------------------------------------ */

/**
 * WAC Corporal as the Bumper second stage, metres, at its true size. `tail`
 * is its base in rocket-local height.
 */
export const WAC = {
  radius: 0.305 / 2,
  length: 4.57,
  /** Base of the upper stage, inside the V-2's nose (approximate). */
  tail: 12.3,
  /** Fin tip radius (published span 1.22 m). */
  finR: 1.22 / 2,
} as const;

/**
 * Display scale of the upper stage: drawn wider and longer than true size so
 * it reads clearly beside the 1.65 m V-2 (the real stage was a fifth of its
 * width). The catalogue says so and keeps the true figures.
 */
export const WAC_SHOW = { radial: 2, length: 1.25 } as const;

/** Upper-stage body radius as drawn. */
export const WAC_R = WAC.radius * WAC_SHOW.radial;

/** Top of the Bumper stack as drawn (the real stack: 17.25 m, sources range to 62 ft). */
export const STACK_TOP = WAC.tail + WAC.length * WAC_SHOW.length;

/**
 * Open sector of the cutaway tanks and insulation, facing the default camera
 * (radians from +Z towards +X): the interior reads like a museum cutaway.
 */
export const CUT = { from: (-25 * Math.PI) / 180, to: (85 * Math.PI) / 180 } as const;

/* ------------------------------------------------------------------ */
/* Body profile                                                        */
/* ------------------------------------------------------------------ */

const OGIVE_L = H.tip - H.centre; // warhead + instrument compartment: 3.42 m
const OGIVE_RHO = (R_MAX * R_MAX + OGIVE_L * OGIVE_L) / (2 * R_MAX);
/** Blend of a tangent ogive and a cone: the V-2 nose is fuller than a cone but sharper than a tangent ogive. */
const OGIVE_W = 0.65;

/**
 * Radius of the outer skin at height `h` (rocket-local, metres): a tapered
 * tail that meets the cylinder tangentially, the cylindrical centre section,
 * and an ogival nose through the instrument compartment and warhead.
 */
export function profile(h: number): number {
  if (h <= H.base) return R_BASE;
  if (h < H.tail) {
    const t = (h - H.base) / (H.tail - H.base);
    return R_BASE + (R_MAX - R_BASE) * (1 - Math.pow(1 - t, 1.8));
  }
  if (h <= H.centre) return R_MAX;
  const x = Math.max(0, H.tip - h); // distance back from the tip
  const ogive = Math.sqrt(Math.max(0, OGIVE_RHO * OGIVE_RHO - (OGIVE_L - x) * (OGIVE_L - x))) + R_MAX - OGIVE_RHO;
  const cone = (R_MAX * x) / OGIVE_L;
  return OGIVE_W * ogive + (1 - OGIVE_W) * cone;
}

/** Height where the Bumper nose is cut back to an opening of radius `r`. */
function cutHeight(r: number): number {
  let lo = H.instrument;
  let hi = H.tip;
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    if (profile(mid) > r) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

/** Inner radius of the collar around the upper stage. */
export const COLLAR_IN = WAC_R + 0.018;

/** The modified nose ends at an opening the upper stage rises from, just wider than the collar. */
export const NOSE_CUT = cutHeight(COLLAR_IN + 0.085);

/** Slope of the profile, dr/dh (used to lean strips and hatches with the skin). */
export function profileSlope(h: number): number {
  const e = 0.01;
  return (profile(h + e) - profile(h - e)) / (2 * e);
}

/* ------------------------------------------------------------------ */
/* Roll pattern                                                        */
/* ------------------------------------------------------------------ */

/**
 * Representative black-and-white roll pattern. Quadrant k spans the fin
 * planes at 45° + 90°k and 135° + 90°k. Alternate sections invert, giving the
 * checkerboard of the Peenemünde test rockets; the exact layout varied from
 * rocket to rocket.
 */
export const SECTION_INVERT = { nose: false, instrument: true, centre: false, tail: true } as const;

export function quadrantIsBlack(k: number, invert: boolean): boolean {
  return (k % 2 === 0) !== invert;
}

/* ------------------------------------------------------------------ */
/* Exploded view                                                       */
/* ------------------------------------------------------------------ */

/**
 * The airframe separates at its section joints, the way it was built and
 * transported, and lifts clear of the engine, which stays on its mount above
 * the firing table. Fins and rudders also move outward; the jet vanes stand
 * off the nozzle exit. Fin-local vectors are x radial, y up. Metres.
 */
export const EX = {
  tail: [0, 3.3, 0] as V3,
  centre: [0, 4.1, 0] as V3,
  instrument: [0, 4.8, 0] as V3,
  nose: [0, 5.5, 0] as V3,
  /** The upper stage slides out of the nose rails. */
  upper: [0, 6.9, 0] as V3,
  /** Fin-local. */
  fin: [0.9, 3.3, 0] as V3,
  /** Fin-local. */
  rudder: [1.35, 3.3, 0] as V3,
  /** Fin-local. */
  jetVane: [0.3, 0, 0] as V3,
};
