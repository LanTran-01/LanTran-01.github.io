import { Group, type BufferGeometry, type Material, type Mesh, type Object3D } from "three";
import { buildAirframe } from "./airframe";
import { buildEngine } from "./engine";
import { buildFins } from "./fins";
import { buildFiringTable } from "./firingTable";
import { buildInterior } from "./interior";
import { SCALE, TABLE_H } from "./layout";
import { createV2Materials, materialList } from "./materials";
import { Kit, group } from "./primitives";
import { buildUpperStage } from "./upperStage";

/** Original shared materials per built root (meshes may later hold viewer clones). */
const ownedMaterials = new WeakMap<Object3D, Material[]>();

/**
 * Procedural V-2 (A-4) exhibit in its Bumper-WAC configuration: the V-2
 * booster with a WAC Corporal upper stage in its nose, standing on its firing
 * table, with the equipment inside on the internal layer.
 * Y up, front (+Z) towards the default camera, fins in an X seen from the
 * front. Geometry is authored in metres under a group scaled to scene units
 * (`SCALE`), so explode offsets are in metres too; the viewer converts them
 * through the parent's world matrix. Every mesh carries a `PartTag`
 * (`userData.xi`) with component, layer, subassembly and explode offset.
 *
 * Release everything with `disposeV2(root)`.
 */
export function buildV2(): Group {
  const materials = createV2Materials();
  const kit = new Kit(materials);
  const root = new Group();
  root.name = "v2-procedural";

  const exhibit = group(root, "exhibit");
  exhibit.scale.setScalar(SCALE);
  const table = group(exhibit, "firing_table");
  const rocket = group(exhibit, "rocket", [0, TABLE_H, 0]);

  buildFiringTable(kit, table);
  buildAirframe(kit, rocket);
  buildFins(kit, rocket);
  buildEngine(kit, rocket);
  buildUpperStage(kit, rocket);
  buildInterior(kit, rocket);

  kit.finish();
  root.updateMatrixWorld(true);
  ownedMaterials.set(root, materialList(materials));
  return root;
}

/** Disposes every geometry and material reachable from `root` (each once), plus the palette. */
export function disposeV2(root: Object3D): void {
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
