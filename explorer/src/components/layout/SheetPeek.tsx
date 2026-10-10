import type { ReactNode } from "react";
import { ChevronUpIcon } from "./Icons";
import styles from "./SheetPeek.module.css";

interface SheetPeekProps {
  kicker: ReactNode;
  title: ReactNode;
  open: boolean;
  onToggle: () => void;
  before?: ReactNode;
  after?: ReactNode;
}

/** Standard peek-bar layout: optional side buttons around a toggle showing the current context. */
export function SheetPeek({ kicker, title, open, onToggle, before, after }: SheetPeekProps) {
  return (
    <div className={styles.peek}>
      {before}
      <button type="button" className={styles.toggle} onClick={onToggle} aria-expanded={open}>
        <span className={styles.text}>
          <span className={styles.kicker}>{kicker}</span>
          <span className={styles.title}>{title}</span>
        </span>
        <ChevronUpIcon className={styles.chev} data-open={open || undefined} />
      </button>
      {after}
    </div>
  );
}

export function PeekButton({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" className={styles.side} onClick={onClick} aria-label={label}>
      {children}
    </button>
  );
}
