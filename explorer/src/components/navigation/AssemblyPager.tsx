import { useNavigate } from "react-router";
import { COMPONENTS, adjacentComponent } from "@/data/components";
import type { ComponentId } from "@/data/types";
import { TERMS } from "@/data/machine";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/layout/Icons";
import styles from "./AssemblyPager.module.css";

const indexOf = (id: ComponentId) => String(COMPONENTS.findIndex((c) => c.id === id) + 1).padStart(2, "0");

/** Previous / next assembly buttons with their targets spelled out. */
export function AssemblyPager({ current }: { current: ComponentId }) {
  const navigate = useNavigate();
  const prev = adjacentComponent(current, -1);
  const next = adjacentComponent(current, 1);
  return (
    <div className={styles.pager}>
      <button
        type="button"
        className={styles.step}
        onClick={() => navigate(`/explore/${prev.slug}`)}
        aria-label={`Previous ${TERMS.part}: ${prev.name}`}
        aria-keyshortcuts="ArrowLeft"
      >
        <ChevronLeftIcon className={styles.icon} />
        <span className={styles.stepText}>
          <span className={styles.stepLabel}>Prev</span>
          <span className={styles.stepName}>
            <span className={styles.stepCode}>
              {indexOf(prev.id)} {prev.prefix}
            </span>{" "}
            {prev.shortName}
          </span>
        </span>
      </button>
      <button
        type="button"
        className={styles.step}
        data-dir="next"
        onClick={() => navigate(`/explore/${next.slug}`)}
        aria-label={`Next ${TERMS.part}: ${next.name}`}
        aria-keyshortcuts="ArrowRight"
      >
        <span className={styles.stepText}>
          <span className={styles.stepLabel}>Next</span>
          <span className={styles.stepName}>
            <span className={styles.stepCode}>
              {indexOf(next.id)} {next.prefix}
            </span>{" "}
            {next.shortName}
          </span>
        </span>
        <ChevronRightIcon className={styles.icon} />
      </button>
    </div>
  );
}

/** Native select listing all assemblies; changes navigate. */
export function AssemblySwitcher({ current }: { current: ComponentId }) {
  const navigate = useNavigate();
  return (
    <label className={styles.switcher}>
      <span className={styles.switchLabel}>Jump to</span>
      <select
        className={styles.select}
        value={current}
        onChange={(e) => {
          const spec = COMPONENTS.find((c) => c.id === e.target.value);
          if (spec) navigate(`/explore/${spec.slug}`);
        }}
      >
        {COMPONENTS.map((c, i) => (
          <option key={c.id} value={c.id}>
            {String(i + 1).padStart(2, "0")} · {c.prefix} · {c.name}
          </option>
        ))}
      </select>
      <ChevronRightIcon className={styles.selectIcon} size={12} />
    </label>
  );
}
