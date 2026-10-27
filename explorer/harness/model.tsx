/* eslint-disable react-refresh/only-export-components -- standalone harness entry, not an HMR module */
/**
 * Standalone harness for the procedural model of the machine being built
 * (`MACHINE=<id>`, see vite.config.ts).
 *
 *   /harness/model.html?view=front|side|side-r|back|three-quarter|three-quarter-r|rear-three-quarter|top
 *                      &explode=0..1      apply explode offsets
 *                      &layer=internal    hide armor (internal-only also hides frame;
 *                                         exterior hides internals, like the viewer's exterior mode)
 *                      &focus=<id>        dim other components and frame this one
 *                      &frame=<id>        frame a component without dimming
 *                      &hide=a,b          hide components
 *                      &sub=<subId>       tint one subassembly cyan
 *                      &probe=1           paint internals magenta (find poke-through)
 *                      &zoom=1            distance multiplier
 *
 * Exposes `window.__xiStats` (mesh / triangle budget, bounds) and
 * `window.__xiCoverage` (subassembly id coverage vs data/components.ts).
 */
import { useEffect, useMemo } from "react";
import { createRoot } from "react-dom/client";
import { Canvas, useThree } from "@react-three/fiber";
import { Environment, Lightformer, OrbitControls } from "@react-three/drei";
import { Box3, Color, Sphere, Vector3, type Mesh, type MeshStandardMaterial, type Object3D } from "three";
import { proceduralModel } from "@/data/modelConfig";
import { measureModel } from "@/features/model/stats";
import { getPartTag } from "@/features/model/modelTypes";
import { COMPONENTS } from "@/data/components";
import type { ComponentId, Subassembly } from "@/data/types";

const q = new URLSearchParams(window.location.search);
const explode = Math.max(0, Math.min(1, Number(q.get("explode") ?? 0)));
const layer = q.get("layer");
const focus = q.get("focus") as ComponentId | null;
const frameId = (q.get("frame") as ComponentId | null) ?? focus;
const hide = new Set((q.get("hide") ?? "").split(",").filter(Boolean));
const sub = q.get("sub");
const probe = q.get("probe") === "1";
const zoom = Number(q.get("zoom") ?? 1);
const view = q.get("view") ?? "three-quarter";

const VIEWS: Record<string, [number, number, number]> = {
  front: [0, 0.08, 1],
  side: [1, 0.06, 0],
  "side-r": [-1, 0.06, 0],
  back: [0, 0.12, -1],
  "three-quarter": [0.8, 0.22, 1],
  "three-quarter-r": [-0.8, 0.22, 1],
  "rear-three-quarter": [0.8, 0.3, -1],
  top: [0.0001, 1, 0.25],
};

declare global {
  interface Window {
    __xiStats?: unknown;
    __xiCoverage?: unknown;
  }
}

function coverage(root: Object3D) {
  const used = new Map<string, Set<string>>();
  root.traverse((o) => {
    const t = getPartTag(o);
    if (!t?.subassemblyId) return;
    const s = used.get(t.componentId) ?? new Set<string>();
    s.add(t.subassemblyId);
    used.set(t.componentId, s);
  });
  const missingLeaves: string[] = [];
  const invalid: string[] = [];
  for (const c of COMPONENTS) {
    const all = new Set<string>();
    const leaves: string[] = [];
    const walk = (list: Subassembly[]) =>
      list.forEach((s) => {
        all.add(s.id);
        if (s.children?.length) walk(s.children);
        else leaves.push(s.id);
      });
    walk(c.subassemblies);
    const u = used.get(c.id) ?? new Set<string>();
    leaves.forEach((l) => !u.has(l) && missingLeaves.push(`${c.id}:${l}`));
    u.forEach((id) => !all.has(id) && invalid.push(`${c.id}:${id}`));
  }
  return { missingLeaves, invalid };
}

function prepare(root: Object3D) {
  root.traverse((o) => {
    const mesh = o as Mesh;
    if (!mesh.isMesh) return;
    const tag = getPartTag(mesh);
    if (!tag) return;
    // Per-mesh clone, like the viewer.
    const mat = (mesh.material as MeshStandardMaterial).clone();
    mesh.material = mat;
    if (tag.explode && explode > 0) {
      mesh.position.x += tag.explode[0] * explode;
      mesh.position.y += tag.explode[1] * explode;
      mesh.position.z += tag.explode[2] * explode;
    }
    if (hide.has(tag.componentId)) mesh.visible = false;
    if ((layer === "internal" || layer === "internal-only") && tag.layer === "armor") mesh.visible = false;
    if (layer === "internal-only" && tag.layer === "frame") mesh.visible = false;
    if (layer === "exterior" && tag.layer === "internal") mesh.visible = false;
    if (probe && tag.layer === "internal") {
      mat.color = new Color("#ff00ff");
      mat.emissive = new Color("#ff00ff");
      mat.emissiveIntensity = 0.6;
    }
    if (sub && tag.subassemblyId === sub) {
      mat.emissive = new Color("#63c7ff");
      mat.emissiveIntensity = 0.7;
    }
    if (focus && tag.componentId !== focus) {
      mat.transparent = true;
      mat.opacity = 0.07;
      mat.depthWrite = false;
    }
  });
}

