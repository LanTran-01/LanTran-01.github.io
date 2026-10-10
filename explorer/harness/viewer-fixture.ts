import { BoxGeometry, Group, Mesh, MeshStandardMaterial, type BufferGeometry } from "three";
import type { ComponentId, PartLayer } from "@/data/types";
import { setPartTag } from "@/features/gundam/modelTypes";

/**
 * DEV-only stand-in for the procedural model: a blocky, fully tagged humanoid
 * so the viewer (modes, explode, callouts, raycasting) can be exercised while
 * the real procedural build is still a placeholder. Never shipped: the viewer
 * only imports it behind `import.meta.env.DEV`.
 */

interface Part {
  c: ComponentId;
  layer: PartLayer;
  sub?: string;
  size: [number, number, number];
  pos: [number, number, number];
  explode?: [number, number, number];
  /** Mirror across X for left/right pairs. */
  mirror?: boolean;
}

const PARTS: Part[] = [
  // head
  { c: "head", layer: "armor", sub: "hd-faceplate", size: [0.42, 0.4, 0.44], pos: [0, 5.45, 0.02], explode: [0, 0.35, 0.25] },
  { c: "head", layer: "armor", sub: "hd-vfin", size: [0.5, 0.06, 0.06], pos: [0, 5.72, 0.22], explode: [0, 0.6, 0.2] },
  { c: "head", layer: "internal", sub: "hd-optics", size: [0.26, 0.08, 0.1], pos: [0, 5.5, 0.12], explode: [0, 0, 0.4] },
  { c: "head", layer: "internal", sub: "hd-lens", size: [0.08, 0.08, 0.14], pos: [0, 5.38, 0.12], explode: [0, -0.1, 0.5] },
  { c: "head", layer: "internal", sub: "hd-processor", size: [0.18, 0.14, 0.16], pos: [0, 5.42, -0.08], explode: [0, 0.1, -0.35] },
  { c: "head", layer: "frame", sub: "hd-neck", size: [0.16, 0.22, 0.16], pos: [0, 5.15, 0], explode: [0, -0.2, 0] },
  // chest
  { c: "chest", layer: "armor", sub: "cp-hatch", size: [0.5, 0.55, 0.12], pos: [0, 4.45, 0.42], explode: [0, 0, 0.7] },
  { c: "chest", layer: "armor", sub: "cp-intakes", size: [0.36, 0.22, 0.12], pos: [0.36, 4.75, 0.38], explode: [0.25, 0.15, 0.6], mirror: true },
  { c: "chest", layer: "armor", sub: "cp-armor", size: [1.3, 1.05, 0.72], pos: [0, 4.45, 0], explode: [0, 0.2, -0.05] },
  { c: "chest", layer: "frame", sub: "cp-frame", size: [1.0, 0.95, 0.5], pos: [0, 4.42, -0.02] },
  { c: "chest", layer: "internal", sub: "cp-seat", size: [0.26, 0.32, 0.26], pos: [0, 4.38, 0.14], explode: [0, 0, 0.45] },
  { c: "chest", layer: "internal", sub: "cp-display", size: [0.4, 0.2, 0.05], pos: [0, 4.6, 0.26], explode: [0, 0.2, 0.5] },
  { c: "chest", layer: "internal", sub: "cp-computer", size: [0.3, 0.42, 0.18], pos: [0, 4.45, -0.2], explode: [0, 0, -0.5] },
  { c: "chest", layer: "internal", sub: "cp-power", size: [0.18, 0.5, 0.18], pos: [0.36, 4.35, -0.1], explode: [0.4, 0, -0.2], mirror: true },
  // shoulders
  { c: "shoulders", layer: "armor", sub: "sh-upper", size: [0.7, 0.28, 0.75], pos: [-1.05, 4.95, 0], explode: [-0.35, 0.45, 0], mirror: true },
  { c: "shoulders", layer: "armor", sub: "sh-flare", size: [0.18, 0.62, 0.7], pos: [-1.38, 4.68, 0], explode: [-0.55, 0.1, 0], mirror: true },
  { c: "shoulders", layer: "frame", sub: "sh-frame", size: [0.5, 0.5, 0.5], pos: [-0.98, 4.65, 0], mirror: true },
  { c: "shoulders", layer: "internal", sub: "sh-joint", size: [0.28, 0.28, 0.28], pos: [-0.92, 4.62, 0], explode: [0, -0.1, 0.35], mirror: true },
  // arms
  { c: "arms", layer: "armor", sub: "ar-upper-armor", size: [0.38, 0.75, 0.4], pos: [-1.08, 3.95, 0], explode: [-0.35, 0.1, 0], mirror: true },
  { c: "arms", layer: "internal", sub: "ar-elbow", size: [0.24, 0.24, 0.24], pos: [-1.08, 3.45, 0], explode: [0, 0, 0.35], mirror: true },
  { c: "arms", layer: "armor", sub: "ar-forearm-armor", size: [0.44, 0.8, 0.46], pos: [-1.1, 2.95, 0.06], explode: [-0.4, -0.2, 0], mirror: true },
  { c: "arms", layer: "internal", sub: "ar-forearm-drive", size: [0.2, 0.5, 0.2], pos: [-1.1, 2.95, 0.04], explode: [0, -0.3, 0.35], mirror: true },
  { c: "arms", layer: "frame", sub: "ar-palm", size: [0.22, 0.26, 0.24], pos: [-1.1, 2.4, 0.06], explode: [0, -0.45, 0], mirror: true },
  // waist
  { c: "waist", layer: "armor", sub: "ws-front", size: [0.32, 0.5, 0.08], pos: [0.2, 3.25, 0.4], explode: [0.15, -0.1, 0.55], mirror: true },
  { c: "waist", layer: "armor", sub: "ws-side", size: [0.08, 0.5, 0.5], pos: [0.6, 3.3, 0], explode: [0.5, 0, 0], mirror: true },
  { c: "waist", layer: "armor", sub: "ws-rear", size: [0.7, 0.45, 0.08], pos: [0, 3.3, -0.4], explode: [0, 0, -0.55] },
  { c: "waist", layer: "frame", sub: "ws-frame", size: [0.3, 0.7, 0.3], pos: [0, 3.55, -0.02] },
  { c: "waist", layer: "internal", sub: "ws-reactor", size: [0.36, 0.3, 0.3], pos: [0, 3.45, 0.04], explode: [0, 0.25, 0.5] },
  { c: "waist", layer: "internal", sub: "ws-hip", size: [0.8, 0.2, 0.26], pos: [0, 3.18, 0], explode: [0, -0.3, 0] },
  // legs
  { c: "legs", layer: "armor", sub: "lg-thigh-armor", size: [0.46, 0.95, 0.5], pos: [-0.36, 2.55, 0], explode: [-0.4, 0.1, 0], mirror: true },
  { c: "legs", layer: "frame", sub: "lg-thigh-frame", size: [0.22, 0.9, 0.22], pos: [-0.36, 2.55, 0], mirror: true },
  { c: "legs", layer: "armor", sub: "lg-knee-armor", size: [0.3, 0.32, 0.18], pos: [-0.36, 1.95, 0.3], explode: [0, 0, 0.5], mirror: true },
  { c: "legs", layer: "internal", sub: "lg-knee-actuator", size: [0.26, 0.26, 0.26], pos: [-0.36, 1.95, 0], explode: [-0.3, 0, 0.2], mirror: true },
  { c: "legs", layer: "armor", sub: "lg-shin-armor", size: [0.56, 1.2, 0.62], pos: [-0.38, 1.15, 0], explode: [-0.45, 0, 0], mirror: true },
  { c: "legs", layer: "internal", sub: "lg-propellant", size: [0.22, 0.6, 0.22], pos: [-0.38, 1.2, -0.1], explode: [0, 0, -0.5], mirror: true },
  { c: "legs", layer: "internal", sub: "lg-ankle", size: [0.2, 0.2, 0.2], pos: [-0.38, 0.45, 0], explode: [0, -0.15, 0.3], mirror: true },
  // feet
  { c: "feet", layer: "armor", sub: "ft-toe", size: [0.42, 0.22, 0.45], pos: [-0.4, 0.2, 0.3], explode: [0, 0.2, 0.35], mirror: true },
  { c: "feet", layer: "armor", sub: "ft-heel", size: [0.38, 0.3, 0.3], pos: [-0.4, 0.22, -0.2], explode: [0, 0.2, -0.3], mirror: true },
  { c: "feet", layer: "frame", sub: "ft-frame", size: [0.44, 0.08, 0.9], pos: [-0.4, 0.1, 0.05], mirror: true },
  { c: "feet", layer: "internal", sub: "ft-damper", size: [0.16, 0.22, 0.16], pos: [-0.4, 0.28, 0.02], explode: [0, 0.35, 0], mirror: true },
  { c: "feet", layer: "frame", sub: "ft-sole", size: [0.46, 0.06, 0.92], pos: [-0.4, 0.03, 0.05], explode: [0, -0.2, 0], mirror: true },
  // backpack
  { c: "backpack", layer: "armor", sub: "bp-housing", size: [0.9, 0.9, 0.4], pos: [0, 4.4, -0.6], explode: [0, 0.1, -0.5] },
  { c: "backpack", layer: "armor", sub: "bp-binder-upper", size: [0.12, 1.4, 0.3], pos: [-0.55, 5.0, -0.82], explode: [-0.4, 0.4, -0.3], mirror: true },
  { c: "backpack", layer: "internal", sub: "bp-flightunit", size: [0.4, 0.4, 0.26], pos: [0, 4.5, -0.6], explode: [0, 0.3, -0.8] },
  { c: "backpack", layer: "internal", sub: "bp-capacitor", size: [0.5, 0.16, 0.2], pos: [0, 4.12, -0.6], explode: [0, -0.2, -0.8] },
  { c: "backpack", layer: "frame", sub: "bp-mount", size: [0.5, 0.5, 0.12], pos: [0, 4.4, -0.38] },
  // thrusters
  { c: "thrusters", layer: "frame", sub: "th-main-bell", size: [0.22, 0.3, 0.22], pos: [-0.22, 3.9, -0.82], explode: [0, -0.35, -0.3], mirror: true },
  { c: "thrusters", layer: "internal", sub: "th-main-chamber", size: [0.16, 0.16, 0.16], pos: [-0.22, 4.1, -0.72], explode: [0, -0.1, -0.5], mirror: true },
  { c: "thrusters", layer: "frame", sub: "th-leg", size: [0.16, 0.18, 0.12], pos: [-0.38, 1.0, -0.36], explode: [0, 0, -0.3], mirror: true },
  { c: "thrusters", layer: "frame", sub: "th-skirt", size: [0.14, 0.12, 0.14], pos: [-0.2, 3.02, -0.3], explode: [0, -0.25, 0], mirror: true },
  // weapons (right hand, machine's right = −X)
  { c: "weapons", layer: "frame", sub: "wp-barrel", size: [0.12, 0.14, 1.3], pos: [-1.1, 2.35, 0.75], explode: [0, 0, 0.6] },
  { c: "weapons", layer: "frame", sub: "wp-sensor", size: [0.1, 0.1, 0.24], pos: [-1.1, 2.5, 0.4], explode: [0, 0.35, 0] },
  { c: "weapons", layer: "internal", sub: "wp-capacitor", size: [0.14, 0.18, 0.2], pos: [-1.1, 2.32, 0.18], explode: [0, -0.35, 0] },
  { c: "weapons", layer: "frame", sub: "wp-grip", size: [0.1, 0.24, 0.12], pos: [-1.1, 2.2, 0.32], explode: [0, -0.4, -0.2] },
];

