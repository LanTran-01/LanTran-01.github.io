import type { SpreadDefinition, SpreadId } from "@/domain/types";

/**
 * The four spreads. Position meaning lives here; how each position is laid out
 * on screen lives in `spreadGeometry.ts`, and how it is interpreted lives in
 * `interpretationEngine.ts` (keyed by `kind`).
 */
export const SPREADS: readonly SpreadDefinition[] = [
  {
    id: "single",
    name: "Single Insight",
    title: "Single Insight",
    count: 1,
    tagline: "One symbol. One perspective. A moment of clarity.",
    purpose: "A focused reading for a daily reflection, a particular concern, or a question that needs a simple point of contemplation.",
    positions: [{ index: 0, kind: "focus", label: "Insight", summary: "The symbol at the centre of your reflection." }],
  },
  {
    id: "three",
    name: "Three Perspectives",
    title: "Three Perspectives",
    count: 3,
    tagline: "Understand the past, examine the present, and consider what may come next.",
    purpose: "Explore a situation through three connected perspectives.",
    positions: [
      { index: 0, kind: "past", label: "Past", summary: "What shaped the current situation." },
      { index: 1, kind: "present", label: "Present", summary: "What is happening now." },
      { index: 2, kind: "future", label: "Future", summary: "A possible direction or outcome." },
    ],
  },
  {
    id: "five",
    name: "Deeper Perspective",
    title: "Deeper Perspective",
    count: 5,
    tagline: "Examine the forces shaping a situation and uncover a new perspective.",
    purpose: "Explore a more complicated question, decision, or personal situation.",
    positions: [
      { index: 0, kind: "core", label: "Core", summary: "The central situation." },
      { index: 1, kind: "challenge", label: "Challenge", summary: "The primary obstacle or tension." },
      { index: 2, kind: "foundation", label: "Foundation", summary: "The underlying influence." },
      { index: 3, kind: "guidance", label: "Guidance", summary: "A perspective worth considering." },
      { index: 4, kind: "direction", label: "Direction", summary: "A possible direction if the situation continues along its current course." },
    ],
  },
  {
    id: "ten",
    name: "Complete Picture",
    title: "Complete Picture",
    count: 10,
    tagline: "Explore the larger picture through ten interconnected perspectives.",
    purpose: "A comprehensive, Celtic Cross–inspired reading for exploring several aspects of a question.",
    positions: [
      { index: 0, kind: "situation", label: "Present", summary: "The central situation." },
      { index: 1, kind: "crossing", label: "Challenge", summary: "The obstacle or opposing influence." },
      { index: 2, kind: "foundation", label: "Foundation", summary: "The underlying basis of the situation." },
      { index: 3, kind: "recent-past", label: "Recent Past", summary: "What has recently influenced events." },
      { index: 4, kind: "conscious", label: "Conscious Focus", summary: "What you are focusing on or aspiring toward." },
      { index: 5, kind: "near-future", label: "Near Future", summary: "A possible near-term development." },
      { index: 6, kind: "self", label: "Self", summary: "Your perspective, attitude, or approach." },
      { index: 7, kind: "environment", label: "Environment", summary: "External influences and circumstances." },
      { index: 8, kind: "hopes-fears", label: "Hopes & Fears", summary: "Expectations, concerns, and conflicting feelings." },
      { index: 9, kind: "outcome", label: "Potential Outcome", summary: "A possible direction suggested by the overall reading." },
    ],
  },
];

const BY_ID = new Map(SPREADS.map((s) => [s.id, s]));

export function getSpread(id: SpreadId): SpreadDefinition {
  const spread = BY_ID.get(id);
  if (!spread) throw new Error(`Unknown spread: ${id}`);
  return spread;
}

export function isSpreadId(value: unknown): value is SpreadId {
  return typeof value === "string" && BY_ID.has(value as SpreadId);
}

/** "02" style position numbers used across the interface. */
export function positionNumber(index: number): string {
  return String(index + 1).padStart(2, "0");
}
