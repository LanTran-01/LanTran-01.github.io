import {
  Box3,
  Color,
  EdgesGeometry,
  LineBasicMaterial,
  LineSegments,
  type BufferGeometry,
  type Material,
  type Mesh,
  type Vector3,
} from "three";
import type { ComponentId } from "@/data/types";
import {
  computeTarget,
  edgeOpacity,
  type EdgeLayer,
  type VisualInputs,
  type VisualTarget,
} from "@/features/component-inspection/modeVisuals";
import { getPartTag, type PartTag } from "./modelTypes";
import type { ViewerModelIndex } from "./annotateModel";

/**
 * Owns per-mesh cloned materials and animates them towards the targets from
 * `modeVisuals`. Created once per model; `dispose()` restores the original
 * materials and frees every clone and edge geometry it created.
 */

export const ACCENT = new Color("#63c7ff");

/** Material fields we animate; present on MeshStandard/Physical/Phong/Lambert. */
type AnimMaterial = Material & {
  color?: Color;
  emissive?: Color;
  emissiveIntensity?: number;
  envMapIntensity?: number;
  roughness?: number;
};

interface MatState {
  mat: AnimMaterial;
  baseColor: Color | null;
  mutedColor: Color | null;
  /** Original emissive × intensity (intensity is then pinned to 1). */
  baseEmissive: Color | null;
  baseOpacity: number;
  baseTransparent: boolean;
  baseDepthWrite: boolean;
  baseEnvIntensity: number;
  baseRoughness: number;
}

interface MeshState {
  mesh: Mesh;
  tag: PartTag;
  original: Material | Material[];
  mats: MatState[];
  base: Vector3;
  explodeVec: Vector3 | null;
  baseCastShadow: boolean;
  cur: VisualTarget;
  tgt: VisualTarget;
  pickable: boolean;
}

interface EdgeSet {
  id: ComponentId;
  layer: EdgeLayer;
  lines: LineSegments[];
  material: LineBasicMaterial;
  cur: number;
  tgt: number;
}

const EPS = 1e-4;
const RATE_VISUAL = 11;
const RATE_EXPLODE = 6.5;
const PICK_MIN_OPACITY = 0.3;
/**
 * Internals are mostly metallic and sit in the shadow of their own housings;
 * extra environment reflection keeps them legible once the shells are ghosted.
 */
const INTERNAL_ENV_BOOST = 1.9;

const noRaycast = () => undefined;

function damp(cur: number, tgt: number, rate: number, dt: number): number {
  const d = tgt - cur;
  if (Math.abs(d) < EPS) return tgt;
  return cur + d * (1 - Math.exp(-rate * dt));
}

export class MaterialController {
  readonly states: MeshState[] = [];
  readonly byMesh = new Map<Mesh, MeshState>();
  /** Meshes the pointer may hit: visible and not ghosted. Rebuilt when it changes. */
  readonly pickables: Mesh[] = [];

  /** Keyed by `${componentId}:${layer}`. */
  private edges = new Map<string, EdgeSet>();
  private edgesBuilt = new Set<ComponentId>();
  private edgeGeoCache = new Map<BufferGeometry, EdgesGeometry>();
  private clones: Material[] = [];
  private pickDirty = true;
  private settled = false;
  private index: ViewerModelIndex;

  constructor(index: ViewerModelIndex) {
    this.index = index;
    for (const mesh of index.meshes) {
      const tag = getPartTag(mesh)!;
      const original = mesh.material;
      const list = Array.isArray(original) ? original : [original];
      const mats = list.map((m) => this.cloneMaterial(m, tag.layer === "internal"));
      mesh.material = Array.isArray(original) ? mats.map((s) => s.mat) : mats[0].mat;
      const st: MeshState = {
        mesh,
        tag,
        original,
        mats,
        base: index.basePositions.get(mesh)!,
        explodeVec: index.explodeVectors.get(mesh) ?? null,
        baseCastShadow: mesh.castShadow,
        cur: { opacity: tag.layer === "internal" ? 0 : 1, mute: 0, glow: 0, explode: 0 },
        tgt: { opacity: 1, mute: 0, glow: 0, explode: 0 },
        pickable: false,
      };
      this.states.push(st);
      this.byMesh.set(mesh, st);
      this.write(st);
    }
  }

