let cached: boolean | null = null;

/** Detects WebGL 2 once per page load and caches the answer. */
export function hasWebGL2(): boolean {
  if (cached !== null) return cached;
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2");
    cached = !!gl;
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    cached = false;
  }
  return cached;
}

/** Hook form for components; the value never changes during a session. */
export function useWebGLSupport(): boolean {
  return typeof document === "undefined" ? true : hasWebGL2();
}
