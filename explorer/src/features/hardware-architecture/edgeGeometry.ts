import type { Box } from "./layout";
import type { ResolvedEdge } from "./graph";

/**
 * Edge routing: cubic Béziers with horizontal tangents between node sides.
 *
 *  - forward (source column < target column): source right side → target left side
 *  - backward: source left side → target right side
 *  - same column: a side loop on the column's free side (right for the last
 *    column, left otherwise)
 *  - spanning two or more columns: the curve drops into a horizontal channel
 *    through a gap between rows of every intermediate column, so long flows
 *    never pass behind unrelated nodes
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
const CHANNEL_CLEAR = 5;
const CHANNEL_STEP = 3.5;

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

  const columns = columnIntervals(boxes);
  const channelUse = new Map<number, number>();

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
    const span = Math.abs(a.col - b.col);
    if (span >= 2) {
      const geom = channelRoute(e, a, b, sx, sy, ex, ty, tx, inDir, columns, channelUse);
      if (geom) {
        out.push(geom);
        continue;
      }
    }
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

interface ColumnSpan {
  x0: number;
  x1: number;
  /** Occupied vertical intervals, sorted. */
  ys: [number, number][];
}

function columnIntervals(boxes: ReadonlyMap<string, PlacedBox>): Map<number, ColumnSpan> {
  const cols = new Map<number, ColumnSpan>();
  for (const b of boxes.values()) {
    const c = cols.get(b.col);
    if (c) {
      c.x0 = Math.min(c.x0, b.x);
      c.x1 = Math.max(c.x1, b.x + b.w);
      c.ys.push([b.y, b.y + b.h]);
    } else cols.set(b.col, { x0: b.x, x1: b.x + b.w, ys: [[b.y, b.y + b.h]] });
  }
  for (const c of cols.values()) c.ys.sort((p, q) => p[0] - q[0]);
  return cols;
}

/** Free horizontal channel centres in a column: row gaps plus above / below the stack. */
function channelCandidates(c: ColumnSpan): number[] {
  const out: number[] = [];
  const first = c.ys[0];
  const last = c.ys[c.ys.length - 1];
  if (first) out.push(first[0] - 12);
  for (let i = 0; i < c.ys.length - 1; i++) {
    const gapTop = c.ys[i][1];
    const gapBottom = c.ys[i + 1][0];
    if (gapBottom - gapTop >= CHANNEL_CLEAR * 2) out.push((gapTop + gapBottom) / 2);
  }
  if (last) out.push(last[1] + 12);
  return out;
}

function isFree(c: ColumnSpan, y: number): boolean {
  return !c.ys.some(([y0, y1]) => y > y0 - CHANNEL_CLEAR && y < y1 + CHANNEL_CLEAR);
}

/**
 * Routes an edge through a shared horizontal channel across the intermediate
 * columns. Parallel edges in one channel are offset by a few units.
 */
function channelRoute(
  e: ResolvedEdge,
  a: PlacedBox,
  b: PlacedBox,
  sx: number,
  sy: number,
  ex: number,
  ty: number,
  tx: number,
  inDir: number,
  columns: Map<number, ColumnSpan>,
  channelUse: Map<number, number>,
): EdgeGeometry | null {
  const lo = Math.min(a.col, b.col) + 1;
  const hi = Math.max(a.col, b.col) - 1;
  const mids: ColumnSpan[] = [];
  for (let c = lo; c <= hi; c++) {
    const span = columns.get(c);
    if (span) mids.push(span);
  }
  if (!mids.length) return null;
  const candidates = mids.flatMap(channelCandidates).filter((y) => mids.every((m) => isFree(m, y)));
  if (!candidates.length) return null;
  // Prefer the channel nearest the straight line between the endpoints.
  let cy = candidates[0];
  let best = Infinity;
  for (const y of candidates) {
    const cost = Math.abs(y - sy) + Math.abs(y - ty);
    if (cost < best) {
      best = cost;
      cy = y;
    }
  }
  const slot = Math.round(cy);
  const used = channelUse.get(slot) ?? 0;
  channelUse.set(slot, used + 1);
  // Alternate either side of the channel centre: 0, +s, −s, +2s …
  cy += (used % 2 ? 1 : -1) * Math.ceil(used / 2) * CHANNEL_STEP;

  const dir = b.col > a.col ? 1 : -1;
  const gx0 = dir > 0 ? Math.min(...mids.map((m) => m.x0)) - 18 : Math.max(...mids.map((m) => m.x1)) + 18;
  const gx1 = dir > 0 ? Math.max(...mids.map((m) => m.x1)) + 18 : Math.min(...mids.map((m) => m.x0)) - 18;
  const d1 = Math.max(18, Math.abs(gx0 - sx) * 0.55);
  const d2 = Math.max(18, Math.abs(ex - gx1) * 0.55);
  const d =
    `M${r(sx)} ${r(sy)}C${r(sx + dir * d1)} ${r(sy)} ${r(gx0 - dir * d1)} ${r(cy)} ${r(gx0)} ${r(cy)}` +
    `L${r(gx1)} ${r(cy)}` +
    `C${r(gx1 + dir * d2)} ${r(cy)} ${r(ex - inDir * d2)} ${r(ty)} ${r(ex)} ${r(ty)}`;
  const arrow = `M${r(tx)} ${r(ty)}L${r(ex)} ${r(ty - ARROW_HALF)}L${r(ex)} ${r(ty + ARROW_HALF)}Z`;
  return { edge: e, d, arrow, mid: { x: (gx0 + gx1) / 2, y: cy } };
}
