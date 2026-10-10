import { useMemo, type RefObject } from "react";
import { LANES } from "@/data/subsystems";
import type { SystemLane } from "@/data/types";
import type { Adjacency, Highlight, ResolvedEdge } from "@/features/hardware-architecture/graph";
import { computeEdgeGeometry, type PlacedBox } from "@/features/hardware-architecture/edgeGeometry";
import { COLUMNS, MAX_COL, METRICS, columnX } from "@/features/hardware-architecture/layout";
import { LANE_TONE } from "@/features/hardware-architecture/presentation";
import type { DisplayNode } from "@/features/hardware-architecture/useTweenedLayout";
import { DiagramEdge, EdgeTag, type EdgeEmphasis } from "./DiagramEdge";
import { DiagramNode, type NodeEmphasis } from "./DiagramNode";
import styles from "./SystemsDiagram.module.css";

interface SystemsDiagramProps {
  svgRef: RefObject<SVGSVGElement | null>;
  contentRef: RefObject<SVGGElement | null>;
  display: DisplayNode[];
  edges: ResolvedEdge[];
  adjacency: Adjacency;
  expanded: ReadonlySet<string>;
  selectedId: string | null;
  highlight: Highlight | null;
  /** Nodes linked to the assembly hovered / clicked in 3D. */
  softIds: ReadonlySet<string>;
  /** A 3D filter is active and nothing is selected: soften non-matching nodes. */
  filterActive: boolean;
  flowAnimation: boolean;
  onActivate: (id: string) => void;
  onToggle: (id: string) => void;
  onFocusNode: (id: string) => void;
  registerRef: (id: string, el: SVGGElement | null) => void;
}

const EMPTY: ResolvedEdge[] = [];

/**
 * The SVG systems map. Pan / zoom is applied by the parent to `contentRef`
 * imperatively; this component only re-renders when the graph, layout tween
 * or highlight state changes.
 */
