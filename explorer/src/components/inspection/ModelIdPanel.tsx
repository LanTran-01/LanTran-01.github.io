import { COMPONENTS, TOTAL_SUBASSEMBLIES } from "@/data/components";
import { modelConfig } from "@/data/modelConfig";
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

  return (
    <section className={styles.id} aria-labelledby="model-id-title">
      <SectionHead title="Machine identification" aside="ID-00" />
      <p className={styles.designation}>RX-105</p>
      <h1 id="model-id-title" className={styles.name}>
        <span className={styles.xi}>Ξ</span> GUNDAM
      </h1>
      <p className={styles.source}>Mobile Suit Gundam: Hathaway</p>

      <dl className={styles.rows}>
        <div className={styles.row}>
          <dt>Flight system</dt>
          <dd>Minovsky flight system</dd>
          <BasisTag basis="reference" />
        </div>
        <div className={styles.row}>
          <dt>Pilot</dt>
          <dd>Single</dd>
          <BasisTag basis="reference" />
        </div>
        <div className={styles.row}>
          <dt>Model</dt>
          <dd>{modelLabel}</dd>
          {prototype ? <ProtoTag /> : <span />}
        </div>
        <div className={styles.row}>
          <dt>Assemblies</dt>
          <dd className={styles.num}>{String(COMPONENTS.length).padStart(2, "0")}</dd>
          <span />
        </div>
        <div className={styles.row}>
          <dt>Subassemblies</dt>
          <dd className={styles.num}>{TOTAL_SUBASSEMBLIES}</dd>
          <span />
        </div>
        <div className={styles.row}>
          <dt>Internals</dt>
          <dd>Conceptual</dd>
          <BasisTag basis="conceptual" />
        </div>
      </dl>

      {prototype && (
        <p className={styles.disclosure}>
          Prototype silhouette study built from primitives — not an accurate or licensed model. Internal hardware is a
          conceptual visualization, not canon.
        </p>
      )}
    </section>
  );
}
