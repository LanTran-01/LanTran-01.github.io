import type { LifeArea } from "@/domain/types";

/**
 * Reads the optional question with simple, transparent keyword rules. Nothing
 * here is "AI": it only decides which life area the question is about and
 * whether it is phrased as a decision, so that interpretations can use the
 * matching card-specific wording.
 */

export interface QuestionContext {
  /** Trimmed question, or "" for an open reading. */
  text: string;
  area: LifeArea | null;
  isDecision: boolean;
}

const AREA_TERMS: Record<LifeArea, RegExp> = {
  work: /\b(work|working|jobs?|careers?|boss(?:es)?|managers?|colleagues?|co-?workers?|teams?|projects?|business(?:es)?|startups?|compan(?:y|ies)|clients?|promotions?|interviews?|salar(?:y|ies)|pay|money|finances?|financial|incomes?|debts?|savings?|invest(?:ment|ments|ing)?|study|studies|school|university|college|exams?|degrees?|profession(?:al)?|office|roles?|hire|hiring|quit|resign(?:ation)?|launch(?:ing)?|products?|offers?)\b/gi,
  love: /\b(loves?|loved|relationships?|partners?|boyfriends?|girlfriends?|husband|wife|spouse|marriage|marry|married|dating|dates?|crush(?:es)?|ex|romance|romantic|soulmate|breakup|break up|divorce|family|families|mother|father|mom|mum|dad|parents?|sisters?|brothers?|siblings?|friends?|friendships?|child|children|kids?|sons?|daughters?)\b/gi,
  self: /\b(myself|self|health|healing|heal|anxiety|anxious|stress|purpose|meaning|spiritual(?:ity)?|growth|grow|habits?|confidence|creative|creativity|art|direction|paths?|happiness|happy|peace|motivation|identity|fears?|burnout|rest|wellbeing|well-being|body|mind)\b/gi,
};

/** Tie-break order when two areas match equally often. */
const AREA_ORDER: readonly LifeArea[] = ["love", "work", "self"];

const DECISION =
  /^\s*(should|shall|do i|would it|is it (?:time|right|wise)|can i)\b|\b(whether|decide|decision|choose|choice|which (?:one|path|option|way)|or not)\b|\s+or\s+.+\?\s*$/i;

export const AREA_LABEL: Record<LifeArea, string> = {
  work: "work and finances",
  love: "relationships",
  self: "your personal path",
};

export function analyseQuestion(raw: string): QuestionContext {
  const text = raw.trim().replace(/\s+/g, " ");
  if (!text) return { text: "", area: null, isDecision: false };

  let best: LifeArea | null = null;
  let bestCount = 0;
  for (const area of AREA_ORDER) {
    const count = text.match(AREA_TERMS[area])?.length ?? 0;
    if (count > bestCount) {
      best = area;
      bestCount = count;
    }
  }
  return { text, area: best, isDecision: DECISION.test(text) };
}

/** The question shortened for quoting inside running text. */
export function quoteQuestion(text: string, max = 90): string {
  const clean = text.replace(/[\s?.!]+$/, "");
  return clean.length > max ? `${clean.slice(0, max - 1).trimEnd()}…` : clean;
}
