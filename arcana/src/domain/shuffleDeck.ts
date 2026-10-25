import type { Draw, Orientation, TarotCard } from "@/domain/types";
import { DECK } from "@/domain/tarotDeck";

/**
 * Probability that a drawn card lands reversed. A physically shuffled deck with
 * rotated cards gives roughly one half; one third keeps reversals meaningful
 * without making most readings read as obstacles.
 */
export const REVERSAL_PROBABILITY = 1 / 3;

/** A uniform float in [0, 1). Uses the Web Crypto API when present. */
export type RandomSource = () => number;

export const cryptoRandom: RandomSource = () => {
  const c = globalThis.crypto;
  if (c?.getRandomValues) {
    const buf = new Uint32Array(1);
    c.getRandomValues(buf);
    return buf[0] / 0x1_0000_0000;
  }
  return Math.random();
};

/** Unbiased Fisher–Yates shuffle. Returns a new array. */
export function shuffle<T>(items: readonly T[], random: RandomSource = cryptoRandom): T[] {
  const out = items.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * Shuffles the complete deck and deals `count` distinct cards, each with an
 * orientation. Index i of the result belongs to spread position i.
 */
export function drawCards(count: number, random: RandomSource = cryptoRandom, deck: readonly TarotCard[] = DECK): Draw[] {
  if (count < 1 || count > deck.length) throw new Error(`Cannot draw ${count} cards from a deck of ${deck.length}`);
  return shuffle(deck, random)
    .slice(0, count)
    .map((card) => ({
      cardId: card.id,
      orientation: (random() < REVERSAL_PROBABILITY ? "reversed" : "upright") as Orientation,
    }));
}

/** Deterministic PRNG (mulberry32) for tests and reproducible previews. */
export function seededRandom(seed: number): RandomSource {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
