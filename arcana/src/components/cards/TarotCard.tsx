import type { CardStatus, Orientation, TarotCard as Card } from "@/domain/types";
import { TarotCardBack } from "@/components/cards/TarotCardBack";
import { TarotCardFront } from "@/components/cards/TarotCardFront";
import s from "./tarotCard.module.css";

interface TarotCardProps {
  /** The card's identity. Must be null while the card is face down so nothing leaks into the DOM. */
  card: Card | null;
  orientation?: Orientation;
  status: CardStatus;
  selected?: boolean;
  label: string;
  onActivate: () => void;
}

/**
 * A card in a spread. Face down it shows the shared back; activating it starts
 * the reveal (lift, rotate about the vertical axis, settle). The front is only
 * mounted once the reveal begins.
 */
export function TarotCard({ card, orientation, status, selected = false, label, onActivate }: TarotCardProps) {
  return (
    <button
      type="button"
      className={s.card}
      data-status={status}
      data-selected={selected || undefined}
      aria-label={label}
      aria-current={selected ? "true" : undefined}
      aria-disabled={status === "revealing" || undefined}
      onClick={onActivate}
    >
      <span className={s.shadow} aria-hidden="true" />
      <span className={s.flipper}>
        <span className={`${s.face} ${s.back}`}>
          <TarotCardBack />
        </span>
        <span className={`${s.face} ${s.front}`}>
          {card && status !== "hidden" && (
            <span className={s.frontInner} data-reversed={orientation === "reversed" || undefined}>
              <TarotCardFront card={card} />
            </span>
          )}
        </span>
      </span>
    </button>
  );
}

/** A non-interactive face-up card, for thumbnails and the detail view. */
export function TarotCardStatic({ card, orientation }: { card: Card; orientation: Orientation }) {
  return (
    <span className={s.static}>
      <span className={s.frontInner} data-reversed={orientation === "reversed" || undefined}>
        <TarotCardFront card={card} />
      </span>
    </span>
  );
}

/** A non-interactive face-down card, for previews. */
export function TarotCardBackStatic() {
  return (
    <span className={s.static}>
      <TarotCardBack />
    </span>
  );
}
