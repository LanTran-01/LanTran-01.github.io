import { Box3, MathUtils, Sphere, Vector3, type PerspectiveCamera } from "three";
import type { ViewInsets } from "@/state/explorerStore";
import type { CameraHint } from "@/data/types";
import { MACHINE } from "@/data/machine";

/**
 * Camera framing maths. The rig shifts the projection centre into the free
 * area between panels (camera.setViewOffset), so framing only has to make the
 * subject fit inside that smaller window.
 */

export interface Framing {
  position: Vector3;
  target: Vector3;
}

export interface Viewport {
  width: number;
  height: number;
  insets: ViewInsets;
}

/** Overview direction: three-quarter front-left of the machine, slightly above. */
export const OVERVIEW_AZIMUTH = MathUtils.degToRad(MACHINE.stage.azimuth);
export const OVERVIEW_ELEVATION = MathUtils.degToRad(MACHINE.stage.elevation);

const MIN_FREE = 120;

/** Clamped free area in CSS px. */
export function freeArea(vp: Viewport): { w: number; h: number } {
  const { width, height, insets } = vp;
  return {
    w: Math.max(MIN_FREE, width - insets.left - insets.right),
    h: Math.max(MIN_FREE, height - insets.top - insets.bottom),
  };
}

/** tan of the half field-of-view that the free area subtends, vertically and horizontally. */
function freeTangents(camera: PerspectiveCamera, vp: Viewport): { tv: number; th: number } {
  const tanV = Math.tan(MathUtils.degToRad(camera.fov) / 2);
  const { w, h } = freeArea(vp);
  return { tv: (tanV * h) / vp.height, th: (tanV * w) / vp.height };
}

/** Applies (or clears) a projection offset so the frustum centre sits in the free area. */
export function applyViewOffset(camera: PerspectiveCamera, vp: Viewport): void {
  const { width, height, insets } = vp;
  const ox = (insets.right - insets.left) / 2;
  const oy = (insets.bottom - insets.top) / 2;
  if (Math.abs(ox) < 0.5 && Math.abs(oy) < 0.5) {
    if (camera.view?.enabled) camera.clearViewOffset();
    return;
  }
  camera.setViewOffset(width, height, ox, oy, width, height);
}

function dirFromAngles(azimuth: number, elevation: number, out: Vector3): Vector3 {
  return out.set(Math.sin(azimuth) * Math.cos(elevation), Math.sin(elevation), Math.cos(azimuth) * Math.cos(elevation));
}

/** Frames a whole bounding box (the machine) from the overview direction. */
export function overviewFraming(
  bounds: Box3,
  camera: PerspectiveCamera,
  vp: Viewport,
  azimuth = OVERVIEW_AZIMUTH,
  elevation = OVERVIEW_ELEVATION,
  distanceScale = 1,
): Framing {
  const size = bounds.getSize(new Vector3());
  const center = bounds.getCenter(new Vector3());
  const { tv, th } = freeTangents(camera, vp);
  const halfH = (size.y / 2) * 1.12;
  // Horizontal extent seen from this azimuth.
  const halfW = ((Math.abs(Math.cos(azimuth)) * size.x + Math.abs(Math.sin(azimuth)) * size.z) / 2) * 1.12;
  const depth = (Math.abs(Math.sin(azimuth)) * size.x + Math.abs(Math.cos(azimuth)) * size.z) / 2;
  const d = (Math.max(halfH / tv, halfW / th) + depth * 0.5) * distanceScale;
  const target = center.clone();
  target.y = center.y - size.y * 0.01;
  const dir = dirFromAngles(azimuth, elevation, new Vector3());
  return { target, position: target.clone().addScaledVector(dir, d) };
}

/** Frames one assembly along its camera hint at radius × distanceFactor. */
export function componentFraming(bounds: Box3, hint: CameraHint, camera: PerspectiveCamera, vp: Viewport): Framing {
  const sphere = bounds.getBoundingSphere(new Sphere());
  const r = Math.max(0.25, sphere.radius);
  const { tv, th } = freeTangents(camera, vp);
  const factor = hint.distanceFactor ?? 2.6;
  // factor 2.6 ≈ the bounding sphere fills ~60% of the free area, leaving context around it.
  const d = (r / Math.min(tv, th)) * (factor / 2.6) * 1.6;
  const dir = new Vector3(...hint.direction).normalize();
  const target = sphere.center.clone();
  return { target, position: target.clone().addScaledVector(dir, Math.max(d, 1.3)) };
}
