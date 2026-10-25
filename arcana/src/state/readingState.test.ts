import { describe, expect, it } from "vitest";
import { createReading } from "@/domain/readingModel";
import { seededRandom } from "@/domain/shuffleDeck";
import { spreadGeometry, fitCardWidth } from "@/domain/spreadGeometry";
import { INITIAL_SESSION, sessionReducer, type SessionState } from "@/state/readingState";

function started(seed = 1): SessionState {
  return sessionReducer(INITIAL_SESSION, { type: "start", reading: createReading("five", "", seededRandom(seed)) });
}

describe("session reducer", () => {
  it("walks a card through hidden → revealing → revealed exactly once", () => {
    let s = started();
    const id = s.reading!.id;
    const draws = s.reading!.draws;
    s = sessionReducer(s, { type: "reveal", readingId: id, index: 2 });
    expect(s.reading!.status[2]).toBe("revealing");
    const again = sessionReducer(s, { type: "reveal", readingId: id, index: 2 });
    expect(again).toBe(s);
    s = sessionReducer(s, { type: "settle", readingId: id, index: 2, auto: false });
    expect(s.reading!.status[2]).toBe("revealed");
    expect(s.reading!.selected).toBe(2);
    expect(sessionReducer(s, { type: "settle", readingId: id, index: 2, auto: false })).toBe(s);
    expect(sessionReducer(s, { type: "reveal", readingId: id, index: 2 })).toBe(s);
    expect(s.reading!.draws).toBe(draws);
  });

  it("ignores actions from a previous reading", () => {
    const first = started(1);
    const oldId = first.reading!.id;
    const second = sessionReducer(first, { type: "start", reading: createReading("ten", "", seededRandom(2)) });
    expect(sessionReducer(second, { type: "reveal", readingId: oldId, index: 0 })).toBe(second);
    expect(sessionReducer(second, { type: "settle", readingId: oldId, index: 0, auto: false })).toBe(second);
  });

  it("only selects revealed cards", () => {
    const s = started();
    expect(sessionReducer(s, { type: "select", readingId: s.reading!.id, index: 1 })).toBe(s);
  });

  it("keeps the current selection during reveal-all", () => {
    let s = started();
    const id = s.reading!.id;
    s = sessionReducer(s, { type: "reveal", readingId: id, index: 0 });
    s = sessionReducer(s, { type: "settle", readingId: id, index: 0, auto: false });
    s = sessionReducer(s, { type: "reveal", readingId: id, index: 3 });
    s = sessionReducer(s, { type: "settle", readingId: id, index: 3, auto: true });
    expect(s.reading!.selected).toBe(0);
  });

  it("refuses to show the reading screen without a reading", () => {
    expect(sessionReducer(INITIAL_SESSION, { type: "show", screen: "reading" })).toBe(INITIAL_SESSION);
  });
});

describe("spread geometry", () => {
  it("fits every spread into a phone column without horizontal overflow", () => {
    for (const id of ["single", "three", "five", "ten"] as const) {
      const w = fitCardWidth(id, "compact", 358, 100000, { min: 60, max: 300 });
      const g = spreadGeometry(id, "compact", w);
      expect(g.width).toBeLessThanOrEqual(358);
      for (const slot of g.slots) {
        const l = slot.label;
        const left = l.align === "center" ? l.x - l.width / 2 : l.x;
        expect(left).toBeGreaterThanOrEqual(-0.01);
        expect(left + l.width).toBeLessThanOrEqual(g.width + 0.01);
      }
    }
  });

  it("does not overlap cards except the ten-card crossing", () => {
    for (const id of ["three", "five", "ten"] as const) {
      const g = spreadGeometry(id, "wide", 120);
      const boxes = g.slots
        .filter((s) => !s.crossing)
        .map((s) => ({ l: s.cx - g.card / 2, r: s.cx + g.card / 2, t: s.cy - g.cardH / 2, b: s.cy + g.cardH / 2 }));
      for (let i = 0; i < boxes.length; i++) {
        for (let j = i + 1; j < boxes.length; j++) {
          const a = boxes[i];
          const b = boxes[j];
          const overlap = a.l < b.r && b.l < a.r && a.t < b.b && b.t < a.b;
          expect(overlap, `${id} ${i}/${j}`).toBe(false);
        }
      }
    }
  });
});
