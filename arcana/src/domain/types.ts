/* ==========================================================================
   Core domain types. Everything the UI renders is derived from these.
   ========================================================================== */

export type Arcana = "major" | "minor";
export type Suit = "cups" | "swords" | "wands" | "pentacles";
export type Element = "fire" | "water" | "air" | "earth";
export type Orientation = "upright" | "reversed";
export type LifeArea = "work" | "love" | "self";

export type PipRank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
export type CourtRank = "page" | "knight" | "queen" | "king";
export type Rank = PipRank | CourtRank;

/** Card-specific writing for one orientation. */
export interface OrientationContent {
  keywords: readonly [string, string, string];
  /** Two or three sentences: what the card means in this orientation. */
  meaning: string;
  /**
   * A lowercase noun phrase that summarises the card's energy, written so it
   * can follow phrases like "points to …", "the obstacle may be …".
   */
  theme: string;
  /** An imperative, practical suggestion. */
  advice: string;
  /** A reflective question in the card's own terms. */
  question: string;
}

/** The authored content for one card, before identity fields are attached. */
export interface CardContent {
  upright: OrientationContent;
  reversed: OrientationContent;
  /** How the card tends to show up in each life area, as a lowercase noun phrase. */
  areas: Record<LifeArea, string>;
  /** Upright tone from -2 (demanding) to +2 (supportive). Used by the synthesis. */
  tone: number;
}

export interface TarotCard extends CardContent {
  /** Stable id: "major-00" … "major-21", "cups-01" … "cups-10", "cups-page" … */
  id: string;
  name: string;
  arcana: Arcana;
  /** 0–21 for the Major Arcana, 1–14 within a suit (11 page … 14 king). */
  number: number;
  suit: Suit | null;
  rank: Rank | null;
  element: Element;
  /** Roman numeral shown on the card face, or null for court cards. */
  numeral: string | null;
}

/* ---- spreads ---------------------------------------------------------- */

export type SpreadId = "single" | "three" | "five" | "ten";

/** The interpretive role of a position. Several spreads share roles. */
export type PositionKind =
  | "focus"
  | "past"
  | "present"
  | "future"
  | "core"
  | "challenge"
  | "foundation"
  | "guidance"
  | "direction"
  | "situation"
  | "crossing"
  | "recent-past"
  | "conscious"
  | "near-future"
  | "self"
  | "environment"
  | "hopes-fears"
  | "outcome";

export interface SpreadPosition {
  /** 0-based index into the reading's draws. */
  index: number;
  kind: PositionKind;
  label: string;
  /** One line describing what the position asks. */
  summary: string;
}

export interface SpreadDefinition {
  id: SpreadId;
  name: string;
  /** Title-case name for running text. */
  title: string;
  count: number;
  tagline: string;
  purpose: string;
  positions: readonly SpreadPosition[];
}

/* ---- readings ---------------------------------------------------------- */

export interface Draw {
  cardId: string;
  orientation: Orientation;
}

export type CardStatus = "hidden" | "revealing" | "revealed";

export interface Reading {
  id: string;
  spreadId: SpreadId;
  question: string;
  createdAt: number;
  /** Fixed when the reading starts. Index i belongs to spread position i. */
  draws: readonly Draw[];
  status: readonly CardStatus[];
  selected: number | null;
  /** The most recent reveal to settle; the UI uses it to open the detail view. */
  lastSettled: { index: number; auto: boolean; nonce: number } | null;
}
