import { forwardRef, useMemo } from "react";
import type { Reading } from "@/domain/types";
import { synthesise, type ResolvedReading } from "@/domain/readingModel";
import { positionNumber } from "@/domain/spreadDefinitions";
import { TarotCardStatic } from "@/components/cards/TarotCard";
import { ReadingActions } from "@/components/reading/ReadingActions";
import { Check } from "@/components/ui/Icons";
import ui from "@/components/ui/ui.module.css";
import s from "./reading.module.css";

interface ReadingSummaryProps {
  reading: Reading;
  resolved: ResolvedReading;
  onReview: (index: number) => void;
  onNew: () => void;
}

const TONE_LABEL = { complementary: "Complementary", tension: "In tension", neutral: "Neutral" } as const;

/** The complete reading: synthesis, themes, relationships, questions, card review and actions. */
export const ReadingSummary = forwardRef<HTMLElement, ReadingSummaryProps>(function ReadingSummary({ reading, resolved, onReview, onNew }, ref) {
  const synth = useMemo(() => synthesise(resolved), [resolved]);
  return (
    <section ref={ref} id="summary" className={s.summary} aria-labelledby="summary-title">
      <header className={s.summaryHead}>
        <p className={`${ui.label} ${s.complete}`}>
          <span className={s.completeMark}>
            <Check size={12} />
          </span>
          Reading complete
        </p>
        <h2 id="summary-title" className={s.summaryTitle}>
          {synth.heading}
        </h2>
        {reading.question && <p className={s.summaryQuestion}>“{reading.question}”</p>}
      </header>

      <div className={s.summaryGrid}>
        <div className={s.summaryMain}>
          <div className={s.prose}>
            {synth.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>

          {synth.themes.length > 0 && (
            <div className={s.block}>
              <h3 className={ui.label}>Recurring themes</h3>
              <ul className={s.themeList}>
                {synth.themes.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          )}

          {synth.relationships.length > 0 && (
            <div className={s.block}>
              <h3 className={ui.label}>Relationships between positions</h3>
              <ul className={s.relList}>
                {synth.relationships.map((r) => (
                  <li key={r.title}>
                    <div className={s.relHead}>
                      <span className={s.relTitle}>{r.title}</span>
                      <span className={s.tag} data-tone={r.tone}>
                        {TONE_LABEL[r.tone]}
                      </span>
                    </div>
                    <p>{r.text}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <aside className={s.summaryAside}>
          <div className={s.block}>
            <h3 className={ui.label}>{synth.questions.length > 1 ? "Reflective questions" : "Reflective question"}</h3>
            <ol className={s.qList}>
              {synth.questions.map((q) => (
                <li key={q}>{q}</li>
              ))}
            </ol>
          </div>
          <div className={s.block}>
            <h3 className={ui.label}>{synth.closing.label}</h3>
            <ul className={s.closingList}>
              {synth.closing.items.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      <div className={s.review}>
        <h3 className={ui.label}>Review the cards</h3>
        <ul className={s.reviewGrid}>
          {resolved.drawn.map((d) => (
            <li key={d.card.id}>
              <button type="button" className={s.reviewItem} onClick={() => onReview(d.index)} aria-current={reading.selected === d.index ? "true" : undefined}>
                <span className={s.reviewThumb}>
                  <TarotCardStatic card={d.card} orientation={d.orientation} />
                </span>
                <span className={s.reviewText}>
                  <span className={s.reviewPos}>
                    {positionNumber(d.index)} · {d.position.label}
                  </span>
                  <span className={s.reviewName}>{d.card.name}</span>
                  <span className={s.reviewOrient}>{d.orientation === "upright" ? "Upright" : "Reversed"}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <ReadingActions reading={reading} onNew={onNew} />

      <p className={s.disclaimer}>
        ARCANA composes every interpretation on this device from traditional card meanings, the role of each position, and the words of your question. There is no
        AI service and no prediction: treat the reading as a set of symbols to think with.
      </p>
    </section>
  );
});
