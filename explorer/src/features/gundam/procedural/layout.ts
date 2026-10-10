import type { V3 } from "./primitives";

/**
 * Anchor points shared by the body-region builders (scene units, root space).
 * Y up, faces +Z, feet on y = 0, machine's right side at −X. Left-side values
 * are given; the right side is mirrored by `bilateral()`.
 */
export const LAYOUT = {
  /** Hip pivot (left). */
  hip: [0.37, 2.92, 0.0] as V3,
  /** Leg splay about Z (left; bottom moves outward). */
  legSplay: 0.045,
  /** Knee and ankle pivots measured down the leg's local −Y axis. */
  kneeDrop: 1.06,
  ankleDrop: 2.44,
  /** Foot yaw (toe out). */
  footYaw: 0.07,

  /** Shoulder joint pivot (left). */
  shoulder: [0.93, 4.36, -0.02] as V3,
  /** Arm abduction about Z (left; hand moves outward). */
  armSplay: 0.2,

  /** Head pivot (base of helmet, above the neck gimbal). */
  head: [0, 4.86, 0.04] as V3,

  /** Torso extents used by chest / backpack. */
  chestBackZ: -0.52,
} as const;
