import { Group, type BufferGeometry, type Material, type Mesh, type Object3D } from "three";
import { buildAdcs } from "./adcs";
import { buildAntenna } from "./antenna";
import { buildAvionics } from "./avionics";
import { createCubeSatMaterials, materialList } from "./materials";
import { buildPayload } from "./payload";
import { buildPower } from "./power";
import { Kit } from "./primitives";
import { buildStructure } from "./structure";

/** Original shared materials per built root (meshes may later hold viewer clones). */
const ownedMaterials = new WeakMap<Object3D, Material[]>();

/**
 * Procedural illustrative 3U CubeSat — a generic educational design, not a
 * specific spacecraft. Y up, long axis vertical, payload looking down (−Y),
 * front (+Z) towards the default camera. Every mesh carries a `PartTag`
 * (`userData.xi`) with component, layer, subassembly and a parent-local
 * explode offset.
 *
 * Release everything with `disposeCubeSat(root)`.
 */
export function buildCubeSat(): Group {
  const materials = createCubeSatMaterials();
  const kit = new Kit(materials);
  const root = new Group();
  root.name = "cubesat-procedural";

  buildStructure(kit, root);
  buildPayload(kit, root);
  buildAdcs(kit, root);
  buildPower(kit, root);
  buildAvionics(kit, root);
  buildAntenna(kit, root);

  kit.finish();
  root.updateMatrixWorld(true);
  ownedMaterials.set(root, materialList(materials));
  return root;
}

/** Disposes every geometry and material reachable from `root` (each once), plus the palette. */
export function disposeCubeSat(root: Object3D): void {
  const geos = new Set<BufferGeometry>();
  const mats = new Set<Material>(ownedMaterials.get(root) ?? []);
  root.traverse((o) => {
    const mesh = o as Mesh;
    if (!mesh.isMesh) return;
    geos.add(mesh.geometry);
    const mm = mesh.material;
    if (Array.isArray(mm)) mm.forEach((x) => mats.add(x));
    else if (mm) mats.add(mm);
  });
  geos.forEach((g) => g.dispose());
  mats.forEach((m) => m.dispose());
  ownedMaterials.delete(root);
}
