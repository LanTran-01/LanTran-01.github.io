import { Box3, Matrix3, Mesh, Vector3, type Object3D } from "three";
import { COMPONENT_IDS, COMPONENTS, walkSubassemblies } from "@/data/components";
import type { ComponentId } from "@/data/types";
import { getPartTag, type ComponentCapabilities, type ModelIndex } from "./modelTypes";

/** ModelIndex plus the viewer-only data needed to animate and frame the model. */
export interface ViewerModelIndex extends ModelIndex {
  /** Rest position (parent-local) per mesh, so exploded offsets are always recoverable. */
  basePositions: Map<Mesh, Vector3>;
  /** Parent-local explode offset per mesh at explode = 1 (only meshes that have one). */
  explodeVectors: Map<Mesh, Vector3>;
  /** World-space bounds of every tagged mesh at rest. */
  overall: Box3;
  /** World-space bounds of every tagged mesh fully exploded (explode = 1). */
  overallExploded: Box3;
  /** Number of tagged meshes (0 means the build produced nothing usable). */
  taggedCount: number;
}

function isMesh(o: Object3D): o is Mesh {
  return (o as Mesh).isMesh === true;
}

/**
 * Walks a model whose meshes carry PartTags and builds the lookup tables the
 * viewer and UI rely on. Untagged meshes are left alone (rendered, never selectable).
 */
export function buildModelIndex(root: Object3D): ViewerModelIndex {
  root.updateMatrixWorld(true);

  const meshes: Mesh[] = [];
  const byComponent = new Map<ComponentId, Mesh[]>();
  const bySubassembly = new Map<string, Mesh[]>();
  const bounds = new Map<ComponentId, Box3>();
  const explodedBounds = new Map<ComponentId, Box3>();
  const basePositions = new Map<Mesh, Vector3>();
  const explodeVectors = new Map<Mesh, Vector3>();
  const overall = new Box3();
  const overallExploded = new Box3();
  const tmp = new Box3();
  const worldOffset = new Vector3();
  const linear = new Matrix3();

  root.traverse((o) => {
    if (!isMesh(o)) return;
    const tag = getPartTag(o);
    if (!tag) return;
    meshes.push(o);

    let list = byComponent.get(tag.componentId);
    if (!list) byComponent.set(tag.componentId, (list = []));
    list.push(o);

    if (tag.subassemblyId) {
      let subs = bySubassembly.get(tag.subassemblyId);
      if (!subs) bySubassembly.set(tag.subassemblyId, (subs = []));
      subs.push(o);
    }

    basePositions.set(o, o.position.clone());
    const e = tag.explode;
    if (e && (e[0] !== 0 || e[1] !== 0 || e[2] !== 0)) explodeVectors.set(o, new Vector3(e[0], e[1], e[2]));

    if (!o.geometry.boundingBox) o.geometry.computeBoundingBox();
    tmp.copy(o.geometry.boundingBox!).applyMatrix4(o.matrixWorld);
    let b = bounds.get(tag.componentId);
    if (!b) bounds.set(tag.componentId, (b = new Box3()));
    b.union(tmp);
    overall.union(tmp);

    // The explode offset is parent-local; move the rest box by its world-space equivalent.
    const vec = explodeVectors.get(o);
    if (vec) {
      worldOffset.copy(vec);
      if (o.parent) worldOffset.applyMatrix3(linear.setFromMatrix4(o.parent.matrixWorld));
      tmp.translate(worldOffset);
    }
    let eb = explodedBounds.get(tag.componentId);
    if (!eb) explodedBounds.set(tag.componentId, (eb = new Box3()));
    eb.union(tmp);
    overallExploded.union(tmp);
  });

  const capabilities = {} as Record<ComponentId, ComponentCapabilities>;
  for (const spec of COMPONENTS) {
    const list = byComponent.get(spec.id) ?? [];
    // A subassembly "has meshes" when it or any descendant is tagged on a mesh.
    const subs: string[] = [];
    const hasMeshes = (id: string, children?: typeof spec.subassemblies): boolean => {
      if (bySubassembly.has(id)) return true;
      if (!children) return false;
      return children.some((c) => hasMeshes(c.id, c.children));
    };
    walkSubassemblies(spec.subassemblies, (node) => {
      if (hasMeshes(node.id, node.children)) subs.push(node.id);
    });
    capabilities[spec.id] = {
      cutaway: list.some((m) => getPartTag(m)!.layer === "internal"),
      exterior: list.some((m) => getPartTag(m)!.layer !== "internal"),
      exploded: list.some((m) => explodeVectors.has(m)),
      subassemblies: subs,
    };
  }
  for (const id of COMPONENT_IDS) {
    if (!bounds.has(id)) bounds.set(id, new Box3());
    if (!explodedBounds.has(id)) explodedBounds.set(id, new Box3());
  }

  return {
    root,
    meshes,
    byComponent,
    bySubassembly,
    bounds,
    explodedBounds,
    capabilities,
    basePositions,
    explodeVectors,
    overall,
    overallExploded,
    taggedCount: meshes.length,
  };
}

/** Disposes every geometry, material and texture under `root`. */
export function disposeObject(root: Object3D): void {
  root.traverse((o) => {
    if (!isMesh(o)) return;
    o.geometry?.dispose();
    const mats = Array.isArray(o.material) ? o.material : [o.material];
    for (const m of mats) {
      if (!m) continue;
      for (const value of Object.values(m)) {
        if (value && typeof value === "object" && (value as { isTexture?: boolean }).isTexture) {
          (value as { dispose: () => void }).dispose();
        }
      }
      m.dispose();
    }
  });
}
