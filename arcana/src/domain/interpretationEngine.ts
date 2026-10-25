import type { Orientation, PositionKind, SpreadDefinition, SpreadPosition, TarotCard } from "@/domain/types";
import { nameInSentence } from "@/domain/tarotDeck";
import { AREA_LABEL, quoteQuestion, type QuestionContext } from "@/domain/questionContext";

/**
 * Card-level interpretation. Every revealed card is read from three inputs:
 *   1. the card's own meaning in its orientation (authored per card),
 *   2. the role of its spread position (templates keyed by PositionKind),
 *   3. the question context (life area and decision phrasing).
 * Output is deterministic: the same card, orientation, position and question
 * always produce the same text.
 */

export interface DrawnCard {
  index: number;
  card: TarotCard;
  orientation: Orientation;
  position: SpreadPosition;
}

export interface CardInterpretation {
  keywords: readonly string[];
  coreMeaning: string;
  positional: string;
  reflectiveQuestion: string;
  practical: string;
  labels: { positional: string; practical: string };
}

/** Tone after orientation: supportive cards soften when reversed, demanding ones ease. */
export function orientedTone(card: TarotCard, orientation: Orientation): number {
  if (orientation === "upright") return card.tone;
  return card.tone >= 0 ? Math.max(-2, card.tone - 1.5) : Math.min(2, card.tone + 1);
}

