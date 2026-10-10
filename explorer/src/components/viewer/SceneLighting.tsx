import { useEffect, useRef } from "react";
import type { DirectionalLight } from "three";
import { Environment, Lightformer } from "@react-three/drei";

/**
 * Dark-studio lighting tuned for off-white armor: a warm-neutral key with soft
 * shadows, a cool low fill, a strong rim to separate the silhouette from the
 * background, and a locally generated environment (Lightformers only — no
 * remote HDRIs) for soft specular reflections.
 */
export function SceneLighting() {
  const key = useRef<DirectionalLight>(null);

  useEffect(() => {
    const light = key.current;
    if (!light) return;
    light.target.position.set(0, 2.6, 0);
    light.target.updateMatrixWorld();
  }, []);

  return (
    <>
      <hemisphereLight args={["#dfe8f2", "#0a0b0d", 0.32]} />
      <directionalLight
        ref={key}
        position={[4.5, 9, 6]}
        intensity={2.1}
        color="#fff6ec"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.025}
        shadow-radius={4}
        shadow-camera-left={-4}
        shadow-camera-right={4}
        shadow-camera-top={7}
        shadow-camera-bottom={-2}
        shadow-camera-near={1}
        shadow-camera-far={24}
      />
      <directionalLight position={[-7, 3.5, 3]} intensity={0.45} color="#b9d4f0" />
      <directionalLight position={[-3, 6.5, -8]} intensity={1.6} color="#e8f2ff" />
      <directionalLight position={[6, 2, -6]} intensity={0.6} color="#cfe4ff" />

      <Environment resolution={256} frames={1} environmentIntensity={0.55}>
        {/* overhead softbox */}
        <Lightformer form="rect" intensity={2.2} color="#ffffff" position={[0, 9, 1]} rotation-x={Math.PI / 2} scale={[10, 4, 1]} />
        {/* tall strips left / right for long highlights down the armor */}
        <Lightformer form="rect" intensity={1.4} color="#f2f6fa" position={[-7, 3, 2]} rotation-y={Math.PI / 2} scale={[2, 9, 1]} />
        <Lightformer form="rect" intensity={1.1} color="#eef4fb" position={[7, 3, 3]} rotation-y={-Math.PI / 2} scale={[2, 9, 1]} />
        {/* cool back strip for rim reflections */}
        <Lightformer form="rect" intensity={0.9} color="#cfe6ff" position={[0, 4, -8]} scale={[12, 1.2, 1]} />
        {/* faint floor bounce */}
        <Lightformer form="rect" intensity={0.12} color="#9aa4b0" position={[0, -2, 0]} rotation-x={-Math.PI / 2} scale={[14, 14, 1]} />
      </Environment>
    </>
  );
}
