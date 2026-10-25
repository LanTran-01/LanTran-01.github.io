import { useMemo } from "react";
import type { Reading } from "@/domain/types";
import { interpretAt, type ResolvedReading } from "@/domain/readingModel";
import { positionNumber } from "@/domain/spreadDefinitions";
import { TarotCardStatic } from "@/components/cards/TarotCard";
import { ArrowLeft, ArrowRight, Close } from "@/components/ui/Icons";
import ui from "@/components/ui/ui.module.css";
import s from "./reading.module.css";

interface CardDetailProps {
  reading: Reading;
  resolved: ResolvedReading;
  index: number | null;
  /** "panel": beside or below the spread. "sheet": the focused phone view. */
  mode: "panel" | "sheet";
  onSelect: (index: number) => void;
  onReveal: (index: number) => void;
  onClose?: () => void;
  headingId?: string;
}

/** Interpretation of one revealed card: identity, position, orientation, keywords and the four readings. */
export function CardDetailPanel({ reading, resolved, index, mode, onSelect, onReveal, onClose, headingId }: CardDetailProps) {
  const revealed = index !== null && reading.status[index] === "revealed";
  const interpretation = useMemo(() => (revealed && index !== null ? interpretAt(resolved, index) : null), [revealed, resolved, index]);

  if (index === null || !revealed || !interpretation) {
    return (
      <div className={s.detailEmpty}>
        <span className={s.emptyMark} aria-hidden="true" />
        <p className={s.emptyTitle}>Select a card to reveal its meaning.</p>
        <p className={s.emptyText}>
          Every card was drawn from a freshly shuffled 78-card deck when this reading began. Reveal them in any order; their identities are already fixed.
        </p>
      </div>
    );
  }

  const d = resolved.drawn[index];
  const count = resolved.spread.count;
  const showThumb = mode === "sheet" || resolved.spread.id !== "single";

  return (
    <article className={s.detail} data-mode={mode} key={`${reading.id}-${index}`} aria-labelledby={headingId}>
      <header className={s.detailHead}>
        {showThumb && (
          <div className={s.detailThumb}>
            <TarotCardStatic card={d.card} orientation={d.orientation} />
          </div>
        )}
        <div className={s.detailId}>
          <p className={ui.label}>
            Position {positionNumber(index)} <span className={s.of}>of {positionNumber(count - 1)}</span>
          </p>
          <h2 id={headingId} className={s.detailName}>
            {d.card.name}
          </h2>
          <dl className={s.facts}>
            <div>
              <dt>Position</dt>
              <dd>{d.position.label}</dd>
            </div>
            <div>
              <dt>Orientation</dt>
              <dd>{d.orientation === "upright" ? "Upright" : "Reversed"}</dd>
            </div>
            <div>
              <dt>Arcana</dt>
              <dd>{d.card.arcana === "major" ? "Major" : `Minor · ${d.card.suit!.charAt(0).toUpperCase()}${d.card.suit!.slice(1)}`}</dd>
            </div>
          </dl>
          <p className={s.positionSummary}>{d.position.summary}</p>
        </div>
        {onClose && (
          <button type="button" className={`${ui.iconBtn} ${s.sheetClose}`} onClick={onClose} aria-label="Close interpretation">
            <Close />
          </button>
        )}
      </header>

      <ul className={s.keywords} aria-label="Keywords">
        {interpretation.keywords.map((k) => (
          <li key={k} className={ui.chip}>
            {k}
          </li>
        ))}
      </ul>

      <div className={s.sections}>
        <section className={s.section}>
          <h3 className={ui.label}>Core meaning</h3>
          <p>{interpretation.coreMeaning}</p>
        </section>
        <section className={s.section}>
          <h3 className={ui.label}>{interpretation.labels.positional}</h3>
          <p>{interpretation.positional}</p>
        </section>
        <section className={`${s.section} ${s.reflect}`}>
          <h3 className={ui.label}>Reflective question</h3>
          <p className={s.quote}>{interpretation.reflectiveQuestion}</p>
        </section>
        <section className={s.section}>
          <h3 className={ui.label}>{interpretation.labels.practical}</h3>
          <p>{interpretation.practical}</p>
        </section>
      </div>

      {count > 1 && (
        <nav className={s.detailNav} aria-label="Other positions">
          <NavButton reading={reading} resolved={resolved} target={index - 1} dir="prev" onSelect={onSelect} onReveal={onReveal} />
          <NavButton reading={reading} resolved={resolved} target={index + 1} dir="next" onSelect={onSelect} onReveal={onReveal} />
        </nav>
      )}
    </article>
  );
}

function NavButton({
  reading,
  resolved,
  target,
  dir,
  onSelect,
  onReveal,
}: {
  reading: Reading;
  resolved: ResolvedReading;
  target: number;
  dir: "prev" | "next";
  onSelect: (i: number) => void;
  onReveal: (i: number) => void;
}) {
  if (target < 0 || target >= resolved.spread.count) return <span />;
  const status = reading.status[target];
  const pos = resolved.drawn[target].position;
  const hidden = status === "hidden";
  const text = hidden ? `Reveal ${positionNumber(target)} · ${pos.label}` : `${positionNumber(target)} · ${pos.label}`;
  return (
    <button
      type="button"
      className={`${ui.btn} ${hidden ? ui.primary : ui.secondary} ${s.navBtn}`}
      data-dir={dir}
      disabled={status === "revealing"}
      onClick={() => (hidden ? onReveal(target) : onSelect(target))}
    >
      {dir === "prev" && <ArrowLeft />}
      <span className={s.navText}>{text}</span>
      {dir === "next" && <ArrowRight />}
    </button>
  );
}
