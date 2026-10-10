/**
 * Low-frequency camera telemetry published by the viewer for the HUD.
 *
 * Deliberately not in the zustand store: it changes every frame while the
 * camera moves, and only one or two DOM readouts care. Subscribers should
 * write to the DOM directly (refs) instead of setting React state per update.
 */
export interface CameraTelemetry {
  /** Azimuth around +Y in degrees, 0 = looking at the machine's front. */
  azimuth: number;
  /** Elevation above the horizon in degrees. */
  elevation: number;
  /** Camera distance to the orbit target, scene units. */
  distance: number;
  /** Orbit target in scene units. */
  target: [number, number, number];
  /** Smoothed frames per second (0 if unknown). */
  fps: number;
}

type Listener = (t: CameraTelemetry) => void;

const listeners = new Set<Listener>();
let latest: CameraTelemetry = { azimuth: 0, elevation: 0, distance: 0, target: [0, 0, 0], fps: 0 };

export const cameraTelemetry = {
  get: () => latest,
  publish(t: CameraTelemetry) {
    latest = t;
    for (const l of listeners) l(t);
  },
  subscribe(l: Listener): () => void {
    listeners.add(l);
    l(latest);
    return () => listeners.delete(l);
  },
};
