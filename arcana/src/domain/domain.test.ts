import { describe, expect, it } from "vitest";
import { DECK, getCard } from "@/domain/tarotDeck";
import { SPREADS, getSpread } from "@/domain/spreadDefinitions";
import { drawCards, seededRandom, shuffle } from "@/domain/shuffleDeck";
import { analyseQuestion } from "@/domain/questionContext";
import { interpretCard } from "@/domain/interpretationEngine";
import { synthesiseReading } from "@/domain/readingSynthesis";
import { createReading, isValidReading, readingToText, resolveReading } from "@/domain/readingModel";
import { ARTWORK } from "@/artwork/registry";
import type { SpreadId } from "@/domain/types";

describe("deck", () => {
  it("contains the complete 78-card deck", () => {
    expect(DECK).toHaveLength(78);
    expect(DECK.filter((c) => c.arcana === "major")).toHaveLength(22);
    for (const suit of ["cups", "swords", "wands", "pentacles"] as const) {
      expect(DECK.filter((c) => c.suit === suit)).toHaveLength(14);
    }
  });

  it("has unique ids and names", () => {
    expect(new Set(DECK.map((c) => c.id)).size).toBe(78);
    expect(new Set(DECK.map((c) => c.name)).size).toBe(78);
  });

  it("numbers the Major Arcana from The Fool to The World", () => {
    expect(getCard("major-00").name).toBe("The Fool");
    expect(getCard("major-13").name).toBe("Death");
    expect(getCard("major-21").name).toBe("The World");
    expect(getCard("cups-01").name).toBe("Ace of Cups");
    expect(getCard("swords-03").name).toBe("Three of Swords");
    expect(getCard("pentacles-king").name).toBe("King of Pentacles");
  });

  it("gives every card distinct, card-specific writing", () => {
    for (const field of ["meaning", "theme", "advice", "question"] as const) {
      for (const o of ["upright", "reversed"] as const) {
        const values = DECK.map((c) => c[o][field]);
        expect(new Set(values).size, `${o}.${field}`).toBe(78);
      }
    }
    for (const area of ["work", "love", "self"] as const) {
      expect(new Set(DECK.map((c) => c.areas[area])).size, area).toBe(78);
    }
    for (const c of DECK) {
      expect(c.upright.keywords).toHaveLength(3);
      expect(c.reversed.keywords).toHaveLength(3);
      expect(c.tone).toBeGreaterThanOrEqual(-2);
      expect(c.tone).toBeLessThanOrEqual(2);
      // themes are spliced into sentences, so they must start lowercase and carry no final period
      expect(c.upright.theme).toMatch(/^[a-z]/);
      expect(c.reversed.theme).toMatch(/^[a-z]/);
      expect(c.upright.theme).not.toMatch(/\.$/);
    }
  });

  it("has a distinct illustration registered for every card", () => {
    expect(Object.keys(ARTWORK).sort()).toEqual(DECK.map((c) => c.id).sort());
    expect(new Set(Object.values(ARTWORK)).size).toBe(78);
  });
});

describe("drawing", () => {
  it("shuffles without losing or duplicating cards", () => {
    const shuffled = shuffle(DECK, seededRandom(7));
    expect(new Set(shuffled.map((c) => c.id)).size).toBe(78);
    expect(shuffled.map((c) => c.id)).not.toEqual(DECK.map((c) => c.id));
  });

  it("never repeats a card within a reading", () => {
    for (let seed = 1; seed <= 300; seed++) {
      const draws = drawCards(10, seededRandom(seed));
      expect(new Set(draws.map((d) => d.cardId)).size).toBe(10);
    }
  });

  it("produces both orientations", () => {
    const orientations = new Set(Array.from({ length: 40 }, (_, i) => drawCards(1, seededRandom(i + 1))[0].orientation));
    expect(orientations).toEqual(new Set(["upright", "reversed"]));
  });

  it("fixes the cards when the reading is created", () => {
    const reading = createReading("five", "", seededRandom(42));
    expect(reading.draws).toHaveLength(5);
    expect(reading.status.every((s) => s === "hidden")).toBe(true);
    expect(isValidReading(reading)).toBe(true);
    expect(isValidReading({ ...reading, draws: reading.draws.slice(0, 4) })).toBe(false);
    expect(isValidReading({ ...reading, draws: [reading.draws[0], reading.draws[0], ...reading.draws.slice(2)] })).toBe(false);
  });
});

