import { Canvas } from "@react-three/fiber";
import { ACESFilmicToneMapping, SRGBColorSpace } from "three";
import { MACHINE } from "@/data/machine";
import { useMachineModel } from "@/features/model/useMachineModel";
import { SceneLighting } from "./SceneLighting";
import { Floor } from "./Floor";
import { CameraRig } from "./CameraRig";
import { ModelRenderer } from "./ModelRenderer";
import { HoverLabel } from "./HoverLabel";
import { SubassemblyCallouts } from "./SubassemblyCallouts";
import styles from "./Viewer.module.css";

const BG = "#07080a";

/**
 * The persistent 3D viewer. Mounted once by AppShell and never remounted;
 * routes only change store state, which the viewer reacts to.
 */
export function ModelViewer() {
  const model = useMachineModel();

  return (
    <div className={styles.viewer}>
      <Canvas
        className={styles.canvas}
        dpr={[1, 1.75]}
        frameloop="demand"
        shadows="percentage"
        gl={{ antialias: true, powerPreference: "high-performance", alpha: false }}
        camera={{ fov: 30, near: 0.1, far: 220, position: [6, 3.2, 14] }}
        onCreated={({ gl }) => {
          gl.toneMapping = ACESFilmicToneMapping;
          gl.toneMappingExposure = 0.9;
          gl.outputColorSpace = SRGBColorSpace;
        }}
        aria-label={MACHINE.viewerLabel}
      >
        <color attach="background" args={[BG]} />
        <fog attach="fog" args={[BG, 20, 52]} />
        <SceneLighting />
        <Floor />
        {model && <ModelRenderer model={model} />}
        <CameraRig model={model} />
      </Canvas>
      <SubassemblyCallouts model={model} />
      <HoverLabel />
    </div>
  );
}