export function buildViewerFixture(): Group {
  const root = new Group();
  root.name = "viewer-fixture";
  const armor = new MeshStandardMaterial({ color: 0xe4e6e8, roughness: 0.48, metalness: 0.08 });
  const frame = new MeshStandardMaterial({ color: 0x3a3f46, roughness: 0.6, metalness: 0.5 });
  const internal = new MeshStandardMaterial({ color: 0x8a939e, roughness: 0.4, metalness: 0.6 });
  const mats: Record<PartLayer, MeshStandardMaterial> = { armor, frame, internal };
  const geoCache = new Map<string, BufferGeometry>();

  for (const p of PARTS) {
    const sides = p.mirror ? [1, -1] : [1];
    for (const s of sides) {
      const key = p.size.join(",");
      let geo = geoCache.get(key);
      if (!geo) {
        geo = new BoxGeometry(...p.size);
        geoCache.set(key, geo);
      }
      const mesh = new Mesh(geo, mats[p.layer]);
      mesh.name = `${p.sub ?? p.c}${s < 0 ? "_L" : ""}`;
      mesh.position.set(p.pos[0] * s, p.pos[1], p.pos[2]);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      setPartTag(mesh, {
        componentId: p.c,
        layer: p.layer,
        subassemblyId: p.sub,
        explode: p.explode ? [p.explode[0] * s, p.explode[1], p.explode[2]] : undefined,
      });
      root.add(mesh);
    }
  }
  return root;
}