  private cloneMaterial(src: Material, internal: boolean): MatState {
    const mat = src.clone() as AnimMaterial;
    this.clones.push(mat);
    const baseColor = mat.color ? mat.color.clone() : null;
    let mutedColor: Color | null = null;
    if (baseColor) {
      // Darkened, desaturated, faintly cool — reads as "out of focus" in a dark studio.
      const l = 0.2126 * baseColor.r + 0.7152 * baseColor.g + 0.0722 * baseColor.b;
      const v = Math.min(0.03, 0.008 + l * 0.03);
      mutedColor = new Color(v * 0.94, v, v * 1.08);
    }
    let baseEmissive: Color | null = null;
    if (mat.emissive) {
      baseEmissive = mat.emissive.clone().multiplyScalar(mat.emissiveIntensity ?? 1);
      mat.emissiveIntensity = 1;
    }
    return {
      mat,
      baseColor,
      mutedColor,
      baseEmissive,
      baseOpacity: mat.opacity,
      baseTransparent: mat.transparent,
      baseDepthWrite: mat.depthWrite,
      baseEnvIntensity: (mat.envMapIntensity ?? 1) * (internal ? INTERNAL_ENV_BOOST : 1),
      baseRoughness: mat.roughness ?? 0.5,
    };
  }

  /** Recomputes all targets from new inputs. Cheap; call on store changes only. */
  apply(inputs: VisualInputs): void {
    for (const st of this.states) computeTarget(st.tag, inputs, st.tgt);
    if (inputs.selected) this.ensureEdges(inputs.selected);
    if (inputs.hovered) this.ensureEdges(inputs.hovered);
    for (const id of inputs.highlighted) this.ensureEdges(id);
    for (const set of this.edges.values()) set.tgt = edgeOpacity(inputs, set.id, set.layer);
    this.settled = false;
  }

  /**
   * Advances every animated value. Returns true while anything is still moving
   * (the caller keeps requesting frames). No allocations.
   */
  update(dt: number, instant: boolean): boolean {
    if (this.settled) return false;
    let moving = false;
    const step = Math.min(dt, 0.1);
    for (const st of this.states) {
      const c = st.cur;
      const t = st.tgt;
      if (c.opacity === t.opacity && c.mute === t.mute && c.glow === t.glow && c.explode === t.explode) continue;
      if (instant) {
        c.opacity = t.opacity;
        c.mute = t.mute;
        c.glow = t.glow;
        c.explode = t.explode;
      } else {
        c.opacity = damp(c.opacity, t.opacity, RATE_VISUAL, step);
        c.mute = damp(c.mute, t.mute, RATE_VISUAL, step);
        c.glow = damp(c.glow, t.glow, RATE_VISUAL, step);
        c.explode = damp(c.explode, t.explode, RATE_EXPLODE, step);
      }
      this.write(st);
      moving = true;
    }
    for (const set of this.edges.values()) {
      if (set.cur === set.tgt) continue;
      set.cur = instant ? set.tgt : damp(set.cur, set.tgt, RATE_VISUAL, step);
      set.material.opacity = set.cur;
      const vis = set.cur > 0.004;
      for (const l of set.lines) l.visible = vis;
      moving = true;
    }
    if (this.pickDirty) this.rebuildPickables();
    if (!moving) this.settled = true;
    return moving;
  }

