import { COMPONENTS } from "@/data/components";
import type { ComponentSpec } from "@/data/types";
import { BasisTag } from "./BasisTag";
import { SectionHead } from "./SectionHead";
import { pad2 } from "./labels";
import s from "./inspection.module.css";

/** A — identification. */
export function IdentificationSection({ spec, compact = false }: { spec: ComponentSpec; compact?: boolean }) {
  const index = COMPONENTS.findIndex((c) => c.id === spec.id) + 1;
  return (
    <section className={s.section} aria-labelledby="insp-a">
      <SectionHead
        index="A"
        title="Identification"
        id="insp-a"
        aside={
          <>
            <span style={{ color: "var(--text)" }}>{pad2(index)}</span> / {pad2(COMPONENTS.length)}
          </>
        }
      />
      <p className={s.designation}>{spec.designation}</p>
      <h1 className={s.name}>{spec.name}</h1>
      <p className={s.classification}>{spec.classification}</p>
      {!compact && <p className={s.body}>{spec.description}</p>}
      <div className={s.legend} aria-label="Data basis legend">
        <span>
          <BasisTag basis="reference" /> broadly published
        </span>
        <span>
          <BasisTag basis="conceptual" /> invented for this study
        </span>
      </div>
    </section>
  );
}
