import { LatheGeometry, Vector2, type BufferGeometry, type Object3D } from "three";
import { revolveBand, revolveSheet } from "@/features/model/procedural/revolve";
import { EX, FIN_ANGLES, HANGER_SIDE, R, STATION, finYaw, profile } from "./layout";
import { group, type Kit, type Piece } from "./primitives";

/**
 * The airframe's four sections, tail to nose: aft body (with the nozzle),
 * centre body (launch hangers, umbilical connector, access panels), forward
 * body (canard collars, display band) and the radome. Every section has its
 * own joint ring, screw row and end closures, so it reads as a separate part
 * when the Sections view pulls the airframe apart. Metres along the axis.
 */

const TAU = Math.PI * 2;

const sheet = (h0: number, h1: number, phi0 = 0, phi1 = TAU, offset = 0, hSeg = 2, phiSeg = 64): BufferGeometry =>
  revolveSheet(profile, h0, h1, phi0, phi1, offset, hSeg, phiSeg);
const band = (h0: number, h1: number, lift: number, phi0 = 0, phi1 = TAU): BufferGeometry =>
  revolveBand(profile, h0, h1, lift, phi0, phi1, 2);

/** Small radial screw heads around the body at height h. */
function screwRing(kit: Kit, h: number, count: number, phase = 0): Piece[] {
  const head = kit.cylZ(0.0034, 0.003, 6);
  const rr = profile(h) + 0.0028;
  return Array.from({ length: count }, (_, i) => {
    const phi = phase + (i / count) * TAU;
    return { geo: head, pos: [Math.sin(phi) * rr, h, Math.cos(phi) * rr], rot: [0, phi, 0] } satisfies Piece;
  });
}

/** Joint at a section end: a narrow raised ring and a screw row on this section's side. */
function joint(kit: Kit, h: number, side: "above" | "below", w = 0.014): Piece[] {
  const h0 = side === "above" ? h : h - w;
  const h1 = side === "above" ? h + w : h;
  return [{ geo: kit.tmp(band(h0, h1, 0.0022)) }, ...screwRing(kit, (h0 + h1) / 2, 16, side === "above" ? 0 : Math.PI / 16)];
}

/** End closure of a section, seen when the airframe is separated. */
function closure(kit: Kit, h: number, side: "above" | "below"): Piece {
  const r = profile(h) - 0.001;
  return { geo: kit.cyl(r, r, 0.004, 48), pos: [0, side === "above" ? h + 0.002 : h - 0.002, 0] };
}

/** Thin raised outline of a curved access panel. */
function panelOutline(kit: Kit, phi: number, halfPhi: number, h0: number, h1: number): Piece[] {
  const w = 0.006;
  const dphi = w / R;
  const a0 = phi - halfPhi;
  const a1 = phi + halfPhi;
  return [
    { geo: kit.tmp(revolveBand(profile, h0, h0 + w, 0.0012, a0, a1, 1)) },
    { geo: kit.tmp(revolveBand(profile, h1 - w, h1, 0.0012, a0, a1, 1)) },
    { geo: kit.tmp(revolveSheet(profile, h0, h1, a0, a0 + dphi, 0.0012, 2, 1)) },
    { geo: kit.tmp(revolveSheet(profile, h0, h1, a1 - dphi, a1, 0.0012, 2, 1)) },
    ...[h0 + 0.012, h1 - 0.012].flatMap((h): Piece[] =>
      [a0 + dphi * 1.6, a1 - dphi * 1.6].map((a) => ({
        geo: kit.cylZ(0.0026, 0.003, 6),
        pos: [Math.sin(a) * (R + 0.0022), h, Math.cos(a) * (R + 0.0022)],
        rot: [0, a, 0],
      })),
    ),
  ];
}

/* ------------------------------------------------------------------ */
/* Aft body                                                            */
/* ------------------------------------------------------------------ */

