import type { Reading, SpreadDefinition } from "@/domain/types";
import { isComplete, revealedCount } from "@/domain/readingModel";
import { ArrowDown, ArrowLeft, Spark } from "@/components/ui/Icons";
import ui from "@/components/ui/ui.module.css";
import s from "./reading.module.css";

interface ReadingHeaderProps {
  reading: Reading;
  spread: SpreadDefinition;
  onBack: () => void;
  onRevealAll: () => void;
  onSummary: () => void;
}

export function ReadingHeader({ reading, spread, onBack, onRevealAll, onSummary }: ReadingHeaderProps) {
  const complete = isComplete(reading);
  const hidden = reading.status.filter((st) => st === "hidden").length;
  return (
    <header className={s.readingHeader}>
      <button type="button" className={`${ui.btn} ${ui.ghost} ${s.back}`} onClick={onBack}>
        <ArrowLeft />
        All spreads
      </button>

      <div className={s.titleBlock}>
        <p className={ui.label}>
          {spread.name} <span className={s.dot}>·</span> {spread.count} {spread.count === 1 ? "card" : "cards"}
        </p>
        <h1 className={s.question} title={reading.question || undefined}>
          {reading.question ? `“${reading.question}”` : "An open reading"}
        </h1>
      </div>

      <div className={s.headerEnd}>
        <ReadingProgress reading={reading} />
        {hidden >= 2 && (
          <button type="button" className={`${ui.btn} ${ui.secondary} ${s.headerAction}`} onClick={onRevealAll}>
            <Spark />
            Reveal all remaining
          </button>
        )}
        {complete && (
          <button type="button" className={`${ui.btn} ${ui.secondary} ${s.headerAction}`} onClick={onSummary}>
            Full reading
            <ArrowDown />
          </button>
        )}
      </div>
    </header>
  );
}

export function ReadingProgress({ reading }: { reading: Reading }) {
  const count = reading.status.length;
  const revealed = revealedCount(reading);
  const complete = revealed === count;
  const text = complete ? "Reading complete" : `${revealed} of ${count} ${count === 1 ? "card" : "cards"} revealed`;
  return (
    <div
      className={s.progress}
      role="progressbar"
      aria-label="Reading progress"
      aria-valuemin={0}
      aria-valuemax={count}
      aria-valuenow={revealed}
      aria-valuetext={text}
    >
      <span className={s.progressText} data-complete={complete || undefined}>
        {text}
      </span>
      <span className={s.segments} aria-hidden="true">
        {reading.status.map((st, i) => (
          <span key={i} data-state={st} />
        ))}
      </span>
    </div>
  );
}
