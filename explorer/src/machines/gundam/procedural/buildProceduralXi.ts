import { Group, type BufferGeometry, type Material, type Mesh, type Object3D } from "three";
import { buildArms } from "./arms";
import { buildBackpack } from "./backpack";
import { buildHead } from "./head";
import { buildLegs } from "./legs";
import { createXiMaterials, materialList } from "./materials";
import { Kit } from "./primitives";
import { buildShoulders } from "./shoulders";
import { buildTorso } from "./torso";
import { buildWaist } from "./waist";
import { buildRifle, seatRifle } from "./weapons";

/** Original shared materials per built root (meshes may later hold viewer clones). */
const ownedMaterials = new WeakMap<Object3D, Material[]>();

/**
 * Procedural RX-105 Ξ prototype — a silhouette study built from primitives,
 * not an accurate model. Height ≈ 6 units, feet on y = 0, faces +Z, machine's
 * right at −X. Every mesh carries a `PartTag` (`userData.xi`) with component,
 * layer, subassembly and a parent-local explode offset; internal hardware is a
 * conceptual visualization.
 *
 * Geometries are shared between meshes (mirrored sides, repeated parts), and
 * materials are shared palette instances. Release everything with
 * `disposeProceduralXi(root)`.
 */
export function buildProceduralXi(): Group {
  const materials = createXiMaterials();
  const kit = new Kit(materials);
  const root = new Group();
  root.name = "xi-procedural";

  buildLegs(kit, root);
  buildWaist(kit, root);
  buildTorso(kit, root);
  buildHead(kit, root);
  buildShoulders(kit, root);
  const { gripAnchor } = buildArms(kit, root);
  buildBackpack(kit, root);

  const rifle = buildRifle(kit, root);
  root.updateMatrixWorld(true);
  seatRifle(rifle, gripAnchor);

  kit.finish();
  root.updateMatrixWorld(true);
  ownedMaterials.set(root, materialList(materials));
  return root;
}

/**
 * Dispose every geometry and material reachable from `root` (each once), plus
 * the original palette materials even if meshes now hold clones.
 */
export function disposeProceduralXi(root: Object3D): void {
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
