import { CylinderGeometry, ExtrudeGeometry, LatheGeometry, Path, Shape, Vector2, type Object3D } from "three";
import { COLLAR_IN, EX, FIN_ANGLES, H, NOSE_CUT, R_BASE, SECTION_INVERT, WAC, profile, quadrantIsBlack } from "./layout";
import { bandGeometry, boltRing, panelFasteners, panelOutline, profileSheet, type PanelSpec } from "./shell";
import type { Kit, PartFn, Piece, V3 } from "./primitives";

/**
 * The four airframe sections, as the A-4 was built and shipped: nose,
 * instrument compartment, centre section and tail. Each has painted skin
 * quadrants (the roll pattern), raised joint bands with bolt rings at its
 * ends and bulkheads closing it, so it reads as a solid section when the
 * airframe is separated. Skin and bulkheads are on the armor layer, so the
 * Internal view clears them; joint bands stay as the reference structure.
 * Heights in metres above the fin bearing surfaces.
 *
 * The nose is shown as modified for Bumper: cut back to an opening the WAC
 * Corporal rises from, with slots where its fins are recessed into the cone.
 */

const QUARTER = Math.PI / 2;
/** Quadrant 0 starts at fin I (45°). */
const Q0 = Math.PI / 4;
/** Quadrant centres: midway between fins, where hatches and doors sit. */
const BETWEEN_FINS = [0, 1, 2, 3].map((i) => i * QUARTER);

