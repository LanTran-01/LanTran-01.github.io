import type { ModelSource } from "@/data/modelConfig";

/** Initial model source: `?model=gltf` or a `VITE_MODEL_URL` build switch to the GLB. */
export function initialModelSource(): ModelSource {
  const query = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
  return query?.get("model") === "gltf" || modelUrlOverride() ? "gltf" : "procedural";
}

/** GLB URL baked in at build time, if any. */
export function modelUrlOverride(): string | undefined {
  return import.meta.env.VITE_MODEL_URL as string | undefined;
}
