import { memo } from "react";
import type { EdgeGeometry } from "@/features/hardware-architecture/edgeGeometry";
import { FLOW_DASH, FLOW_STROKE } from "@/features/hardware-architecture/presentation";
import styles from "./SystemsDiagram.module.css";

export type EdgeEmphasis = "highlight" | "dim" | "normal";

interface DiagramEdgeProps {
  geom: EdgeGeometry;
  emphasis: EdgeEmphasis;
  /** Animate a travelling dash along the edge (highlighted edges only, never under reduced motion). */
  flowing: boolean;
}

/** A directed flow: styled path and arrowhead. */
export const DiagramEdge = memo(function DiagramEdge({ geom, emphasis, flowing }: DiagramEdgeProps) {
  const { edge, d, arrow } = geom;
  const stroke = FLOW_STROKE[edge.kind];
  return (
    <g className={`${styles.edge} ${styles[`edge_${emphasis}`]}`} data-edge={edge.key}>
      <path className={styles.edgeLine} d={d} style={{ stroke }} strokeDasharray={FLOW_DASH[edge.kind]} />
      {flowing && <path className={styles.edgeFlow} d={d} />}
      <path className={styles.edgeArrow} d={arrow} style={{ fill: stroke }} />
    </g>
  );
});

/**
 * Mid-edge tag, drawn in a layer above the nodes: the merge count for deduped
 * edges, or the flow label when the edge is highlighted.
 */
export const EdgeTag = memo(function EdgeTag({ geom, emphasis }: { geom: EdgeGeometry; emphasis: EdgeEmphasis }) {
  const { edge, mid } = geom;
  const count = edge.sources.length;
  const single = count === 1 ? edge.sources[0].label : undefined;
  const text =
    emphasis === "highlight" ? (count > 1 ? `${count} FLOWS` : single?.toUpperCase()) : count > 1 ? `\u00d7${count}` : undefined;
  if (!text) return null;
  const textW = text.length * 5.9 + 10;
  return (
    <g
      className={`${styles.edgeTag} ${styles[`edgeTag_${emphasis}`]}`}
      transform={`translate(${mid.x.toFixed(1)} ${mid.y.toFixed(1)})`}
      aria-hidden="true"
    >
      <rect x={-textW / 2} y={-7} width={textW} height={14} rx={1} />
      <text y={3.3} textAnchor="middle">
        {text}
      </text>
    </g>
  );
});