describe("questions", () => {
  it("detects the life area and decision phrasing", () => {
    expect(analyseQuestion("Should I take the new job offer?")).toMatchObject({ area: "work", isDecision: true });
    expect(analyseQuestion("What do I need to know about my relationship with my partner?")).toMatchObject({ area: "love", isDecision: false });
    expect(analyseQuestion("How can I find more peace and purpose?")).toMatchObject({ area: "self" });
    expect(analyseQuestion("   ")).toEqual({ text: "", area: null, isDecision: false });
  });
});

describe("interpretation", () => {
  const hermit = getCard("major-09");
  const five = getSpread("five");
  const none = analyseQuestion("");

  it("reads the same card differently by position", () => {
    const challenge = interpretCard({ index: 1, card: hermit, orientation: "upright", position: five.positions[1] }, five, none);
    const guidance = interpretCard({ index: 3, card: hermit, orientation: "upright", position: five.positions[3] }, five, none);
    expect(challenge.positional).not.toEqual(guidance.positional);
    expect(challenge.practical).not.toEqual(guidance.practical);
    expect(challenge.coreMeaning).toEqual(guidance.coreMeaning);
  });

  it("reads orientation and question context", () => {
    const pos = five.positions[0];
    const upright = interpretCard({ index: 0, card: hermit, orientation: "upright", position: pos }, five, none);
    const reversed = interpretCard({ index: 0, card: hermit, orientation: "reversed", position: pos }, five, none);
    expect(upright.coreMeaning).not.toEqual(reversed.coreMeaning);
    const work = interpretCard({ index: 0, card: hermit, orientation: "upright", position: pos }, five, analyseQuestion("Should I change careers?"));
    const love = interpretCard({ index: 0, card: hermit, orientation: "upright", position: pos }, five, analyseQuestion("Where is my relationship going?"));
    expect(work.positional).toContain(hermit.areas.work);
    expect(love.positional).toContain(hermit.areas.love);
  });
});

describe("synthesis", () => {
  const spreads: SpreadId[] = ["single", "three", "five", "ten"];

  it("is deterministic and specific to the drawn cards", () => {
    for (const id of spreads) {
      const a = resolveReading(createReading(id, "Should I move to a new city for work?", seededRandom(11)));
      const b = resolveReading(createReading(id, "Should I move to a new city for work?", seededRandom(11)));
      const c = resolveReading(createReading(id, "Should I move to a new city for work?", seededRandom(12)));
      expect(synthesiseReading(a.drawn, a.ctx)).toEqual(synthesiseReading(b.drawn, b.ctx));
      expect(synthesiseReading(a.drawn, a.ctx).paragraphs).not.toEqual(synthesiseReading(c.drawn, c.ctx).paragraphs);
    }
  });

  it("covers every spread and position kind without throwing", () => {
    for (const spread of SPREADS) {
      for (let seed = 1; seed <= 60; seed++) {
        const r = createReading(spread.id, seed % 2 ? "Will this project succeed or should I stop?" : "", seededRandom(seed));
        const resolved = resolveReading(r);
        const s = synthesiseReading(resolved.drawn, resolved.ctx);
        expect(s.paragraphs.length).toBeGreaterThan(0);
        expect(s.paragraphs.join(" ")).not.toMatch(/undefined|NaN|\[object/);
        for (const d of resolved.drawn) {
          const i = interpretCard(d, resolved.spread, resolved.ctx);
          expect(`${i.positional} ${i.practical}`).not.toMatch(/undefined|NaN/);
        }
        if (spread.id === "ten") expect(s.questions).toHaveLength(3);
      }
    }
  });

  it("produces readable copy text", () => {
    const r = createReading("three", "What should I focus on?", seededRandom(3));
    const done = { ...r, status: r.status.map(() => "revealed" as const) };
    const text = readingToText(done);
    expect(text).toContain("Three Perspectives");
    expect(text).toContain("PAST");
    expect(text).toContain("Reflective question");
    for (const d of r.draws) expect(text).toContain(getCard(d.cardId).name);
  });
});
