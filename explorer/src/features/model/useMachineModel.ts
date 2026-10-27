import { useEffect, useState } from "react";
import { Group, type Object3D } from "three";
import { modelConfig, proceduralModel } from "@/data/modelConfig";
import { useExplorerStore } from "@/state/explorerStore";
import { buildModelIndex, disposeObject, type ViewerModelIndex } from "./annotateModel";
import { applyMeshRules, enableShadows, loadGltf, normaliseModel } from "./loadModel";

/**
 * Builds (procedural) or loads (GLB) the machine once, indexes it and publishes
 * status + capabilities to the store.
 *
 * The model is shared through a small ref-counted cache so React StrictMode's
 * mount → unmount → mount cycle reuses the same build instead of building twice;
 * disposal happens one task after the last consumer releases it.
 */

interface Entry {
  promise: Promise<ViewerModelIndex>;
  refs: number;
  disposeTimer: ReturnType<typeof setTimeout> | null;
  model: ViewerModelIndex | null;
}

let entry: Entry | null = null;

/** Builds the procedural prototype; a build with no meshes is reported as an error. */
async function buildProcedural(): Promise<Object3D> {
  const root = proceduralModel.build();
  let meshes = 0;
  root.traverse((o) => {
    if ((o as { isMesh?: boolean }).isMesh) meshes++;
  });
  if (meshes === 0) {
    proceduralModel.dispose(root);
    throw new Error("the procedural build produced no meshes");
  }
  return root;
}

async function produce(): Promise<ViewerModelIndex> {
  const { setModelStatus, setCapabilities } = useExplorerStore.getState();
  const source = modelConfig.source;
  let root: Object3D;
  let note: string | undefined;

  if (source === "gltf") {
    setModelStatus({ state: "loading", source, progress: 0 });
    try {
      const scene = await loadGltf(modelConfig.gltfUrl, (p) =>
        useExplorerStore.getState().setModelStatus({ state: "loading", source, progress: p }),
      );
      const wrapper = new Group();
      wrapper.name = "gltf-root";
      wrapper.add(scene);
      applyMeshRules(scene, modelConfig.meshRules);
      normaliseModel(scene, modelConfig.targetHeight);
      enableShadows(scene);
      root = wrapper;
    } catch (err) {
      if (!modelConfig.fallbackToProcedural) {
        const message = err instanceof Error ? err.message : String(err);
        setModelStatus({ state: "error", source, message: `Could not load ${modelConfig.gltfUrl}: ${message}` });
        throw err;
      }
      root = await buildProcedural();
      note = `Could not load ${modelConfig.gltfUrl}; showing the ${modelConfig.label.toLowerCase()} instead.`;
    }
  } else {
    setModelStatus({ state: "loading", source, progress: 0 });
    // Yield a frame so the loading state can paint before the synchronous build.
    await new Promise((r) => setTimeout(r, 0));
    try {
      root = await buildProcedural();
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setModelStatus({ state: "error", source, message: `Procedural build failed: ${message}` });
      throw err;
    }
  }

  const index = buildModelIndex(root);
  setCapabilities(index.capabilities);
  setModelStatus(note ? { state: "ready", source: "procedural", note } : { state: "ready", source });
  return index;
}

function acquire(): Entry {
  if (!entry) {
    const e: Entry = { promise: produce(), refs: 0, disposeTimer: null, model: null };
    e.promise.then(
      (m) => (e.model = m),
      () => undefined,
    );
    entry = e;
  }
  if (entry.disposeTimer) {
    clearTimeout(entry.disposeTimer);
    entry.disposeTimer = null;
  }
  entry.refs++;
  return entry;
}

function release(e: Entry): void {
  e.refs--;
  if (e.refs > 0 || e.disposeTimer) return;
  e.disposeTimer = setTimeout(() => {
    if (e.refs > 0) return;
    if (entry === e) entry = null;
    e.promise.then(
      (m) => {
        // Procedural roots also own palette materials that may sit on no mesh.
        if (m.root.name === proceduralModel.rootName) proceduralModel.dispose(m.root);
        else disposeObject(m.root);
      },
      () => undefined,
    );
  }, 0);
}

export function useMachineModel(): ViewerModelIndex | null {
  const [model, setModel] = useState<ViewerModelIndex | null>(() => entry?.model ?? null);

  useEffect(() => {
    const e = acquire();
    let alive = true;
    e.promise.then(
      (m) => alive && setModel(m),
      () => undefined,
    );
    return () => {
      alive = false;
      release(e);
    };
  }, []);

  return model;
}
