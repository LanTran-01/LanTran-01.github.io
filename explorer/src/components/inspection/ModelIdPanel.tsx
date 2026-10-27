import { COMPONENTS, TOTAL_SUBASSEMBLIES } from "@/data/components";
import { modelConfig } from "@/data/modelConfig";
import { MACHINE, TERMS, capitalize } from "@/data/machine";
import { useExplorerStore } from "@/state/explorerStore";
import { BasisTag, ProtoTag } from "./BasisTag";
import { SectionHead } from "./SectionHead";
import styles from "./ModelIdPanel.module.css";

/** Machine identification block for the overview. */
export function ModelIdPanel() {
  const status = useExplorerStore((s) => s.modelStatus);
  const fellBack = status.state === "ready" && status.source === "procedural" && modelConfig.source === "gltf";
  const modelLabel = fellBack ? "Procedural prototype (GLB fallback)" : modelConfig.label;
  const prototype = modelConfig.isPrototype || fellBack;
  const { identity } = MACHINE;

  return (
    <section className={styles.id} aria-labelledby="model-id-title">
      <SectionHead title={`${capitalize(TERMS.whole)} identification`} aside="ID-00" />
      <p className={styles.designation}>{identity.designation}</p>
      <h1 id="model-id-title" className={styles.name}>
        {identity.glyph && (
          <>
            <span className={styles.xi}>{identity.glyph}</span>{" "}
          </>
        )}
        {identity.name}
      </h1>
      <p className={styles.source}>{identity.source}</p>

      <dl className={styles.rows}>
        {identity.rows.map((row) => (
          <div key={row.label} className={styles.row}>
            <dt>{row.label}</dt>
            <dd>{row.value}</dd>
            <BasisTag basis={row.basis} />
          </div>
        ))}
        <div className={styles.row}>
          <dt>Model</dt>
          <dd>{modelLabel}</dd>
          {prototype ? <ProtoTag /> : <span />}
        </div>
      </dl>

      <dl className={styles.stats}>
        <div>
          <dt>{capitalize(TERMS.parts)}</dt>
          <dd>{String(COMPONENTS.length).padStart(2, "0")}</dd>
        </div>
        <div>
          <dt>Subassemblies</dt>
          <dd>{TOTAL_SUBASSEMBLIES}</dd>
        </div>
        <div>
          <dt>Internals</dt>
          <dd className={styles.statWord}>
            {identity.internals} <span className="visually-hidden">{identity.internalsNote}</span>
          </dd>
        </div>
      </dl>

      {prototype && (
        <p className={styles.disclosure}>{identity.disclosure}</p>
      )}
    </section>
  );
}
