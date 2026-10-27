import type { ReactNode } from "react";
import { useExplorerStore } from "@/state/explorerStore";
import { useWebGLSupport } from "@/hooks/useWebGLSupport";
import { MACHINE, TERMS } from "@/data/machine";
import styles from "./LoadingOverlay.module.css";

/**
 * Centred over the free canvas area. Shows model loading progress, a load
 * error with retry, or a WebGL 2 notice. Fades out (CSS only) once ready.
 */
export function LoadingOverlay() {
  const status = useExplorerStore((s) => s.modelStatus);
  const insets = useExplorerStore((s) => s.viewInsets);
  const webgl = useWebGLSupport();

  const hidden = webgl && status.state === "ready";
  const area = { top: insets.top, right: insets.right, bottom: insets.bottom, left: insets.left };

  let body: ReactNode;
  if (!webgl) {
    body = (
      <div className={styles.card} role="alert">
        <p className={styles.kicker}>
          <span className={styles.caution} aria-hidden="true" />
          WEBGL 2 UNAVAILABLE
        </p>
        <p className={styles.text}>
          This browser or device cannot create a WebGL 2 context, so the 3D {TERMS.whole} cannot be drawn. The{" "}
          {TERMS.part} index, inspection data and systems map still work. Try a current desktop browser with hardware
          acceleration enabled.
        </p>
      </div>
    );
  } else if (status.state === "error") {
    body = (
      <div className={styles.card} role="alert">
        <p className={styles.kicker}>
          <span className={styles.caution} aria-hidden="true" />
          MODEL FAILED TO LOAD
        </p>
        <p className={styles.text}>{status.message}</p>
        <button type="button" className={styles.retry} onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  } else {
    const pct = status.state === "loading" ? Math.round(Math.min(1, Math.max(0, status.progress)) * 100) : 100;
    body = (
      <div className={styles.loader} role="status" aria-live="polite" aria-label={`Initialising model, ${pct}%`}>
        <p className={styles.kicker}>INITIALISING MODEL</p>
        <div className={styles.track} aria-hidden="true">
          <span className={styles.fill} style={{ transform: `scaleX(${pct / 100})` }} />
        </div>
        <div className={styles.meta} aria-hidden="true">
          <span>{`${MACHINE.designation} · ${status.source === "gltf" ? "GLB" : "PROCEDURAL"}`}</span>
          <span className={styles.pct}>{String(pct).padStart(3, "0")}%</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.overlay} style={area} data-hidden={hidden || undefined} aria-hidden={hidden || undefined}>
      {body}
    </div>
  );
}
