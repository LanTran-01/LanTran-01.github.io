import { useEffect, useMemo } from "react";
import { BackSide, BufferGeometry, Color, Float32BufferAttribute, ShaderMaterial } from "three";
import { Grid } from "@react-three/drei";
import { MACHINE } from "@/data/machine";

/**
 * Technical floor: an infinite fine grid that fades with distance, a shadow
 * catcher, a measurement ring with angular ticks around the base, a height
 * ruler beside the machine (when the machine has one), and a large backdrop with a faint horizon band.
 * Measurement marks are unlabelled scale cues, not dimensions.
 */

const RING_R = MACHINE.stage.ringRadius;

function ringGeometry(): BufferGeometry {
  const pts: number[] = [];
  const seg = 160;
  for (let i = 0; i < seg; i++) {
    const a0 = (i / seg) * Math.PI * 2;
    const a1 = ((i + 1) / seg) * Math.PI * 2;
    pts.push(Math.cos(a0) * RING_R, 0, Math.sin(a0) * RING_R, Math.cos(a1) * RING_R, 0, Math.sin(a1) * RING_R);
  }
  // ticks every 5°, longer every 30°, longest at the four cardinal directions
  for (let d = 0; d < 360; d += 5) {
    const a = (d * Math.PI) / 180;
    const len = d % 90 === 0 ? 0.22 : d % 30 === 0 ? 0.13 : 0.05;
    const c = Math.cos(a);
    const s = Math.sin(a);
    pts.push(c * RING_R, 0, s * RING_R, c * (RING_R + len), 0, s * (RING_R + len));
  }
  // short centre cross
  pts.push(-0.18, 0, 0, 0.18, 0, 0, 0, 0, -0.18, 0, 0, 0.18);
  const g = new BufferGeometry();
  g.setAttribute("position", new Float32BufferAttribute(pts, 3));
  return g;
}

function rulerGeometry(height: number): BufferGeometry {
  const pts: number[] = [0, 0, 0, 0, height, 0];
  const steps = height * 4;
  for (let i = 0; i <= steps; i++) {
    const y = (i / steps) * height;
    const len = i % 4 === 0 ? 0.16 : i % 2 === 0 ? 0.09 : 0.045;
    pts.push(0, y, 0, len, y, 0);
  }
  const g = new BufferGeometry();
  g.setAttribute("position", new Float32BufferAttribute(pts, 3));
  return g;
}

const backdropVertex = /* glsl */ `
  varying vec3 vDir;
  void main() {
    vDir = normalize(position);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const backdropFragment = /* glsl */ `
  uniform vec3 uBase;
  uniform vec3 uHorizon;
  varying vec3 vDir;
  void main() {
    float h = abs(vDir.y);
    float band = exp(-h * 7.0);
    vec3 c = mix(uBase, uHorizon, band * 0.9);
    gl_FragColor = vec4(c, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

const poolVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const poolFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uStrength;
  varying vec2 vUv;
  void main() {
    float r = length(vUv - 0.5) * 2.0;
    float a = pow(1.0 - smoothstep(0.0, 1.0, r), 1.6) * uStrength;
    gl_FragColor = vec4(uColor, a);
    #include <colorspace_fragment>
  }
`;

export function Floor() {
  const ring = useMemo(ringGeometry, []);
  const ruler = useMemo(() => (MACHINE.stage.ruler ? rulerGeometry(MACHINE.stage.ruler) : null), []);
  const backdrop = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: backdropVertex,
        fragmentShader: backdropFragment,
        uniforms: { uBase: { value: new Color("#07080a") }, uHorizon: { value: new Color("#11151a") } },
        side: BackSide,
        depthWrite: false,
        fog: false,
        toneMapped: false,
      }),
    [],
  );

  // Soft "stage" pool of light under the machine, like a studio floor spot.
  const pool = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: poolVertex,
        fragmentShader: poolFragment,
        uniforms: { uColor: { value: new Color("#8fb4d0") }, uStrength: { value: 0.11 } },
        transparent: true,
        depthWrite: false,
        fog: false,
        toneMapped: false,
      }),
    [],
  );

  useEffect(
    () => () => {
      ring.dispose();
      ruler?.dispose();
      backdrop.dispose();
      pool.dispose();
    },
    [ring, ruler, backdrop, pool],
  );

  return (
    <group>
      <mesh material={backdrop} renderOrder={-10} frustumCulled={false}>
        <sphereGeometry args={[90, 32, 16]} />
      </mesh>

      <mesh rotation-x={-Math.PI / 2} position-y={0} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <shadowMaterial transparent opacity={0.5} color="#000000" depthWrite={false} />
      </mesh>

      <mesh material={pool} rotation-x={-Math.PI / 2} position-y={0.001} renderOrder={-1}>
        <planeGeometry args={[11, 11]} />
      </mesh>

      <Grid
        position={[0, 0.002, 0]}
        args={[10, 10]}
        infiniteGrid
        cellSize={0.25}
        cellThickness={0.6}
        cellColor="#1a1f25"
        sectionSize={1}
        sectionThickness={0.9}
        sectionColor="#2a333d"
        fadeDistance={34}
        fadeStrength={1.6}
        followCamera={false}
      />

      <lineSegments geometry={ring} position-y={0.004} renderOrder={1}>
        <lineBasicMaterial color="#63c7ff" transparent opacity={0.22} depthWrite={false} toneMapped={false} />
      </lineSegments>

      {ruler && (
        <lineSegments geometry={ruler} position={[-2.35, 0.004, -1.1]} rotation-y={Math.PI * 0.12} renderOrder={1}>
          <lineBasicMaterial color="#9aa4b0" transparent opacity={0.28} depthWrite={false} toneMapped={false} />
        </lineSegments>
      )}
    </group>
  );
}
