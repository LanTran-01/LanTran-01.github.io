import { useState } from "react";
import { getSpread } from "@/domain/spreadDefinitions";
import { isComplete, MAX_QUESTION_LENGTH, revealedCount } from "@/domain/readingModel";
import type { ArcanaSession } from "@/state/useArcanaSession";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Hero } from "@/components/landing/Hero";
import { SpreadSelector } from "@/components/landing/SpreadSelector";
import { SpreadPreview } from "@/components/landing/SpreadPreview";
import { Dialog } from "@/components/ui/Dialog";
import { ArrowRight } from "@/components/ui/Icons";
import ui from "@/components/ui/ui.module.css";
import dlg from "@/components/ui/dialog.module.css";
import { CONFIGURE_ID, scrollToConfigure } from "@/components/landing/configure";
import s from "./landing.module.css";

/** Landing → select a spread → set an intention → begin. */
export function LandingPage({ session }: { session: ArcanaSession }) {
  const { spreadId, question, reading } = session.state;
  const spread = getSpread(spreadId);
  const showPreview = useMediaQuery("(min-width: 960px)");
  const [confirmOpen, setConfirmOpen] = useState(false);

  const start = () => {
    if (!session.begin()) setConfirmOpen(true);
  };

  const current = reading ? getSpread(reading.spreadId) : null;
  const done = reading ? revealedCount(reading) : 0;

  return (
    <main className={s.landing}>
      <Hero onStart={() => scrollToConfigure()} />

      <section id={CONFIGURE_ID} className={s.configure} aria-labelledby="configure-title">
        <header className={s.configureHead}>
          <p className={ui.label}>Configure your reading</p>
          <h2 id="configure-title" className={s.h2}>
            Select a spread. Set an intention.
          </h2>
        </header>

        <div className={s.configureGrid}>
          {showPreview && (
            <div className={s.previewCol}>
              <SpreadPreview spreadId={spreadId} height={540} />
              <div className={s.previewCaption}>
                <p className={ui.label}>
                  {spread.name} <span className={s.dim}>·</span> {spread.count} {spread.count === 1 ? "card" : "cards"}
                </p>
                <p className={s.purpose}>{spread.purpose}</p>
              </div>
            </div>
          )}

          <form
            className={s.panel}
            onSubmit={(e) => {
              e.preventDefault();
              start();
            }}
          >
            <fieldset className={s.fieldset}>
              <legend className={`${ui.label} ${s.legend}`}>
                <span className={s.step}>01</span> Spread
              </legend>
              <SpreadSelector value={spreadId} onChange={session.chooseSpread} />
            </fieldset>

            <div className={s.field}>
              <label htmlFor="intention" className={ui.label}>
                <span className={s.step}>02</span> Intention <span className={s.optional}>(optional)</span>
              </label>
              <textarea
                id="intention"
                className={s.textarea}
                rows={2}
                maxLength={MAX_QUESTION_LENGTH}
                placeholder="What would you like to reflect on?"
                value={question}
                onChange={(e) => session.setQuestion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                    e.preventDefault();
                    start();
                  }
                }}
                aria-describedby="intention-hint"
              />
              <p id="intention-hint" className={s.hint}>
                Your words shape how each card is framed. They stay on this device.
              </p>
            </div>

            {reading && current && (
              <div className={s.resume}>
                <p>
                  <span className={s.resumeLabel}>{isComplete(reading) ? "Last reading" : "Reading in progress"}</span>
                  {current.name} · {done} of {current.count} revealed
                </p>
                <button type="button" className={`${ui.btn} ${ui.secondary}`} onClick={session.resume}>
                  {isComplete(reading) ? "Review" : "Resume"}
                </button>
              </div>
            )}

            <button type="submit" className={`${ui.btn} ${ui.primary} ${ui.large} ${ui.block}`}>
              Begin {spread.name.toLowerCase()} reading
              <ArrowRight />
            </button>
            <p className={s.fine}>The full 78-card deck is shuffled when you begin. Each card stays fixed until you start again.</p>
          </form>
        </div>
      </section>

      <footer className={s.footer}>
        <p>
          <span className={s.footerMark}>ARCANA</span> Clarity through symbolism.
        </p>
        <p>Interpretations are composed on this device from traditional meanings. A tool for reflection, not prediction.</p>
      </footer>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} labelledBy="confirm-title">
        <div className={dlg.body}>
          <p className={ui.label}>Replace current reading</p>
          <h2 id="confirm-title" className={dlg.title}>
            Start a new {spread.name.toLowerCase()} reading?
          </h2>
          {reading && current && (
            <p className={dlg.text}>
              You have revealed <strong>{done} of {current.count}</strong> cards in your {current.name} reading. Beginning again shuffles the full deck and
              replaces it.
            </p>
          )}
          <div className={dlg.actions}>
            <button
              type="button"
              className={`${ui.btn} ${ui.secondary}`}
              onClick={() => {
                setConfirmOpen(false);
                session.resume();
              }}
            >
              Return to current reading
            </button>
            <button
              type="button"
              className={`${ui.btn} ${ui.primary}`}
              onClick={() => {
                setConfirmOpen(false);
                session.begin(true);
              }}
            >
              Start new reading
            </button>
          </div>
        </div>
      </Dialog>
    </main>
  );
}
