import { FLOW_KINDS } from "@/data/subsystems";
import type { FlowKind } from "@/data/types";
import { FLOW_COUNTS, FLOW_ORDER } from "@/features/hardware-architecture/graph";
import { FLOW_DASH, FLOW_STROKE } from "@/features/hardware-architecture/presentation";
import styles from "./Controls.module.css";

interface LegendProps {
  kinds: ReadonlySet<FlowKind>;
  onToggle: (kind: FlowKind) => void;
}

/** Flow-kind key that doubles as an on/off filter. */
export function Legend({ kinds, onToggle }: LegendProps) {
  return (
    <div className={styles.legend} role="group" aria-label="Flow kinds — toggle to filter">
      {FLOW_ORDER.map((k) => {
        const on = kinds.has(k);
        return (
          <button
            key={k}
            type="button"
            className={styles.legendItem}
            aria-pressed={on}
            title={`${FLOW_KINDS[k].description} — ${on ? "hide" : "show"}`}
            onClick={() => onToggle(k)}
          >
            <FlowSample kind={k} />
            <span className={styles.legendLabel}>{FLOW_KINDS[k].label}</span>
            <span className={styles.legendCount}>{String(FLOW_COUNTS[k]).padStart(2, "0")}</span>
          </button>
        );
      })}
    </div>
  );
}

/** Short line sample in the style of a flow kind. */
export function FlowSample({ kind, width = 24 }: { kind: FlowKind; width?: number }) {
  return (
    <svg className={styles.sample} width={width} height={8} viewBox={`0 0 ${width} 8`} aria-hidden="true">
      <path
        d={`M1 4H${width - 6}`}
        style={{ stroke: FLOW_STROKE[kind] }}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeDasharray={FLOW_DASH[kind]}
        fill="none"
      />
      <path d={`M${width - 1} 4L${width - 6} 1.2V6.8Z`} style={{ fill: FLOW_STROKE[kind] }} />
    </svg>
  );
}
