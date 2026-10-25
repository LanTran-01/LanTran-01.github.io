/* ==========================================================================
   Artwork style system. Every illustration is drawn in a 200 × 300 viewBox
   (the card face) using only these strokes and fills, so the deck reads as one
   instrument: near-white primary line, cool silver secondary line, graphite
   construction line, and an opaque card-black fill used to occlude.
   ========================================================================== */

export const INK = "#ECECEC";
export const SILVER = "#A9B0BA";
export const GRAPHITE = "#45484D";
export const CARD_BG = "#0D0D0E";
export const RAISED = "#19191B";

/** Primary line. */
export const L = { fill: "none", stroke: INK, strokeWidth: 1.1, strokeLinecap: "round", strokeLinejoin: "round" } as const;
/** Bold line for staffs, grips and key structure. */
export const LB = { ...L, strokeWidth: 1.7 } as const;
/** Fine silver line for detail. */
export const F = { fill: "none", stroke: SILVER, strokeWidth: 0.7, strokeLinecap: "round", strokeLinejoin: "round" } as const;
/** Graphite hairline for construction geometry and distance. */
export const H = { fill: "none", stroke: GRAPHITE, strokeWidth: 0.55, strokeLinecap: "round", strokeLinejoin: "round" } as const;
/** Dotted silver line for paths, chains and streams. */
export const DOT = { ...F, strokeDasharray: "0.1 2.6", strokeWidth: 1 } as const;
/** Dashed graphite line. */
export const DASH = { ...H, strokeDasharray: "2 2.5" } as const;
/** Solid ink fill. */
export const S = { fill: INK, stroke: "none" } as const;
/** Solid silver fill. */
export const SS = { fill: SILVER, stroke: "none" } as const;
/** Translucent tint for planes and glows. */
export const T = { fill: "rgba(236,236,236,0.07)", stroke: "none" } as const;
/** Opaque card-black with a primary outline: occludes whatever is behind. */
export const D = { fill: CARD_BG, stroke: INK, strokeWidth: 1.1, strokeLinejoin: "round", strokeLinecap: "round" } as const;
/** Opaque raised fill with an outline, for robes and cloth. */
export const R = { fill: RAISED, stroke: INK, strokeWidth: 1.1, strokeLinejoin: "round", strokeLinecap: "round" } as const;
/** Opaque card-black with a silver outline. */
export const DF = { fill: CARD_BG, stroke: SILVER, strokeWidth: 0.7, strokeLinejoin: "round", strokeLinecap: "round" } as const;
/** Solid ink with a matching outline (silhouettes). */
export const SO = { fill: INK, stroke: INK, strokeWidth: 1.1, strokeLinejoin: "round", strokeLinecap: "round" } as const;

/* ---- geometry helpers --------------------------------------------------- */

export const at = (x: number, y: number, r = 0, s = 1) =>
  `translate(${x} ${y})${r ? ` rotate(${r})` : ""}${s !== 1 ? ` scale(${s})` : ""}`;

export function pol(cx: number, cy: number, r: number, deg: number): [number, number] {
  const a = (deg * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
}

const f = (n: number) => Math.round(n * 100) / 100;

/** Regular star polygon with n points; angle 0 points up. */
export function starPath(cx: number, cy: number, outer: number, inner: number, n: number, rot = 0): string {
  const pts: string[] = [];
  for (let i = 0; i < n * 2; i++) {
    const [x, y] = pol(cx, cy, i % 2 ? inner : outer, -90 + rot + (i * 180) / n);
    pts.push(`${f(x)} ${f(y)}`);
  }
  return `M${pts.join(" L")} Z`;
}

/** Pentagram drawn as one continuous {5/2} line. */
export function pentagramPath(cx: number, cy: number, r: number, rot = 0): string {
  const order = [0, 2, 4, 1, 3];
  const pts = order.map((k) => pol(cx, cy, r, -90 + rot + k * 72));
  return `M${pts.map(([x, y]) => `${f(x)} ${f(y)}`).join(" L")} Z`;
}

export function polygonPath(cx: number, cy: number, r: number, n: number, rot = 0): string {
  const pts = Array.from({ length: n }, (_, k) => pol(cx, cy, r, -90 + rot + (k * 360) / n));
  return `M${pts.map(([x, y]) => `${f(x)} ${f(y)}`).join(" L")} Z`;
}

/** Circular arc from angle a0 to a1 (degrees, 0 = right, clockwise). */
export function arcPath(cx: number, cy: number, r: number, a0: number, a1: number): string {
  const [x0, y0] = pol(cx, cy, r, a0);
  const [x1, y1] = pol(cx, cy, r, a1);
  const large = Math.abs(a1 - a0) > 180 ? 1 : 0;
  const sweep = a1 > a0 ? 1 : 0;
  return `M${f(x0)} ${f(y0)} A${r} ${r} 0 ${large} ${sweep} ${f(x1)} ${f(y1)}`;
}

/** A row of soft waves from x0 to x1. */
export function wavePath(x0: number, x1: number, y: number, amp = 2, period = 12): string {
  let d = `M${x0} ${y}`;
  for (let x = x0; x < x1 - 0.01; x += period) {
    const w = Math.min(period, x1 - x);
    d += ` q${f(w / 4)} ${-amp} ${f(w / 2)} 0 t${f(w / 2)} 0`;
  }
  return d;
}

/**
 * Crescent: a disc of radius `outer` minus a disc of radius `inner` whose
 * centre is offset by `offset` to the right. Opening faces right; rotate to taste.
 */
export function crescentPath(outer: number, inner: number, offset: number): string {
  const xi = (outer * outer - inner * inner + offset * offset) / (2 * offset);
  const yi = Math.sqrt(Math.max(0, outer * outer - xi * xi));
  return `M${f(xi)} ${f(-yi)} A${outer} ${outer} 0 1 0 ${f(xi)} ${f(yi)} A${inner} ${inner} 0 0 1 ${f(xi)} ${f(-yi)} Z`;
}

/** Horizontal figure-eight with half-width a, centred on the origin. */
export function lemniscatePath(a: number): string {
  const h = a * 0.55;
  return `M0 0 C${f(a * 0.3)} ${-h} ${a} ${-h} ${a} 0 C${a} ${h} ${f(a * 0.3)} ${h} 0 0 C${f(-a * 0.3)} ${-h} ${-a} ${-h} ${-a} 0 C${-a} ${h} ${f(-a * 0.3)} ${h} 0 0 Z`;
}

/** A soft cloud bank of bumps along a baseline starting at (x, y). */
export function cloudPath(x: number, y: number, bumps: readonly number[]): string {
  let d = `M${x} ${y}`;
  for (const r of bumps) d += ` a${r} ${r} 0 0 1 ${r * 2} 0`;
  return d;
}

/** Vesica / lens with vertical axis: half-width w, half-height h. */
export function vesicaPath(cx: number, cy: number, w: number, h: number): string {
  return `M${cx} ${cy - h} Q${cx + w * 1.6} ${cy} ${cx} ${cy + h} Q${cx - w * 1.6} ${cy} ${cx} ${cy - h} Z`;
}
