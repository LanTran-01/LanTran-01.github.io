import type { Object3D } from "three";
import { onBoard, stackBoard, PCB_T } from "./boards";
import { BODY_H, EX, HALF, STACK, y } from "./layout";
import { bilateral, type Kit, type Piece, type V3 } from "./primitives";

const WING_PANEL_W = 1.45;
const WING_H = 4.2;
const WING_T = 0.035;
/** Wing plane, just behind the rear face (the hinges sit on the rear rail edges). */
const WING_Z = -HALF - 0.03;
const CELL_COLS = 2;
const CELL_ROWS = 6;
const CELL_W = 0.66;
const CELL_H = 0.64;
const CELL_GAP = 0.04;

/** Two deployable wings, each two panels, coplanar with the rear face. */
function buildWings(kit: Kit, root: Object3D) {
  const { m } = kit;
  const substrate = kit.rbox(WING_PANEL_W, WING_H, WING_T, 0.01);
  const cellCentres: [number, number][] = [];
  for (let c = 0; c < CELL_COLS; c++) {
    for (let r = 0; r < CELL_ROWS; r++) {
      cellCentres.push([
        (c - (CELL_COLS - 1) / 2) * (CELL_W + CELL_GAP),
        (r - (CELL_ROWS - 1) / 2) * (CELL_H + CELL_GAP),
      ]);
    }
  }
  const cells = kit.merge("cs.wingCells", () =>
    cellCentres.map(([cx, cy]) => ({ geo: kit.rbox(CELL_W, CELL_H, 0.008, 0.003), pos: [cx, cy, 0] as V3 })),
  );
  const busbars = kit.merge("cs.wingBusbars", () =>
    cellCentres.flatMap(([cx, cy]) =>
      [-0.17, 0.17].map((dx) => ({ geo: kit.rbox(0.008, CELL_H - 0.04, 0.004, 0), pos: [cx + dx, cy, 0.005] as V3 })),
    ),
  );
  const hinge = kit.cyl(0.028, 0.028, 0.3, 12);

  bilateral(root, "solar.wing", [0, 0, 0], (g, side) => {
    const P = kit.scope(g, "solar", side);
    const yc = y(BODY_H / 2);
    const front = WING_Z + WING_T / 2;
    const ex = EX.wing;
    for (let i = 0; i < 2; i++) {
      const x = HALF + 0.05 + WING_PANEL_W / 2 + i * (WING_PANEL_W + 0.05);
      P(`substrate.${i}`, substrate, m.substrate, "frame", "sol-substrate", { pos: [x, yc, WING_Z], ex });
      P(`cells.${i}`, cells, m.cell, "frame", "sol-cells", { pos: [x, yc, front + 0.004], ex });
      P(`busbars.${i}`, busbars, m.busbar, "frame", "sol-cells", { pos: [x, yc, front + 0.006], ex });
      // Hinge line on the inboard edge of each panel.
      const hx = HALF + 0.025 + i * (WING_PANEL_W + 0.05);
      for (const hy of [-1.35, 1.35]) {
        P(`hinge.${i}.${hy > 0 ? "t" : "b"}`, hinge, m.aluminum, "frame", "sol-hinges", { pos: [hx, yc + hy, WING_Z], ex });
      }
    }
  });
}

/** Power management board: input conditioning, regulators, load switches, telemetry. */
function buildEps(kit: Kit, root: Object3D) {
  const { m } = kit;
  const P = kit.scope(root, "eps");
  const yb = y(STACK.eps);
  const top = yb + PCB_T / 2;
  const ex = EX.eps;
  stackBoard(kit, P, "eps", yb, "eps-board", ex);

  // Input conditioning: two toroidal inductors and a controller.
  const toroid = kit.memo("cs.toroid", () => kit.torus(0.075, 0.03, 10, 24).clone().rotateX(Math.PI / 2));
  P("input.l1", toroid, m.copper, "internal", "eps-input", { pos: [-0.22, top + 0.03, 0.3], ex });
  P("input.l2", toroid, m.copper, "internal", "eps-input", { pos: [0.02, top + 0.03, 0.3], ex });
  onBoard(kit, P, "input.ctrl", "eps-input", [0.12, 0.025, 0.12], [0.24, 0.3], top, ex);

  // Regulators: shielded inductors with their controllers.
  for (const [i, x] of [-0.28, -0.04, 0.2].entries()) {
    onBoard(kit, P, `conv.l${i}`, "eps-conv", [0.13, 0.07, 0.13], [x, -0.08], top, ex, m.dark);
    onBoard(kit, P, `conv.ic${i}`, "eps-conv", [0.08, 0.02, 0.08], [x, -0.26], top, ex);
  }

  // Load switches along the +X edge, with the output connector.
  for (let i = 0; i < 6; i++) {
    onBoard(kit, P, `switch.${i}`, "eps-switch", [0.07, 0.025, 0.08], [0.44, -0.36 + i * 0.13], top, ex);
  }
  onBoard(kit, P, "switch.conn", "eps-switch", [0.05, 0.05, 0.7], [0.54, -0.04], top, ex, m.gold);

  // Power telemetry ADC.
  onBoard(kit, P, "mon.adc", "eps-mon", [0.12, 0.02, 0.12], [-0.28, -0.4], top, ex);
}

/** Battery pack: four cylindrical cells in a holder, with a monitoring board above. */
function buildBattery(kit: Kit, root: Object3D) {
  const { m } = kit;
  const P = kit.scope(root, "battery");
  const ex = EX.battery;
  const base = y(STACK.battery);
  P("holder.base", kit.rbox(1.1, 0.025, 1.1, 0.006), m.anodized, "internal", "bat-holder", { pos: [0, base, 0], ex });
  const bracket = kit.rbox(0.05, 0.28, 1.04, 0.008);
  for (const s of [-1, 1]) {
    P(`holder.bracket.${s}`, bracket, m.anodized, "internal", "bat-holder", { pos: [s * 0.475, base + 0.15, 0], ex });
  }
  P("holder.strap", kit.rbox(0.06, 0.012, 1.04, 0.004), m.aluminum, "internal", "bat-holder", {
    pos: [0, base + 0.265, 0],
    ex,
  });

  const cell = kit.merge("cs.batteryCell", () => [
    { geo: kit.cylX(0.12, 0.88, 24) },
    { geo: kit.cylX(0.045, 0.03, 16), pos: [0.45, 0, 0] },
  ] satisfies Piece[]);
  for (const [i, z] of [-0.39, -0.13, 0.13, 0.39].entries()) {
    P(`cell.${i}`, cell, m.cellWrap, "internal", "bat-cells", { pos: [0, base + 0.135, z], ex, rot: [0, i % 2 ? Math.PI : 0, 0] });
  }

  const exB = EX.bms;
  const yb = y(STACK.bms);
  const top = yb + PCB_T / 2;
  stackBoard(kit, P, "bms", yb, "bat-bms", exB);
  onBoard(kit, P, "bms.monitor", "bat-bms", [0.16, 0.025, 0.16], [0.05, 0.1], top, exB);
  for (const [i, x] of [0.25, 0.38].entries()) {
    onBoard(kit, P, `bms.fet${i}`, "bat-bms", [0.09, 0.03, 0.12], [x, -0.25], top, exB);
  }
  onBoard(kit, P, "bms.sense", "bat-bms", [0.24, 0.012, 0.05], [-0.15, -0.3], top, exB, m.copper);
}

export function buildPower(kit: Kit, root: Object3D) {
  buildWings(kit, root);
  buildEps(kit, root);
  buildBattery(kit, root);
}
