import { useCallback, useEffect, useLayoutEffect, useReducer, useRef, type RefObject } from "react";
import type { SpreadId } from "@/domain/types";
import { createReading } from "@/domain/readingModel";
import { loadSession, saveSession } from "@/state/persistence";
import { sessionReducer, type SessionState } from "@/state/readingState";

/** Flip duration; must match --reveal-ms in tokens.css. */
export const REVEAL_MS = 760;
const REVEAL_MS_REDUCED = 240;
/** Delay between cards for "Reveal all remaining", so the screen never flips all at once. */
const STAGGER_MS = 180;
const STAGGER_MS_REDUCED = 70;

const READING_HASH = "#reading";

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

function enterReadingUrl(pushed: RefObject<boolean>) {
  if (location.hash !== READING_HASH) {
    history.pushState({ arcana: "reading" }, "", location.pathname + location.search + READING_HASH);
    pushed.current = true;
  }
}

/** Returns true when it navigated back, in which case popstate updates the screen. */
function exitReadingUrl(pushed: RefObject<boolean>): boolean {
  if (pushed.current && location.hash === READING_HASH) {
    pushed.current = false;
    history.back();
    return true;
  }
  history.replaceState({ arcana: "landing" }, "", location.pathname + location.search);
  return false;
}

export interface ArcanaSession {
  state: SessionState;
  chooseSpread: (id: SpreadId) => void;
  setQuestion: (q: string) => void;
  /** Returns false when an existing reading would be discarded and `force` was not given. */
  begin: (force?: boolean) => boolean;
  resume: () => void;
  /** Back to the spreads; the current reading is kept and can be resumed. */
  leave: () => void;
  /** Discard the current reading and return to the spreads. */
  newReading: () => void;
  reveal: (index: number) => void;
  revealAll: () => void;
  select: (index: number | null) => void;
}

/**
 * Owns the session: reducer, reveal timers, persistence and browser history.
 * The browser Back button moves from a reading to the spread selection (the
 * reading stays resumable); Forward returns to it.
 */
export function useArcanaSession(): ArcanaSession {
  const [state, dispatch] = useReducer(sessionReducer, undefined, loadSession);
  const stateRef = useRef(state);
  const timers = useRef(new Set<number>());
  const pending = useRef(new Set<string>());
  const pushed = useRef(false);

  useLayoutEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => saveSession(state), [state]);

  const clearTimers = useCallback(() => {
    for (const t of timers.current) window.clearTimeout(t);
    timers.current.clear();
    pending.current.clear();
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  // History: mirror the screen in the URL hash so Back / Forward behave.
  useEffect(() => {
    const url = location.pathname + location.search;
    history.replaceState({ arcana: stateRef.current.screen }, "", stateRef.current.screen === "reading" ? url + READING_HASH : url);
    const onPop = () => {
      const wantsReading = location.hash === READING_HASH;
      if (wantsReading && !stateRef.current.reading) {
        history.replaceState({ arcana: "landing" }, "", location.pathname + location.search);
        dispatch({ type: "show", screen: "landing" });
        return;
      }
      pushed.current = false;
      dispatch({ type: "show", screen: wantsReading ? "reading" : "landing" });
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const chooseSpread = useCallback((spreadId: SpreadId) => dispatch({ type: "choose-spread", spreadId }), []);
  const setQuestion = useCallback((question: string) => dispatch({ type: "set-question", question }), []);

  const begin = useCallback(
    (force = false) => {
      const { reading, spreadId, question } = stateRef.current;
      const hasRevealed = !!reading && reading.status.some((s) => s !== "hidden");
      if (hasRevealed && !force) return false;
      clearTimers();
      dispatch({ type: "start", reading: createReading(spreadId, question) });
      enterReadingUrl(pushed);
      return true;
    },
    [clearTimers],
  );

  const resume = useCallback(() => {
    if (!stateRef.current.reading) return;
    dispatch({ type: "show", screen: "reading" });
    enterReadingUrl(pushed);
  }, []);

  const leave = useCallback(() => {
    if (!exitReadingUrl(pushed)) dispatch({ type: "show", screen: "landing" });
  }, []);

  const newReading = useCallback(() => {
    clearTimers();
    exitReadingUrl(pushed);
    dispatch({ type: "discard" });
  }, [clearTimers]);

  const revealOne = useCallback((index: number, auto: boolean) => {
    const r = stateRef.current.reading;
    if (!r || r.status[index] !== "hidden") return;
    const key = `${r.id}:${index}`;
    if (pending.current.has(key)) return;
    pending.current.add(key);
    dispatch({ type: "reveal", readingId: r.id, index });
    const t = window.setTimeout(
      () => {
        timers.current.delete(t);
        pending.current.delete(key);
        dispatch({ type: "settle", readingId: r.id, index, auto });
      },
      prefersReducedMotion() ? REVEAL_MS_REDUCED : REVEAL_MS,
    );
    timers.current.add(t);
  }, []);

  const reveal = useCallback((index: number) => revealOne(index, false), [revealOne]);

  const revealAll = useCallback(() => {
    const r = stateRef.current.reading;
    if (!r) return;
    const hidden = r.status.flatMap((s, i) => (s === "hidden" && !pending.current.has(`${r.id}:${i}`) ? [i] : []));
    const stagger = prefersReducedMotion() ? STAGGER_MS_REDUCED : STAGGER_MS;
    hidden.forEach((index, k) => {
      if (k === 0) return revealOne(index, true);
      const t = window.setTimeout(() => {
        timers.current.delete(t);
        if (stateRef.current.reading?.id === r.id) revealOne(index, true);
      }, k * stagger);
      timers.current.add(t);
    });
  }, [revealOne]);

  const select = useCallback((index: number | null) => {
    const r = stateRef.current.reading;
    if (r) dispatch({ type: "select", readingId: r.id, index });
  }, []);

  return { state, chooseSpread, setQuestion, begin, resume, leave, newReading, reveal, revealAll, select };
}
