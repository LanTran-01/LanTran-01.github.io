import { LANES } from "@/data/subsystems";
import type { FlowKind, SystemLane, SystemNode } from "@/data/types";
import type { EdgeGeometry } from "./edgeGeometry";

/**
 * Visual coding for lanes and flow kinds. Lanes use the accent family and
 * greys only; flow kinds vary by tone and dash pattern (tokens.css).
 */

export const LANE_TONE: Record<SystemLane, string> = {
  power: "var(--accent)",
  sensing: "var(--flow-data)",
  cockpit: "var(--text-dim)",
  computing: "var(--accent-strong)",
  actuation: "var(--flow-data)",
  propulsion: "var(--flow-control)",
  weapons: "var(--text-dim)",
};

export const FLOW_STROKE: Record<FlowKind, string> = {
  power: "var(--flow-power)",
  data: "var(--flow-data)",
  control: "var(--flow-control)",
  propellant: "var(--flow-propellant)",
};

/** SVG dash pattern per kind (undefined = solid). */
export const FLOW_DASH: Record<FlowKind, string | undefined> = {
  power: undefined,
  data: undefined,
  control: "5 3.5",
  propellant: "0.1 3.6",
};

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