function framing(root: Object3D): { centre: Vector3; radius: number } {
  root.updateMatrixWorld(true);
  const box = new Box3();
  root.traverse((o) => {
    const mesh = o as Mesh;
    if (!mesh.isMesh || !mesh.visible) return;
    const tag = getPartTag(mesh);
    if (frameId && tag?.componentId !== frameId) return;
    box.expandByObject(mesh);
  });
  const s = box.getBoundingSphere(new Sphere());
  return { centre: s.center, radius: s.radius };
}

function Model() {
  const root = useMemo(() => {
    const r = proceduralModel.build();
    const stats = measureModel(r);
    window.__xiStats = stats;
    window.__xiCoverage = coverage(r);
    prepare(r);
    const el = document.getElementById("stats");
    if (el) {
      const cov = window.__xiCoverage as ReturnType<typeof coverage>;
      el.textContent =
        `meshes ${stats.meshes}  tris ${stats.triangles}  geos ${stats.geometries}  untagged ${stats.untagged}\n` +
        `bounds y ${stats.bounds.min[1]}..${stats.bounds.max[1]}  x ${stats.bounds.min[0]}..${stats.bounds.max[0]}  z ${stats.bounds.min[2]}..${stats.bounds.max[2]}\n` +
        `missing ${cov.missingLeaves.length ? cov.missingLeaves.join(" ") : "none"}  invalid ${cov.invalid.length ? cov.invalid.join(" ") : "none"}\n` +
        `view ${view}  explode ${explode}  layer ${layer ?? "all"}${focus ? `  focus ${focus}` : ""}${frameId && !focus ? `  frame ${frameId}` : ""}`;
    }
    return r;
  }, []);
  useEffect(() => () => proceduralModel.dispose(root), [root]);
  return <primitive object={root} />;
}

function CameraRig() {
  const { camera, scene, controls } = useThree();
  useEffect(() => {
    const root = scene.getObjectByName(proceduralModel.rootName);
    if (!root) return;
    const { centre, radius } = framing(root);
    const dir = new Vector3(...(VIEWS[view] ?? VIEWS["three-quarter"])).normalize();
    const fov = (30 * Math.PI) / 180;
    const dist = (radius / Math.sin(fov / 2)) * 0.9 * zoom;
    camera.position.copy(centre).addScaledVector(dir, dist);
    camera.lookAt(centre);
    const c = controls as unknown as { target: Vector3; update: () => void } | null;
    if (c) {
      c.target.copy(centre);
      c.update();
    }
  }, [camera, scene, controls]);
  return null;
}

function App() {
  return (
    <Canvas dpr={[1, 2]} camera={{ fov: 30, near: 0.05, far: 200, position: [6, 4, 14] }} gl={{ antialias: true }}>
      <color attach="background" args={["#07080a"]} />
      <hemisphereLight args={["#dfe8f2", "#0b0d10", 0.55]} />
      <directionalLight position={[5, 9, 7]} intensity={2.3} />
      <directionalLight position={[-6, 4, -6]} intensity={1.1} color="#cfe6ff" />
      <directionalLight position={[-4, 2, 6]} intensity={0.5} />
      <Environment resolution={128}>
        <Lightformer form="rect" intensity={1.6} position={[0, 6, 4]} scale={[10, 3, 1]} />
        <Lightformer form="rect" intensity={0.8} position={[-6, 3, -2]} rotation-y={Math.PI / 2} scale={[8, 4, 1]} />
        <Lightformer form="rect" intensity={0.5} position={[6, 2, -4]} rotation-y={-Math.PI / 2} scale={[8, 3, 1]} />
      </Environment>
      <gridHelper args={[24, 48, "#1c2229", "#12161b"]} />
      <Model />
      <OrbitControls makeDefault />
      <CameraRig />
    </Canvas>
  );
}

// No StrictMode: the model is built once and disposed on unmount.
createRoot(document.getElementById("root")!).render(<App />);