export const capitalise = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** FNV-1a, used to pick a template variant deterministically per card and position. */
function hash(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

interface Slots {
  name: string;
  Name: string;
  theme: string;
  tone: number;
}

type Template = (s: Slots) => string;

const supportive = (t: number) => t > 0.5;
const demanding = (t: number) => t < -0.5;

/** Closing clause for future-facing positions: possibilities, never verdicts. */
function forwardTail(tone: number): string {
  if (supportive(tone)) return " If that direction appeals to you, the present is where you can support it.";
  if (demanding(tone)) return " Seen early, a direction like this is a prompt to adjust, not a sentence to accept.";
  return "";
}

/** Lead sentences per position kind. Each entry returns the candidate variants for a tone. */
const LEADS: Record<PositionKind, (tone: number) => Template[]> = {
  focus: () => [
    (s) => `${s.Name} comes forward as the single symbol for this moment, pointing to ${s.theme}.`,
    (s) => `The card drawn for you is ${s.name}, and its message centres on ${s.theme}.`,
  ],
  past: () => [
    (s) => `In the Past position, ${s.name} describes what has shaped the present: ${s.theme}. Its influence is still felt, even if the events themselves are behind you.`,
    (s) => `Looking back, ${s.name} suggests the situation grew out of ${s.theme}. Understanding that root helps explain why things feel the way they do now.`,
  ],
  present: () => [
    (s) => `In the Present, ${s.name} names what is active now: ${s.theme}. This is the energy you are working with, whether or not you chose it.`,
    (s) => `Right now, ${s.name} describes ${s.theme}. It is the live element of the situation, the part most open to your attention and choices.`,
  ],
  future: (tone) => [
    (s) => `As a possible future, ${s.name} points toward ${s.theme}. This is not a fixed outcome; it describes where the current momentum may lead if nothing significant changes.${forwardTail(tone)}`,
    (s) => `Looking ahead, ${s.name} suggests a possible next chapter shaped by ${s.theme}. Read it as a direction the situation is leaning in, not a promise or a verdict.${forwardTail(tone)}`,
  ],
  core: () => [
    (s) => `At the core of the matter sits ${s.name}: ${s.theme}. The other cards in this spread are best read in relation to this one.`,
    (s) => `${s.Name} sits at the centre of this reading, describing ${s.theme}. It is the heart of the situation, the thing the other positions circle around.`,
  ],
  challenge: (tone) =>
    supportive(tone)
      ? [
          (s) => `Even a supportive card can mark a difficulty. In the Challenge position, ${s.name} suggests that ${s.theme} may be underused, taken for granted, or harder to accept than it seems.`,
          (s) => `${s.Name} is a generous card, so as a challenge it rarely means hardship. More often it points to ${s.theme} as something you are resisting, overdoing, or not yet trusting.`,
        ]
      : [
          (s) => `In the Challenge position, ${s.name} marks where the tension lies: ${s.theme}. It may be an outside obstacle, or a pattern of your own that is making progress harder.`,
          (s) => `The obstacle here takes the shape of ${s.name}: ${s.theme}. Naming it clearly is often half the work of moving through it.`,
        ],
  crossing: (tone) =>
    supportive(tone)
      ? [
          (s) => `Crossing the centre is ${s.name}. A supportive card in this place can still complicate things: ${s.theme} may be overplayed, resisted, or arriving at an inconvenient moment.`,
        ]
      : [
          (s) => `Laid across the centre, ${s.name} is the influence crossing the situation: ${s.theme}. This is the friction you are working against, whether it comes from outside or within.`,
        ],
  foundation: () => [
    (s) => `At the foundation lies ${s.name}: ${s.theme}. This is the ground beneath the situation, easy to overlook precisely because it is so familiar.`,
    (s) => `Beneath everything runs ${s.name}, pointing to ${s.theme}. It is an underlying influence that helps explain why the situation has taken its present shape.`,
  ],
  guidance: (tone) =>
    demanding(tone)
      ? [
          (s) => `Guidance does not always arrive gently. Here, ${s.name} suggests that facing ${s.theme} directly may be more useful than avoiding it.`,
          (s) => `${s.Name} is an unexpected source of guidance. It suggests that the way forward runs through ${s.theme} rather than around it.`,
        ]
      : [
          (s) => `As guidance, ${s.name} offers a perspective worth trying: ${s.theme}. Treat it less as an instruction than as an angle you may not have taken yet.`,
          (s) => `The guidance here comes through ${s.name}: ${s.theme}. It suggests a way of approaching the situation that may open something up.`,
        ],
  direction: (tone) => [
    (s) => `If things continue along their current course, ${s.name} suggests a movement toward ${s.theme}. Treat this as a trajectory you can still adjust.${forwardTail(tone)}`,
    (s) => `On its present course, the situation leans toward ${s.theme}, as ${s.name} describes. Nothing here is fixed; it shows where the momentum is pointing.${forwardTail(tone)}`,
  ],
  situation: () => [
    (s) => `At the heart of the reading, ${s.name} describes the central situation: ${s.theme}. Everything else in the cross is arranged around it.`,
  ],
  "recent-past": () => [
    (s) => `In the Recent Past, ${s.name} points to ${s.theme}. Its effects are still settling, and they colour what comes next.`,
    (s) => `Recently, ${s.theme} has been in play, as ${s.name} shows. This influence is passing, but it has left its mark on the present.`,
  ],
  conscious: () => [
    (s) => `As your conscious focus, ${s.name} shows what you are aiming for or preoccupied with: ${s.theme}. It is worth asking whether this aim is truly your own.`,
  ],
  "near-future": (tone) => [
    (s) => `In the near future, ${s.name} suggests that ${s.theme} may come forward. It is a development to prepare for, not one to fear or fixate on.${forwardTail(tone)}`,
  ],
  self: () => [
    (s) => `In the Self position, ${s.name} reflects your own stance: ${s.theme}. This is how you are meeting the question, and others may see it more clearly than you do.`,
  ],
  environment: () => [
    (s) => `In the Environment position, ${s.name} describes the influences around you: ${s.theme}. These come from people, circumstances, or timing that you do not fully control.`,
  ],
  "hopes-fears": (tone) => [
    (s) =>
      `In Hopes and Fears, ${s.name} holds something you may both want and dread: ${s.theme}. ` +
      (supportive(tone)
        ? "It is worth asking whether you fully believe you are allowed to have it."
        : demanding(tone)
          ? "Naming the fear plainly often makes it smaller than it feels."
          : "Often the hope and the fear here are two sides of the same desire."),
  ],
  outcome: (tone) => [
    (s) => `As a potential outcome, ${s.name} indicates that the reading is leaning toward ${s.theme}. It reflects the direction of the whole spread, and like any direction, it can change as you do.${forwardTail(tone)}`,
  ],
};

const DECISION_KINDS: ReadonlySet<PositionKind> = new Set(["focus", "guidance", "outcome", "direction", "future", "core", "situation"]);
const FORWARD_KINDS: ReadonlySet<PositionKind> = new Set(["future", "near-future", "direction", "outcome"]);

/** How the question's life area, or its wording, bears on this card. */
function contextSentences(card: TarotCard, orientation: Orientation, kind: PositionKind, ctx: QuestionContext): string[] {
  const out: string[] = [];
  const kw = card[orientation].keywords;
  if (ctx.area) {
    const label = AREA_LABEL[ctx.area];
    const phrase = card.areas[ctx.area];
    if (orientation === "upright") out.push(`Because your question concerns ${label}, this may show up as ${phrase}.`);
    else if (card.tone < 0) out.push(`Because your question concerns ${label}, this may relate to ${phrase}, and to the way that pattern is beginning to shift.`);
    else out.push(`Because your question concerns ${label}, look at where ${phrase} feels blocked, delayed, or out of balance.`);
  } else if (ctx.text) {
    out.push(`Held against your question, “${quoteQuestion(ctx.text)}”, notice where ${kw[0]} and ${kw[1]} are already present in the situation.`);
  }
  if (ctx.isDecision && DECISION_KINDS.has(kind)) {
    if (orientation === "upright") {
      out.push(card.tone >= 0 ? `If you are weighing a choice, ask which option leaves more room for ${kw[0]}.` : `If you are weighing a choice, notice how each option would handle ${kw[0]}.`);
    } else {
      out.push(card.tone >= 0 ? `If you are weighing a choice, notice whether ${kw[0]} is quietly shaping it.` : "If you are weighing a choice, consider which option builds on this shift.");
    }
  }
  return out;
}

function practicalFor(kind: PositionKind, advice: string, tone: number, kw: readonly string[]): string {
  switch (kind) {
    case "focus":
      return `Pay attention to moments that involve ${kw[0]} or ${kw[1]}; they are likely to carry this card's message. ${advice}`;
    case "past":
      return `Acknowledge what this history has given you as well as what it has cost. ${advice}`;
    case "recent-past":
      return `Notice how this recent influence is still shaping your choices. ${advice}`;
    case "challenge":
    case "crossing":
      return `Name the tension before trying to solve it. ${advice}`;
    case "foundation":
      return `Work with this foundation rather than against it. ${advice}`;
    case "guidance":
      return `${advice} Try it as an experiment for a week rather than as a permanent rule.`;
    case "conscious":
      return `Check that this aim is genuinely yours. ${advice}`;
    case "environment":
      return `Focus on your response rather than on the circumstance itself. ${advice}`;
    case "hopes-fears":
      return `Separate what you hope for from what you fear losing. ${advice}`;
    default:
      if (FORWARD_KINDS.has(kind)) {
        if (supportive(tone)) return `If this direction appeals to you, support it deliberately. ${advice}`;
        if (demanding(tone)) return `If this direction concerns you, treat it as a cue to adjust course now. ${advice}`;
      }
      return advice;
  }
}

export function interpretCard(drawn: DrawnCard, spread: SpreadDefinition, ctx: QuestionContext): CardInterpretation {
  const { card, orientation, position } = drawn;
  const content = card[orientation];
  const tone = orientedTone(card, orientation);
  const name = nameInSentence(card);
  const slots: Slots = { name, Name: capitalise(name), theme: content.theme, tone };

  const variants = LEADS[position.kind](tone);
  const lead = variants[hash(`${card.id}:${orientation}:${position.kind}`) % variants.length](slots);

  const context = contextSentences(card, orientation, position.kind, ctx);
  if (spread.id === "single" && !ctx.text) {
    context.push(`Without a specific question, let it serve as a theme for the day: notice where ${content.keywords[0]} shows up, and how you respond when it does.`);
  }

  const single = spread.id === "single";
  return {
    keywords: content.keywords,
    coreMeaning: content.meaning,
    positional: [lead, ...context].join(" "),
    reflectiveQuestion: content.question,
    practical: practicalFor(position.kind, content.advice, tone, content.keywords),
    labels: {
      positional: single ? (ctx.text ? "Relevance to your question" : "Relevance today") : "In this position",
      practical: single ? "What to pay attention to" : "Practical consideration",
    },
  };
}
