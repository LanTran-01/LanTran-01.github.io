import type { ComponentType } from "react";
import { DECK } from "@/domain/tarotDeck";
import type { Suit } from "@/domain/types";
import { MAJOR_ART } from "@/artwork/majorArt";
import { CUPS_ART } from "@/artwork/cupsArt";
import { SWORDS_ART } from "@/artwork/swordsArt";
import { WANDS_ART } from "@/artwork/wandsArt";
import { PENTACLES_ART } from "@/artwork/pentaclesArt";

/**
 * Card id → illustration. The mapping is fixed and derived from card identity
 * (arcana, suit and number), never chosen at runtime.
 */
const SUIT_ART: Record<Suit, readonly ComponentType[]> = {
  cups: CUPS_ART,
  swords: SWORDS_ART,
  wands: WANDS_ART,
  pentacles: PENTACLES_ART,
};

export const ARTWORK: Readonly<Record<string, ComponentType>> = Object.fromEntries(
  DECK.map((card) => {
    const art = card.suit ? SUIT_ART[card.suit][card.number - 1] : MAJOR_ART[card.number];
    if (!art) throw new Error(`Missing artwork for ${card.id}`);
    return [card.id, art];
  }),
);
