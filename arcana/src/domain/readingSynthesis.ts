import type { Element, Suit, TarotCard } from "@/domain/types";
import { isCourt, nameInSentence } from "@/domain/tarotDeck";
import { AREA_LABEL, type QuestionContext } from "@/domain/questionContext";
import { capitalise, orientedTone, type DrawnCard } from "@/domain/interpretationEngine";

/**
 * Whole-reading synthesis, generated only once every card is revealed.
 * It is built from the actual draws: their themes per position, elemental
 * dignities between paired positions, tone trajectories, and patterns across
 * suits, numbers, court cards, Major Arcana and reversals.
 */

export type RelationshipTone = "complementary" | "tension" | "neutral";

export interface Relationship {
  title: string;
  tone: RelationshipTone;
  text: string;
}

export interface ReadingSynthesis {
  heading: string;
  paragraphs: string[];
  themes: string[];
  relationships: Relationship[];
  questions: string[];
  closing: { label: string; items: string[] };
}

/* ---- symbolic vocabulary ------------------------------------------------ */

const ELEMENT_QUALITY: Record<Element, string> = {
  fire: "drive and initiative",
  water: "feeling and intuition",
  air: "thought and communication",
  earth: "practical, material concerns",
};

const SUIT_QUALITY: Record<Suit, string> = {
  wands: "drive, creativity, and ambition",
  cups: "feelings and relationships",
  swords: "thought, communication, and conflict",
  pentacles: "work, money, and the body",
};

const SUIT_ABSENT: Record<Suit, string> = {
  wands: "drive and initiative are not where the answer lies",
  cups: "feelings may be getting less attention than they deserve",
  swords: "analysis and argument are not the main issue",
  pentacles: "practical and material matters are secondary here",
};

const NUMBER_THEME: Record<number, string> = {
  1: "new beginnings",
  2: "balance and choice",
  3: "growth and collaboration",
  4: "stability and structure",
  5: "disruption and change",
  6: "harmony and recovery",
  7: "reflection and assessment",
  8: "movement and mastery",
  9: "culmination",
  10: "completion and renewal",
};

const COUNT_WORD = ["no", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];
const NUMBER_WORD = ["", "ace", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];
const NUMBER_PLURAL = ["", "aces", "twos", "threes", "fours", "fives", "sixes", "sevens", "eights", "nines", "tens"];

type ElementRelation = "reinforcing" | "supportive" | "opposing" | "neutral";

/** Elemental dignities: same element reinforces; fire–air and water–earth support; fire–water and air–earth oppose. */
export function elementRelation(a: Element, b: Element): ElementRelation {
  if (a === b) return "reinforcing";
  const has = (x: Element, y: Element) => (a === x && b === y) || (a === y && b === x);
  if (has("fire", "air") || has("water", "earth")) return "supportive";
  if (has("fire", "water") || has("air", "earth")) return "opposing";
  return "neutral";
}

const aligned = (r: ElementRelation) => r === "reinforcing" || r === "supportive";

