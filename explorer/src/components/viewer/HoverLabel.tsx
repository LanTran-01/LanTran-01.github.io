import { useEffect, useRef } from "react";
import { viewerRuntime } from "./viewerRuntime";
import styles from "./Viewer.module.css";

/**
 * Small label that follows the pointer over a hovered assembly. Content and
 * position are written imperatively by the interaction hook (no re-renders).
 */
export function HoverLabel() {
  const root = useRef<HTMLDivElement>(null);
  const title = useRef<HTMLSpanElement>(null);
  const meta = useRef<HTMLSpanElement>(null);
  const sub = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const dom = viewerRuntime.hoverLabel;
    dom.root = root.current;
    dom.title = title.current;
    dom.meta = meta.current;
    dom.sub = sub.current;
    return () => {
      dom.root = dom.title = dom.meta = dom.sub = null;
    };
  }, []);

  return (
    <div ref={root} className={styles.hoverLabel} data-visible="false" aria-hidden="true">
      <span className={styles.hoverRow}>
        <span ref={title} className={styles.hoverTitle} />
        <span ref={meta} className={styles.hoverMeta} />
      </span>
      <span ref={sub} className={styles.hoverSub} hidden />
    </div>
  );
}
