import { useRef } from "react";
import { getComponent } from "@/data/components";
import type { ComponentId } from "@/data/types";
import { useExplorerStore, type ModelStatus } from "@/state/explorerStore";
import { useViewInset } from "@/hooks/useViewInset";
import { useCameraTelemetry } from "@/hooks/useCameraTelemetry";
import styles from "./StatusBar.module.css";

function assemblyCode(id: ComponentId | null): string {
  return id ? getComponent(id).designation.replace(" / ", "/") : "—";
}

function ModelState({ status }: { status: ModelStatus }) {
  const source = status.source === "gltf" ? "GLB MODEL" : "PROCEDURAL PROTOTYPE";
  if (status.state === "loading") {
    const pct = Math.round(Math.min(1, Math.max(0, status.progress)) * 100);
    return (
      <span className={styles.model} data-state="loading" role="status">
        <span className={styles.meter} aria-hidden="true">
          <span style={{ transform: `scaleX(${pct / 100})` }} />
        </span>
        <span>
          LOADING <span className={styles.num}>{String(pct).padStart(2, "0")}%</span>
        </span>
      </span>
    );
  }
  if (status.state === "error") {
    return (
      <span className={styles.model} data-state="error" role="status" title={status.message}>
        <span className={styles.dot} aria-hidden="true" />
        ERROR · <span className={styles.msg}>{status.message}</span>
      </span>
    );
  }
  return (
    <span className={styles.model} data-state={status.note ? "fallback" : "ready"} role="status" title={status.note}>
      <span className={styles.dot} aria-hidden="true" />
      READY
      <span className={styles.source}>
        <span className={styles.sep}>·</span> {source}
      </span>
      {status.note && (
        <>
          <span className={styles.sep}>·</span> <span className={styles.msg}>{status.note}</span>
        </>
      )}
    </span>
  );
}

/** Camera numbers, refreshed at 10 Hz straight into the DOM. */
function CameraReadout() {
  const az = useRef<HTMLSpanElement>(null);
  const el = useRef<HTMLSpanElement>(null);
  const dist = useRef<HTMLSpanElement>(null);
  const fps = useRef<HTMLSpanElement>(null);

  useCameraTelemetry((t) => {
    const known = t.distance > 0;
    if (az.current) az.current.textContent = known ? t.azimuth.toFixed(1).padStart(6, " ") : "—";
    if (el.current) el.current.textContent = known ? t.elevation.toFixed(1).padStart(5, " ") : "—";
    if (dist.current) dist.current.textContent = known ? t.distance.toFixed(2) : "—";
    if (fps.current) fps.current.textContent = t.fps > 0 ? String(Math.round(t.fps)).padStart(3, " ") : "—";
  });

  return (
    <span className={styles.camera} aria-hidden="true">
      <span className={styles.item}>
        <span className={styles.k}>AZ</span>
        <span ref={az} className={styles.num} data-w="6">
          —
        </span>
      </span>
      <span className={styles.item}>
        <span className={styles.k}>EL</span>
        <span ref={el} className={styles.num} data-w="5">
          —
        </span>
      </span>
      <span className={styles.item}>
        <span className={styles.k}>DIST</span>
        <span ref={dist} className={styles.num} data-w="5">
          —
        </span>
      </span>
      <span className={`${styles.item} ${styles.fps}`}>
        <span ref={fps} className={styles.num} data-w="3">
          —
        </span>
        <span className={styles.k}>FPS</span>
      </span>
    </span>
  );
}

export function StatusBar() {
  const ref = useRef<HTMLElement>(null);
  useViewInset(ref, "bottom");
  const view = useExplorerStore((s) => s.view);
  const selected = useExplorerStore((s) => s.selected);
  const hovered = useExplorerStore((s) => s.hovered);
  const mode = useExplorerStore((s) => s.mode);
  const status = useExplorerStore((s) => s.modelStatus);

  const modeLabel = view === "systems" ? "SYSTEMS" : selected ? mode.toUpperCase() : "OVERVIEW";

  return (
    <footer ref={ref} className={styles.bar} aria-label="Status">
      <div className={styles.left}>
        <span className={styles.item}>
          <span className={styles.k}>MODE</span>
          <span className={styles.v} data-accent={selected && view === "explorer" ? true : undefined}>
            {modeLabel}
          </span>
        </span>
        <span className={styles.item}>
          <span className={styles.k}>SEL</span>
          <span className={styles.v}>
            <span className={styles.full}>{assemblyCode(selected)}</span>
            <span className={styles.short}>{selected ? getComponent(selected).prefix : "—"}</span>
          </span>
        </span>
        <span className={`${styles.item} ${styles.hover}`}>
          <span className={styles.k}>HOV</span>
          <span className={styles.v}>{assemblyCode(hovered)}</span>
        </span>
      </div>
      <div className={styles.centre}>
        <ModelState status={status} />
      </div>
      <div className={styles.right}>
        <CameraReadout />
        <span className={styles.tag}>CONCEPTUAL VISUALIZATION</span>
      </div>
    </footer>
  );
}