export function SystemsDiagram({
  svgRef,
  contentRef,
  display,
  edges,
  adjacency,
  expanded,
  selectedId,
  highlight,
  softIds,
  filterActive,
  flowAnimation,
  onActivate,
  onToggle,
  onFocusNode,
  registerRef,
}: SystemsDiagramProps) {
  const boxes = useMemo(() => {
    const m = new Map<string, PlacedBox>();
    for (const n of display) if (!n.exiting) m.set(n.id, n);
    return m;
  }, [display]);

  const geoms = useMemo(() => computeEdgeGeometry(edges, boxes, MAX_COL), [edges, boxes]);

  const edgeEmphasis = (key: string): EdgeEmphasis =>
    highlight ? (highlight.edges.has(key) ? "highlight" : "dim") : "normal";
  const nodeEmphasis = (id: string): NodeEmphasis => {
    if (highlight) return highlight.nodes.has(id) ? (id === selectedId ? "selected" : "neighbour") : "dim";
    if (filterActive) return softIds.has(id) ? "normal" : "dim";
    return "normal";
  };

  // Highlighted edges paint last so they sit above dimmed ones.
  const orderedGeoms = useMemo(() => {
    if (!highlight) return geoms;
    return [...geoms].sort((a, b) => Number(highlight.edges.has(a.edge.key)) - Number(highlight.edges.has(b.edge.key)));
  }, [geoms, highlight]);

  const lanes = useMemo(() => laneSpans(display), [display]);
  const rails = useMemo(() => childRails(display), [display]);
  const maxBottom = useMemo(() => display.reduce((m, n) => Math.max(m, n.y + n.h), 0), [display]);

  // DOM order = tab order: column by column, top to bottom.
  const ordered = useMemo(() => [...display].sort((a, b) => a.col - b.col || a.y - b.y), [display]);

  return (
    <svg ref={svgRef} className={styles.svg} role="group" aria-label="Systems architecture diagram">
      <defs>
        <pattern id="xi-sys-grid" width={24} height={24} patternUnits="userSpaceOnUse">
          <path d="M0 0.5H3M0.5 0V3" className={styles.gridMark} />
        </pattern>
        <pattern id="xi-sys-grid-major" width={120} height={120} patternUnits="userSpaceOnUse" x={-28} y={-METRICS.headerH}>
          <path d="M0 0.5H8M0.5 0V8" className={styles.gridMajor} />
        </pattern>
      </defs>
      <g ref={contentRef}>
        <rect x={-4000} y={-4000} width={9000} height={9000} fill="url(#xi-sys-grid)" />
        <rect x={-4000} y={-4000} width={9000} height={9000} fill="url(#xi-sys-grid-major)" />

        <ColumnHeaders height={maxBottom} />

        {lanes.map((l) => (
          <g key={l.key} className={styles.lane} transform={`translate(${columnX(l.col) - 14} 0)`}>
            <path d={`M3 ${l.y0}H0V${l.y1}H3`} style={{ stroke: LANE_TONE[l.lane] }} />
            <text transform={`translate(-5 ${l.y0}) rotate(-90)`} textAnchor="end">
              {LANES[l.lane].short}
            </text>
          </g>
        ))}

        {rails.map((r) => (
          <path key={r.key} className={styles.rail} d={r.d} opacity={r.opacity} />
        ))}

        <g className={styles.edges}>
          {orderedGeoms.map((g) => {
            const em = edgeEmphasis(g.edge.key);
            return <DiagramEdge key={g.edge.key} geom={g} emphasis={em} flowing={flowAnimation && em === "highlight"} />;
          })}
        </g>

        <g className={styles.nodes}>
          {ordered.map((dn) => (
            <DiagramNode
              key={dn.id}
              dn={dn}
              emphasis={nodeEmphasis(dn.id)}
              soft={softIds.has(dn.id)}
              expanded={expanded.has(dn.id)}
              inCount={(adjacency.incoming.get(dn.id) ?? EMPTY).length}
              outCount={(adjacency.outgoing.get(dn.id) ?? EMPTY).length}
              onActivate={onActivate}
              onToggle={onToggle}
              onFocusNode={onFocusNode}
              registerRef={registerRef}
            />
          ))}
        </g>

        <g className={styles.edgeTags}>
          {orderedGeoms.map((g) => (
            <EdgeTag key={g.edge.key} geom={g} emphasis={edgeEmphasis(g.edge.key)} />
          ))}
        </g>
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ */

function ColumnHeaders({ height }: { height: number }) {
  const M = METRICS;
  const ruleY = -24;
  const ticks = Math.floor(M.nodeW / 14);
  return (
    <g className={styles.headers} aria-hidden="true">
      {COLUMNS.map((c) => {
        const x = columnX(c.index);
        return (
          <g key={c.index} transform={`translate(${x} 0)`}>
            <text className={styles.colIndex} x={0} y={-50}>
              {String(c.index).padStart(2, "0")}
            </text>
            <text className={styles.colTitle} x={22} y={-50}>
              {c.title.toUpperCase()}
            </text>
            <text className={styles.colLanes} x={0} y={-35}>
              {c.lanes.map((l) => LANES[l].label.toUpperCase()).join("  ·  ")}
            </text>
            <path
              className={styles.colRule}
              d={
                `M0 ${ruleY}H${M.nodeW}` +
                `M0.5 ${ruleY - 5}V${ruleY + 3}M${M.nodeW - 0.5} ${ruleY - 5}V${ruleY + 3}` +
                Array.from({ length: ticks - 1 }, (_, i) => `M${(i + 1) * 14 + 0.5} ${ruleY}V${ruleY + 2.5}`).join("")
              }
            />
            {/* faint column guide down the full height */}
            <path className={styles.colGuide} d={`M${M.nodeW / 2} ${ruleY + 10}V${height + 18}`} />
            {c.index < MAX_COL && (
              <path
                className={styles.colFlow}
                d={`M${M.nodeW + 14} ${ruleY}H${M.nodeW + M.colGap - 14}M${M.nodeW + M.colGap - 19} ${ruleY - 3}L${M.nodeW + M.colGap - 14} ${ruleY}L${M.nodeW + M.colGap - 19} ${ruleY + 3}`}
              />
            )}
          </g>
        );
      })}
    </g>
  );
}

interface LaneSpan {
  key: string;
  col: number;
  lane: SystemLane;
  y0: number;
  y1: number;
}

/** Consecutive runs of the same lane within a column, spanning children too. */
function laneSpans(display: DisplayNode[]): LaneSpan[] {
  const byCol = new Map<number, DisplayNode[]>();
  for (const n of display) {
    if (n.exiting) continue;
    const list = byCol.get(n.col);
    if (list) list.push(n);
    else byCol.set(n.col, [n]);
  }
  const out: LaneSpan[] = [];
  for (const [col, list] of byCol) {
    list.sort((a, b) => a.y - b.y);
    let cur: LaneSpan | null = null;
    for (const n of list) {
      const lane = n.node.lane;
      if (cur && cur.lane === lane) cur.y1 = Math.max(cur.y1, n.y + n.h);
      else {
        cur = { key: `${col}-${lane}-${out.length}`, col, lane, y0: n.y, y1: n.y + n.h };
        out.push(cur);
      }
    }
  }
  return out;
}

/** Tree rails from an expanded parent down to each child. */
function childRails(display: DisplayNode[]): { key: string; d: string; opacity: number }[] {
  const parents = new Map(display.filter((n) => n.depth === 0).map((n) => [n.id, n]));
  const kids = new Map<string, DisplayNode[]>();
  for (const n of display) {
    if (!n.parentId) continue;
    const list = kids.get(n.parentId);
    if (list) list.push(n);
    else kids.set(n.parentId, [n]);
  }
  const out: { key: string; d: string; opacity: number }[] = [];
  for (const [pid, list] of kids) {
    const p = parents.get(pid);
    if (!p) continue;
    const x = p.x + 8.5;
    let d = "";
    let last = p.y + p.h;
    let opacity = 0;
    for (const c of list) {
      const cy = c.y + c.h / 2;
      if (cy > last) last = cy;
      d += `M${x} ${cy.toFixed(1)}H${c.x}`;
      opacity = Math.max(opacity, c.opacity);
    }
    out.push({ key: pid, d: `M${x} ${p.y + p.h}V${last.toFixed(1)}` + d, opacity });
  }
  return out;
}
