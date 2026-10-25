/**
 * Dev harness: a product shot of the deck for the lantran.dev home page.
 *   /harness/showcase.html         landscape fan of five cards
 *   /harness/showcase.html?p=1     tighter fan for portrait crops
 * Screenshot it with scripts/shot.mjs at the target size.
 */
import { createRoot } from "react-dom/client";
import "@/styles/global.css";
import { getCard } from "@/domain/tarotDeck";
import { TarotCardBackStatic, TarotCardStatic } from "@/components/cards/TarotCard";

const portrait = new URLSearchParams(location.search).get("p") === "1";
const h = portrait ? "30vh" : "44vh";
const spread = portrait ? 0.56 : 0.72;

const fan: { id: string | null; rot: number; x: number; y: number; z: number }[] = [
  { id: "major-02", rot: -22, x: -2, y: 9, z: 1 },
  { id: "major-18", rot: -11, x: -1, y: 3, z: 2 },
  { id: null, rot: 0, x: 0, y: -2, z: 5 },
  { id: "major-17", rot: 11, x: 1, y: 3, z: 2 },
  { id: "major-19", rot: 22, x: 2, y: 9, z: 1 },
];

createRoot(document.getElementById("root")!).render(
  <div style={{ position: "fixed", inset: 0, background: "#080808", overflow: "hidden" }}>
    {[118, 84, 58].map((size, i) => (
      <div
        key={size}
        style={{
          position: "absolute",
          left: "50%",
          top: "51%",
          width: `${size}vh`,
          aspectRatio: "1",
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          border: `1px ${i === 1 ? "dashed" : "solid"} ${i === 2 ? "#1a1a1b" : "#151516"}`,
        }}
      />
    ))}
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "51%",
        width: "90vh",
        aspectRatio: "1",
        transform: "translate(-50%, -50%)",
        background: "radial-gradient(circle, rgba(255,255,255,0.035), transparent 60%)",
      }}
    />
    {fan.map((c, i) => (
      <div
        key={i}
        style={{
          position: "absolute",
          left: "50%",
          top: "51%",
          height: h,
          aspectRatio: "2 / 3",
          zIndex: c.z,
          transform: `translate(-50%, -50%) translate(calc(${c.x} * ${h} * ${spread} * 0.667), calc(${c.y} * ${h} / 100)) rotate(${c.rot}deg)`,
        }}
      >
        {c.id ? <TarotCardStatic card={getCard(c.id)} orientation="upright" /> : <TarotCardBackStatic />}
      </div>
    ))}
  </div>,
);
