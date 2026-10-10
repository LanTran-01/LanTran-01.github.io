import { Box3, Group, Vector3, type Mesh, type Object3D } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import type { MeshRule } from "@/data/modelConfig";
import { getPartTag, setPartTag } from "./modelTypes";

/**
 * Loads a GLB/GLTF and returns its scene. `onProgress` receives 0..1 when the
 * server reports a content length.
 */
export function loadGltf(url: string, onProgress?: (p: number) => void, signal?: AbortSignal): Promise<Group> {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(
      url,
      (gltf) => {
        if (signal?.aborted) return;
        resolve(gltf.scene);
      },
      (ev) => {
        if (ev.lengthComputable && ev.total > 0) onProgress?.(Math.min(1, ev.loaded / ev.total));
      },
      (err) => reject(err instanceof Error ? err : new Error(String(err))),
    );
  });
}

/**
 * Tags every untagged mesh by testing `rules` against the mesh name, then each
 * ancestor's name (nearest first). Returns the number of meshes tagged.
 */
export function applyMeshRules(root: Object3D, rules: MeshRule[]): number {
  let count = 0;
  root.traverse((o) => {
    if (!(o as Mesh).isMesh || getPartTag(o)) return;
    for (let node: Object3D | null = o; node && node !== root.parent; node = node.parent) {
      const name = node.name;
      if (!name) continue;
      const rule = rules.find((r) => r.match.test(name));
      if (rule) {
        setPartTag(o, { componentId: rule.componentId, layer: rule.layer ?? "armor", subassemblyId: rule.subassemblyId });
        count++;
        return;
      }
    }
  });
  return count;
}

/**
 * Uniformly scales `root` so its height equals `targetHeight`, then puts the
 * lowest point on y = 0 and centres it on x/z. Mutates the root transform only.
 */
export function normaliseModel(root: Object3D, targetHeight: number): void {
  root.updateMatrixWorld(true);
  const box = new Box3().setFromObject(root);
  const size = box.getSize(new Vector3());
  if (size.y <= 0 || !Number.isFinite(size.y)) return;
  const s = targetHeight / size.y;
  root.scale.multiplyScalar(s);
  root.updateMatrixWorld(true);
  box.setFromObject(root);
  const c = box.getCenter(new Vector3());
  root.position.x -= c.x;
  root.position.z -= c.z;
  root.position.y -= box.min.y;
  root.updateMatrixWorld(true);
}

/** Enables shadows on every mesh (GLBs rarely ship with the flags set). */
export function enableShadows(root: Object3D): void {
  root.traverse((o) => {
    if ((o as Mesh).isMesh) {
      o.castShadow = true;
      o.receiveShadow = true;
    }
  });
}
