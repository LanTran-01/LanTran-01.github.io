import { getCard } from "@/domain/tarotDeck";
import { TarotCardBackStatic, TarotCardStatic } from "@/components/cards/TarotCard";
import { ArrowDown } from "@/components/ui/Icons";
import ui from "@/components/ui/ui.module.css";
import s from "./landing.module.css";

/** Opening composition: wordmark tagline, heading, and a fan of three cards with the centre one face down. */
export function Hero({ onStart }: { onStart: () => void }) {
  return (
    <section className={s.hero} aria-labelledby="hero-title">
      <div className={s.heroText}>
        <p className={ui.label}>Clarity through symbolism.</p>
        <h1 id="hero-title" className={s.display}>
          Discover what lies beneath.
        </h1>
        <p className={s.lead}>Choose a spread. Reveal the symbols. Explore the meaning.</p>
      </div>

      <div className={s.fan} aria-hidden="true">
        <div className={`${s.fanCard} ${s.fanLeft}`}>
          <TarotCardStatic card={getCard("major-18")} orientation="upright" />
        </div>
        <div className={`${s.fanCard} ${s.fanRight}`}>
          <TarotCardStatic card={getCard("major-17")} orientation="upright" />
        </div>
        <div className={`${s.fanCard} ${s.fanCenter}`}>
          <TarotCardBackStatic />
        </div>
      </div>

      <div className={s.heroCta}>
        <button type="button" className={`${ui.btn} ${ui.primary} ${ui.large}`} onClick={onStart}>
          Choose a spread
          <ArrowDown />
        </button>
        <p className={s.heroMeta}>78 cards · 4 spreads · Private, offline, no account</p>
      </div>
    </section>
  );
}
