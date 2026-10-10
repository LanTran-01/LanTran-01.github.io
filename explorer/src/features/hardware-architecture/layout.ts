import type { SystemLane, SystemNode } from "@/data/types";
import type { VisibleNode } from "./graph";

/**
 * Deterministic layout of the visible nodes in diagram (world) units.
 *
 * Columns follow flow order left → right. Top-level nodes snap to a row grid
 * (`row * rowPitch`) so rows line up across columns; an expanded parent's
 * children stack beneath it, indented, and push later rows in that column down.
 */

export const METRICS = {
  nodeW: 196,
  nodeH: 50,
  childIndent: 18,
  childH: 40,
  childGap: 6,
  rowPitch: 66,
  rowGap: 16,
  colGap: 112,
  /** Space above row 0 reserved for column headers. */
  headerH: 70,
} as const;

export interface ColumnDef {
  index: number;
  title: string;
  lanes: SystemLane[];
}

export const COLUMNS: ColumnDef[] = [
  { index: 0, title: "Power", lanes: ["power"] },
  { index: 1, title: "Inputs", lanes: ["sensing", "cockpit"] },
  { index: 2, title: "Computing", lanes: ["computing"] },
  { index: 3, title: "Outputs", lanes: ["actuation", "propulsion", "weapons"] },
];

export const MAX_COL = COLUMNS.length - 1;

export interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface LayoutNode extends Box {
  id: string;
  node: SystemNode;
  parentId: string | null;
  depth: 0 | 1;
  col: number;
}

export interface Layout {
  nodes: LayoutNode[];
  byId: Map<string, LayoutNode>;
  /** Content bounds including column headers. */
  bounds: Box;
}

export function columnX(col: number): number {
  return col * (METRICS.nodeW + METRICS.colGap);
}

export function computeLayout(visible: VisibleNode[]): Layout {
  const M = METRICS;
  const nodes: LayoutNode[] = [];
  const cursor = new Map<number, number>();
  let maxY = 0;

  for (const v of visible) {
    const x0 = columnX(v.col);
    if (v.depth === 0) {
      const prevEnd = cursor.get(v.col);
      const gridY = v.node.row * M.rowPitch;
      const y = prevEnd === undefined ? gridY : Math.max(gridY, prevEnd + M.rowGap);
      nodes.push({ id: v.node.id, node: v.node, parentId: null, depth: 0, col: v.col, x: x0, y, w: M.nodeW, h: M.nodeH });
      cursor.set(v.col, y + M.nodeH);
    } else {
      const y = (cursor.get(v.col) ?? 0) + M.childGap;
      nodes.push({
        id: v.node.id,
        node: v.node,
        parentId: v.parentId,
        depth: 1,
        col: v.col,
        x: x0 + M.childIndent,
        y,
        w: M.nodeW - M.childIndent,
        h: M.childH,
      });
      cursor.set(v.col, y + M.childH);
    }
    maxY = Math.max(maxY, cursor.get(v.col) ?? 0);
  }

  const width = columnX(MAX_COL) + M.nodeW;
  return {
    nodes,
    byId: new Map(nodes.map((n) => [n.id, n])),
    bounds: { x: -28, y: -M.headerH, w: width + 56, h: maxY + M.headerH + 28 },
  };
}
