import type { Ref } from "react";
import styles from "./Controls.module.css";

interface ZoomControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFit: () => void;
  /** Receives the zoom percentage text imperatively (no re-render per frame). */
  readoutRef: Ref<HTMLSpanElement>;
}

export function ZoomControls({ onZoomIn, onZoomOut, onFit, readoutRef }: ZoomControlsProps) {
  return (
    <div className={styles.zoom} role="group" aria-label="Zoom">
      <button type="button" className={styles.iconBtn} onClick={onZoomOut} aria-label="Zoom out" title="Zoom out (−)">
        <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
          <path d="M1 5H9" />
        </svg>
      </button>
      <span ref={readoutRef} className={styles.zoomReadout} aria-live="off">
        100%
      </span>
      <button type="button" className={styles.iconBtn} onClick={onZoomIn} aria-label="Zoom in" title="Zoom in (+)">
        <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
          <path d="M1 5H9M5 1V9" />
        </svg>
      </button>
      <button type="button" className={styles.textBtn} onClick={onFit} aria-label="Fit diagram to view" title="Fit to view (0)">
        <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
          <path d="M1 3.5V1H3.5M6.5 1H9V3.5M9 6.5V9H6.5M3.5 9H1V6.5" />
        </svg>
        Fit
      </button>
    </div>
  );
}
