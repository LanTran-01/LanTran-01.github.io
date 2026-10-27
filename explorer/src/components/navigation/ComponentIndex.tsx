import { useEffect, useRef } from "react";
import { Link } from "react-router";
import { COMPONENTS, countSubassemblies } from "@/data/components";
import type { ComponentId } from "@/data/types";
import { TERMS, capitalize } from "@/data/machine";
import { useExplorerStore } from "@/state/explorerStore";
import { SectionHead } from "@/components/inspection/SectionHead";
import { ChevronRightIcon } from "@/components/layout/Icons";
import styles from "./ComponentIndex.module.css";

interface ComponentIndexProps {
  /**
   * full    two-line rows with classification (overview, mobile sheet)
   * rail    compact one-line rows for the detail page
   */
  variant?: "full" | "rail";
  /** Called after a row is activated (e.g. to collapse a mobile sheet). */
  onNavigate?: () => void;
}

const ROWS = COMPONENTS.map((c, i) => ({
  spec: c,
  index: String(i + 1).padStart(2, "0"),
  count: countSubassemblies(c),
}));

/**
 * The machine's assemblies as a numbered list. Hovering or focusing a row highlights
 * the assembly in 3D (store.hovered); 3D hover is reflected back on the row.
 */
export function ComponentIndex({ variant = "full", onNavigate }: ComponentIndexProps) {
  const selected = useExplorerStore((s) => s.selected);
  const hovered = useExplorerStore((s) => s.hovered);
  const setHovered = useExplorerStore((s) => s.setHovered);
  const owned = useRef<ComponentId | null>(null);

  const enter = (id: ComponentId) => {
    owned.current = id;
    setHovered(id);
  };
  const leave = (id: ComponentId) => {
    if (useExplorerStore.getState().hovered === id) setHovered(null);
    if (owned.current === id) owned.current = null;
  };

  // Don't leave a stale highlight behind when the list unmounts mid-hover.
  useEffect(
    () => () => {
      const id = owned.current;
      if (id && useExplorerStore.getState().hovered === id) useExplorerStore.getState().setHovered(null);
    },
    [],
  );

  const rail = variant === "rail";

  return (
    <nav className={styles.index} data-variant={variant} aria-label={`${capitalize(TERMS.part)} index`}>
      <div className={styles.head}>
        <SectionHead
          title={rail ? capitalize(TERMS.parts) : "Component index"}
          aside={rail ? undefined : `${String(ROWS.length).padStart(2, "0")} ${TERMS.partsShort}`}
        />
      </div>
      <ol className={styles.list}>
        {ROWS.map(({ spec, index, count }) => {
          const active = selected === spec.id;
          return (
            <li key={spec.id}>
              <Link
                to={`/explore/${spec.slug}`}
                className={styles.row}
                data-active={active || undefined}
                data-hover={hovered === spec.id || undefined}
                aria-current={active ? "page" : undefined}
                title={rail ? `${spec.name} — ${spec.classification}` : undefined}
                onMouseEnter={() => enter(spec.id)}
                onMouseLeave={() => leave(spec.id)}
                onFocus={() => enter(spec.id)}
                onBlur={() => leave(spec.id)}
                onClick={() => {
                  leave(spec.id);
                  onNavigate?.();
                }}
              >
                <span className={styles.num}>{index}</span>
                <span className={styles.code}>{spec.prefix}</span>
                <span className={styles.text}>
                  <span className={styles.name}>{spec.shortName}</span>
                  {!rail && <span className={styles.cls}>{spec.classification}</span>}
                </span>
                {!rail && (
                  <span className={styles.count} title={`${count} subassemblies`}>
                    {String(count).padStart(2, "0")}
                  </span>
                )}
                <ChevronRightIcon className={styles.chev} size={12} />
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
