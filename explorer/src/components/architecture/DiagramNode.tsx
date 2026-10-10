import { memo, type KeyboardEvent, type MouseEvent } from "react";
import type { DisplayNode } from "@/features/hardware-architecture/useTweenedLayout";
import { LANE_TONE, basisTag, laneLabel } from "@/features/hardware-architecture/presentation";
import styles from "./SystemsDiagram.module.css";

/** `muted` = outside an active 3D filter: dimmed, but less than outside a selection. */
export type NodeEmphasis = "selected" | "neighbour" | "dim" | "muted" | "normal";

interface DiagramNodeProps {
  dn: DisplayNode;
  emphasis: NodeEmphasis;
  /** Linked to the assembly hovered / clicked in 3D. */
  soft: boolean;
  expanded: boolean;
  inCount: number;
  outCount: number;
  onActivate: (id: string) => void;
  onToggle: (id: string) => void;
  onFocusNode: (id: string) => void;
  registerRef: (id: string, el: SVGGElement | null) => void;
}

/**
 * One subsystem rectangle. Rendered as a focusable `role="button"` group so the
 * map can be operated with Tab / Enter / Space. The chevron toggles children.
 */
export const DiagramNode = memo(function DiagramNode({
  dn,
  emphasis,
  soft,
  expanded,
  inCount,
  outCount,
  onActivate,
  onToggle,
  onFocusNode,
  registerRef,
}: DiagramNodeProps) {
  const { node, w, h, depth } = dn;
  const kids = node.children?.length ?? 0;
  const child = depth === 1;
  const tag = basisTag(node);
  const tagW = tag.length * 5.6 + 9;

  const onKey = (e: KeyboardEvent<SVGGElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (emphasis === "selected" && kids) onToggle(node.id);
      else onActivate(node.id);
    }
  };
  const onChevron = (e: MouseEvent) => {
    e.stopPropagation();
    onToggle(node.id);
  };

  const label =
    `${node.code} ${node.label}. ${laneLabel(node)}, ${node.basis === "reference" ? "reference" : "conceptual"}. ` +
    `${inCount} inputs, ${outCount} outputs.` +
    (kids ? ` ${kids} subsystems, ${expanded ? "expanded" : "collapsed"}.` : "");

  const cls = [styles.nodeInner, styles[emphasis], soft && styles.soft, child && styles.child].filter(Boolean).join(" ");

  return (
    <g
      ref={(el) => registerRef(node.id, el)}
      data-node={node.id}
      className={dn.exiting ? `${styles.node} ${styles.exiting}` : styles.node}
      transform={`translate(${dn.x.toFixed(2)} ${dn.y.toFixed(2)})`}
      style={dn.opacity < 1 ? { opacity: dn.opacity } : undefined}
      role="button"
      tabIndex={dn.exiting ? -1 : 0}
      aria-label={label}
      aria-pressed={emphasis === "selected"}
      aria-expanded={kids ? expanded : undefined}
      onClick={() => onActivate(node.id)}
      onKeyDown={onKey}
      onFocus={() => onFocusNode(node.id)}
    >
      <g className={cls}>
      {/* generous invisible hit area (≥ 40 units tall) */}
      <rect className={styles.hit} x={-8} y={-7} width={w + 16} height={h + 14} />
      <rect className={styles.focusRing} x={-4.5} y={-4.5} width={w + 9} height={h + 9} rx={2} />
      <rect className={styles.body} x={0.5} y={0.5} width={w - 1} height={h - 1} rx={1.5} />
      <rect className={styles.laneBar} x={0} y={0} width={2} height={h} style={{ fill: LANE_TONE[node.lane] }} />
      {soft && <path className={styles.softMark} d={`M${w - 9} 0.5H${w - 0.5}V9`} />}

      <text className={styles.code} x={12} y={child ? 15 : 17}>
        {node.code}
      </text>
      <g
        className={node.basis === "reference" ? styles.tagRef : styles.tag}
        transform={`translate(${w - (kids ? 40 : 8) - tagW} ${child ? 6 : 8})`}
      >
        <rect width={tagW} height={12} rx={1} />
        <text x={tagW / 2} y={8.6} textAnchor="middle">
          {tag}
        </text>
      </g>
      <text className={child ? styles.labelChild : styles.label} x={12} y={child ? 31 : 37}>
        {node.label}
      </text>

      {kids > 0 && (
        <g
          className={styles.chevron}
          data-chevron=""
          transform={`translate(${w - 34} 0)`}
          onClick={onChevron}
          aria-hidden="true"
        >
          <rect className={styles.chevronHit} x={-2} y={0} width={36} height={28} />
          <text className={styles.kidCount} x={9} y={17.5} textAnchor="end">
            {kids}
          </text>
          <rect className={styles.chevronBox} x={12} y={7} width={14} height={14} rx={1} />
          <path className={styles.chevronGlyph} d={expanded ? "M15.5 15.5L19 12L22.5 15.5" : "M15.5 12.5L19 16L22.5 12.5"} />
        </g>
      )}
      </g>
    </g>
  );
});
