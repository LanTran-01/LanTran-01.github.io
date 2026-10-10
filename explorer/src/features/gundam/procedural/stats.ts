import { Box3, type BufferGeometry, type Mesh, type Object3D } from "three";
import type { ComponentId } from "@/data/types";
import { getPartTag } from "../modelTypes";

export interface ComponentStats {
  meshes: number;
  triangles: number;
  armor: number;
  frame: number;
  internal: number;
  subassemblies: string[];
  /** World-space bounds at rest: centre and size. */
  centre: [number, number, number];
  size: [number, number, number];
}

export interface ModelStats {
  meshes: number;
  untagged: number;
  triangles: number;
  geometries: number;
  bounds: { min: [number, number, number]; max: [number, number, number] };
  byComponent: Partial<Record<ComponentId, ComponentStats>>;
}

function triangles(g: BufferGeometry): number {
  return Math.round((g.index ? g.index.count : g.getAttribute("position").count) / 3);
}

const r3 = (v: { x: number; y: number; z: number }): [number, number, number] => [
  +v.x.toFixed(3),
  +v.y.toFixed(3),
  +v.z.toFixed(3),
];

/** Budget / coverage report for a built model (used by the harness and tests). */
export function measureModel(root: Object3D): ModelStats {
  root.updateMatrixWorld(true);
  const byComponent: Partial<Record<ComponentId, ComponentStats>> = {};
  const boxes = new Map<ComponentId, Box3>();
  const geos = new Set<BufferGeometry>();
  let meshes = 0;
  let untagged = 0;
  let tris = 0;
  root.traverse((o) => {
    const mesh = o as Mesh;
    if (!mesh.isMesh) return;
    meshes++;
    geos.add(mesh.geometry);
    const t = triangles(mesh.geometry);
    tris += t;
    const tag = getPartTag(mesh);
    if (!tag) {
      untagged++;
      return;
    }
    const c = (byComponent[tag.componentId] ??= {
      meshes: 0,
      triangles: 0,
      armor: 0,
      frame: 0,
      internal: 0,
      subassemblies: [],
      centre: [0, 0, 0],
      size: [0, 0, 0],
    });
    c.meshes++;
    c.triangles += t;
    c[tag.layer]++;
    if (tag.subassemblyId && !c.subassemblies.includes(tag.subassemblyId)) c.subassemblies.push(tag.subassemblyId);
    const box = boxes.get(tag.componentId) ?? new Box3();
    box.expandByObject(mesh);
    boxes.set(tag.componentId, box);
  });
  for (const [id, box] of boxes) {
    const c = byComponent[id]!;
    c.centre = r3(box.getCenter(box.min.clone()));
    c.size = r3(box.getSize(box.min.clone()));
  }
  const all = new Box3().setFromObject(root);
  return {
    meshes,
    untagged,
    triangles: tris,
    geometries: geos.size,
    bounds: { min: r3(all.min), max: r3(all.max) },
    byComponent,
  };
}
