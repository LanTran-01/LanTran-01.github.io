import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { Box3, MathUtils, Vector3, type PerspectiveCamera } from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { CameraControls } from "@react-three/drei";
import type CameraControlsImpl from "camera-controls";
import { getComponent } from "@/data/components";
import { MACHINE, MACHINE_SCOPE } from "@/data/machine";
import { useExplorerStore } from "@/state/explorerStore";
import { cameraTelemetry } from "@/features/model/telemetry";
import type { ViewerModelIndex } from "@/features/model/annotateModel";
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
 * With machine-scope modes, entering or leaving the exploded view refits the
 * camera to the separated model from the current viewing angle.
 * Publishes low-rate camera telemetry for the HUD.
 */

const SMOOTH = 0.25;
const INTRO_SMOOTH = 0.42;
const TELEMETRY_INTERVAL = 0.1;

const { stage } = MACHINE;
/** Fallback bounds until the model is indexed. */
const DEFAULT_BOUNDS = new Box3(new Vector3(...stage.defaultBounds[0]), new Vector3(...stage.defaultBounds[1]));
const TARGET_BOUNDARY = new Box3(new Vector3(...stage.targetBoundary[0]), new Vector3(...stage.targetBoundary[1]));

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
  const exploded = useExplorerStore((s) => MACHINE_SCOPE && s.mode === "exploded");

  const introDone = useRef(false);
  /** True once the user orbits/zooms after the last programmatic framing. */
  const userMoved = useRef(false);
  const vpRef = useRef<Viewport>({ width: size.width, height: size.height, insets });
  vpRef.current = { width: size.width, height: size.height, insets };

  const computeFraming = useCallback((): Framing => {
    const vp = vpRef.current;
    const s = useExplorerStore.getState();
    // Machine scope: the exploded view is framed fully separated, so the slider never pushes parts out of view.
    const sep = MACHINE_SCOPE && s.mode === "exploded";
    const overall = model ? (sep ? model.overallExploded : model.overall) : null;
    const bounds = overall && !overall.isEmpty() ? overall : DEFAULT_BOUNDS;
    if (s.view !== "systems" && s.selected && model) {
      const b = (sep ? model.explodedBounds : model.bounds).get(s.selected);
      if (b && !b.isEmpty()) return componentFraming(b, getComponent(s.selected).camera, camera, vp);
    }
    return overviewFraming(bounds, camera, vp, OVERVIEW_AZIMUTH, OVERVIEW_ELEVATION);
  }, [model, camera]);

  const frame = useCallback(
    (animate: boolean, keepAngle = false) => {
      const c = controls.current;
      if (!c) return;
      const { position: p, target: t } = computeFraming();
      if (keepAngle) {
        // Same distance and target, seen from where the camera is now.
        const dir = c.getPosition(new Vector3()).sub(c.getTarget(new Vector3()));
        const distance = p.distanceTo(t);
        if (dir.lengthSq() > 1e-6) p.copy(t).addScaledVector(dir.normalize(), distance);
      }
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
      OVERVIEW_ELEVATION - MathUtils.degToRad(4.5),
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

  // Machine scope: separating or reassembling the model refits it without turning the camera.
  const lastExploded = useRef(exploded);
  useEffect(() => {
    if (lastExploded.current === exploded) return;
    lastExploded.current = exploded;
    if (introDone.current) frame(true, true);
  }, [exploded, frame]);

  // Panels opening / closing or a resize: re-fit unless the user has taken over.
  const layoutKey = `${size.width}x${size.height}|${insets.left},${insets.right},${insets.top},${insets.bottom}`;
  const lastLayoutKey = useRef(layoutKey);
  useEffect(() => {
    if (lastLayoutKey.current === layoutKey) return;
    lastLayoutKey.current = layoutKey;
    if (!introDone.current || userMoved.current) return;
    frame(true);
  }, [layoutKey, frame]);

  // Telemetry at ≤ 10 Hz. With an on-demand frame loop a move can end between
  // samples, so a trailing frame is requested until the latest pose is published.
  const tel = useRef({ acc: 0, frames: 0, fps: 0, az: NaN, pol: NaN, dist: NaN, tx: NaN, ty: NaN, tz: NaN });
  const tmpTarget = useRef(new Vector3());
  useFrame((_, dt) => {
    const c = controls.current;
    if (!c) return;
    const t = tel.current;
    if (dt > 0.25) {
      // Coming back from idle: the gap says nothing about render speed.
      t.acc = 0;
      t.frames = 0;
    } else {
      t.acc += dt;
      t.frames++;
    }
    const target = c.getTarget(tmpTarget.current, true);
    const changed =
      c.azimuthAngle !== t.az || c.polarAngle !== t.pol || c.distance !== t.dist ||
      target.x !== t.tx || target.y !== t.ty || target.z !== t.tz;
    if (t.acc < TELEMETRY_INTERVAL) {
      if (changed) invalidate();
      return;
    }
    const inst = t.frames / t.acc;
    t.fps = t.fps === 0 ? inst : t.fps * 0.7 + inst * 0.3;
    t.acc = 0;
    t.frames = 0;
    t.az = c.azimuthAngle;
    t.pol = c.polarAngle;
    t.dist = c.distance;
    t.tx = target.x;
    t.ty = target.y;
    t.tz = target.z;
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
