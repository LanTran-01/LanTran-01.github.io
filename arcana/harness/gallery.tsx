/**
 * Dev harness: renders the whole deck, front and back, for reviewing artwork.
 *   /harness/gallery.html            all 78 cards
 *   /harness/gallery.html?suit=cups  one suit (major | cups | swords | wands | pentacles)
 *   /harness/gallery.html?w=260      card width in px
 */
import { createRoot } from "react-dom/client";
import "@/styles/global.css";
import { DECK } from "@/domain/tarotDeck";
import { TarotCardFront } from "@/components/cards/TarotCardFront";
import { TarotCardBack } from "@/components/cards/TarotCardBack";

const params = new URLSearchParams(location.search);
const suit = params.get("suit");
const w = Number(params.get("w") ?? 180);
const cards = DECK.filter((c) => !suit || (suit === "major" ? c.arcana === "major" : c.suit === suit));

const cell = { width: w, aspectRatio: "2 / 3", container: "card / inline-size", borderRadius: "5.5%", overflow: "hidden" } as const;

createRoot(document.getElementById("root")!).render(
  <div style={{ display: "flex", flexWrap: "wrap", gap: 16, padding: 16 }}>
    {!suit && (
      <figure style={{ margin: 0 }}>
        <div style={cell}>
          <TarotCardBack />
        </div>
        <figcaption style={{ fontSize: 11, color: "#929292", marginTop: 6 }}>back</figcaption>
      </figure>
    )}
    {cards.map((card) => (
      <figure key={card.id} style={{ margin: 0 }}>
        <div style={cell}>
          <TarotCardFront card={card} />
        </div>
        <figcaption style={{ fontSize: 11, color: "#929292", marginTop: 6 }}>{card.id}</figcaption>
      </figure>
    ))}
  </div>,
);
