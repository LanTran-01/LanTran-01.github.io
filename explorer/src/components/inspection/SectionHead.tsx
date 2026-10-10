import type { ReactNode } from "react";
import styles from "./SectionHead.module.css";

interface SectionHeadProps {
  /** Section letter or number, e.g. "A". */
  index?: string;
  title: string;
  id?: string;
  /** Right-aligned readout, e.g. "02 / 10". */
  aside?: ReactNode;
}

/** Section heading: index, uppercase label, and a hairline rule with measurement ticks. */
export function SectionHead({ index, title, id, aside }: SectionHeadProps) {
  return (
    <div className={styles.head}>
      {index && (
        <span className={styles.idx} aria-hidden="true">
          {index}
        </span>
      )}
      <h2 id={id} className={styles.title}>
        {title}
      </h2>
      <span className={styles.rule} aria-hidden="true" />
      {aside && <span className={styles.aside}>{aside}</span>}
    </div>
  );
}
