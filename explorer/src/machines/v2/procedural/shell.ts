import type { BufferGeometry } from "three";
import { arcSegments, revolveBand, revolveSheet } from "@/features/model/procedural/revolve";
import { profile } from "./layout";
import type { Kit, Piece } from "./primitives";

/**
 * Geometry that follows the body of revolution: skin quadrants, raised joint
 * bands, panel outlines and fastener rings. Angles (phi) are measured from +Z
 * towards +X, like LatheGeometry. Profiles run bottom → top so faces point
 * outward. The lathe work is shared (`revolve.ts`); this file binds it to the
 * V-2 profile.
 */

const TAU = Math.PI * 2;

export { arcSegments };

/** Partial surface of revolution on the body profile between h0 and h1, pushed out by `offset` (metres). */
export function profileSheet(
  h0: number,
  h1: number,
  phi0: number,
  phi1: number,
  offset = 0,
  hSeg = 24,
  phiSeg = 24,
): BufferGeometry {
  return revolveSheet(profile, h0, h1, phi0, phi1, offset, hSeg, phiSeg);
}

/** A raised band around the body between h0 and h1, with chamfered lips so it reads as a separate ring from any angle. */
export function bandGeometry(h0: number, h1: number, lift: number, phi0 = 0, phi1 = TAU, steps = 4): BufferGeometry {
  return revolveBand(profile, h0, h1, lift, phi0, phi1, steps);
}

/** Ring of radial bolt heads around the body at height h, centred `lift` off the skin. */
export function boltRing(kit: Kit, h: number, count: number, r = 0.011, phase = 0, lift = 0.006): Piece[] {
  const head = kit.cylZ(r, 0.012, 8);
  const rr = profile(h) + lift;
  return Array.from({ length: count }, (_, i) => {
    const phi = phase + (i / count) * TAU;
    return { geo: head, pos: [Math.sin(phi) * rr, h, Math.cos(phi) * rr], rot: [0, phi, 0] } satisfies Piece;
  });
}

export interface PanelSpec {
  /** Centre angle. */
  phi: number;
  /** Half the panel's angular width. */
  halfPhi: number;
  h0: number;
  h1: number;
}

/** Thin raised outline around a curved panel (two arcs and two meridian strips). */
export function panelOutline(kit: Kit, p: PanelSpec, width = 0.03, lift = 0.006): Piece[] {
  const dphi = width / profile((p.h0 + p.h1) / 2);
  const a0 = p.phi - p.halfPhi;
  const a1 = p.phi + p.halfPhi;
  return [
    { geo: kit.tmp(bandGeometry(p.h1 - width, p.h1, lift, a0, a1, 1)) },
    { geo: kit.tmp(bandGeometry(p.h0, p.h0 + width, lift, a0, a1, 1)) },
    { geo: kit.tmp(profileSheet(p.h0, p.h1, a0, a0 + dphi, lift, 12, 1)) },
    { geo: kit.tmp(profileSheet(p.h0, p.h1, a1 - dphi, a1, lift, 12, 1)) },
  ];
}

/** Fastener heads around a panel outline: `n` per side. */
export function panelFasteners(kit: Kit, p: PanelSpec, n = 3): Piece[] {
  const head = kit.cylZ(0.009, 0.01, 8);
  const inset = 0.015;
  const out: Piece[] = [];
  const place = (phi: number, h: number) => {
    const rr = profile(h) + 0.009;
    out.push({ geo: head, pos: [Math.sin(phi) * rr, h, Math.cos(phi) * rr], rot: [0, phi, 0] });
  };
  const a0 = p.phi - p.halfPhi + inset / profile(p.h0);
  const a1 = p.phi + p.halfPhi - inset / profile(p.h0);
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const h = p.h0 + inset + (p.h1 - p.h0 - 2 * inset) * t;
    place(a0, h);
    place(a1, h);
    if (i > 0 && i < n) {
      const phi = a0 + (a1 - a0) * t;
      place(phi, p.h0 + inset);
      place(phi, p.h1 - inset);
    }
  }
  return out;
}
