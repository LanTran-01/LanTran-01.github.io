import type { Reading } from "@/domain/types";
import { isSpreadId } from "@/domain/spreadDefinitions";
import { isValidReading } from "@/domain/readingModel";
import { INITIAL_SESSION, type SessionState } from "@/state/readingState";

/**
 * Reset behaviour: the session (current reading, chosen spread, question) is
 * kept in sessionStorage, so a refresh restores the reading exactly, including
 * which cards are revealed. Closing the tab ends the session. Nothing is sent
 * anywhere. If storage is unavailable or the saved data is malformed, the app
 * simply starts fresh.
 */

const KEY = "arcana:session:v1";

/** A card caught mid-flip by a refresh is restored as revealed. */
function settled(reading: Reading): Reading {
  return {
    ...reading,
    status: reading.status.map((s) => (s === "revealing" ? "revealed" : s)),
    lastSettled: null,
  };
}

export function loadSession(): SessionState {
  try {
    const raw = window.sessionStorage.getItem(KEY);
    if (!raw) return INITIAL_SESSION;
    const data = JSON.parse(raw) as Partial<SessionState> & { v?: number };
    if (data.v !== 1) return INITIAL_SESSION;
    const reading = isValidReading(data.reading) ? settled(data.reading) : null;
    if (reading && reading.selected !== null && reading.status[reading.selected] !== "revealed") reading.selected = null;
    return {
      screen: data.screen === "reading" && reading ? "reading" : "landing",
      spreadId: isSpreadId(data.spreadId) ? data.spreadId : INITIAL_SESSION.spreadId,
      question: typeof data.question === "string" ? data.question : "",
      reading,
    };
  } catch {
    return INITIAL_SESSION;
  }
}

export function saveSession(state: SessionState): void {
  try {
    const reading = state.reading ? settled(state.reading) : null;
    window.sessionStorage.setItem(KEY, JSON.stringify({ v: 1, ...state, reading }));
  } catch {
    // Private mode or storage disabled: the reading still works, it just won't survive a refresh.
  }
}
