import type { Draw, Reading, SpreadDefinition, SpreadId } from "@/domain/types";
import { getCard, hasCard } from "@/domain/tarotDeck";
import { getSpread, isSpreadId, positionNumber } from "@/domain/spreadDefinitions";
import { drawCards, type RandomSource, cryptoRandom } from "@/domain/shuffleDeck";
import { analyseQuestion, type QuestionContext } from "@/domain/questionContext";
import { interpretCard, type CardInterpretation, type DrawnCard } from "@/domain/interpretationEngine";
import { synthesiseReading, type ReadingSynthesis } from "@/domain/readingSynthesis";

/** A reading resolved into cards, positions and question context. */
export interface ResolvedReading {
  spread: SpreadDefinition;
  drawn: DrawnCard[];
  ctx: QuestionContext;
}

export const MAX_QUESTION_LENGTH = 240;

let readingCounter = 0;

/** Starts a reading: the full deck is shuffled once and every position's card is fixed here. */
export function createReading(spreadId: SpreadId, question: string, random: RandomSource = cryptoRandom): Reading {
  const spread = getSpread(spreadId);
  const draws = drawCards(spread.count, random);
  readingCounter += 1;
  return {
    id: `r-${Date.now().toString(36)}-${readingCounter}`,
    spreadId,
    question: question.trim().slice(0, MAX_QUESTION_LENGTH),
    createdAt: Date.now(),
    draws,
    status: draws.map(() => "hidden"),
    selected: null,
    lastSettled: null,
  };
}

export function resolveDraws(spreadId: SpreadId, draws: readonly Draw[], question: string): ResolvedReading {
  const spread = getSpread(spreadId);
  return {
    spread,
    drawn: draws.map((d, index) => ({
      index,
      card: getCard(d.cardId),
      orientation: d.orientation,
      position: spread.positions[index],
    })),
    ctx: analyseQuestion(question),
  };
}

export function resolveReading(reading: Reading): ResolvedReading {
  return resolveDraws(reading.spreadId, reading.draws, reading.question);
}

export function interpretAt(resolved: ResolvedReading, index: number): CardInterpretation {
  return interpretCard(resolved.drawn[index], resolved.spread, resolved.ctx);
}

export function synthesise(resolved: ResolvedReading): ReadingSynthesis {
  return synthesiseReading(resolved.drawn, resolved.ctx);
}

export function revealedCount(reading: Reading): number {
  return reading.status.filter((s) => s === "revealed").length;
}

export function isComplete(reading: Reading): boolean {
  return reading.status.every((s) => s === "revealed");
}

/** Validates a reading loaded from storage; anything malformed is discarded. */
export function isValidReading(value: unknown): value is Reading {
  if (!value || typeof value !== "object") return false;
  const r = value as Partial<Reading>;
  if (typeof r.id !== "string" || !isSpreadId(r.spreadId) || typeof r.question !== "string" || typeof r.createdAt !== "number") return false;
  const spread = getSpread(r.spreadId);
  if (!Array.isArray(r.draws) || r.draws.length !== spread.count) return false;
  if (!Array.isArray(r.status) || r.status.length !== spread.count) return false;
  const ids = new Set<string>();
  for (const d of r.draws) {
    if (!d || !hasCard(d.cardId) || (d.orientation !== "upright" && d.orientation !== "reversed")) return false;
    ids.add(d.cardId);
  }
  if (ids.size !== spread.count) return false;
  if (!r.status.every((s) => s === "hidden" || s === "revealing" || s === "revealed")) return false;
  if (r.selected !== null && (typeof r.selected !== "number" || r.selected < 0 || r.selected >= spread.count)) return false;
  return true;
}

/** Plain-text version of a completed reading, for the clipboard. */
export function readingToText(reading: Reading): string {
  const resolved = resolveReading(reading);
  const { spread, drawn } = resolved;
  const date = new Date(reading.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
  const lines: string[] = [
    `ARCANA — ${spread.title}`,
    reading.question ? `Question: “${reading.question}”` : "Question: none (an open reading)",
    `Drawn: ${date} · ${spread.count} ${spread.count === 1 ? "card" : "cards"}`,
    "",
  ];

  for (const d of drawn) {
    if (reading.status[d.index] !== "revealed") continue;
    const i = interpretAt(resolved, d.index);
    lines.push(
      `${positionNumber(d.index)} · ${d.position.label.toUpperCase()} — ${d.card.name} (${d.orientation === "upright" ? "Upright" : "Reversed"})`,
      `Keywords: ${i.keywords.join(", ")}`,
      `Core meaning: ${i.coreMeaning}`,
      `${i.labels.positional}: ${i.positional}`,
      `Reflective question: ${i.reflectiveQuestion}`,
      `${i.labels.practical}: ${i.practical}`,
      "",
    );
  }

  if (isComplete(reading)) {
    const s = synthesise(resolved);
    lines.push(s.heading.toUpperCase(), ...s.paragraphs.map((p) => p), "");
    if (s.themes.length) lines.push("Themes:", ...s.themes.map((t) => `- ${t}`), "");
    if (s.relationships.length) lines.push("Relationships:", ...s.relationships.map((r) => `- ${r.title}: ${r.text}`), "");
    if (s.questions.length) lines.push("Reflective questions:", ...s.questions.map((q) => `- ${q}`), "");
    lines.push(`${s.closing.label}:`, ...s.closing.items.map((c) => `- ${c}`), "");
  }

  lines.push("ARCANA composes its interpretations locally from traditional card meanings, spread positions and the words of your question. Readings are prompts for reflection, not predictions.");
  return lines.join("\n");
}
