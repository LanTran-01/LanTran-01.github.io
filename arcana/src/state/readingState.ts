import type { CardStatus, Reading, SpreadId } from "@/domain/types";
import { MAX_QUESTION_LENGTH } from "@/domain/readingModel";

/**
 * Session state and its reducer. All transitions are guarded so that rapid or
 * repeated input can never produce an invalid state:
 *   hidden → revealing → revealed, each step at most once per card;
 *   only revealed cards can be selected;
 *   actions carry the reading id, so a timer from a previous reading is ignored.
 * Card identities live in `reading.draws` and never change after `start`.
 */

export type Screen = "landing" | "reading";

export interface SessionState {
  screen: Screen;
  /** Spread chosen on the landing screen (the draft for the next reading). */
  spreadId: SpreadId;
  /** Question typed on the landing screen. */
  question: string;
  /** The current reading, kept when returning to the landing screen so it can be resumed. */
  reading: Reading | null;
}

export type SessionAction =
  | { type: "choose-spread"; spreadId: SpreadId }
  | { type: "set-question"; question: string }
  | { type: "start"; reading: Reading }
  | { type: "show"; screen: Screen }
  | { type: "reveal"; readingId: string; index: number }
  | { type: "settle"; readingId: string; index: number; auto: boolean }
  | { type: "select"; readingId: string; index: number | null }
  | { type: "discard" };

export const INITIAL_SESSION: SessionState = { screen: "landing", spreadId: "three", question: "", reading: null };

function withStatus(status: readonly CardStatus[], index: number, value: CardStatus): CardStatus[] {
  const next = status.slice();
  next[index] = value;
  return next;
}

export function sessionReducer(state: SessionState, action: SessionAction): SessionState {
  const r = state.reading;
  switch (action.type) {
    case "choose-spread":
      return state.spreadId === action.spreadId ? state : { ...state, spreadId: action.spreadId };
    case "set-question":
      return { ...state, question: action.question.slice(0, MAX_QUESTION_LENGTH) };
    case "start":
      return { ...state, spreadId: action.reading.spreadId, reading: action.reading, screen: "reading" };
    case "show":
      if (action.screen === "reading" && !r) return state;
      return state.screen === action.screen ? state : { ...state, screen: action.screen };
    case "reveal":
      if (!r || r.id !== action.readingId || r.status[action.index] !== "hidden") return state;
      return { ...state, reading: { ...r, status: withStatus(r.status, action.index, "revealing") } };
    case "settle": {
      if (!r || r.id !== action.readingId || r.status[action.index] !== "revealing") return state;
      const select = !action.auto || r.selected === null;
      return {
        ...state,
        reading: {
          ...r,
          status: withStatus(r.status, action.index, "revealed"),
          selected: select ? action.index : r.selected,
          lastSettled: { index: action.index, auto: action.auto, nonce: (r.lastSettled?.nonce ?? 0) + 1 },
        },
      };
    }
    case "select":
      if (!r || r.id !== action.readingId) return state;
      if (action.index !== null && r.status[action.index] !== "revealed") return state;
      return r.selected === action.index ? state : { ...state, reading: { ...r, selected: action.index } };
    case "discard":
      return { ...state, reading: null, question: "", screen: "landing" };
  }
}
