import { Group, type BufferGeometry, type Material, type Mesh, type Object3D } from "three";
import { buildAirframe } from "./airframe";
import { BASE_Y, SCALE } from "./layout";
import { createDerbyMaterials, materialList } from "./materials";
import { Kit, group } from "./primitives";
import { buildSurfaces } from "./surfaces";

/** Original shared materials per built root (meshes may later hold viewer clones). */
const ownedMaterials = new WeakMap<Object3D, Material[]>();

/**
 * Procedural Derby exhibit: the missile standing upright on its tail, nose
 * up, centred on the origin. It is authored along Y in metres and the exhibit
 * group scales metres to scene units, so explode offsets are in metres along
 * the missile. Every mesh carries a `PartTag` (`userData.xi`).
 *
 * Release everything with `disposeDerby(root)`.
 */
export function buildDerby(): Group {
  const materials = createDerbyMaterials();
  const kit = new Kit(materials);
  const root = new Group();
  root.name = "derby-procedural";

  const exhibit = group(root, "exhibit");
  exhibit.scale.setScalar(SCALE);
  const body = group(exhibit, "missile", [0, BASE_Y, 0]);

  buildAirframe(kit, body);
  buildSurfaces(kit, body);

  kit.finish();
  root.updateMatrixWorld(true);
  ownedMaterials.set(root, materialList(materials));
  return root;
}

/** Disposes every geometry and material reachable from `root` (each once), plus the palette. */
export function disposeDerby(root: Object3D): void {
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
