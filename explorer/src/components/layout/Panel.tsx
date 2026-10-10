import type { HTMLAttributes, Ref } from "react";
import styles from "./Panel.module.css";

interface PanelProps extends HTMLAttributes<HTMLElement> {
  /** Which edge the panel slides in from. */
  side?: "left" | "right" | "none";
  as?: "section" | "aside" | "nav";
  ref?: Ref<HTMLElement>;
}

/** Translucent graphite surface with hairline border and corner ticks. */
export function Panel({ side = "none", as: Tag = "section", className, children, ref, ...rest }: PanelProps) {
  return (
    <Tag ref={ref} className={[styles.panel, styles[side], className].filter(Boolean).join(" ")} {...rest}>
      {children}
    </Tag>
  );
}
