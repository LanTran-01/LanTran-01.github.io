import type { Material } from "three";
import { BOARD } from "./layout";
import type { Kit, PartFn, V3 } from "./primitives";

/**
 * Stack-board helpers. Every electronics module in the stack is a square board
 * with an edge connector on its −X side; parts placed on it share its explode
 * offset so the board travels as one piece.
 */

export const PCB_T = 0.035;

function pins(kit: Kit) {
  return kit.merge("cs.pins", () => {
    const out = [];
    for (let row = 0; row < 2; row++) {
      for (let i = 0; i < 14; i++) {
        out.push({ geo: kit.rbox(0.014, 0.022, 0.014, 0.002), pos: [-0.016 + row * 0.032, 0, -0.29 + (i * 0.58) / 13] as V3 });
      }
    }
    return out;
  });
}

/** Board plus stack connector (body and gold pins), all tagged to `sub`. */
export function stackBoard(kit: Kit, P: PartFn, key: string, yAbs: number, sub: string, ex: V3, size = BOARD) {
  const { m } = kit;
  const top = yAbs + PCB_T / 2;
  P(`${key}.pcb`, kit.rbox(size, PCB_T, size, 0.012), m.pcb, "internal", sub, { pos: [0, yAbs, 0], ex });
  P(`${key}.header`, kit.rbox(0.07, 0.08, 0.62, 0.008), m.chip, "internal", sub, { pos: [-0.5, top + 0.04, 0], ex });
  P(`${key}.pins`, pins(kit), m.gold, "internal", sub, { pos: [-0.5, top + 0.09, 0], ex });
}

/** A box-shaped part sitting on a board top (`yTop`), centred at x/z. */
export function onBoard(
  kit: Kit,
  P: PartFn,
  name: string,
  sub: string,
  [w, h, d]: V3,
  [x, z]: readonly [number, number],
  yTop: number,
  ex: V3,
  mat: Material = kit.m.chip,
) {
  return P(name, kit.rbox(w, h, d, Math.min(0.01, h * 0.3)), mat, "internal", sub, { pos: [x, yTop + h / 2, z], ex });
}