function listJoin(items: string[]): string {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

/* ---- helpers over drawn cards ------------------------------------------ */

const tone = (d: DrawnCard) => orientedTone(d.card, d.orientation);
const theme = (d: DrawnCard) => d.card[d.orientation].theme;
const label = (d: DrawnCard) => `${nameInSentence(d.card)}${d.orientation === "reversed" ? ", reversed" : ""}`;
const advice = (d: DrawnCard) => d.card[d.orientation].advice;
const question = (d: DrawnCard) => d.card[d.orientation].question;

function elementalRelationship(
  title: string,
  a: DrawnCard,
  b: DrawnCard,
  texts: { aligned: string; opposed: string; neutral: string },
  opposedTone: RelationshipTone = "tension",
): Relationship {
  const r = elementRelation(a.card.element, b.card.element);
  if (aligned(r)) return { title, tone: "complementary", text: texts.aligned };
  if (r === "opposing") return { title, tone: opposedTone, text: texts.opposed };
  return { title, tone: "neutral", text: texts.neutral };
}

function trajectory(from: DrawnCard, to: DrawnCard): "rising" | "falling" | "steady" {
  const diff = tone(to) - tone(from);
  if (diff >= 1) return "rising";
  if (diff <= -1) return "falling";
  return "steady";
}

/** Patterns across the whole draw: arcana, suits, courts, reversals and repeated numbers. */
function patternThemes(drawn: DrawnCard[]): string[] {
  const n = drawn.length;
  const cards = drawn.map((d) => d.card);
  const out: string[] = [];

  const majors = cards.filter((c) => c.arcana === "major");
  const m = majors.length;
  if (n >= 3) {
    if (m === n) out.push(`Every card is a Major Arcana card, which marks this as a significant chapter rather than a passing moment.`);
    else if (m >= Math.max(2, Math.ceil(n * 0.4)))
      out.push(`${capitalise(COUNT_WORD[m])} of ${COUNT_WORD[n]} cards are Major Arcana (${listJoin(majors.map((c) => c.name))}). The situation touches on larger life themes and turning points, not only day-to-day circumstances.`);
    else if (m === 0 && n >= 5)
      out.push("No Major Arcana appear. The situation is shaped mostly by everyday choices, which means it is largely within your influence.");
    else if (n === 10 && m > 0)
      out.push(`${capitalise(COUNT_WORD[m])} Major Arcana ${m === 1 ? "appears" : "appear"} (${listJoin(majors.map((c) => c.name))}), marking where the larger lessons sit.`);
  }

  const suitCounts = new Map<Suit, number>();
  for (const c of cards) if (c.suit) suitCounts.set(c.suit, (suitCounts.get(c.suit) ?? 0) + 1);
  const sorted = [...suitCounts.entries()].sort((a, b) => b[1] - a[1]);
  const threshold = n <= 3 ? 2 : 3;
  if (sorted.length && sorted[0][1] >= threshold && (sorted.length === 1 || sorted[0][1] > sorted[1][1])) {
    const [suit, count] = sorted[0];
    out.push(`${capitalise(suit)} appear ${count === 2 ? "twice" : `${COUNT_WORD[count]} times`}, so ${SUIT_QUALITY[suit]} are the main currency of this situation.`);
  }
  if (n === 10) {
    const absent = (["wands", "cups", "swords", "pentacles"] as Suit[]).filter((s) => !suitCounts.has(s));
    if (absent.length > 0 && absent.length <= 2) {
      for (const s of absent) out.push(`There are no ${capitalise(s)} in this reading, which may suggest that ${SUIT_ABSENT[s]}.`);
    }
  }

  const courts = cards.filter(isCourt).length;
  if (courts >= (n === 10 ? 3 : 2) && n >= 5)
    out.push(`${capitalise(COUNT_WORD[courts])} court cards suggest that other people, or different roles you play, have a strong influence here.`);

  const reversed = drawn.filter((d) => d.orientation === "reversed").length;
  const reversedThreshold = n === 10 ? 5 : n === 5 ? 3 : 2;
  if (n >= 3 && reversed >= reversedThreshold)
    out.push(`${capitalise(COUNT_WORD[reversed])} of ${COUNT_WORD[n]} cards are reversed. Much of the energy here may be internal, delayed, or blocked, which asks for reflection before action.`);
  else if (n >= 5 && reversed === 0) out.push("Every card is upright: the energies in this reading are expressed openly and directly.");

  const numbers = new Map<number, number>();
  for (const c of cards) if (typeof c.rank === "number") numbers.set(c.rank, (numbers.get(c.rank) ?? 0) + 1);
  for (const [num, count] of numbers) {
    if (count >= 2) out.push(`${capitalise(COUNT_WORD[count])} ${NUMBER_PLURAL[num]} appear, emphasising ${NUMBER_THEME[num]}.`);
  }
  return out;
}

/* ---- per spread ---------------------------------------------------------- */

function single(drawn: DrawnCard[], ctx: QuestionContext): ReadingSynthesis {
  const [d] = drawn;
  const card: TarotCard = d.card;
  const subject = capitalise(nameInSentence(card)) + (d.orientation === "reversed" ? ", reversed," : "");
  const paragraphs = [`${subject} is the one card drawn for you. Its message centres on ${theme(d)}.`];
  let second: string;
  if (card.arcana === "major") {
    second = "As a Major Arcana card, it suggests your question touches something larger than a single day: a recurring lesson or a turning point worth taking seriously.";
  } else if (isCourt(card)) {
    second = "As a court card, it may describe a person in your life, or a way of carrying yourself, that is especially relevant right now.";
  } else {
    const rank = card.rank as number;
    second = `As a minor card of ${capitalise(card.suit!)}, it brings the question down to the everyday level of ${SUIT_QUALITY[card.suit!]}, and the ${NUMBER_WORD[rank]} adds a note of ${NUMBER_THEME[rank]}.`;
  }
  if (ctx.area) second += ` Applied to ${AREA_LABEL[ctx.area]}, look for it in ${card.areas[ctx.area]}.`;
  paragraphs.push(second);
  return {
    heading: "The central message",
    paragraphs,
    themes: [],
    relationships: [],
    questions: [question(d)],
    closing: { label: "If you keep one thing", items: [advice(d)] },
  };
}

function three(drawn: DrawnCard[]): ReadingSynthesis {
  const [past, present, future] = drawn;
  const paragraphs = [`The story moves from ${theme(past)} in the past, through ${theme(present)} in the present, toward ${theme(future)} as a possible next chapter.`];

  const diff = tone(future) - tone(past);
  const tones = drawn.map(tone);
  if (diff >= 1.5) paragraphs.push("The arc is opening. Something that weighed on you earlier appears to be giving way to something more workable, and the present card shows the hinge on which that turn depends.");
  else if (diff <= -1.5) paragraphs.push("The arc tightens toward the future. Take this as an early signal rather than a verdict: the present card marks where you can still change the course.");
  else if (tones.every((t) => t >= 0.5)) paragraphs.push("The tone stays steady and supportive across all three positions, which suggests continuity: what has been working is likely to keep working if you keep tending it.");
  else if (tones.every((t) => t <= -0.5)) paragraphs.push("All three cards carry weight. This is a demanding stretch, and the reading asks for patience and support rather than quick fixes.");
  else paragraphs.push("The tone shifts between positions without a single clear direction, so how this unfolds is likely to depend on the choices you make in the present.");

  const relationships = [
    elementalRelationship("Past → Present", past, present, {
      aligned: `The past (${label(past)}) and the present (${label(present)}) are elementally compatible, so the story is continuous: the emphasis on ${ELEMENT_QUALITY[past.card.element]} that began earlier is still the main current.`,
      opposed: `The past (${label(past)}) and the present (${label(present)}) pull in different directions. The emphasis has shifted from ${ELEMENT_QUALITY[past.card.element]} to ${ELEMENT_QUALITY[present.card.element]}, and that change may still be settling.`,
      neutral: `The past (${label(past)}) and the present (${label(present)}) work in different registers, which suggests a change of focus rather than a direct continuation.`,
    }),
    elementalRelationship("Present → Future", present, future, {
      aligned: `The present (${label(present)}) flows naturally toward the possible future (${label(future)}); the momentum you have now supports where things are heading.`,
      opposed: `The present (${label(present)}) and the possible future (${label(future)}) are elementally opposed. Reaching that future may require a change of approach, from ${ELEMENT_QUALITY[present.card.element]} toward ${ELEMENT_QUALITY[future.card.element]}.`,
      neutral: `The present (${label(present)}) and the possible future (${label(future)}) are neither strongly aligned nor opposed, so the path between them is open to your choices.`,
    }),
  ];

  return {
    heading: "Past, present, and a possible future",
    paragraphs,
    themes: patternThemes(drawn),
    relationships,
    questions: [question(present), question(future)],
    closing: {
      label: "A practical next step",
      items: [`Start with the present. ${advice(present)} The future card describes a direction, not a verdict; what you do now is what shapes it.`],
    },
  };
}

function five(drawn: DrawnCard[]): ReadingSynthesis {
  const [core, challenge, foundation, guidance, direction] = drawn;
  const paragraphs = [
    `At the centre is ${theme(core)}, tested by ${theme(challenge)}. Beneath it runs ${theme(foundation)}, which helps explain why the situation has taken this shape.`,
    `The cards offer ${theme(guidance)} as a perspective worth considering. If nothing changes, the situation leans toward ${theme(direction)}.`,
  ];
  const dt = tone(direction);
  if (dt < -0.5) paragraphs.push("The direction card is demanding, which is exactly why the guidance matters: it shows where you can intervene before that course sets.");
  else if (dt > 0.5) paragraphs.push("The direction card is encouraging. The guidance describes how to stay on that course rather than drift from it.");
  else paragraphs.push("The direction is finely balanced, so the guidance may well be what tips it.");

  const relationships = [
    elementalRelationship("Core × Challenge", core, challenge, {
      aligned: `The challenge (${label(challenge)}) is compatible with the core (${label(core)}). The difficulty may be a matter of degree, too much or too little of the same energy, rather than a true opposition.`,
      opposed: `The challenge (${label(challenge)}) works against the core (${label(core)}) at an elemental level: ${ELEMENT_QUALITY[core.card.element]} meets ${ELEMENT_QUALITY[challenge.card.element]}. Holding both, rather than choosing one, may be the real task.`,
      neutral: `The challenge (${label(challenge)}) approaches the core (${label(core)}) from a different angle, which may be why it is easy to underestimate.`,
    }),
    elementalRelationship(
      "Challenge × Guidance",
      challenge,
      guidance,
      {
        aligned: `The guidance (${label(guidance)}) shares its nature with the challenge (${label(challenge)}). The way through may involve working with the challenge's energy rather than against it.`,
        opposed: `The guidance (${label(guidance)}) runs against the grain of the challenge (${label(challenge)}). It offers a genuinely different approach rather than more of the same.`,
        neutral: `The guidance (${label(guidance)}) comes from a different direction than the challenge (${label(challenge)}), offering a fresh angle rather than a direct counter.`,
      },
      "complementary",
    ),
    elementalRelationship("Foundation × Core", foundation, core, {
      aligned: `The foundation (${label(foundation)}) supports the core (${label(core)}): the situation rests on ground that is compatible with it.`,
      opposed: `The foundation (${label(foundation)}) and the core (${label(core)}) are at odds. An older influence may be working against what is happening now.`,
      neutral: `The foundation (${label(foundation)}) and the core (${label(core)}) are only loosely connected; the situation may have outgrown its original basis.`,
    }),
  ];

  return {
    heading: "The forces at work",
    paragraphs,
    themes: patternThemes(drawn),
    relationships,
    questions: [question(challenge), question(guidance)],
    closing: { label: "A practical reflection", items: [advice(guidance), advice(core)] },
  };
}

function ten(drawn: DrawnCard[]): ReadingSynthesis {
  const [present, crossing, foundation, recent, conscious, near, self, environment, hopes, outcome] = drawn;
  const paragraphs = [
    `At the heart of this reading is ${theme(present)}, crossed by ${theme(crossing)}. Beneath it lies ${theme(foundation)}, while your conscious attention is on ${theme(conscious)}.`,
    `Recently, ${theme(recent)} has been in play. In the near future, ${theme(near)} may come forward.`,
    `Your own stance is marked by ${theme(self)}, amid ${theme(environment)} in your surroundings. Your hopes and fears gather around ${theme(hopes)}, and the reading leans toward ${theme(outcome)} as a potential outcome.`,
  ];
  const avg = drawn.reduce((sum, d) => sum + tone(d), 0) / drawn.length;
  if (avg >= 0.6)
    paragraphs.push("Taken together, the cards describe a situation with real support behind it. The work is less about forcing change than about staying with what is already moving in your favour.");
  else if (avg <= -0.6)
    paragraphs.push("Taken together, this is a demanding reading. It does not predict a bad result; it describes pressure that is easier to work with once it is named, and it points to the Self card as the place where your choices carry the most weight.");
  else
    paragraphs.push("Taken together, the reading is mixed: real support and real friction sit side by side. The relationships marked as tension below are where your attention is likely to make the most difference.");

  const tr = (title: string, from: DrawnCard, to: DrawnCard, texts: Record<"rising" | "falling" | "steady", string>): Relationship => {
    const t = trajectory(from, to);
    return { title, tone: t === "rising" ? "complementary" : t === "falling" ? "tension" : "neutral", text: texts[t] };
  };

  const relationships: Relationship[] = [
    elementalRelationship("Present × Challenge", present, crossing, {
      aligned: `The challenge (${label(crossing)}) is elementally compatible with the central situation (${label(present)}). The obstacle may be less an opponent than an exaggeration of the situation itself: too much of the same energy.`,
      opposed: `The challenge (${label(crossing)}) opposes the central situation (${label(present)}) elementally. It is a genuinely different force, and progress may depend on finding a way to hold both rather than defeat one.`,
      neutral: `The challenge (${label(crossing)}) and the central situation (${label(present)}) work in different registers, so the friction may come from an unexpected direction.`,
    }),
    elementalRelationship("Foundation × Conscious Focus", foundation, conscious, {
      aligned: `What lies beneath (${label(foundation)}) supports what you are consciously focused on (${label(conscious)}). Your underlying motivations and your stated aims point the same way.`,
      opposed: `What lies beneath (${label(foundation)}) and what you are consciously focused on (${label(conscious)}) are at odds. Part of you may want something different from the goal you have named.`,
      neutral: `Your foundation (${label(foundation)}) and your conscious focus (${label(conscious)}) operate separately; it may help to ask how one could serve the other.`,
    }),
    tr("Recent Past → Near Future", recent, near, {
      rising: `From the recent past (${label(recent)}) to the near future (${label(near)}), the tone lifts: what has recently been difficult appears to be giving way.`,
      falling: `From the recent past (${label(recent)}) to the near future (${label(near)}), the tone becomes more demanding. Preparing now may soften what is coming.`,
      steady: `The recent past (${label(recent)}) and the near future (${label(near)}) carry a similar tone, suggesting continuity rather than a sharp change in the weeks ahead.`,
    }),
    elementalRelationship("Self × Environment", self, environment, {
      aligned: `Your own stance (${label(self)}) and your environment (${label(environment)}) are compatible: the people and circumstances around you are likely to support your approach.`,
      opposed: `There is friction between your stance (${label(self)}) and your environment (${label(environment)}). You may be approaching the situation differently from those around you, which is worth acknowledging openly.`,
      neutral: `Your stance (${label(self)}) and your surroundings (${label(environment)}) are neither strongly aligned nor opposed, so your own choices may carry more weight than the context.`,
    }),
    elementalRelationship("Hopes & Fears × Outcome", hopes, outcome, {
      aligned: `Your hopes and fears (${label(hopes)}) resonate with the potential outcome (${label(outcome)}). What you anticipate and where things are heading are closely linked, so your expectations matter here.`,
      opposed: `Your hopes and fears (${label(hopes)}) diverge from the potential outcome (${label(outcome)}). Things may not unfold the way you are bracing for, or wishing for.`,
      neutral: `Your hopes and fears (${label(hopes)}) and the potential outcome (${label(outcome)}) sit at some distance from each other; the outcome may surprise you in either direction.`,
    }),
    tr("Present → Outcome", present, outcome, {
      rising: `Between the present (${label(present)}) and the potential outcome (${label(outcome)}), the reading moves toward greater ease.`,
      falling: `Between the present (${label(present)}) and the potential outcome (${label(outcome)}), the reading becomes more demanding. That is a direction, not a destination; the Self card shows where you can intervene.`,
      steady: `The present (${label(present)}) and the potential outcome (${label(outcome)}) share a similar tone: the situation is more likely to deepen than to transform.`,
    }),
  ];

  return {
    heading: "The complete picture",
    paragraphs,
    themes: patternThemes(drawn),
    relationships,
    questions: [question(crossing), question(hopes), question(outcome)],
    closing: {
      label: "Practical considerations",
      items: [`On your own approach: ${advice(self)}`, `On the challenge: ${advice(crossing)}`, `On the potential outcome: ${advice(outcome)}`],
    },
  };
}

export function synthesiseReading(drawn: DrawnCard[], ctx: QuestionContext): ReadingSynthesis {
  switch (drawn.length) {
    case 1:
      return single(drawn, ctx);
    case 3:
      return three(drawn);
    case 5:
      return five(drawn);
    case 10:
      return ten(drawn);
    default:
      throw new Error(`No synthesis for a ${drawn.length}-card reading`);
  }
}
