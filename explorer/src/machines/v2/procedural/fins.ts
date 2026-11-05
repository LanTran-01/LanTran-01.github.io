import type { Object3D } from "three";
import { EX, FIN_ANGLES, H, R_BASE, R_FIN, finYaw, profile } from "./layout";
import { clamp01, extrudeGeo, group, lerp, warp, type Kit, type P2 } from "./primitives";

/**
 * Four stabilising fins with their air rudders, and the four graphite jet
 * vanes in the exhaust. Everything is authored once in a fin-local frame —
 * x radial (outward from the axis), y up, z across the fin — and placed in
 * each fin plane by a group turned about the rocket axis. Metres.
 *
 * The planform is an approximation from photographs: root along the tapered
 * tail, a gently convex leading edge, a straight outer edge at the published
 * span, and the air rudder at the outer trailing (bottom) corner.
 */

/** Air rudder, fin-local: hinged along its top edge, deflecting across the fin plane. */
const RUDDER = { x0: 1.33, x1: R_FIN - 0.004, bottom: 0.06, top: 0.42 } as const;
/** Bottom edge of the fin (the bearing shoe below it rests on the firing table). */
const FIN_FOOT = 0.03;
/** Outer edge runs from the rudder notch up to here. */
const TIP_TOP = 1.05;
/** Fin thickness at the root; it thins towards the tip. */
const FIN_T = 0.17;
/** Jet vane, fin-local: just below the nozzle exit. */
const VANE = { x0: 0.08, x1: 0.33, bottom: 0.07, top: 0.33 } as const;

function finOutline(): P2[] {
  const inset = 0.02;
  const pts: P2[] = [
    [R_BASE - inset, FIN_FOOT],
    [RUDDER.x0 - 0.02, FIN_FOOT],
    [RUDDER.x0 - 0.02, RUDDER.top + 0.03],
    [R_FIN, RUDDER.top + 0.03],
    [R_FIN, TIP_TOP],
  ];
  // Leading edge: a gentle convex sweep from the tip up to the root.
  const a: P2 = [R_FIN, TIP_TOP];
  const c: P2 = [1.6, 2.5];
  const b: P2 = [profile(H.finRoot) - inset, H.finRoot];
  const n = 18;
  for (let i = 1; i < n; i++) {
    const s = i / n;
    const u = 1 - s;
    pts.push([u * u * a[0] + 2 * u * s * c[0] + s * s * b[0], u * u * a[1] + 2 * u * s * c[1] + s * s * b[1]]);
  }
  // Root, top → bottom, just inside the tapered skin.
  const m = 14;
  for (let i = 0; i <= m; i++) {
    const h = H.finRoot - ((H.finRoot - H.base) * i) / m;
    pts.push([profile(h) - inset, h]);
  }
  return pts;
}

/** Thickness falls off from root to tip. */
const finThickness = (x: number) => lerp(1, 0.3, clamp01((x - R_BASE) / (R_FIN - R_BASE)));

function rootFairingOutline(): P2[] {
  const h0 = H.base + 0.04;
  const h1 = H.finRoot - 0.35;
  const n = 16;
  const inner: P2[] = [];
  const outer: P2[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const h = h0 + (h1 - h0) * t;
    // Full width along most of the root, tapering to a point at the top.
    const w = 0.09 * Math.pow(Math.sin(Math.PI * Math.min(1, t * 0.5 + 0.5)), 0.5);
    inner.push([profile(h) - 0.03, h]);
    outer.push([profile(h) + Math.max(0.004, w), h]);
  }
  return [...inner, ...outer.reverse()];
}

export function buildFins(kit: Kit, rocket: Object3D) {
  const { m } = kit;

  const fin = kit.memo("v2.fin", () =>
    warp(extrudeGeo(finOutline(), FIN_T, "xy", 0.03), (x, y, z) => [x, y, z * finThickness(x)]),
  );
  const fairing = kit.memo("v2.finFairing", () =>
    warp(extrudeGeo(rootFairingOutline(), 0.25, "xy", 0.03), (x, y, z) => {
      const out = clamp01((x - profile(y)) / 0.09);
      return [x, y, z * lerp(1, 0.55, out)];
    }),
  );
  const shoe = kit.rbox(0.38, 0.05, 0.19, 0.012);
  const rudder = kit.memo("v2.rudder", () =>
    warp(
      extrudeGeo(
        [
          [RUDDER.x0, RUDDER.bottom + 0.025],
          [RUDDER.x0 + 0.03, RUDDER.bottom],
          [RUDDER.x1, RUDDER.bottom],
          [RUDDER.x1, RUDDER.top],
          [RUDDER.x0, RUDDER.top],
        ],
        0.065,
        "xy",
        0.012,
      ),
      // Thick at the hinge, thin at the trailing edge.
      (x, y, z) => [x, y, z * lerp(0.4, 1, clamp01((y - RUDDER.bottom) / (RUDDER.top - RUDDER.bottom)))],
    ),
  );
  const hinge = kit.cylX(0.026, RUDDER.x1 - RUDDER.x0 + 0.03, 16);
  const vane = kit.extrude(
    "v2.jetVane",
    [
      [VANE.x0, VANE.bottom + 0.09],
      [VANE.x0 + 0.05, VANE.bottom],
      [VANE.x1, VANE.bottom],
      [VANE.x1, VANE.top],
      [VANE.x0 + 0.02, VANE.top],
    ],
    0.075,
    "xy",
    0.022,
  );
  const vaneMount = kit.merge("v2.vaneMount", () => [
    { geo: kit.cylX(0.022, 0.22, 12), pos: [VANE.x1 + 0.1, 0.27, 0] },
    { geo: kit.rbox(0.12, 0.2, 0.15, 0.015), pos: [0.55, 0.28, 0] },
    { geo: kit.cylZ(0.035, 0.17, 14), pos: [0.55, 0.27, 0] },
  ]);

  FIN_ANGLES.forEach((phi, i) => {
    const n = i + 1;
    // Fins I and III light, II and IV dark: each fin contrasts with one of the tail quadrants beside it.
    const paint = i % 2 === 0 ? m.paintWhite : m.paintBlack;
    const g = group(rocket, `fin.${n}`, [0, 0, 0], [0, finYaw(phi), 0]);
    const F = kit.scope(g, "fins");
    const C = kit.scope(g, "control");

    F(`fin.${n}`, fin, paint, "armor", `fn-${n}`, { ex: EX.fin });
    F(`fairing.${n}`, fairing, paint, "armor", "fn-fairings", { ex: EX.fin });
    F(`shoe.${n}`, shoe, m.darkSteel, "frame", "fn-shoes", { pos: [0.95, FIN_FOOT - 0.005, 0], ex: EX.fin });

    C(`rudder.${n}`, rudder, paint, "armor", "cv-rudders", { ex: EX.rudder });
    C(`hinge.${n}`, hinge, m.darkSteel, "armor", "cv-hinges", {
      pos: [(RUDDER.x0 + RUDDER.x1) / 2, RUDDER.top + 0.012, 0],
      ex: EX.rudder,
    });
    C(`jet_vane.${n}`, vane, m.graphite, "frame", "cv-jet", { ex: EX.jetVane });
    C(`vane_mount.${n}`, vaneMount, m.darkSteel, "frame", "cv-mounts", { ex: EX.jetVane });
  });
}
