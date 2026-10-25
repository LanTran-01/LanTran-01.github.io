import type { TarotCard } from "@/domain/types";
import { CardArtwork } from "@/components/cards/CardArtwork";
import { ElementGlyph, SuitMark } from "@/artwork/primitives";
import { CARD_BG, H } from "@/artwork/style";
import s from "./cardFace.module.css";

/** The face of a card: frame, numeral or suit mark, illustration, title and element. */
export function TarotCardFront({ card }: { card: TarotCard }) {
  return (
    <svg className={s.svg} viewBox="0 0 200 300" aria-hidden="true" focusable="false">
      <rect width={200} height={300} fill={CARD_BG} />
      <rect x={0.5} y={0.5} width={199} height={299} rx={11} fill="none" stroke="#2b2c2f" strokeWidth={1} />
      <rect x={7} y={7} width={186} height={286} rx={5} fill="none" stroke="#36383c" strokeWidth={0.75} />
      <rect x={11} y={11} width={178} height={278} rx={3} fill="none" stroke="rgba(169,176,186,0.2)" strokeWidth={0.45} />
      <g className={s.meta}>
        {card.numeral ? (
          <text x={100} y={31.5} className={s.numeral}>
            {card.numeral}
          </text>
        ) : (
          <SuitMark suit={card.suit!} x={100} y={27.5} />
        )}
        <line x1={56} y1={27.8} x2={76} y2={27.8} {...H} />
        <line x1={124} y1={27.8} x2={144} y2={27.8} {...H} />
      </g>
      <CardArtwork cardId={card.id} />
      <g className={s.meta}>
        <line x1={44} y1={256} x2={156} y2={256} {...H} />
        <text x={100} y={272.5} className={s.title}>
          {card.name.toUpperCase()}
        </text>
        <ElementGlyph element={card.element} x={100} y={283.5} size={3.1} />
      </g>
    </svg>
  );
}
