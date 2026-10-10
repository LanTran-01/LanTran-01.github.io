import { useMemo, type Ref } from "react";
import { FLOW_KINDS, LANES, getSystemNode, getSystemParent } from "@/data/subsystems";
import { getComponent } from "@/data/components";
import type { ComponentId } from "@/data/types";
import { nodeFlows, type NodeFlow } from "@/features/hardware-architecture/graph";
import { LANE_TONE } from "@/features/hardware-architecture/presentation";
import { FlowSample } from "./Legend";
import styles from "./NodeDetail.module.css";

interface NodeDetailProps {
  nodeId: string;
  onSelect: (id: string) => void;
  onClose: () => void;
  /** Hover preview of a linked assembly in the 3D view. */
  onPreviewAssembly: (id: ComponentId | null) => void;
  onOpenAssembly: (id: ComponentId) => void;
  ref?: Ref<HTMLElement>;
}

/** Docked inspector for the selected subsystem. */
export function NodeDetail({ nodeId, onSelect, onClose, onPreviewAssembly, onOpenAssembly, ref }: NodeDetailProps) {
  const node = getSystemNode(nodeId);
  const parent = getSystemParent(nodeId);
  const flows = useMemo(() => nodeFlows(nodeId), [nodeId]);
  if (!node) return null;
  const lane = LANES[node.lane];

  return (
    <aside ref={ref} className={styles.detail} aria-label={`${node.code} ${node.label} details`} data-ui="">
      <header className={styles.head}>
        <div className={styles.headTop}>
          <span className={styles.code}>{node.code}</span>
          <span className={node.basis === "reference" ? styles.basisRef : styles.basis}>
            {node.basis === "reference" ? "REF" : "CONCEPT"}
          </span>
          <button type="button" className={styles.close} onClick={onClose} aria-label="Close details (Esc)">
            <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
              <path d="M1.5 1.5L8.5 8.5M8.5 1.5L1.5 8.5" />
            </svg>
          </button>
        </div>
        <h2 className={styles.title}>{node.label}</h2>
      </header>

      <div className={styles.scroll}>
        <dl className={styles.meta}>
          <div>
            <dt>Lane</dt>
            <dd>
              <i className={styles.laneSwatch} style={{ background: LANE_TONE[node.lane] }} aria-hidden="true" />
              {lane.label} <span className={styles.dim}>/ {lane.short}</span>
            </dd>
          </div>
          <div>
            <dt>Basis</dt>
            <dd>{node.basis === "reference" ? "Reference descriptor" : "Conceptual"}</dd>
          </div>
          {parent && (
            <div>
              <dt>Parent</dt>
              <dd>
                <button type="button" className={styles.inlineLink} onClick={() => onSelect(parent.id)}>
                  {parent.code} {parent.label}
                </button>
              </dd>
            </div>
          )}
        </dl>

        <p className={styles.desc}>{node.description}</p>

        {node.children && node.children.length > 0 && (
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>
              Subsystems <span>{String(node.children.length).padStart(2, "0")}</span>
            </h3>
            <ul className={styles.rows}>
              {node.children.map((c) => (
                <li key={c.id}>
                  <button type="button" className={`${styles.row} ${styles.rowSimple}`} onClick={() => onSelect(c.id)}>
                    <span className={styles.rowCode}>{c.code}</span>
                    <span className={styles.rowLabel}>{c.label}</span>
                    <Arrow />
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        <FlowList title="Inputs" flows={flows.inputs} dir="in" onSelect={onSelect} />
        <FlowList title="Outputs" flows={flows.outputs} dir="out" onSelect={onSelect} />

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>
            Linked 3D assemblies <span>{String(node.componentIds.length).padStart(2, "0")}</span>
          </h3>
          <div className={styles.assemblies}>
            {node.componentIds.map((cid) => {
              const spec = getComponent(cid);
              return (
                <button
                  key={cid}
                  type="button"
                  className={styles.assembly}
                  onPointerEnter={() => onPreviewAssembly(cid)}
                  onPointerLeave={() => onPreviewAssembly(null)}
                  onFocus={() => onPreviewAssembly(cid)}
                  onBlur={() => onPreviewAssembly(null)}
                  onClick={() => onOpenAssembly(cid)}
                  title={`Inspect ${spec.name}`}
                >
                  <span className={styles.asmCode}>{spec.designation}</span>
                  <span className={styles.asmName}>{spec.shortName}</span>
                  <Arrow />
                </button>
              );
            })}
          </div>
        </section>

        <p className={styles.note}>Conceptual illustration — not official design data.</p>
      </div>
    </aside>
  );
}

function FlowList({
  title,
  flows,
  dir,
  onSelect,
}: {
  title: string;
  flows: NodeFlow[];
  dir: "in" | "out";
  onSelect: (id: string) => void;
}) {
  return (
    <section className={styles.section}>
      <h3 className={styles.sectionTitle}>
        {title} <span>{String(flows.length).padStart(2, "0")}</span>
      </h3>
      {flows.length === 0 ? (
        <p className={styles.empty}>None in this model.</p>
      ) : (
        <ul className={styles.rows}>
          {flows.map((f) => (
            <li key={f.key}>
              <button
                type="button"
                className={styles.row}
                onClick={() => onSelect(f.peer.id)}
                aria-label={`${dir === "in" ? "From" : "To"} ${f.peer.code} ${f.peer.label}, ${FLOW_KINDS[f.kind].label}${f.label ? `, ${f.label}` : ""}${f.via ? `, via ${f.via.code}` : ""}`}
              >
                <span className={styles.rowDir} aria-hidden="true">
                  {dir === "in" ? "←" : "→"}
                </span>
                <span className={styles.rowCode}>{f.peer.code}</span>
                <span className={styles.rowLabel}>
                  {f.peer.label}
                  {(f.label || f.via) && (
                    <span className={styles.rowSub}>
                      {f.label}
                      {f.label && f.via ? " · " : ""}
                      {f.via ? `via ${f.via.code}` : ""}
                    </span>
                  )}
                </span>
                <span className={styles.rowKind}>
                  <FlowSample kind={f.kind} width={18} />
                  {FLOW_KINDS[f.kind].label}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function Arrow() {
  return (
    <svg className={styles.chev} width="8" height="8" viewBox="0 0 8 8" aria-hidden="true">
      <path d="M2.5 1L5.5 4L2.5 7" />
    </svg>
  );
}
