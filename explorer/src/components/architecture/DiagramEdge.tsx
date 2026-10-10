import { memo } from "react";
import type { EdgeGeometry } from "@/features/hardware-architecture/edgeGeometry";
import { FLOW_DASH, FLOW_STROKE, type PlacedTag } from "@/features/hardware-architecture/presentation";
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

/** Mid-edge tag, drawn in a layer above the nodes. */
export const EdgeTag = memo(function EdgeTag({ tag }: { tag: PlacedTag }) {
  return (
    <g
      className={`${styles.edgeTag} ${tag.highlight ? styles.edgeTag_highlight : tag.dim ? styles.edgeTag_dim : ""}`}
      transform={`translate(${tag.x.toFixed(1)} ${tag.y.toFixed(1)})`}
      aria-hidden="true"
    >
      <rect x={-tag.w / 2} y={-7} width={tag.w} height={14} rx={1} />
      <text y={3.3} textAnchor="middle">
        {tag.text}
      </text>
    </g>
  );
});
