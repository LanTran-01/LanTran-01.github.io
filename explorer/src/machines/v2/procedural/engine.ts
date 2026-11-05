import { LatheGeometry, Matrix4, Vector2, type Object3D } from "three";
import { H, R_EXIT } from "./layout";
import type { Kit, P2, Piece } from "./primitives";

/**
 * The rocket engine as museums display it: a bulbous combustion chamber with
 * eighteen burner cups on its head, necking to a throat and opening into a
 * conical nozzle. Inside the tail it is hidden, so every part is on the
 * internal layer — the Sections view lifts the airframe off it. The silhouette
 * is an approximation from museum photographs; no dimensions are claimed.
 */

/** Outer surface, (radius, height) bottom → top, metres above the fin bearing surfaces. */
const OUTER: P2[] = [
  [R_EXIT + 0.002, H.nozzleExit],
  [0.362, 0.46],
  [0.338, 0.62],
  [0.302, 0.8],
  [0.262, 0.97],
  [0.226, 1.12],
  [0.209, 1.21],
  [0.207, 1.26],
  [0.222, 1.33],
  [0.27, 1.41],
  [0.34, 1.5],
  [0.405, 1.61],
  [0.445, 1.73],
  [0.458, 1.83],
  [0.45, 1.91],
  [0.42, 1.98],
  [0.36, 2.04],
  [0.27, 2.08],
  [0.15, 2.1],
  [0, 2.105],
];
const THROAT_INDEX = 7;

function lathe(points: readonly P2[], seg = 48): LatheGeometry {
  const g = new LatheGeometry(points.map(([r, h]) => new Vector2(r, h)), seg);
  g.deleteAttribute("uv");
  return g;
}

/** Radius and outward normal angle (from vertical) of the outer surface at height h. */
function surfaceAt(h: number): { r: number; tilt: number } {
  for (let i = 0; i < OUTER.length - 1; i++) {
    const [r0, h0] = OUTER[i];
    const [r1, h1] = OUTER[i + 1];
    if (h >= h0 && h <= h1) {
      const t = (h - h0) / (h1 - h0);
      // Lathe normal is (dh, -dr) in (r, h): its angle from vertical.
      return { r: r0 + (r1 - r0) * t, tilt: Math.atan2(h1 - h0, -(r1 - r0)) };
    }
  }
  return { r: 0, tilt: 0 };
}

export function buildEngine(kit: Kit, rocket: Object3D) {
  const { m } = kit;
  const E = kit.scope(rocket, "engine");

  // Nozzle: outer wall, sooty inner wall (profile reversed so it faces inward) and the exit lip.
  const nozzle = kit.merge("v2.nozzle", () => {
    const outer = OUTER.slice(0, THROAT_INDEX + 1);
    return [
      { geo: kit.tmp(lathe(outer)) },
      { geo: kit.torus(R_EXIT - 0.004, 0.011, 8, 64), rot: [Math.PI / 2, 0, 0], pos: [0, H.nozzleExit, 0] },
    ] satisfies Piece[];
  });
  E("nozzle", nozzle, m.engine, "internal", "en-nozzle");
  const inner = kit.memo("v2.nozzleInner", () =>
    lathe(
      OUTER.slice(0, 5)
        .map(([r, h]): P2 => [r - 0.012, h])
        .reverse(),
    ),
  );
  E("nozzle_inner", inner, m.soot, "internal", "en-nozzle");

  // Chamber from the throat up over the head.
  const chamber = kit.memo("v2.chamber", () => lathe(OUTER.slice(THROAT_INDEX)));
  E("chamber", chamber, m.engine, "internal", "en-chamber");

  // Eighteen burner cups: twelve around the shoulder of the head, six nearer the top.
  const cups = kit.merge("v2.cups", () => {
    const cup = kit.merge("v2.cup", () => [
      { geo: kit.cyl(0.07, 0.074, 0.2, 18), pos: [0, 0.1, 0] },
      { geo: kit.sphere(0.07, 18, 10), pos: [0, 0.2, 0], scale: [1, 0.55, 1] },
      { geo: kit.torus(0.074, 0.01, 6, 24), pos: [0, 0.03, 0], rot: [Math.PI / 2, 0, 0] },
    ]);
    const pieces: Piece[] = [];
    const ring = (count: number, h: number, extraTilt: number, phase: number, sink: number) => {
      const { r, tilt } = surfaceAt(h);
      for (let i = 0; i < count; i++) {
        const phi = phase + (i / count) * Math.PI * 2;
        const a = Math.min(tilt, Math.PI / 2) * 0.7 + extraTilt;
        const mtx = new Matrix4()
          .makeRotationY(phi)
          .multiply(new Matrix4().makeRotationX(a))
          .setPosition(Math.sin(phi) * (r - sink), h - sink * 0.5, Math.cos(phi) * (r - sink));
        pieces.push({ geo: cup, matrix: mtx });
      }
    };
    ring(12, 2.0, 0, Math.PI / 12, 0.05);
    ring(6, 2.085, 0.12, 0, 0.04);
    return pieces;
  });
  E("burner_cups", cups, m.engineHead, "internal", "en-heads");

  // A feed ring linking the outer cups, simplified.
  const feed = kit.torus(0.505, 0.022, 10, 72);
  E("feed_ring", feed, m.engineHead, "internal", "en-heads", { pos: [0, 2.13, 0], rot: [Math.PI / 2, 0, 0] });
}
