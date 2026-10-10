import type { CSSProperties } from "react";
import { useId } from "react";
import type { ComponentSpec } from "@/data/types";
import { useExplorerStore } from "@/state/explorerStore";
import {
  INSPECTION_MODES,
  isModeSupported,
  unsupportedReason,
  useSelectedCapabilities,
} from "@/hooks/useInspectionModes";
import { ResetViewButton } from "@/components/navigation/ResetViewButton";
import { SectionHead } from "./SectionHead";
import s from "./inspection.module.css";
import m from "./ModeSection.module.css";

/** B — inspection mode, explode distance, camera reset. */
export function ModeSection({ spec }: { spec: ComponentSpec }) {
  const mode = useExplorerStore((st) => st.mode);
  const explode = useExplorerStore((st) => st.explode);
  const setMode = useExplorerStore((st) => st.setMode);
  const setExplode = useExplorerStore((st) => st.setExplode);
  const caps = useSelectedCapabilities();
  const sliderId = useId();

  const unsupported = INSPECTION_MODES.filter((md) => !isModeSupported(md.id, caps));
  const explodeSupported = isModeSupported("exploded", caps);
  const current = INSPECTION_MODES.find((md) => md.id === mode) ?? INSPECTION_MODES[0];
  const pct = Math.round(explode * 100);

  const onSlide = (value: number) => {
    if (mode !== "exploded") setMode("exploded");
    setExplode(value / 100);
  };

  return (
    <section className={s.section} aria-labelledby="insp-b">
      <SectionHead index="B" title="Inspection mode" id="insp-b" />
      <div className={m.segmented} role="group" aria-label={`Inspection mode for ${spec.shortName}`}>
        {INSPECTION_MODES.map((md) => {
          const supported = isModeSupported(md.id, caps);
          const active = mode === md.id;
          return (
            <button
              key={md.id}
              type="button"
              className={m.seg}
              aria-pressed={active}
              disabled={!supported}
              title={supported ? `${md.hint} (${md.key})` : unsupportedReason(md.id)}
              aria-keyshortcuts={md.key}
              onClick={() => setMode(md.id)}
            >
              <span className={m.segKey} aria-hidden="true">
                {md.key}
              </span>
              <span className={m.segLabel}>{md.label}</span>
            </button>
          );
        })}
      </div>
      <p className={m.modeHint} aria-live="polite">
        <span className={m.modeHintKey}>{current.label}</span> {current.hint}.
      </p>
      {unsupported.length > 0 && (
        <ul className={m.unavailable}>
          {unsupported.map((md) => (
            <li key={md.id}>
              <span className={m.unavailableMode}>{md.label} unavailable.</span> {unsupportedReason(md.id)}
            </li>
          ))}
        </ul>
      )}

      <div className={m.slider} data-active={mode === "exploded" || undefined} data-disabled={!explodeSupported || undefined}>
        <div className={m.sliderHead}>
          <label htmlFor={sliderId} className={m.sliderLabel}>
            Explode distance
          </label>
          <output htmlFor={sliderId} className={m.sliderValue}>
            {String(pct).padStart(3, "0")}%
          </output>
        </div>
        <div className={m.track}>
          <input
            id={sliderId}
            type="range"
            min={0}
            max={100}
            step={1}
            value={pct}
            disabled={!explodeSupported}
            onChange={(e) => onSlide(Number(e.target.value))}
            aria-valuetext={`${pct} percent separated`}
            style={{ "--pct": `${pct}%` } as CSSProperties}
          />
          <span className={m.ticks} aria-hidden="true" />
        </div>
        <div className={m.scale} aria-hidden="true">
          <span>0</span>
          <span>50</span>
          <span>100</span>
        </div>
        {mode !== "exploded" && explodeSupported && <p className={m.sliderHint}>Drag to switch to the exploded view.</p>}
      </div>

      <div className={m.reset}>
        <ResetViewButton variant="inline" label="Reset inspection camera" />
      </div>
    </section>
  );
}
