import type { CardContent, CourtRank, Element, Rank, Suit, TarotCard } from "@/domain/types";
import { MAJOR_ARCANA } from "@/domain/cards/major";
import { CUPS } from "@/domain/cards/cups";
import { SWORDS } from "@/domain/cards/swords";
import { WANDS } from "@/domain/cards/wands";
import { PENTACLES } from "@/domain/cards/pentacles";

/**
 * Assembles the complete 78-card deck from the authored content.
 * Identity fields (id, name, numbering, element) are derived here so the
 * content files only contain writing.
 */

export const SUITS: readonly Suit[] = ["wands", "cups", "swords", "pentacles"];

export const SUIT_ELEMENT: Record<Suit, Element> = {
  wands: "fire",
  cups: "water",
  swords: "air",
  pentacles: "earth",
};

const SUIT_CONTENT: Record<Suit, readonly CardContent[]> = {
  wands: WANDS,
  cups: CUPS,
  swords: SWORDS,
  pentacles: PENTACLES,
};

const ROMAN = ["0", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX", "XXI"];
const PIP_NAMES = ["Ace", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"];
const COURTS: readonly CourtRank[] = ["page", "knight", "queen", "king"];

const capitalise = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function buildMajors(): TarotCard[] {
  return MAJOR_ARCANA.map((source, number) => {
    const { name, element, ...content } = source;
    return {
      ...content,
      id: `major-${String(number).padStart(2, "0")}`,
      name,
      arcana: "major",
      number,
      suit: null,
      rank: null,
      element,
      numeral: ROMAN[number],
    };
  });
}

function buildSuit(suit: Suit): TarotCard[] {
  const content = SUIT_CONTENT[suit];
  if (content.length !== 14) throw new Error(`${suit}: expected 14 cards, found ${content.length}`);
  return content.map((card, i) => {
    const number = i + 1;
    const rank: Rank = number <= 10 ? (number as Rank) : COURTS[number - 11];
    const rankName = typeof rank === "number" ? PIP_NAMES[rank - 1] : capitalise(rank);
    return {
      ...card,
      id: typeof rank === "number" ? `${suit}-${String(rank).padStart(2, "0")}` : `${suit}-${rank}`,
      name: `${rankName} of ${capitalise(suit)}`,
      arcana: "minor",
      number,
      suit,
      rank,
      element: SUIT_ELEMENT[suit],
      numeral: typeof rank === "number" ? ROMAN[rank] : null,
    };
  });
}

export const DECK: readonly TarotCard[] = [...buildMajors(), ...SUITS.flatMap(buildSuit)];

const BY_ID = new Map(DECK.map((card) => [card.id, card]));

export function getCard(id: string): TarotCard {
  const card = BY_ID.get(id);
  if (!card) throw new Error(`Unknown card id: ${id}`);
  return card;
}

export function hasCard(id: string): boolean {
  return BY_ID.has(id);
}

export function isCourt(card: TarotCard): boolean {
  return typeof card.rank === "string";
}

/** "The Hermit" stays as-is mid-sentence; "Three of Swords" becomes "the Three of Swords". */
export function nameInSentence(card: TarotCard): string {
  return card.arcana === "major" ? card.name : `the ${card.name}`;
}
