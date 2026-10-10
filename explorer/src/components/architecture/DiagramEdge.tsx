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

/** A directed flow: styled path, arrowhead, merge count and (when highlighted) its label. */
export const DiagramEdge = memo(function DiagramEdge({ geom, emphasis, flowing }: DiagramEdgeProps) {
  const { edge, d, arrow, mid } = geom;
  const stroke = FLOW_STROKE[edge.kind];
  const count = edge.sources.length;
  const single = count === 1 ? edge.sources[0].label : undefined;
  const text = emphasis === "highlight" ? (count > 1 ? `${count} FLOWS` : single?.toUpperCase()) : count > 1 ? `×${count}` : undefined;
  const textW = text ? text.length * 5.9 + 10 : 0;

  return (
    <g className={`${styles.edge} ${styles[`edge_${emphasis}`]} ${styles[`kind_${edge.kind}`]}`} data-edge={edge.key}>
      <path className={styles.edgeLine} d={d} style={{ stroke }} strokeDasharray={FLOW_DASH[edge.kind]} />
      {flowing && <path className={styles.edgeFlow} d={d} />}
      <path className={styles.edgeArrow} d={arrow} style={{ fill: stroke }} />
      {text && (
        <g className={styles.edgeTag} transform={`translate(${mid.x.toFixed(1)} ${mid.y.toFixed(1)})`}>
          <rect x={-textW / 2} y={-7} width={textW} height={14} rx={1} />
          <text y={3.3} textAnchor="middle">
            {text}
          </text>
        </g>
      )}
    </g>
  );
});
