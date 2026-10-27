import { FLOW_KINDS, LANES } from "@/data/subsystems";
import type { FlowKind, SystemLane, SystemNode } from "@/data/types";
import type { EdgeGeometry } from "./edgeGeometry";

/**
 * Visual coding for lanes and flow kinds, defined per machine in its systems
 * data. Lanes use the accent family and greys only; flow kinds vary by tone
 * and dash pattern (tokens.css).
 */

const entries = <K extends string, V>(r: Record<K, V>) => Object.entries(r) as [K, V][];

export const LANE_TONE = Object.fromEntries(entries(LANES).map(([k, v]) => [k, v.tone])) as Record<SystemLane, string>;

export const FLOW_STROKE = Object.fromEntries(entries(FLOW_KINDS).map(([k, v]) => [k, v.stroke])) as Record<FlowKind, string>;

/** SVG dash pattern per kind (undefined = solid). */
export const FLOW_DASH = Object.fromEntries(entries(FLOW_KINDS).map(([k, v]) => [k, v.dash])) as Record<
  FlowKind,
  string | undefined
>;

export function basisTag(n: SystemNode): string {
  return n.basis === "reference" ? "REF" : "CONCEPT";
}

export function laneLabel(n: SystemNode): string {
  return LANES[n.lane].label;
}

export interface PlacedTag {
  key: string;
  text: string;
  x: number;
  y: number;
  w: number;
  highlight: boolean;
  dim: boolean;
}

const TAG_H = 14;

/**
 * Mid-edge tags: merge counts for deduped edges, flow labels for highlighted
 * ones. Overlapping tags are nudged apart vertically (greedy, top to bottom).
 */
export function placeEdgeTags(geoms: EdgeGeometry[], highlighted: ReadonlySet<string> | null): PlacedTag[] {
  const tags: PlacedTag[] = [];
  for (const g of geoms) {
    const e = g.edge;
    const count = e.sources.length;
    const hi = !!highlighted?.has(e.key);
    const text = hi ? (count > 1 ? `${count} FLOWS` : e.sources[0].label?.toUpperCase()) : count > 1 ? `\u00d7${count}` : undefined;
    if (!text) continue;
    tags.push({ key: e.key, text, x: g.mid.x, y: g.mid.y, w: text.length * 5.9 + 10, highlight: hi, dim: !!highlighted && !hi });
  }
  // Highlighted tags claim space first so they stay closest to their edge.
  tags.sort((a, b) => Number(b.highlight) - Number(a.highlight) || a.y - b.y);
  const placed: PlacedTag[] = [];
  for (const t of tags) {
    for (let guard = 0; guard < 12; guard++) {
      const hit = placed.find((p) => Math.abs(p.x - t.x) < (p.w + t.w) / 2 + 2 && Math.abs(p.y - t.y) < TAG_H + 1);
      if (!hit) break;
      t.y = hit.y + (t.y >= hit.y ? TAG_H + 1 : -(TAG_H + 1));
    }
    placed.push(t);
  }
  return placed;
}
