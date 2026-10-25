import { ARTWORK } from "@/artwork/registry";

/** The illustration for a card, looked up from its stable id. Renders inside the 200 × 300 face. */
export function CardArtwork({ cardId }: { cardId: string }) {
  const Art = ARTWORK[cardId];
  return Art ? <Art /> : null;
}
