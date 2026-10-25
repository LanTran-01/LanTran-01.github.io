import type { SpreadId } from "@/domain/types";

/**
 * Pixel layout for every spread, as a function of card width. One source of
 * truth for the reading stage, the landing preview and the mini diagrams.
 *
 *   wide     desktop and tablet: the traditional arrangement
 *   compact  phones: the same relationships, re-flowed to fit a narrow column
 *            (the ten-card staff becomes a 2 × 2 block under the cross)
 */

export type GeometryVariant = "wide" | "compact";

export interface LabelBox {
  /** Anchor point: centre-x for "center" labels, left edge for "left" labels. */
  x: number;
  y: number;
  width: number;
  align: "center" | "left";
  /** Which edge of the label sits on y. */
  anchor: "top" | "bottom" | "middle";
}

export interface SlotBox {
  index: number;
  cx: number;
  cy: number;
  rotate: 0 | 90;
  z: number;
  /** The ten-card challenge card lies across position 1. */
  crossing?: boolean;
  /** The card the crossing card lies over. */
  base?: boolean;
  label: LabelBox;
}

export interface Geometry {
  card: number;
  cardH: number;
  width: number;
  height: number;
  slots: SlotBox[];
}

export interface GeometryOptions {
  /** Height reserved for a position label (two lines in the reading, one in previews). */
  labelH: number;
  /** Gap between a card edge and its label. */
  labelGap: number;
  /** Width of labels placed to the right of a card (five-card arms, ten-card staff). */
  sideLabelW: number;
}

export const READING_LABELS: GeometryOptions = { labelH: 36, labelGap: 10, sideLabelW: 156 };
export const PREVIEW_LABELS: GeometryOptions = { labelH: 14, labelGap: 8, sideLabelW: 92 };
export const DIAGRAM_LABELS: GeometryOptions = { labelH: 0, labelGap: 0, sideLabelW: 0 };

export const CARD_RATIO = 1.5;

function below(cx: number, top: number, h: number, width: number, o: GeometryOptions): LabelBox {
  return { x: cx, y: top + h + o.labelGap, width, align: "center", anchor: "top" };
}
function above(cx: number, top: number, width: number, o: GeometryOptions): LabelBox {
  return { x: cx, y: top - o.labelGap, width, align: "center", anchor: "bottom" };
}
function right(x: number, cy: number, width: number, o: GeometryOptions): LabelBox {
  return { x: x + o.labelGap, y: cy, width: Math.max(0, width - o.labelGap), align: "left", anchor: "middle" };
}

function single(w: number, o: GeometryOptions): Geometry {
  const h = w * CARD_RATIO;
  const width = Math.max(w, 160);
  return {
    card: w,
    cardH: h,
    width,
    height: h + o.labelGap + o.labelH,
    slots: [{ index: 0, cx: width / 2, cy: h / 2, rotate: 0, z: 1, label: below(width / 2, 0, h, width, o) }],
  };
}

function three(w: number, variant: GeometryVariant, o: GeometryOptions): Geometry {
  const h = w * CARD_RATIO;
  const gap = variant === "wide" ? w * 0.2 + 12 : w * 0.07 + 8;
  const slots: SlotBox[] = [0, 1, 2].map((i) => {
    const cx = w / 2 + i * (w + gap);
    return { index: i, cx, cy: h / 2, rotate: 0, z: 1, label: below(cx, 0, h, w + gap, o) };
  });
  return { card: w, cardH: h, width: 3 * w + 2 * gap, height: h + o.labelGap + o.labelH, slots };
}

function five(w: number, o: GeometryOptions): Geometry {
  const h = w * CARD_RATIO;
  const gap = w * 0.14 + 10;
  const c = [w / 2, w / 2 + w + gap, w / 2 + 2 * (w + gap)];
  const row = [0, h + 16, 0];
  row[2] = row[1] + h + o.labelGap + o.labelH + 12;
  const cy = (r: number) => r + h / 2;
  const sideW = w + gap;
  const slots: SlotBox[] = [
    { index: 0, cx: c[1], cy: cy(row[1]), rotate: 0, z: 1, label: below(c[1], row[1], h, w + gap, o) },
    { index: 1, cx: c[1], cy: cy(row[0]), rotate: 0, z: 1, label: right(c[1] + w / 2, cy(row[0]), sideW, o) },
    { index: 2, cx: c[0], cy: cy(row[1]), rotate: 0, z: 1, label: below(c[0], row[1], h, w + gap, o) },
    { index: 3, cx: c[2], cy: cy(row[1]), rotate: 0, z: 1, label: below(c[2], row[1], h, w + gap, o) },
    { index: 4, cx: c[1], cy: cy(row[2]), rotate: 0, z: 1, label: right(c[1] + w / 2, cy(row[2]), sideW, o) },
  ];
  return { card: w, cardH: h, width: 3 * w + 2 * gap, height: row[2] + h, slots };
}

