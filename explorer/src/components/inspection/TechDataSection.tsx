import { Link } from "react-router";
import { countSubassemblies, getComponent } from "@/data/components";
import { FLOW_KINDS, LANES, systemNodesForComponent } from "@/data/subsystems";
import type { ComponentFlow, ComponentSpec } from "@/data/types";
import { MACHINE, TERMS, capitalize } from "@/data/machine";
import { ArrowUpRightIcon, ChevronRightIcon } from "@/components/layout/Icons";
import { BasisTag } from "./BasisTag";
import { BasisLegend } from "./IdentificationSection";
import { SectionHead } from "./SectionHead";
import { FLOW_ORDER, pad2 } from "./labels";
import s from "./inspection.module.css";
import d from "./TechDataSection.module.css";

const DIRECTION_TEXT: Record<ComponentFlow["direction"], string> = {
  in: `into this ${TERMS.part} from`,
  out: `out of this ${TERMS.part} to`,
  both: "exchanged with",
};

/** Hairline arrow: in ←, out →, both ↔ (relative to this assembly on the left). */
function FlowArrow({ direction }: { direction: ComponentFlow["direction"] }) {
  return (
    <svg className={d.arrow} width="28" height="8" viewBox="0 0 28 8" aria-hidden="true" data-dir={direction}>
      <path d="M1 4h26" />
      {(direction === "out" || direction === "both") && <path d="M23 1l4 3-4 3" />}
      {(direction === "in" || direction === "both") && <path d="M5 1L1 4l4 3" />}
    </svg>
  );
}

/** D — technical data, relationships and related subsystems. */
export function TechDataSection({ spec, withDescription = false }: { spec: ComponentSpec; withDescription?: boolean }) {
  const flows = [...spec.flows].sort((a, b) => FLOW_ORDER.indexOf(a.kind) - FLOW_ORDER.indexOf(b.kind));
  const related = systemNodesForComponent(spec.id);

  return (
    <section className={s.section} aria-labelledby="insp-d">
      <SectionHead index="D" title="Technical data" id="insp-d" />
      {withDescription && (
        <div className={d.description}>
          <p className={s.body}>{spec.description}</p>
          <BasisLegend />
        </div>
      )}
      <dl className={s.rows}>
        <div className={s.row}>
          <dt>{capitalize(TERMS.part)} ID</dt>
          <dd className={s.mono}>{spec.designation}</dd>
        </div>
        <div className={s.row}>
          <dt>Subassemblies</dt>
          <dd className={s.mono}>{pad2(countSubassemblies(spec))}</dd>
        </div>
        <div className={s.row}>
          <dt>Function</dt>
          <dd>
            <span className={s.valueWithTag}>
              <span>{spec.mechanicalFunction}</span>
              <BasisTag basis="conceptual" />
            </span>
          </dd>
        </div>
        {spec.role && (
          <div className={s.row}>
            <dt>Role</dt>
            <dd>
              <span className={s.valueWithTag}>
                <span>{spec.role}</span>
                <BasisTag basis="conceptual" />
              </span>
            </dd>
          </div>
        )}
        <div className={s.row}>
          <dt>Interfaces</dt>
          <dd className={s.stack}>
            {spec.interfaces.map((itf) => {
              const peer = getComponent(itf.componentId);
              return (
                <span key={itf.componentId}>
                  <Link to={`/explore/${peer.slug}`} className={s.link}>
                    <span className={s.linkCode}>{peer.prefix}</span>
                    {peer.shortName}
                  </Link>
                  <span className={s.subtle}>{itf.relation}</span>
                </span>
              );
            })}
          </dd>
        </div>
        {spec.techData.map((f) => (
          <div key={f.label} className={s.row}>
            <dt>{f.label}</dt>
            <dd>
              <span className={s.valueWithTag}>
                <span>{f.value}</span>
                <BasisTag basis={f.basis} />
              </span>
            </dd>
          </div>
        ))}
      </dl>

      <h3 className={s.subhead}>Relationships</h3>
      <ul className={d.flows}>
        {flows.map((f, i) => (
          <li key={`${f.kind}-${i}`} className={d.flow} data-kind={f.kind}>
            <span className={d.kind}>
              <span className={d.swatch} aria-hidden="true" />
              {FLOW_KINDS[f.kind].label}
            </span>
            <FlowArrow direction={f.direction} />
            <span className={d.peer}>
              <span className="visually-hidden">{DIRECTION_TEXT[f.direction]} </span>
              {f.peer}
              <span className={s.subtle}>{f.note}</span>
            </span>
          </li>
        ))}
      </ul>
      <p className={d.flowKey} aria-hidden="true">
        Arrows read from this {TERMS.part} · {MACHINE.flowsNote}
      </p>

      {spec.details && spec.details.length > 0 && (
        <>
          <h3 className={s.subhead}>Engineering notes</h3>
          <div className={d.details}>
            {spec.details.map((note) => (
              <details key={note.title} className={d.detail}>
                <summary className={d.detailSummary}>
                  <span>{note.title}</span>
                  <ChevronRightIcon size={12} className={d.detailIcon} />
                </summary>
                <p className={d.detailBody}>{note.body}</p>
              </details>
            ))}
          </div>
        </>
      )}

      <h3 className={s.subhead}>Inspection notes</h3>
      <ol className={s.notes}>
        {spec.inspectionNotes.map((n) => (
          <li key={n}>{n}</li>
        ))}
      </ol>

      <h3 className={s.subhead}>Related subsystems</h3>
      <ul className={d.related}>
        {related.map((n) => (
          <li key={n.id}>
            <Link to={`/systems?node=${encodeURIComponent(n.id)}`} className={d.relatedLink}>
              <span className={d.relatedCode}>{n.code}</span>
              <span className={d.relatedLabel}>{n.label}</span>
              <span className={d.relatedLane}>{LANES[n.lane].short}</span>
              <ArrowUpRightIcon size={12} className={d.relatedIcon} />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
