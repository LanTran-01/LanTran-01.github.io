import { ExtrudeGeometry, Path, Shape, type Object3D } from "three";
import { EX, HALF, RAIL, ROD, U, BODY_H, STACK, y } from "./layout";
import { group, type Kit, type Piece, type V3 } from "./primitives";

/** Panel inset between the rails and its height inside a unit (leaves a band for the rings). */
const PANEL_W = 1.28;
const PANEL_H = 1.38;
const PANEL_Z = HALF - 0.03;
const PANEL_T = 0.03;
const CELL_W = 0.56;
const CELL_H = 1.04;
/** Cells sit a little above the panel centre, leaving room for a sun sensor below. */
const CELL_LIFT = 0.08;

/**
 * Structure (rails, end frames, unit rings, side panels, stack rods,
 * deployment switches) plus the parts mounted on the panels: body-mounted
 * solar cells and the sun sensors.
 */
export function buildStructure(kit: Kit, root: Object3D) {
  const { m } = kit;
  const S = kit.scope(root, "structure");
  const corner = HALF - RAIL / 2;

  /* ---- frame: corner rails with feet ---- */
  const rail = kit.merge("cs.rail", () => [
    { geo: kit.rbox(RAIL, BODY_H, RAIL, 0.012) },
    { geo: kit.rbox(0.084, 0.07, 0.084, 0.01), pos: [0, BODY_H / 2 + 0.035, 0] },
    { geo: kit.rbox(0.084, 0.07, 0.084, 0.01), pos: [0, -BODY_H / 2 - 0.035, 0] },
  ]);
  for (const [sx, sz] of [[1, 1], [-1, 1], [-1, -1], [1, -1]] as const) {
    S(`rail.${sx}${sz}`, rail, m.aluminum, "frame", "st-rails", { pos: [sx * corner, y(BODY_H / 2), sz * corner] });
  }

  /* ---- frame: end frames and the two unit rings ---- */
  const ring = (key: string, h: number) =>
    kit.merge(`cs.ring.${key}`, () => {
      const len = 2 * HALF - 2 * RAIL + 0.02;
      const off = HALF - 0.05;
      return [
        { geo: kit.rbox(len, h, 0.08, 0.008), pos: [0, 0, off] },
        { geo: kit.rbox(len, h, 0.08, 0.008), pos: [0, 0, -off] },
        { geo: kit.rbox(0.08, h, len, 0.008), pos: [off, 0, 0] },
        { geo: kit.rbox(0.08, h, len, 0.008), pos: [-off, 0, 0] },
      ] satisfies Piece[];
    });
  S("ring.bottom", ring("end", 0.07), m.aluminum, "frame", "st-rings", { pos: [0, y(0.035), 0], ex: EX.bottomFrame });
  S("ring.u1", ring("unit", 0.08), m.aluminum, "frame", "st-rings", { pos: [0, y(U), 0] });
  S("ring.u2", ring("unit", 0.08), m.aluminum, "frame", "st-rings", { pos: [0, y(2 * U), 0] });
  S("ring.top", ring("end", 0.07), m.aluminum, "frame", "st-rings", { pos: [0, y(STACK.topFrame), 0], ex: EX.topFrame });

  // Bottom plate with the payload aperture.
  const plate = kit.memo("cs.bottomPlate", () => {
    const s = 0.62;
    const shape = new Shape();
    shape.moveTo(-s, -s);
    shape.lineTo(s, -s);
    shape.lineTo(s, s);
    shape.lineTo(-s, s);
    shape.closePath();
    const hole = new Path();
    hole.absarc(0, 0, 0.48, 0, Math.PI * 2, true);
    shape.holes.push(hole);
    const g = new ExtrudeGeometry(shape, { depth: 0.03, bevelEnabled: false, curveSegments: 40 });
    g.deleteAttribute("uv");
    g.rotateX(-Math.PI / 2);
    g.translate(0, -0.015, 0);
    return g;
  });
  S("plate.bottom", plate, m.anodized, "frame", "st-rings", { pos: [0, y(0.05), 0], ex: EX.bottomFrame });

  /* ---- internal: stack rods ---- */
  const rod = kit.cyl(0.018, 0.018, BODY_H - 0.2, 10);
  for (const [sx, sz] of [[1, 1], [-1, 1], [-1, -1], [1, -1]] as const) {
    S(`rod.${sx}${sz}`, rod, m.rotor, "internal", "st-stack", { pos: [sx * ROD, y(BODY_H / 2), sz * ROD] });
  }

  /* ---- frame: deployment switches (bottom feet) and separation springs (top feet) ---- */
  const plunger = kit.cyl(0.022, 0.022, 0.05, 12);
  S("switch.a", plunger, m.gold, "frame", "st-switches", { pos: [corner, y(-0.095), corner] });
  S("switch.b", plunger, m.gold, "frame", "st-switches", { pos: [-corner, y(-0.095), -corner] });
  S("spring.a", plunger, m.gold, "frame", "st-switches", { pos: [-corner, y(BODY_H + 0.095), corner] });
  S("spring.b", plunger, m.gold, "frame", "st-switches", { pos: [corner, y(BODY_H + 0.095), -corner] });

  /* ---- faces: panels, body cells, sun sensors ---- */
  const panel = kit.rbox(PANEL_W, PANEL_H, PANEL_T, 0.006);
  const cells = kit.merge("cs.bodyCells", () =>
    [-1, 1].map((s) => ({ geo: kit.rbox(CELL_W, CELL_H, 0.008, 0.003), pos: [s * (CELL_W / 2 + 0.02), 0, 0] as V3 })),
  );
  const busbars = kit.merge("cs.bodyBusbars", () =>
    [-1, 1].flatMap((s) =>
      [-0.14, 0.14].map((dx) => ({ geo: kit.rbox(0.008, CELL_H - 0.04, 0.004, 0), pos: [s * (CELL_W / 2 + 0.02) + dx, 0, 0.005] as V3 })),
    ),
  );
  const sensorBase = kit.rbox(0.15, 0.15, 0.04, 0.008);
  const sensorWindow = kit.cylZ(0.038, 0.012, 20);
  const faceZ = PANEL_Z + PANEL_T / 2;

  const faces = [
    { key: "front", rot: 0, cells: true, sensorUnit: 0 },
    { key: "left", rot: Math.PI / 2, cells: true, sensorUnit: 0 },
    { key: "right", rot: -Math.PI / 2, cells: true, sensorUnit: 0 },
    { key: "back", rot: Math.PI, cells: false, sensorUnit: 2 },
  ];
  for (const f of faces) {
    const g = group(root, `face.${f.key}`, [0, 0, 0], [0, f.rot, 0]);
    const P = kit.scope(g, "structure");
    const PC = kit.scope(g, "solar");
    const PA = kit.scope(g, "adcs");
    for (let u = 0; u < 3; u++) {
      const yc = y(u * U + U / 2);
      P(`panel.${f.key}.${u}`, panel, m.anodized, "armor", "st-panels", { pos: [0, yc, PANEL_Z], ex: EX.panel });
      if (f.cells) {
        PC(`cells.${f.key}.${u}`, cells, m.cell, "armor", "sol-body", { pos: [0, yc + CELL_LIFT, faceZ + 0.004], ex: EX.panel });
        PC(`busbars.${f.key}.${u}`, busbars, m.busbar, "armor", "sol-body", { pos: [0, yc + CELL_LIFT, faceZ + 0.006], ex: EX.panel });
      }
      if (u === f.sensorUnit) {
        const sy = f.cells ? yc - PANEL_H / 2 + 0.16 : yc;
        PA(`sun.${f.key}.base`, sensorBase, m.dark, "frame", "adcs-sun", { pos: [0, sy, faceZ + 0.02], ex: EX.panel });
        PA(`sun.${f.key}.window`, sensorWindow, m.sensor, "frame", "adcs-sun", { pos: [0, sy, faceZ + 0.045], ex: EX.panel });
      }
    }
    if (f.key === "back") {
      // Umbilical / access port on the middle unit.
      P("access.cover", kit.rbox(0.34, 0.2, 0.02, 0.006), m.aluminum, "armor", "st-panels", {
        pos: [0.28, y(U + U / 2), faceZ + 0.01],
        ex: EX.panel,
      });
      P("access.port", kit.rbox(0.16, 0.07, 0.03, 0.006), m.chip, "armor", "st-panels", {
        pos: [0.28, y(U + U / 2), faceZ + 0.03],
        ex: EX.panel,
      });
    }
  }
}
