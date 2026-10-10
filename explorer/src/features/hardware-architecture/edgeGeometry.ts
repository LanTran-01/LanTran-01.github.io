import type { Box } from "./layout";
import type { ResolvedEdge } from "./graph";

/**
 * Edge routing: cubic Béziers with horizontal tangents between node sides.
 *
 *  - forward (source column < target column): source right side → target left side
 *  - backward: source left side → target right side
 *  - same column: a side loop on the column's free side (right for the last
 *    column, left otherwise)
 *
 * Endpoints sharing a node side are spread along it, ordered by the far end's
 * height, which keeps bundles from crossing at the port.
 */

export interface PlacedBox extends Box {
  col: number;
}

export interface EdgeGeometry {
  edge: ResolvedEdge;
  d: string;
  /** Closed triangle at the target. */
  arrow: string;
  mid: { x: number; y: number };
}

type Side = "L" | "R";

const ARROW_LEN = 6;
const ARROW_HALF = 3.2;
const PORT_INSET = 9;

interface Endpoint {
  key: string;
  role: "src" | "dst";
  otherY: number;
}

export function computeEdgeGeometry(
  edges: ResolvedEdge[],
  boxes: ReadonlyMap<string, PlacedBox>,
  maxCol: number,
): EdgeGeometry[] {
  const sides = new Map<string, { s: Side; t: Side }>();
  const groups = new Map<string, Endpoint[]>();
  const centreY = (b: Box) => b.y + b.h / 2;
  const add = (id: string, side: Side, ep: Endpoint) => {
    const k = `${id}|${side}`;
    const list = groups.get(k);
    if (list) list.push(ep);
    else groups.set(k, [ep]);
  };

  for (const e of edges) {
    const a = boxes.get(e.from);
    const b = boxes.get(e.to);
    if (!a || !b) continue;
    let s: Side;
    let t: Side;
    if (a.col < b.col) [s, t] = ["R", "L"];
    else if (a.col > b.col) [s, t] = ["L", "R"];
    else s = t = a.col === maxCol ? "R" : "L";
    sides.set(e.key, { s, t });
    add(e.from, s, { key: e.key, role: "src", otherY: centreY(b) });
    add(e.to, t, { key: e.key, role: "dst", otherY: centreY(a) });
  }

  // Spread ports along each side.
  const portY = new Map<string, number>(); // `${key}|src` → y
  for (const [k, list] of groups) {
    const id = k.slice(0, k.lastIndexOf("|"));
    const box = boxes.get(id);
    if (!box) continue;
    list.sort((p, q) => p.otherY - q.otherY || (p.role === q.role ? 0 : p.role === "src" ? -1 : 1));
    const top = box.y + PORT_INSET;
    const span = Math.max(0, box.h - PORT_INSET * 2);
    list.forEach((p, i) => {
      const y = list.length === 1 ? box.y + box.h / 2 : top + (span * i) / (list.length - 1);
      portY.set(`${p.key}|${p.role}`, y);
    });
  }

  const out: EdgeGeometry[] = [];
  for (const e of edges) {
    const a = boxes.get(e.from);
    const b = boxes.get(e.to);
    const side = sides.get(e.key);
    if (!a || !b || !side) continue;
    const sx = side.s === "R" ? a.x + a.w : a.x;
    const tx = side.t === "R" ? b.x + b.w : b.x;
    const sy = portY.get(`${e.key}|src`) ?? centreY(a);
    const ty = portY.get(`${e.key}|dst`) ?? centreY(b);
    // Direction of travel when entering the target: +1 into a left side, −1 into a right side.
    const inDir = side.t === "L" ? 1 : -1;
    const ex = tx - inDir * ARROW_LEN; // path end, arrow covers the rest
    let c1x: number;
    let c2x: number;
    if (side.s === side.t) {
      const out = side.s === "R" ? 1 : -1;
      const bulge = 26 + Math.min(46, Math.abs(ty - sy) * 0.2);
      const edgeX = out > 0 ? Math.max(sx, tx) : Math.min(sx, tx);
      c1x = edgeX + out * bulge;
      c2x = edgeX + out * bulge;
    } else {
      const outDir = side.s === "R" ? 1 : -1;
      const dx = Math.max(34, Math.abs(ex - sx) * 0.48);
      c1x = sx + outDir * dx;
      c2x = ex - inDir * dx;
    }
    const d = `M${r(sx)} ${r(sy)}C${r(c1x)} ${r(sy)} ${r(c2x)} ${r(ty)} ${r(ex)} ${r(ty)}`;
    const arrow = `M${r(tx)} ${r(ty)}L${r(ex)} ${r(ty - ARROW_HALF)}L${r(ex)} ${r(ty + ARROW_HALF)}Z`;
    const mid = {
      x: (sx + 3 * c1x + 3 * c2x + ex) / 8,
      y: (sy + 3 * sy + 3 * ty + ty) / 8,
    };
    out.push({ edge: e, d, arrow, mid });
  }
  return out;
}

const r = (v: number) => Math.round(v * 10) / 10;
