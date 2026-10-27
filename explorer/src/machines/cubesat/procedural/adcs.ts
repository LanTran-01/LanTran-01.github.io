import type { Object3D } from "three";
import { onBoard, stackBoard, PCB_T } from "./boards";
import { EX, STACK, y } from "./layout";
import { group, type Kit, type V3 } from "./primitives";

/**
 * Attitude hardware inside the middle unit: the interface board (magnetometer,
 * actuator drivers), three reaction wheels on orthogonal axes and the
 * magnetorquers. The sun sensors live on the outer panels (see structure.ts).
 */
export function buildAdcs(kit: Kit, root: Object3D) {
  const { m } = kit;
  const P = kit.scope(root, "adcs");

  /* ---- interface board ---- */
  const yb = y(STACK.adcsBoard);
  const top = yb + PCB_T / 2;
  const exB = EX.adcsBoard;
  stackBoard(kit, P, "adcs", yb, "adcs-board", exB);
  onBoard(kit, P, "mag", "adcs-mag", [0.1, 0.03, 0.1], [0.36, -0.34], top, exB);
  for (let i = 0; i < 3; i++) {
    onBoard(kit, P, `drv.${i}`, "adcs-drv", [0.12, 0.025, 0.16], [-0.25 + i * 0.2, 0.32], top, exB);
  }
  onBoard(kit, P, "drv.ind", "adcs-drv", [0.11, 0.06, 0.11], [0.32, 0.1], top, exB, m.dark);

  /* ---- reaction wheels: base plate, two upright brackets, three wheels ---- */
  const base = y(STACK.wheelBase);
  P("wheels.base", kit.rbox(1.08, 0.03, 1.08, 0.006), m.anodized, "internal", "adcs-wheels", { pos: [0, base, 0] });
  P("wheels.bracketX", kit.rbox(0.03, 0.48, 0.46, 0.006), m.anodized, "internal", "adcs-wheels", {
    pos: [-0.46, base + 0.255, 0.05],
  });
  P("wheels.bracketZ", kit.rbox(0.46, 0.48, 0.03, 0.006), m.anodized, "internal", "adcs-wheels", {
    pos: [0.15, base + 0.255, 0.39],
  });
  const housing = kit.cyl(0.2, 0.2, 0.035, 32);
  const rotor = kit.cyl(0.17, 0.17, 0.05, 32);
  const hub = kit.cyl(0.05, 0.05, 0.075, 16);
  // Each wheel is built along +Y and turned onto its axis; explode stays zero, so local frames are fine.
  const wheels: { key: string; pos: V3; rot: V3 }[] = [
    { key: "y", pos: [0.25, base + 0.035, -0.22], rot: [0, 0, 0] },
    { key: "x", pos: [-0.445, base + 0.27, 0.05], rot: [0, 0, -Math.PI / 2] },
    { key: "z", pos: [0.15, base + 0.29, 0.375], rot: [-Math.PI / 2, 0, 0] },
  ];
  for (const w of wheels) {
    const g = group(root, `adcs.wheel.${w.key}`, w.pos, w.rot);
    const W = kit.scope(g, "adcs");
    W(`wheel.${w.key}.housing`, housing, m.dark, "internal", "adcs-wheels", { pos: [0, 0.0175, 0] });
    W(`wheel.${w.key}.rotor`, rotor, m.rotor, "internal", "adcs-wheels", { pos: [0, 0.06, 0] });
    W(`wheel.${w.key}.hub`, hub, m.aluminum, "internal", "adcs-wheels", { pos: [0, 0.07, 0] });
  }

  /* ---- magnetorquers: two rods and a flat air-core coil ---- */
  const ex = EX.mtq;
  const ym = y(STACK.mtq);
  P("mtq.rodX.core", kit.cylX(0.032, 0.8, 14), m.dark, "internal", "adcs-mtq", { pos: [0, ym, -0.42], ex });
  P("mtq.rodX.coil", kit.cylX(0.055, 0.6, 18), m.copper, "internal", "adcs-mtq", { pos: [0, ym, -0.42], ex });
  P("mtq.rodZ.core", kit.cylZ(0.032, 0.8, 14), m.dark, "internal", "adcs-mtq", { pos: [0.42, ym, 0.05], ex });
  P("mtq.rodZ.coil", kit.cylZ(0.055, 0.6, 18), m.copper, "internal", "adcs-mtq", { pos: [0.42, ym, 0.05], ex });
  const coil = kit.merge("cs.airCoil", () => {
    const s = 0.44;
    return [
      { geo: kit.rbox(2 * s + 0.04, 0.03, 0.04, 0.006), pos: [0, 0, s] as V3 },
      { geo: kit.rbox(2 * s + 0.04, 0.03, 0.04, 0.006), pos: [0, 0, -s] as V3 },
      { geo: kit.rbox(0.04, 0.03, 2 * s - 0.04, 0.006), pos: [s, 0, 0] as V3 },
      { geo: kit.rbox(0.04, 0.03, 2 * s - 0.04, 0.006), pos: [-s, 0, 0] as V3 },
    ];
  });
  P("mtq.coil", coil, m.copper, "internal", "adcs-mtq", { pos: [0, ym + 0.085, 0], ex });
}
