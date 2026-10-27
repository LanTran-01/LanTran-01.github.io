import type { CSSProperties } from "react";
import { TERMS } from "@/data/machine";
import { useExplorerStore } from "@/state/explorerStore";
import { INSPECTION_MODES, isModeSupported, unsupportedReason, useModeCapabilities } from "@/hooks/useInspectionModes";
import styles from "./ViewModeBar.module.css";

/**
 * Floating view-mode control for machines whose modes apply to the whole
 * model (Exterior · Internal · Exploded). Shown where the inspection panel's
 * mode section is not: the overview and the systems map. While exploded, a
 * compact slider sets the separation; Exterior reassembles the model.
 */
export function ViewModeBar() {
  const mode = useExplorerStore((s) => s.mode);
  const explode = useExplorerStore((s) => s.explode);
  const setMode = useExplorerStore((s) => s.setMode);
  const setExplode = useExplorerStore((s) => s.setExplode);
  const caps = useModeCapabilities();
  const pct = Math.round(explode * 100);

  return (
    <div className={styles.bar} role="group" aria-label={`View mode for the ${TERMS.whole}`}>
      {INSPECTION_MODES.map((md) => {
        const supported = isModeSupported(md.id, caps);
        return (
          <button
            key={md.id}
            type="button"
            className={styles.seg}
            aria-pressed={mode === md.id}
            disabled={!supported}
            title={supported ? `${md.hint} (${md.key})` : unsupportedReason(md.id)}
            aria-keyshortcuts={md.key}
            onClick={() => setMode(md.id)}
          >
            <span className={styles.key} aria-hidden="true">
              {md.key}
            </span>
            {md.label}
          </button>
        );
      })}
      {mode === "exploded" && (
        <label className={styles.slider}>
          <span className="visually-hidden">Explode distance</span>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={pct}
            onChange={(e) => setExplode(Number(e.target.value) / 100)}
            aria-valuetext={`${pct} percent separated`}
            style={{ "--pct": `${pct}%` } as CSSProperties}
          />
          <output className={styles.value} aria-hidden="true">
            {String(pct).padStart(3, "0")}%
          </output>
        </label>
      )}
    </div>
  );
}