/** Index of the quadrant containing angle `phi`. */
function quadrantOf(phi: number): number {
  const a = (((phi - Q0) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
  return Math.floor(a / QUARTER) % 4;
}

/** Paint quadrants of one section. */
function skin(kit: Kit, S: PartFn, key: string, sub: string, h0: number, h1: number, invert: boolean, ex: V3, hSeg: number) {
  const { m } = kit;
  for (let k = 0; k < 4; k++) {
    const phi0 = Q0 + k * QUARTER;
    const geo = kit.memo(`v2.skin.${key}.${k}`, () => profileSheet(h0, h1, phi0, phi0 + QUARTER, 0, hSeg, 24));
    S(`skin.${k}`, geo, quadrantIsBlack(k, invert) ? m.paintBlack : m.paintWhite, "armor", sub, { ex });
  }
}

/** Joint at a section end: a raised band on this section's side of the joint, with a bolt ring. */
function jointPieces(kit: Kit, hJoint: number, side: "above" | "below", w = 0.05): Piece[] {
  const h0 = side === "above" ? hJoint : hJoint - w;
  const h1 = side === "above" ? hJoint + w : hJoint;
  return [
    { geo: kit.tmp(bandGeometry(h0, h1, 0.008)) },
    ...boltRing(kit, (h0 + h1) / 2, 36, 0.011, side === "above" ? 0 : Math.PI / 36),
  ];
}

/** Bulkhead disc closing a section at a joint. */
function bulkhead(kit: Kit, hJoint: number, side: "above" | "below"): Piece {
  const r = profile(hJoint) - 0.003;
  return { geo: kit.cyl(r, r, 0.012, 64), pos: [0, side === "above" ? hJoint + 0.006 : hJoint - 0.006, 0] };
}

/** Hatch or door: a panel in the paint of its quadrant, plus outline and fasteners (merged per section). */
function panels(kit: Kit, S: PartFn, key: string, sub: string, specs: PanelSpec[], invert: boolean, ex: V3) {
  const { m } = kit;
  const inset = 0.03;
  for (const [i, p] of specs.entries()) {
    const dphi = inset / profile((p.h0 + p.h1) / 2);
    const geo = kit.memo(`v2.panel.${key}.${i}`, () =>
      profileSheet(p.h0 + inset, p.h1 - inset, p.phi - p.halfPhi + dphi, p.phi + p.halfPhi - dphi, 0.0035, 10, 12),
    );
    const black = quadrantIsBlack(quadrantOf(p.phi), invert);
    S(`${key}.panel.${i}`, geo, black ? m.paintBlack : m.paintWhite, "armor", sub, { ex });
  }
  const outline = kit.merge(`v2.${key}.outline`, () => specs.flatMap((p) => panelOutline(kit, p)));
  S(`${key}.outline`, outline, m.seam, "armor", sub, { ex });
  const fasteners = kit.merge(`v2.${key}.fasteners`, () => specs.flatMap((p) => panelFasteners(kit, p, 4)));
  S(`${key}.fasteners`, fasteners, m.seam, "armor", sub, { ex });
}

/* ------------------------------------------------------------------ */
/* Nose section, modified for Bumper                                   */
/* ------------------------------------------------------------------ */

/** Half-width of each fin slot (metres), around the enlarged stage's fins. */
const SLOT_HALF = 0.045;

function buildNose(kit: Kit, rocket: Object3D) {
  const { m } = kit;
  const S = kit.scope(rocket, "nose");
  skin(kit, S, "nose", "ns-shell", H.instrument, NOSE_CUT, SECTION_INVERT.nose, EX.nose, 36);
  S("bulkhead", kit.merge("v2.nose.bulkhead", () => [bulkhead(kit, H.instrument, "above")]), m.seam, "armor", "ns-shell", {
    ex: EX.nose,
  });

  // Collar at the opening: a raised band on the skin and a ring around the upper stage, broken by the fin slots.
  const collar = kit.merge("v2.nose.collar", () => {
    const rOut = profile(NOSE_CUT) + 0.006;
    const slot = SLOT_HALF / ((rOut + COLLAR_IN) / 2);
    const pieces: Piece[] = [{ geo: kit.tmp(bandGeometry(NOSE_CUT - 0.07, NOSE_CUT, 0.007)) }];
    for (let k = 0; k < 4; k++) {
      const a0 = FIN_ANGLES[k] + slot;
      const a1 = FIN_ANGLES[(k + 1) % 4] + (k === 3 ? Math.PI * 2 : 0) - slot;
      const g = new LatheGeometry([new Vector2(rOut, NOSE_CUT), new Vector2(COLLAR_IN, NOSE_CUT)], 16, a0, a1 - a0);
      g.deleteAttribute("uv");
      pieces.push({ geo: kit.tmp(g) });
    }
    return pieces;
  });
  S("collar", collar, m.seam, "frame", "ns-collar", { ex: EX.nose });

  // Slots in the cone where the upper stage's fins are recessed.
  const slots = kit.merge("v2.nose.slots", () =>
    FIN_ANGLES.map((phi) => {
      const h0 = WAC.tail + 0.04;
      const half = SLOT_HALF / profile((h0 + NOSE_CUT) / 2);
      return { geo: kit.tmp(profileSheet(h0, NOSE_CUT - 0.07, phi - half, phi + half, 0.0025, 10, 2)) };
    }),
  );
  S("fin_slots", slots, m.soot, "frame", "ns-slots", { ex: EX.nose });

  const joint = kit.merge("v2.nose.joint", () => jointPieces(kit, H.instrument, "above"));
  S("joint", joint, m.seam, "frame", "ns-joint", { ex: EX.nose });
}

/* ------------------------------------------------------------------ */
/* Instrument compartment                                              */
/* ------------------------------------------------------------------ */

function buildInstrument(kit: Kit, rocket: Object3D) {
  const { m } = kit;
  const S = kit.scope(rocket, "instrument");
  const invert = SECTION_INVERT.instrument;
  skin(kit, S, "instrument", "ic-shell", H.centre, H.instrument, invert, EX.instrument, 16);

  // Four access hatches, one per quadrant of the compartment.
  const hatches: PanelSpec[] = BETWEEN_FINS.map((phi) => ({
    phi,
    halfPhi: 0.42,
    h0: H.centre + 0.2,
    h1: H.instrument - 0.22,
  }));
  panels(kit, S, "hatch", "ic-hatches", hatches, invert, EX.instrument);

  const joints = kit.merge("v2.instrument.joints", () => [
    ...jointPieces(kit, H.centre, "above"),
    ...jointPieces(kit, H.instrument, "below"),
  ]);
  S("joints", joints, m.seam, "frame", "ic-joints", { ex: EX.instrument });
  const bulkheads = kit.merge("v2.instrument.bulkheads", () => [bulkhead(kit, H.centre, "above"), bulkhead(kit, H.instrument, "below")]);
  S("bulkheads", bulkheads, m.seam, "armor", "ic-shell", { ex: EX.instrument });
}

/* ------------------------------------------------------------------ */
/* Centre section                                                      */
/* ------------------------------------------------------------------ */

function buildCentre(kit: Kit, rocket: Object3D) {
  const { m } = kit;
  const S = kit.scope(rocket, "centre");
  skin(kit, S, "centre", "cs-skin", H.tail, H.centre, SECTION_INVERT.centre, EX.centre, 6);

  // The centre section was built from two half shells: a longitudinal seam on each side, with a rivet line.
  const seams = kit.merge("v2.centre.seams", () => {
    const pieces: Piece[] = [];
    const h0 = H.tail + 0.08;
    const h1 = H.centre - 0.08;
    const half = 0.012 / profile(h0);
    const rivet = kit.cylZ(0.0075, 0.008, 6);
    for (const phi of [0, Math.PI]) {
      pieces.push({ geo: kit.tmp(profileSheet(h0, h1, phi - half, phi + half, 0.003, 4, 1)) });
      for (const side of [-1, 1]) {
        const a = phi + side * 0.045;
        for (let h = h0 + 0.1; h < h1 - 0.05; h += 0.2) {
          const rr = profile(h) + 0.004;
          pieces.push({ geo: rivet, pos: [Math.sin(a) * rr, h, Math.cos(a) * rr], rot: [0, a, 0] });
        }
      }
    }
    return pieces;
  });
  S("seams", seams, m.seam, "frame", "cs-seams", { ex: EX.centre });

  const joints = kit.merge("v2.centre.joints", () => [
    ...jointPieces(kit, H.tail, "above"),
    ...jointPieces(kit, H.centre, "below"),
  ]);
  S("joints", joints, m.seam, "frame", "cs-joints", { ex: EX.centre });
  const bulkheads = kit.merge("v2.centre.bulkheads", () => [bulkhead(kit, H.tail, "above"), bulkhead(kit, H.centre, "below")]);
  S("bulkheads", bulkheads, m.seam, "armor", "cs-skin", { ex: EX.centre });
}

/* ------------------------------------------------------------------ */
/* Tail section                                                        */
/* ------------------------------------------------------------------ */

/** Inner radius of the base plate: the opening the nozzle exit sits in. */
const BASE_HOLE = 0.39;
/** Top of the dark lining seen through the base opening. */
const LINER_TOP = 1.9;

function buildTail(kit: Kit, rocket: Object3D) {
  const { m } = kit;
  const S = kit.scope(rocket, "tail");
  const invert = SECTION_INVERT.tail;
  skin(kit, S, "tail", "ts-shell", H.base, H.tail, invert, EX.tail, 24);

  // Access doors between the fins.
  const doors: PanelSpec[] = BETWEEN_FINS.map((phi) => ({ phi, halfPhi: 0.36, h0: 1.45, h1: 2.55 }));
  panels(kit, S, "door", "ts-doors", doors, invert, EX.tail);

  const joint = kit.merge("v2.tail.joint", () => jointPieces(kit, H.tail, "below"));
  S("joint", joint, m.seam, "frame", "ts-joint", { ex: EX.tail });
  S("bulkhead", kit.merge("v2.tail.bulkhead", () => [bulkhead(kit, H.tail, "below")]), m.seam, "armor", "ts-shell", {
    ex: EX.tail,
  });

  // Thrust ring at the base, with its bolt circle.
  const ring = kit.merge("v2.tail.ring", () => [
    { geo: kit.tmp(bandGeometry(H.base - 0.04, H.base + 0.12, 0.014, 0, Math.PI * 2, 2)) },
    ...boltRing(kit, H.base + 0.05, 32, 0.012, 0, 0.018),
  ]);
  S("thrust_ring", ring, m.darkSteel, "frame", "ts-ring", { ex: EX.tail });

  // Base plate around the nozzle opening.
  const plate = kit.memo("v2.tail.basePlate", () => {
    const shape = new Shape();
    shape.absarc(0, 0, R_BASE + 0.012, 0, Math.PI * 2, false);
    const hole = new Path();
    hole.absarc(0, 0, BASE_HOLE, 0, Math.PI * 2, true);
    shape.holes.push(hole);
    const g = new ExtrudeGeometry(shape, { depth: 0.02, bevelEnabled: false, curveSegments: 48 });
    g.deleteAttribute("uv");
    g.rotateX(-Math.PI / 2);
    return g;
  });
  S("base_plate", plate, m.soot, "frame", "ts-base", { pos: [0, H.base - 0.04, 0], ex: EX.tail });

  // Dark lining seen through the base opening in the exterior view; cleared with the skin in the Internal view.
  const liner = kit.memo("v2.tail.liner", () => {
    const g = new CylinderGeometry(0.575, 0.575, LINER_TOP - H.base, 48, 1, true);
    g.deleteAttribute("uv");
    g.translate(0, (LINER_TOP + H.base) / 2, 0);
    return g;
  });
  S("liner", liner, m.interior, "armor", "ts-shell", { ex: EX.tail });
}

/** Nose, instrument compartment, centre section and tail shell. */
export function buildAirframe(kit: Kit, rocket: Object3D) {
  buildTail(kit, rocket);
  buildCentre(kit, rocket);
  buildInstrument(kit, rocket);
  buildNose(kit, rocket);
}