function buildAft(kit: Kit, body: Object3D) {
  const { m } = kit;
  const A = kit.scope(body, "aft");
  const ex = EX.aft;
  const skin = kit.merge("db.aft.skin", () => [
    { geo: kit.tmp(sheet(0, STATION.boattail, 0, TAU, 0, 6)) },
    { geo: kit.tmp(sheet(STATION.boattail, STATION.aftJoint)) },
  ]);
  A("skin", skin, m.paint, "armor", "as-skin", { ex });

  // Aft ring at the end of the boattail, and the annular end closure around the nozzle.
  const ring = kit.merge("db.aft.ring", () => {
    const endFace = new LatheGeometry([new Vector2(0.063, 0.0005), new Vector2(profile(0), 0.0005)], 64);
    endFace.deleteAttribute("uv");
    return [{ geo: kit.tmp(band(STATION.boattail - 0.004, STATION.boattail + 0.016, 0.0022)) }, { geo: kit.tmp(endFace) }];
  });
  A("aft_ring", ring, m.metal, "frame", "as-ring", { ex });

  // Nozzle exit: a rim and a sooty throat seen from behind.
  const nozzleInner = kit.memo("db.aft.nozzleInner", () => {
    const g = new LatheGeometry(
      [new Vector2(0.03, 0.1), new Vector2(0.042, 0.06), new Vector2(0.056, 0.015), new Vector2(0.061, 0.0)],
      40,
    );
    g.deleteAttribute("uv");
    return g;
  });
  A("nozzle_throat", nozzleInner, m.soot, "frame", "as-nozzle", { ex });
  const rim = kit.torus(0.061, 0.004, 8, 48);
  A("nozzle_rim", rim, m.nozzle, "frame", "as-nozzle", { pos: [0, 0.0005, 0], rot: [Math.PI / 2, 0, 0], ex });

  const j = kit.merge("db.aft.joint", () => joint(kit, STATION.aftJoint, "below"));
  A("joint", j, m.metal, "frame", "as-joint", { ex });
  A("closure", kit.merge("db.aft.closure", () => [closure(kit, STATION.aftJoint, "below")]), m.soot, "frame", "as-joint", { ex });
}

/* ------------------------------------------------------------------ */
/* Centre body                                                         */
/* ------------------------------------------------------------------ */

/** Hanger stations and the umbilical connector, along one side of the centre body. */
const HANGERS = [1.42, 2.36];
const UMBILICAL = 1.9;

function buildCentre(kit: Kit, body: Object3D) {
  const { m } = kit;
  const C = kit.scope(body, "centre");
  const ex = EX.centre;
  C("skin", kit.memo("db.centre.skin", () => sheet(STATION.aftJoint, STATION.fwdJoint)), m.paint, "armor", "cb-skin", { ex });

  const panels = kit.merge("db.centre.panels", () => [
    ...panelOutline(kit, 0, 0.5, 1.55, 1.83),
    ...panelOutline(kit, Math.PI, 0.5, 2.0, 2.26),
    ...panelOutline(kit, Math.PI, 0.42, 1.28, 1.44),
  ]);
  C("access_panels", panels, m.seam, "armor", "cb-panels", { ex });

  const joints = kit.merge("db.centre.joints", () => [...joint(kit, STATION.aftJoint, "above"), ...joint(kit, STATION.fwdJoint, "below")]);
  C("joints", joints, m.metal, "frame", "cb-joints", { ex });
  const closures = kit.merge("db.centre.closures", () => [closure(kit, STATION.aftJoint, "above"), closure(kit, STATION.fwdJoint, "below")]);
  C("closures", closures, m.soot, "frame", "cb-joints", { ex });

  // Hanger side of the body: launch hangers and the umbilical connector (x radial in this frame).
  const side = group(body, "centre.hangerSide", [0, 0, 0], [0, finYaw(HANGER_SIDE), 0]);
  const T = kit.scope(side, "centre");
  const hangers = kit.merge("db.centre.hangers", () =>
    HANGERS.flatMap((y): Piece[] => [
      { geo: kit.rbox(0.014, 0.05, 0.036, 0.003), pos: [R + 0.004, y, 0] },
      { geo: kit.rbox(0.016, 0.024, 0.012, 0.002), pos: [R + 0.017, y, 0] },
      { geo: kit.rbox(0.007, 0.058, 0.034, 0.002), pos: [R + 0.027, y, 0] },
    ]),
  );
  T("launch_hangers", hangers, m.dark, "frame", "cb-hangers", { ex });
  const umbilical = kit.merge("db.centre.umbilical", () => [
    { geo: kit.rbox(0.014, 0.13, 0.044, 0.005), pos: [R + 0.003, UMBILICAL, 0] },
    { geo: kit.rbox(0.008, 0.05, 0.03, 0.003), pos: [R + 0.012, UMBILICAL + 0.03, 0] },
    { geo: kit.cylX(0.011, 0.016, 16), pos: [R + 0.014, UMBILICAL - 0.035, 0] },
  ]);
  T("umbilical", umbilical, m.dark, "frame", "cb-umbilical", { ex });
}

