import type { Object3D } from "three";
import { onBoard, stackBoard, PCB_T } from "./boards";
import { EX, STACK, y } from "./layout";
import type { Kit, P2 } from "./primitives";

/** Closed lathe outline for a thin-walled ring between radii r0..r1 and heights y0..y1. */
const ringProfile = (r0: number, r1: number, y0: number, y1: number): P2[] => [
  [r0, y0],
  [r1, y0],
  [r1, y1],
  [r0, y1],
  [r0, y0],
];

/** Illustrative imager on the nadir end: baffle, front lens, optics barrel, detector and electronics. */
export function buildPayload(kit: Kit, root: Object3D) {
  const { m } = kit;
  const P = kit.scope(root, "payload");

  /* ---- exterior: baffle and front lens ---- */
  P("baffle.tube", kit.lathe("cs.baffle", ringProfile(0.42, 0.47, -0.4, 0.02), 48), m.anodized, "frame", "pl-baffle", {
    pos: [0, y(0), 0],
    ex: EX.baffle,
  });
  P("baffle.lip", kit.lathe("cs.baffleLip", ringProfile(0.34, 0.42, -0.4, -0.37), 48), m.dark, "frame", "pl-baffle", {
    pos: [0, y(0), 0],
    ex: EX.baffle,
  });
  P("baffle.vane", kit.lathe("cs.baffleVane", ringProfile(0.37, 0.42, -0.22, -0.2), 48), m.dark, "frame", "pl-baffle", {
    pos: [0, y(0), 0],
    ex: EX.baffle,
  });
  P("lens", kit.cyl(0.37, 0.37, 0.02, 40), m.glass, "frame", "pl-lens", { pos: [0, y(-0.05), 0], ex: EX.baffle });

  /* ---- internal: optics barrel in its insulation blanket ---- */
  P("optics.barrel", kit.cyl(0.38, 0.38, 0.84, 14), m.foil, "internal", "pl-optics", { pos: [0, y(0.5), 0], ex: EX.optics });
  for (const [i, h] of [0.08, 0.93].entries()) {
    P(`optics.flange${i}`, kit.cyl(0.44, 0.44, 0.03, 40), m.anodized, "internal", "pl-optics", {
      pos: [0, y(h), 0],
      ex: EX.optics,
    });
  }

  /* ---- detector board: image sensor faces down the optics ---- */
  const yd = y(STACK.plDetector);
  const exD = EX.plDetector;
  stackBoard(kit, P, "detector", yd, "pl-detector", exD);
  P("detector.sensor", kit.rbox(0.26, 0.03, 0.26, 0.006), m.chip, "internal", "pl-detector", {
    pos: [0, yd - PCB_T / 2 - 0.015, 0],
    ex: exD,
  });
  onBoard(kit, P, "detector.readout", "pl-detector", [0.16, 0.025, 0.16], [0.2, 0.2], yd + PCB_T / 2, exD);

  /* ---- payload electronics ---- */
  const yp = y(STACK.plProc);
  const top = yp + PCB_T / 2;
  const exP = EX.plProc;
  stackBoard(kit, P, "proc", yp, "pl-proc", exP);
  onBoard(kit, P, "proc.fpga", "pl-proc", [0.32, 0.035, 0.32], [0.05, -0.05], top, exP);
  for (const [i, z] of [-0.3, 0.3].entries()) {
    onBoard(kit, P, `proc.mem${i}`, "pl-proc", [0.1, 0.022, 0.2], [0.38, z], top, exP);
  }
}
