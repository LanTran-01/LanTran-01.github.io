import { LatheGeometry, Vector2, type BufferGeometry } from "three";

/**
 * Surfaces of revolution that follow a body profile — skin panels, raised
 * joint bands — for machines built around a long axis (rockets, missiles).
 * The axis is local Y; angles (phi) are measured from +Z towards +X, like
 * LatheGeometry. Profiles run in increasing height so faces point outward.
 */

/** Body radius at height `h` along the axis. */
export type Profile = (h: number) => number;

const TAU = Math.PI * 2;

/** Segments for an arc so facets stay ≈ 3.75° wide. */
export const arcSegments = (phi0: number, phi1: number) => Math.max(2, Math.round(((phi1 - phi0) / TAU) * 96));

/** Partial surface of revolution on `profile` between h0 and h1, pushed out by `offset`. */
export function revolveSheet(
  profile: Profile,
  h0: number,
  h1: number,
  phi0: number,
  phi1: number,
  offset = 0,
  hSeg = 24,
  phiSeg = 24,
): BufferGeometry {
  const pts: Vector2[] = [];
  for (let i = 0; i <= hSeg; i++) {
    const h = h0 + ((h1 - h0) * i) / hSeg;
    pts.push(new Vector2(profile(h) + offset, h));
  }
  const g = new LatheGeometry(pts, Math.max(1, phiSeg), phi0, phi1 - phi0);
  g.deleteAttribute("uv");
  return g;
}

/**
 * A raised band around the body between h0 and h1, with chamfered lips so it
 * reads as a separate ring from any angle.
 */
export function revolveBand(
  profile: Profile,
  h0: number,
  h1: number,
  lift: number,
  phi0 = 0,
  phi1 = TAU,
  steps = 4,
): BufferGeometry {
  const lip = Math.min(0.004, (h1 - h0) / 4);
  const pts: Vector2[] = [new Vector2(profile(h0), h0)];
  for (let i = 0; i <= steps; i++) {
    const h = h0 + lip + ((h1 - h0 - 2 * lip) * i) / steps;
    pts.push(new Vector2(profile(h) + lift, h));
  }
  pts.push(new Vector2(profile(h1), h1));
  const g = new LatheGeometry(pts, arcSegments(phi0, phi1), phi0, phi1 - phi0);
  g.deleteAttribute("uv");
  return g;
}