function ten(w: number, variant: GeometryVariant, o: GeometryOptions): Geometry {
  const h = w * CARD_RATIO;
  const cg = w * 0.3 + 8;
  const c = [w / 2, w / 2 + w + cg, w / 2 + 2 * (w + cg)];
  const labelBand = o.labelH + o.labelGap;
  const top0 = labelBand;
  const top1 = top0 + h + labelBand + (o.labelH ? 8 : 6);
  const top2 = top1 + h + labelBand + (o.labelH ? 8 : 6);
  const crossH = top2 + h + labelBand;
  const crossW = 3 * w + 2 * cg;
  const colW = w + cg;

  // The challenge card lies across the present card, set slightly low so the
  // upper half of the present card stays visible and easy to select.
  const crossDrop = h * 0.15;
  const cross = (offset: number): SlotBox[] => [
    { index: 0, cx: c[1], cy: offset + top1 + h / 2, rotate: 0, z: 1, base: true, label: below(c[1], offset + top1, h, colW, o) },
    { index: 1, cx: c[1], cy: offset + top1 + h / 2 + crossDrop, rotate: 90, z: 2, crossing: true, label: above(c[1], offset + top1, colW, o) },
    // Top and bottom of the cross have empty columns beside them, so their labels may run wider.
    { index: 2, cx: c[1], cy: offset + top2 + h / 2, rotate: 0, z: 1, label: below(c[1], offset + top2, h, colW * 1.9, o) },
    { index: 3, cx: c[0], cy: offset + top1 + h / 2, rotate: 0, z: 1, label: below(c[0], offset + top1, h, colW, o) },
    { index: 4, cx: c[1], cy: offset + top0 + h / 2, rotate: 0, z: 1, label: above(c[1], offset + top0, colW * 1.9, o) },
    { index: 5, cx: c[2], cy: offset + top1 + h / 2, rotate: 0, z: 1, label: below(c[2], offset + top1, h, colW, o) },
  ];

  if (variant === "wide") {
    const sg = 12;
    const staffH = 4 * h + 3 * sg;
    const height = Math.max(crossH, staffH);
    const crossOffset = (height - crossH) / 2;
    const staffOffset = (height - staffH) / 2;
    const staffLeft = crossW + w * 0.42 + 14;
    const staffCx = staffLeft + w / 2;
    const staff: SlotBox[] = [0, 1, 2, 3].map((k) => {
      const top = staffOffset + (3 - k) * (h + sg);
      return { index: 6 + k, cx: staffCx, cy: top + h / 2, rotate: 0, z: 1, label: right(staffLeft + w, top + h / 2, o.sideLabelW + o.labelGap, o) };
    });
    return {
      card: w,
      cardH: h,
      width: staffLeft + w + (o.sideLabelW ? o.labelGap + o.sideLabelW : 0),
      height,
      slots: [...cross(crossOffset), ...staff],
    };
  }

  const sgx = w * 0.16 + 10;
  const staffW = 2 * w + sgx;
  const startX = (crossW - staffW) / 2;
  const row0 = crossH + 18;
  const row1 = row0 + h + labelBand + 10;
  const staff: SlotBox[] = [0, 1, 2, 3].map((k) => {
    const cx = startX + w / 2 + (k % 2) * (w + sgx);
    const top = k < 2 ? row0 : row1;
    return { index: 6 + k, cx, cy: top + h / 2, rotate: 0, z: 1, label: below(cx, top, h, w + sgx, o) };
  });
  return { card: w, cardH: h, width: crossW, height: row1 + h + labelBand, slots: [...cross(0), ...staff] };
}

function build(id: SpreadId, variant: GeometryVariant, w: number, o: GeometryOptions): Geometry {
  switch (id) {
    case "single":
      return single(w, o);
    case "three":
      return three(w, variant, o);
    case "five":
      return five(w, o);
    case "ten":
      return ten(w, variant, o);
  }
}

export function spreadGeometry(id: SpreadId, variant: GeometryVariant, w: number, o: GeometryOptions = READING_LABELS): Geometry {
  const g = build(id, variant, w, o);
  // Keep every label inside the stage so none spills into the page gutter.
  for (const { label: l } of g.slots) {
    l.width = l.align === "center" ? Math.min(l.width, 2 * Math.min(l.x, g.width - l.x)) : Math.min(l.width, g.width - l.x);
  }
  return g;
}

export interface FitLimits {
  min: number;
  max: number;
}

/**
 * Largest card width whose layout fits the available box. Width is a hard
 * constraint; height is honoured down to `min`, below which the page scrolls.
 */
export function fitCardWidth(
  id: SpreadId,
  variant: GeometryVariant,
  availW: number,
  availH: number,
  limits: FitLimits,
  o: GeometryOptions = READING_LABELS,
): number {
  const largest = (fits: (w: number) => boolean, lo: number, hi: number) => {
    if (!fits(lo)) return lo;
    for (let i = 0; i < 24; i++) {
      const mid = (lo + hi) / 2;
      if (fits(mid)) lo = mid;
      else hi = mid;
    }
    return lo;
  };
  const byWidth = largest((w) => spreadGeometry(id, variant, w, o).width <= availW, 24, limits.max);
  const byHeight = largest((w) => spreadGeometry(id, variant, w, o).height <= availH, 24, limits.max);
  return Math.floor(Math.min(byWidth, Math.max(byHeight, limits.min), limits.max));
}