  private write(st: MeshState): void {
    const { mesh, cur } = st;
    mesh.visible = cur.opacity > 0.002;
    mesh.castShadow = st.baseCastShadow && cur.opacity > 0.55;
    const pickable = mesh.visible && cur.opacity >= PICK_MIN_OPACITY && st.tgt.opacity >= PICK_MIN_OPACITY;
    if (pickable !== st.pickable) {
      st.pickable = pickable;
      this.pickDirty = true;
    }
    if (st.explodeVec) mesh.position.copy(st.base).addScaledVector(st.explodeVec, cur.explode);

    const keep = 1 - cur.mute * 0.85;
    // Ease-out curve: moderate mute values already read as clearly darker.
    const inv = 1 - cur.mute;
    const colorT = 1 - inv * inv * inv;
    for (const ms of st.mats) {
      const m = ms.mat;
      if (m.color && ms.baseColor && ms.mutedColor) m.color.copy(ms.baseColor).lerp(ms.mutedColor, colorT);
      if (m.emissive && ms.baseEmissive) {
        const e = ms.baseEmissive;
        m.emissive.setRGB(
          e.r * keep + ACCENT.r * cur.glow,
          e.g * keep + ACCENT.g * cur.glow,
          e.b * keep + ACCENT.b * cur.glow,
        );
      }
      if (m.envMapIntensity !== undefined) m.envMapIntensity = ms.baseEnvIntensity * (1 - 0.8 * cur.mute);
      // Rougher when muted so key-light speculars don't keep de-emphasised parts bright.
      if (m.roughness !== undefined) m.roughness = ms.baseRoughness + (0.92 - ms.baseRoughness) * cur.mute;
      m.opacity = ms.baseOpacity * cur.opacity;
      const transparent = ms.baseTransparent || cur.opacity < 0.999;
      if (transparent !== m.transparent) {
        m.transparent = transparent;
        m.needsUpdate = true;
      }
      m.depthWrite = ms.baseDepthWrite && cur.opacity > 0.6;
    }
  }

  private rebuildPickables(): void {
    this.pickables.length = 0;
    for (const st of this.states) if (st.pickable) this.pickables.push(st.mesh);
    this.pickDirty = false;
  }

  /** Lazily builds accent edge lines for one assembly (cached until dispose). */
  private ensureEdges(id: ComponentId): void {
    if (this.edgesBuilt.has(id)) return;
    this.edgesBuilt.add(id);
    const meshes = this.index.byComponent.get(id) ?? [];
    const armor = meshes.filter((m) => getPartTag(m)!.layer === "armor");
    const frame = meshes.filter((m) => getPartTag(m)!.layer === "frame");
    // An assembly without shells (e.g. internals only) is outlined as "armor".
    if (armor.length === 0 && frame.length === 0) this.buildEdgeSet(id, "armor", meshes);
    else {
      if (armor.length > 0) this.buildEdgeSet(id, "armor", armor);
      if (frame.length > 0) this.buildEdgeSet(id, "frame", frame);
    }
  }

  private buildEdgeSet(id: ComponentId, layer: EdgeLayer, source: Mesh[]): void {
    const material = new LineBasicMaterial({
      color: ACCENT,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      toneMapped: false,
    });
    const lines: LineSegments[] = [];
    for (const mesh of source) {
      let geo = this.edgeGeoCache.get(mesh.geometry);
      if (!geo) {
        geo = new EdgesGeometry(mesh.geometry, 35);
        this.edgeGeoCache.set(mesh.geometry, geo);
      }
      const line = new LineSegments(geo, material);
      line.name = "xi-edges";
      line.raycast = noRaycast;
      line.visible = false;
      line.renderOrder = 2;
      mesh.add(line);
      lines.push(line);
    }
    this.edges.set(`${id}:${layer}`, { id, layer, lines, material, cur: 0, tgt: 0 });
  }

  /** World-space bounds of the given meshes in their *current* (possibly exploded) pose. */
  static currentBounds(meshes: Mesh[], out: Box3, tmp: Box3): Box3 {
    out.makeEmpty();
    for (const m of meshes) {
      if (!m.geometry.boundingBox) m.geometry.computeBoundingBox();
      tmp.copy(m.geometry.boundingBox!).applyMatrix4(m.matrixWorld);
      out.union(tmp);
    }
    return out;
  }

  dispose(): void {
    for (const set of this.edges.values()) {
      for (const l of set.lines) l.removeFromParent();
      set.material.dispose();
    }
    for (const g of this.edgeGeoCache.values()) g.dispose();
    this.edges.clear();
    this.edgesBuilt.clear();
    this.edgeGeoCache.clear();
    for (const st of this.states) {
      st.mesh.material = st.original;
      st.mesh.position.copy(st.base);
      st.mesh.visible = true;
      st.mesh.castShadow = st.baseCastShadow;
    }
    for (const m of this.clones) m.dispose();
    this.clones.length = 0;
    this.pickables.length = 0;
  }
}
