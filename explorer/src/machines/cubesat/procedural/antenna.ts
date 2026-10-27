import type { Object3D } from "three";
import { EX, STACK, y } from "./layout";
import type { Kit, V3 } from "./primitives";

const DEPLOYER = 1.26;
const TAPE_LEN = 1.75;

/**
 * Zenith end: the antenna deployer with four tape-spring elements in a
 * pinwheel, its release posts, and the GNSS patch on top.
 */
export function buildAntenna(kit: Kit, root: Object3D) {
  const { m } = kit;
  const P = kit.scope(root, "antenna");
  const yc = y(STACK.deployer);
  const ex = EX.deployer;
  P("deployer", kit.rbox(DEPLOYER, 0.12, DEPLOYER, 0.012), m.anodized, "frame", "ant-deployer", { pos: [0, yc, 0], ex });
  P("deployer.trim", kit.rbox(DEPLOYER - 0.12, 0.012, DEPLOYER - 0.12, 0.004), m.aluminum, "frame", "ant-deployer", {
    pos: [0, yc + 0.064, 0],
    ex,
  });

  // Each element leaves a side near one corner and runs tangentially, angled slightly outward.
  const tape = kit.rbox(TAPE_LEN, 0.05, 0.008, 0.002);
  const flare = (12 * Math.PI) / 180;
  for (let k = 0; k < 4; k++) {
    const a = (k * Math.PI) / 2;
    const n: V3 = [Math.cos(a), 0, Math.sin(a)];
    const t: V3 = [-Math.sin(a), 0, Math.cos(a)];
    const d: V3 = [t[0] * Math.cos(flare) + n[0] * Math.sin(flare), 0, t[2] * Math.cos(flare) + n[2] * Math.sin(flare)];
    const half = DEPLOYER / 2 + 0.004;
    const start: V3 = [n[0] * half + t[0] * 0.42, yc, n[2] * half + t[2] * 0.42];
    const mid: V3 = [start[0] + (d[0] * TAPE_LEN) / 2, yc, start[2] + (d[2] * TAPE_LEN) / 2];
    P(`element.${k}`, tape, m.tape, "frame", "ant-elements", {
      pos: mid,
      rot: [0, -Math.atan2(d[2], d[0]), 0],
      ex: [ex[0] + n[0] * 0.25, ex[1], ex[2] + n[2] * 0.25],
    });
  }

  // Release posts at the four corners of the top face.
  const post = kit.cyl(0.024, 0.024, 0.05, 12);
  const block = kit.rbox(0.07, 0.03, 0.04, 0.004);
  for (const [sx, sz] of [[1, 1], [-1, 1], [-1, -1], [1, -1]] as const) {
    P(`release.post.${sx}${sz}`, post, m.gold, "frame", "ant-release", { pos: [sx * 0.5, yc + 0.085, sz * 0.5], ex });
    P(`release.block.${sx}${sz}`, block, m.chip, "frame", "ant-release", { pos: [sx * 0.4, yc + 0.075, sz * 0.5], ex });
  }

  /* ---- GNSS patch antenna on the zenith face ---- */
  const G = kit.scope(root, "gnss");
  const exP = EX.patch;
  const py = yc + 0.06;
  G("patch.dielectric", kit.rbox(0.42, 0.05, 0.42, 0.01), m.ceramic, "frame", "gnss-antenna", { pos: [0, py + 0.025, 0], ex: exP });
  G("patch.radiator", kit.rbox(0.3, 0.01, 0.3, 0.003), m.gold, "frame", "gnss-antenna", { pos: [0, py + 0.055, 0], ex: exP });
  G("patch.feed", kit.cyl(0.02, 0.02, 0.016, 12), m.aluminum, "frame", "gnss-antenna", { pos: [0.06, py + 0.066, 0.06], ex: exP });
}
