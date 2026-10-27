import { useEffect, useLayoutEffect, useRef } from "react";
import { cameraTelemetry, type CameraTelemetry } from "@/features/model/telemetry";

/**
 * Samples camera telemetry at a fixed rate (default 10 Hz) and hands it to a
 * callback that should write straight to the DOM through refs. Never sets
 * React state, so HUD readouts cost nothing while the camera moves.
 */
export function useCameraTelemetry(onSample: (t: CameraTelemetry) => void, intervalMs = 100) {
  const callback = useRef(onSample);
  useLayoutEffect(() => {
    callback.current = onSample;
  });

  useEffect(() => {
    let latest = cameraTelemetry.get();
    let dirty = false;
    callback.current(latest);
    const unsubscribe = cameraTelemetry.subscribe((t) => {
      latest = t;
      dirty = true;
    });
    const timer = window.setInterval(() => {
      if (!dirty) return;
      dirty = false;
      callback.current(latest);
    }, intervalMs);
    return () => {
      unsubscribe();
      window.clearInterval(timer);
    };
  }, [intervalMs]);
}

/** Fixed-width signed degrees, e.g. "+012.4°" / "−183.0°". */
export function formatDegrees(value: number, digits = 1, pad = 3): string {
  const sign = value < 0 ? "−" : "+";
  const [int, frac] = Math.abs(value).toFixed(digits).split(".");
  return `${sign}${int.padStart(pad, "0")}${frac ? `.${frac}` : ""}°`;
}
