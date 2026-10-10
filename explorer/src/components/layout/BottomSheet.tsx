import { useId, useRef, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import { useViewInset } from "@/hooks/useViewInset";
import styles from "./BottomSheet.module.css";

export interface SheetTab {
  id: string;
  label: string;
  content: ReactNode;
}

interface BottomSheetProps {
  /** Peek bar contents; always visible. Should include a toggle (see `SheetToggle`). */
  peek: ReactNode;
  tabs: SheetTab[];
  activeTab: string;
  onTabChange: (id: string) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  label: string;
}

/**
 * Mobile bottom sheet. Collapsed it shows only the peek bar; expanded it
 * reveals tabs and a scrollable body. Only the peek height is reported as the
 * bottom view inset, so the camera does not re-frame when the sheet opens.
 */
export function BottomSheet({ peek, tabs, activeTab, onTabChange, open, onOpenChange, label }: BottomSheetProps) {
  const sentinel = useRef<HTMLDivElement>(null);
  const start = useRef<number | null>(null);
  const baseId = useId();
  useViewInset(sentinel, "bottom");

  const onPointerDown = (e: PointerEvent) => {
    start.current = e.clientY;
  };
  const onPointerUp = (e: PointerEvent) => {
    if (start.current === null) return;
    const dy = e.clientY - start.current;
    start.current = null;
    if (Math.abs(dy) > 28) onOpenChange(dy < 0);
  };

  const onTabKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    e.stopPropagation();
    const i = tabs.findIndex((t) => t.id === activeTab);
    const next = tabs[(i + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length];
    onTabChange(next.id);
    document.getElementById(`${baseId}-tab-${next.id}`)?.focus();
  };

  const current = tabs.find((t) => t.id === activeTab) ?? tabs[0];

  return (
    <>
      <div ref={sentinel} className={styles.sentinel} aria-hidden="true" />
      <section className={styles.sheet} data-open={open || undefined} aria-label={label}>
        <div className={styles.peek} onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
          <button
            type="button"
            className={styles.grip}
            onClick={() => onOpenChange(!open)}
            aria-label={open ? "Collapse panel" : "Expand panel"}
            aria-expanded={open}
          >
            <span />
          </button>
          {peek}
        </div>
        <div className={styles.body} inert={!open}>
          <div className={styles.tabs} role="tablist" aria-label={`${label} sections`} onKeyDown={onTabKey}>
            {tabs.map((t) => (
              <button
                key={t.id}
                id={`${baseId}-tab-${t.id}`}
                type="button"
                role="tab"
                className={styles.tab}
                aria-selected={t.id === current.id}
                aria-controls={`${baseId}-panel`}
                tabIndex={t.id === current.id ? 0 : -1}
                onClick={() => onTabChange(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div
            id={`${baseId}-panel`}
            role="tabpanel"
            aria-labelledby={`${baseId}-tab-${current.id}`}
            className={styles.panel}
            key={current.id}
          >
            {current.content}
          </div>
        </div>
      </section>
    </>
  );
}
