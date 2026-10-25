import { useEffect, useMemo, useRef, useState } from "react";
import type { Reading } from "@/domain/types";
import { isComplete, resolveDraws, revealedCount } from "@/domain/readingModel";
import type { ArcanaSession } from "@/state/useArcanaSession";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useViewportHeight } from "@/hooks/useElementSize";
import { scrollBehavior } from "@/components/landing/configure";
import { ReadingHeader } from "@/components/reading/ReadingHeader";
import { SpreadLayout } from "@/components/reading/SpreadLayout";
import { CardDetailPanel } from "@/components/reading/CardDetailPanel";
import { CardDetailSheet } from "@/components/reading/CardDetailSheet";
import { ReadingSummary } from "@/components/reading/ReadingSummary";
import s from "./reading.module.css";

/** Vertical space taken by the site header, the reading header and padding above the stage. */
const CHROME_HEIGHT = 200;

/**
 * The reading interface. Layout adapts per spread and viewport:
 *   split    ≥ 1080px (one, five and ten cards): spread left, interpretation right
 *   stacked  three cards, and tablets: spread above, interpretation below
 *   compact  < 820px: spread only; interpretations open in a focused sheet
 */
export function ReadingScreen({ session, reading }: { session: ArcanaSession; reading: Reading }) {
  const { draws, spreadId, question } = reading;
  const resolved = useMemo(() => resolveDraws(spreadId, draws, question), [spreadId, draws, question]);
  const { spread } = resolved;

  const compact = useMediaQuery("(max-width: 819px)");
  const wideScreen = useMediaQuery("(min-width: 1080px)");
  const split = !compact && wideScreen && spread.id !== "three";
  const vh = useViewportHeight();

  const [sheetIndex, setSheetIndex] = useState<number | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const stageRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const summaryRef = useRef<HTMLElement>(null);
  const lastNonce = useRef(reading.lastSettled?.nonce ?? 0);

  const complete = isComplete(reading);
  const revealed = revealedCount(reading);

  // A reveal has settled: announce it, and bring its interpretation into view.
  useEffect(() => {
    const ls = reading.lastSettled;
    if (!ls || ls.nonce === lastNonce.current) return;
    lastNonce.current = ls.nonce;
    const d = resolved.drawn[ls.index];
    const done = revealedCount(reading);
    setAnnouncement(
      `${d.card.name}, ${d.orientation}, in the ${d.position.label} position. ${done} of ${spread.count} revealed.${isComplete(reading) ? " Reading complete." : ""}`,
    );
    if (ls.auto) return;
    if (compact) setSheetIndex(ls.index);
    else if (!split) {
      const panel = panelRef.current;
      if (panel && panel.getBoundingClientRect().top > window.innerHeight * 0.8) panel.scrollIntoView({ block: "start", behavior: scrollBehavior() });
    }
  }, [reading, resolved, spread.count, compact, split]);

  const scrollToSlot = (index: number) => {
    const el = stageRef.current?.querySelector<HTMLElement>(`[data-index="${index}"]`);
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (r.top < 80 || r.bottom > window.innerHeight) el.scrollIntoView({ block: "center", behavior: scrollBehavior() });
  };

  const activate = (index: number) => {
    const status = reading.status[index];
    if (status === "hidden") session.reveal(index);
    else if (status === "revealed") {
      session.select(index);
      if (compact) setSheetIndex(index);
    }
  };

  const selectFromDetail = (index: number) => {
    session.select(index);
    if (compact) setSheetIndex(index);
  };

  const revealFromDetail = (index: number) => {
    setSheetIndex(null);
    scrollToSlot(index);
    session.reveal(index);
  };

  const review = (index: number) => {
    session.select(index);
    if (compact) setSheetIndex(index);
    else if (split) window.scrollTo({ top: 0, behavior: scrollBehavior() });
    else panelRef.current?.scrollIntoView({ block: "start", behavior: scrollBehavior() });
  };

  const hint = compact
    ? revealed === 0
      ? "Tap any card to reveal it. Reveal them in any order."
      : complete
        ? "Tap any card to read its interpretation again."
        : "Tap a face-down card to continue, or a revealed card to read it again."
    : revealed === 0
      ? "Select any card to reveal it. Reveal them in any order."
      : complete
        ? "Select any card to review its interpretation."
        : "Select another card to continue the reading.";

  return (
    <main className={s.reading} data-layout={compact ? "compact" : split ? "split" : "stacked"} data-spread={spread.id}>
      <ReadingHeader
        reading={reading}
        spread={spread}
        onBack={session.leave}
        onRevealAll={session.revealAll}
        onSummary={() => summaryRef.current?.scrollIntoView({ block: "start", behavior: scrollBehavior() })}
      />

      <div className={s.body}>
        <section ref={stageRef} className={s.stageArea} aria-label={`${spread.name} spread`}>
          <SpreadLayout
            reading={reading}
            resolved={resolved}
            variant={compact ? "compact" : "wide"}
            maxHeight={compact ? 100000 : Math.max(440, vh - CHROME_HEIGHT)}
            onActivate={activate}
          />
          <p className={s.stageHint}>{hint}</p>
        </section>

        {!compact && (
          <aside ref={panelRef} className={s.panel} aria-label="Card interpretation">
            <CardDetailPanel
              reading={reading}
              resolved={resolved}
              index={reading.selected}
              mode="panel"
              headingId="panel-card-title"
              onSelect={selectFromDetail}
              onReveal={revealFromDetail}
            />
          </aside>
        )}
      </div>

      {complete && <ReadingSummary ref={summaryRef} reading={reading} resolved={resolved} onReview={review} onNew={session.newReading} />}

      <p className="visually-hidden" aria-live="polite">
        {announcement}
      </p>

      {compact && (
        <CardDetailSheet
          reading={reading}
          resolved={resolved}
          index={sheetIndex}
          onClose={() => setSheetIndex(null)}
          onSelect={selectFromDetail}
          onReveal={revealFromDetail}
        />
      )}
    </main>
  );
}