/* ------------------------------------------------------------------ */
/* Forward body                                                        */
/* ------------------------------------------------------------------ */

/** Hinge station of the control canards. */
export const CANARD_HINGE = 2.865;

function buildForward(kit: Kit, body: Object3D) {
  const { m } = kit;
  const F = kit.scope(body, "forward");
  const ex = EX.forward;
  F("skin", kit.memo("db.forward.skin", () => sheet(STATION.fwdJoint, STATION.radome)), m.paint, "armor", "fs-skin", { ex });
  F("display_band", kit.memo("db.forward.band", () => sheet(2.6, 2.665, 0, TAU, 0.0009, 1)), m.band, "armor", "fs-band", { ex });

  // Collars where the control canards' shafts meet the body.
  const collars = kit.merge("db.forward.collars", () =>
    FIN_ANGLES.map((phi): Piece => {
      const rr = R + 0.0015;
      return { geo: kit.cylZ(0.017, 0.006, 20), pos: [Math.sin(phi) * rr, CANARD_HINGE, Math.cos(phi) * rr], rot: [0, phi, 0] };
    }),
  );
  F("canard_collars", collars, m.metal, "frame", "fs-collars", { ex });

  const joints = kit.merge("db.forward.joint", () => [...joint(kit, STATION.fwdJoint, "above"), ...screwRing(kit, STATION.radome - 0.008, 16)]);
  F("joint", joints, m.metal, "frame", "fs-joint", { ex });
  const closures = kit.merge("db.forward.closures", () => [closure(kit, STATION.fwdJoint, "above"), closure(kit, STATION.radome, "below")]);
  F("closures", closures, m.soot, "frame", "fs-joint", { ex });
}

/* ------------------------------------------------------------------ */
/* Radome                                                              */
/* ------------------------------------------------------------------ */

function buildRadome(kit: Kit, body: Object3D) {
  const { m } = kit;
  const N = kit.scope(body, "radome");
  const ex = EX.radome;
  const shell = kit.memo("db.radome.shell", () => sheet(STATION.radome + 0.018, STATION.tip - 0.004, 0, TAU, 0, 40, 64));
  N("shell", shell, m.radome, "armor", "rd-shell", { ex });
  // Attachment ring: the metal band the radome is fixed to.
  const ring = kit.merge("db.radome.ring", () => [
    { geo: kit.tmp(sheet(STATION.radome, STATION.radome + 0.018, 0, TAU, 0.0006, 2)) },
    ...screwRing(kit, STATION.radome + 0.009, 12, Math.PI / 12),
  ]);
  N("attachment_ring", ring, m.metal, "frame", "rd-ring", { ex });
  N("tip", kit.sphere(0.0062, 16, 10), m.metal, "frame", "rd-tip", { pos: [0, STATION.tip - 0.006, 0], ex });
}

/** Radome, forward body, centre body and aft body. */
export function buildAirframe(kit: Kit, body: Object3D) {
  buildAft(kit, body);
  buildCentre(kit, body);
  buildForward(kit, body);
  buildRadome(kit, body);
}
