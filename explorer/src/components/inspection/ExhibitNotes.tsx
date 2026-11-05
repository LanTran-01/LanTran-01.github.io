import { useRef } from "react";
import type { ExhibitConfig } from "@/data/types";
import { Panel } from "@/components/layout/Panel";
import { ArrowUpRightIcon, ChevronRightIcon } from "@/components/layout/Icons";
import { useViewInset } from "@/hooks/useViewInset";
import { SectionHead } from "./SectionHead";
import { pad2 } from "./labels";
import s from "./inspection.module.css";
import d from "./TechDataSection.module.css";
import e from "./ExhibitNotes.module.css";
import p from "./InspectionPanel.module.css";

const letter = (i: number) => String.fromCharCode(65 + i);

/**
 * A machine's long-form context: a short lede, lettered groups of collapsible
 * notes (the first one open) and the published sources they draw on.
 */
export function ExhibitNotes({ exhibit }: { exhibit: ExhibitConfig }) {
  return (
    <>
      <section className={s.section} aria-labelledby="exhibit-title">
        <SectionHead title={exhibit.title} id="exhibit-title" aside="EX-00" />
        <p className={e.lede}>{exhibit.lede}</p>
      </section>

      {exhibit.groups.map((group, gi) => (
        <section key={group.title} className={s.section} aria-labelledby={`exhibit-g${gi}`}>
          <SectionHead index={letter(gi)} title={group.title} id={`exhibit-g${gi}`} aside={`${pad2(group.notes.length)} NOTES`} />
          <div className={d.details}>
            {group.notes.map((note, ni) => (
              <details key={note.title} className={d.detail} open={gi === 0 && ni === 0}>
                <summary className={d.detailSummary}>
                  <span>{note.title}</span>
                  <ChevronRightIcon size={12} className={d.detailIcon} />
                </summary>
                <p className={d.detailBody}>{note.body}</p>
              </details>
            ))}
          </div>
        </section>
      ))}

      {exhibit.sources && exhibit.sources.length > 0 && (
        <section className={s.section} aria-labelledby="exhibit-sources">
          <SectionHead index={letter(exhibit.groups.length)} title="Sources" id="exhibit-sources" />
          <ul className={e.sources}>
            {exhibit.sources.map((src) => (
              <li key={src.href}>
                <a className={e.source} href={src.href} target="_blank" rel="noopener noreferrer">
                  <span className={e.sourceLabel}>{src.label}</span>
                  <ArrowUpRightIcon size={12} className={e.sourceIcon} />
                </a>
                {src.note && <span className={e.sourceNote}>{src.note}</span>}
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}

/** Desktop overview: the exhibit as a right-hand panel. The model stays centred in the space between the panels. */
export function ExhibitPanel({ exhibit }: { exhibit: ExhibitConfig }) {
  const ref = useRef<HTMLElement>(null);
  useViewInset(ref, "right");
  return (
    <Panel ref={ref} as="aside" side="right" className={p.panel} aria-label={exhibit.title}>
      <div className={p.scroll}>
        <div className={p.content}>
          <ExhibitNotes exhibit={exhibit} />
        </div>
      </div>
    </Panel>
  );
}
