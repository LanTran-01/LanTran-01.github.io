import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { Box3, MathUtils, Vector3, type PerspectiveCamera } from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { CameraControls } from "@react-three/drei";
import type CameraControlsImpl from "camera-controls";
import { getComponent } from "@/data/components";
import { MODEL_HEIGHT } from "@/data/modelConfig";
import { useExplorerStore } from "@/state/explorerStore";
import { cameraTelemetry } from "@/features/gundam/telemetry";
import type { ViewerModelIndex } from "@/features/gundam/annotateModel";
import {
  OVERVIEW_AZIMUTH,
  OVERVIEW_ELEVATION,
  applyViewOffset,
  componentFraming,
  overviewFraming,
  type Framing,
  type Viewport,
} from "./framing";
import { viewerRuntime } from "./viewerRuntime";

/**
 * Orbit camera (camera-controls) with damping, limits and a target boundary,
 * plus the programmatic moves: intro, overview, per-assembly framing, reset.
 * Publishes low-rate camera telemetry for the HUD.
 */

const SMOOTH = 0.25;
const INTRO_SMOOTH = 0.42;
const TELEMETRY_INTERVAL = 0.1;

/** Fallback bounds until the model is indexed. */
const DEFAULT_BOUNDS = new Box3(new Vector3(-1.4, 0, -0.9), new Vector3(1.4, MODEL_HEIGHT, 0.9));
const TARGET_BOUNDARY = new Box3(new Vector3(-3.5, 0.15, -3.5), new Vector3(3.5, MODEL_HEIGHT + 0.6, 3.5));

export function CameraRig({ model }: { model: ViewerModelIndex | null }) {
  const controls = useRef<CameraControlsImpl>(null);
  const camera = useThree((s) => s.camera) as PerspectiveCamera;
  const size = useThree((s) => s.size);
  const invalidate = useThree((s) => s.invalidate);

  const selected = useExplorerStore((s) => s.selected);
  const view = useExplorerStore((s) => s.view);
  const insets = useExplorerStore((s) => s.viewInsets);
  const resetNonce = useExplorerStore((s) => s.cameraResetNonce);
  const reducedMotion = useExplorerStore((s) => s.reducedMotion);

  const introDone = useRef(false);
  /** True once the user orbits/zooms after the last programmatic framing. */
  const userMoved = useRef(false);
  const vpRef = useRef<Viewport>({ width: size.width, height: size.height, insets });
  vpRef.current = { width: size.width, height: size.height, insets };

  const computeFraming = useCallback((): Framing => {
    const vp = vpRef.current;
    const bounds = model && !model.overall.isEmpty() ? model.overall : DEFAULT_BOUNDS;
    const s = useExplorerStore.getState();
    if (s.view !== "systems" && s.selected && model) {
      const b = model.bounds.get(s.selected);
      if (b && !b.isEmpty()) return componentFraming(b, getComponent(s.selected).camera, camera, vp);
    }
    return overviewFraming(bounds, camera, vp);
  }, [model, camera]);

  const frame = useCallback(
    (animate: boolean) => {
      const c = controls.current;
      if (!c) return;
      const { position: p, target: t } = computeFraming();
      const smooth = animate && !useExplorerStore.getState().reducedMotion;
      viewerRuntime.rigTransitioning = smooth;
      userMoved.current = false;
      void c.setLookAt(p.x, p.y, p.z, t.x, t.y, t.z, smooth);
      invalidate();
    },
    [computeFraming, invalidate],
  );

  // Static configuration.
  useEffect(() => {
    const c = controls.current;
    if (!c) return;
    c.setBoundary(TARGET_BOUNDARY);
    c.boundaryFriction = 0.15;
    c.boundaryEnclosesCamera = false;
    const onStart = () => {
      userMoved.current = true;
      viewerRuntime.rigTransitioning = false;
    };
    const onRest = () => {
      viewerRuntime.rigTransitioning = false;
      c.smoothTime = SMOOTH;
      invalidate();
    };
    c.addEventListener("controlstart", onStart);
    c.addEventListener("rest", onRest);
    return () => {
      c.removeEventListener("controlstart", onStart);
      c.removeEventListener("rest", onRest);
    };
  }, [invalidate]);

  // Projection offset keeps the subject centred between panels.
  useLayoutEffect(() => {
    applyViewOffset(camera, vpRef.current);
    invalidate();
  }, [camera, size.width, size.height, insets, invalidate]);

  // Initial pose (before the model is ready): slightly further, lower and turned.
  useLayoutEffect(() => {
    const c = controls.current;
    if (!c) return;
    const f = overviewFraming(
      DEFAULT_BOUNDS,
      camera,
      vpRef.current,
      OVERVIEW_AZIMUTH + MathUtils.degToRad(16),
      MathUtils.degToRad(2.5),
      1.4,
    );
    void c.setLookAt(f.position.x, f.position.y, f.position.z, f.target.x, f.target.y - 0.35, f.target.z, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Intro once the model is ready; afterwards follow selection / view / reset.
  const framingKey = view === "systems" ? "systems" : (selected ?? "overview");
  useEffect(() => {
    const c = controls.current;
    if (!c || !model) return;
    if (!introDone.current) {
      introDone.current = true;
      if (!reducedMotion && framingKey === "overview") c.smoothTime = INTRO_SMOOTH;
      frame(!reducedMotion);
      return;
    }
    frame(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model, framingKey, resetNonce]);

  // Panels opening / closing or a resize: re-fit unless the user has taken over.
  const layoutKey = `${size.width}x${size.height}|${insets.left},${insets.right},${insets.top},${insets.bottom}`;
  const lastLayoutKey = useRef(layoutKey);
  useEffect(() => {
    if (lastLayoutKey.current === layoutKey) return;
    lastLayoutKey.current = layoutKey;
    if (!introDone.current || userMoved.current) return;
    frame(true);
  }, [layoutKey, frame]);

  // Telemetry at ≤ 10 Hz.
  const tel = useRef({ acc: 0, frames: 0, fps: 0 });
  const tmpTarget = useRef(new Vector3());
  useFrame((_, dt) => {
    const c = controls.current;
    if (!c) return;
    const t = tel.current;
    t.acc += dt;
    t.frames++;
    if (t.acc < TELEMETRY_INTERVAL) return;
    const inst = t.frames / t.acc;
    t.fps = t.fps === 0 ? inst : t.fps * 0.7 + inst * 0.3;
    t.acc = 0;
    t.frames = 0;
    const target = c.getTarget(tmpTarget.current, true);
    cameraTelemetry.publish({
      azimuth: normaliseDeg(MathUtils.radToDeg(c.azimuthAngle)),
      elevation: 90 - MathUtils.radToDeg(c.polarAngle),
      distance: c.distance,
      target: [target.x, target.y, target.z],
      fps: Math.round(t.fps),
    });
  });

  return (
    <CameraControls
      ref={controls}
      makeDefault
      smoothTime={SMOOTH}
      draggingSmoothTime={0.09}
      minDistance={1.1}
      maxDistance={24}
      minPolarAngle={MathUtils.degToRad(12)}
      maxPolarAngle={MathUtils.degToRad(88)}
      azimuthRotateSpeed={0.55}
      polarRotateSpeed={0.55}
      dollySpeed={0.45}
      truckSpeed={1.2}
      dollyToCursor={false}
      infinityDolly={false}
    />
  );
}

function normaliseDeg(d: number): number {
  const x = ((d % 360) + 540) % 360 - 180;
  return Math.round(x * 10) / 10;
}
