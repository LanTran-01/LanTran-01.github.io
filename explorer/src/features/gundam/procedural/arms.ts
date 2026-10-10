import { Object3D } from "three";
import { LAYOUT } from "./layout";
import { bilateral, clamp01, composeMatrix, extrudeGeo, group, lerp, warp, type Kit, type Piece, type Side } from "./primitives";

/** Finger curl (radians about local Z, negative = toward the palm) per segment. */
type Curl = readonly [number, number, number];

interface HandPose {
  fingers: readonly Curl[];
  /** Thumb base orientation (Euler XYZ) and per-segment curl. */
  thumb: { base: readonly [number, number, number]; curl: readonly [number, number] };
  wristFlex: number;
}

const RELAXED: HandPose = {
  fingers: [
    [-0.3, -0.42, -0.3],
    [-0.36, -0.48, -0.34],
    [-0.42, -0.52, -0.38],
    [-0.5, -0.56, -0.42],
  ],
  thumb: { base: [-0.45, 0.25, -0.5], curl: [-0.25, -0.2] },
  wristFlex: -0.08,
};

const GRIP: HandPose = {
  fingers: [
    [-1.3, -1.5, -1.2],
    [-1.35, -1.5, -1.2],
    [-1.4, -1.5, -1.2],
    [-1.45, -1.5, -1.2],
  ],
  thumb: { base: [-0.25, 0.55, -1.1], curl: [-0.7, -0.5] },
  wristFlex: -0.62,
};

/**
 * Five-finger manipulator as one merged geometry: four three-segment fingers
 * along the knuckle line (index at +Z) and a two-segment thumb on the palm side.
 */
function fingerPieces(kit: Kit, pose: HandPose): Piece[] {
  const pieces: Piece[] = [];
  const lens = [0.07, 0.056, 0.046];
  const zs = [0.068, 0.023, -0.023, -0.068];
  zs.forEach((z, i) => {
    const M = composeMatrix([-0.015, -0.205, z]);
    pose.fingers[i].forEach((c, k) => {
      M.multiply(composeMatrix([0, 0, 0], [0, 0, c]));
      const w = k === 0 ? 0.052 : 0.046;
      pieces.push({ geo: kit.rbox(w, lens[k], 0.04, 0.008), matrix: M.clone().multiply(composeMatrix([0, -lens[k] / 2, 0])) });
      pieces.push({ geo: kit.cylZ(0.018, 0.044, 8), matrix: M.clone() });
      M.multiply(composeMatrix([0, -lens[k], 0]));
    });
  });
  // Thumb
  const T = composeMatrix([-0.045, -0.07, 0.085], pose.thumb.base);
  const tl = [0.07, 0.055];
  pose.thumb.curl.forEach((c, k) => {
    T.multiply(composeMatrix([0, 0, 0], [0, 0, c]));
    pieces.push({ geo: kit.rbox(0.05, tl[k], 0.045, 0.009), matrix: T.clone().multiply(composeMatrix([0, -tl[k] / 2, 0])) });
    T.multiply(composeMatrix([0, -tl[k], 0]));
  });
  return pieces;
}

/**
 * Arms & manipulators. Upper arm with armor sleeve, elbow actuator, flared
 * armored forearm with wrist drive, and a five-finger hand. The right hand is
 * posed in a grip; the returned anchor marks the grip axis for the rifle.
 */
export function buildArms(kit: Kit, root: Object3D): { gripAnchor: Object3D } {
  const { m } = kit;
  const gripAnchor = new Object3D();
  gripAnchor.name = "arms.gripAnchor.R";

  bilateral(root, "arms", LAYOUT.shoulder, (s, side: Side) => {
    const pose = side === "R" ? GRIP : RELAXED;
    const arm = group(s, "arm", [0.0, -0.03, 0], [0, 0, LAYOUT.armSplay]);
    const A = kit.scope(arm, "arms", side);

    /* ---- upper arm ---- */
    const upperFrame = kit.merge("ar.upperFrame", () => [
      { geo: kit.cyl(0.11, 0.11, 0.06, 18), pos: [0, -0.13, 0] },
      { geo: kit.cyl(0.08, 0.085, 0.76, 14), pos: [0, -0.5, 0] },
      { geo: kit.rbox(0.04, 0.22, 0.18, 0.01), pos: [0.115, -0.9, 0] },
      { geo: kit.rbox(0.04, 0.22, 0.18, 0.01), pos: [-0.115, -0.9, 0] },
      { geo: kit.cylX(0.07, 0.19, 18), pos: [0, -0.9, 0] },
    ]);
    A("upper_arm_frame", upperFrame, m.frame, "frame", "ar-upper-frame");
    const sleeve = kit.extrude(
      "ar.sleeve",
      [
        [-0.15, -0.19],
        [0.15, -0.19],
        [0.165, -0.64],
        [0.125, -0.74],
        [-0.125, -0.74],
        [-0.16, -0.64],
      ],
      0.33,
      "xy",
      0.022,
    );
    A("upper_arm_armor", sleeve, m.armorWhite, "armor", "ar-upper-armor", { ex: [0.3, 0, 0.06] });
    A("upper_arm_panel", kit.rbox(0.04, 0.36, 0.24, 0.01), m.armorNavy, "armor", "ar-upper-armor", {
      pos: [0.172, -0.45, 0],
      ex: [0.46, 0, 0.0],
    });
    A("elbow_guard", kit.rbox(0.22, 0.16, 0.06, 0.012), m.armorWhite, "armor", "ar-upper-armor", {
      pos: [0, -0.9, -0.14],
      rot: [0.35, 0, 0],
      ex: [0, -0.04, -0.3],
    });
    // Elbow drive: motor can + reduction gearbox inside the lower sleeve, link rod to the hinge.
    const elbow = kit.merge("ar.elbow", () => [
      { geo: kit.cyl(0.05, 0.05, 0.14, 14), pos: [0, 0.32, -0.04] },
      { geo: kit.rbox(0.13, 0.08, 0.12, 0.01), pos: [0, 0.22, -0.02] },
      { geo: kit.cylX(0.03, 0.17, 10), pos: [0, 0.22, -0.02] },
      { geo: kit.rbox(0.03, 0.14, 0.03, 0.006), pos: [0.05, 0.1, -0.05] },
    ]);
    A("elbow_actuator", elbow, m.steel, "internal", "ar-elbow", { pos: [0, -0.9, 0], ex: [0, -0.1, -0.16] });
    const upperCable = kit.tubes("ar.upperCable", [
      [
        [0.05, -0.08, -0.11],
        [0.07, -0.4, -0.12],
        [0.06, -0.62, -0.12],
        [0.04, -0.72, -0.1],
      ],
      [
        [-0.05, -0.08, -0.11],
        [-0.07, -0.4, -0.12],
        [-0.06, -0.62, -0.12],
        [-0.04, -0.72, -0.1],
      ],
    ]);
    A("upper_harness", upperCable, m.cable, "internal", "ar-harness", { ex: [0, -0.04, -0.22] });

    /* ---- forearm ---- */
    const fore = group(arm, "forearm", [0, -0.9, 0], [side === "R" ? -0.3 : -0.16, 0, 0]);
    const F = kit.scope(fore, "arms", side);
    const foreFrame = kit.merge("ar.foreFrame", () => [
      { geo: kit.rbox(0.12, 0.64, 0.12, 0.015), pos: [0, -0.36, 0] },
      { geo: kit.cyl(0.08, 0.08, 0.06, 16), pos: [0, -0.72, 0] },
    ]);
    F("forearm_frame", foreFrame, m.frame, "frame", "ar-forearm");
    const foreArmor = kit.memo("ar.foreArmor", () =>
      warp(
        extrudeGeo(
          [
            [-0.15, -0.06],
            [0.15, -0.06],
            [0.205, -0.48],
            [0.195, -0.7],
            [-0.17, -0.7],
            [-0.185, -0.48],
          ],
          0.36,
          "xy",
          0.024,
        ),
        (x, y, z) => [x, y, z * lerp(0.86, 1.14, clamp01((-y - 0.06) / 0.55))],
      ),
    );
    F("forearm_armor", foreArmor, m.armorWhite, "armor", "ar-forearm-armor", { ex: [0.32, -0.12, 0.04] });
    const forePlate = kit.extrude(
      "ar.forePlate",
      [
        [-0.17, -0.12],
        [0.17, -0.12],
        [0.22, -0.58],
        [0.1, -0.68],
        [-0.2, -0.64],
      ],
      0.06,
      "zy",
      0.012,
    );
    F("forearm_outer_plate", forePlate, m.armorNavy, "armor", "ar-forearm-armor", {
      pos: [0.21, 0, 0],
      rot: [0, 0, 0.06],
      ex: [0.48, -0.12, 0],
    });
    const drive = kit.merge("ar.drive", () => [
      { geo: kit.cyl(0.04, 0.04, 0.14, 12), pos: [0.06, -0.52, -0.03] },
      { geo: kit.cyl(0.04, 0.04, 0.14, 12), pos: [-0.06, -0.52, -0.03] },
      { geo: kit.rbox(0.16, 0.06, 0.13, 0.01), pos: [0, -0.63, 0] },
      { geo: kit.cylX(0.03, 0.18, 10), pos: [0, -0.63, 0.06] },
      // flexor actuator pair running along the forearm
      { geo: kit.cyl(0.026, 0.026, 0.3, 10), pos: [0.07, -0.26, 0.07] },
      { geo: kit.cyl(0.026, 0.026, 0.3, 10), pos: [-0.07, -0.26, 0.07] },
      { geo: kit.cyl(0.013, 0.013, 0.16, 8), pos: [0.07, -0.47, 0.07] },
      { geo: kit.cyl(0.013, 0.013, 0.16, 8), pos: [-0.07, -0.47, 0.07] },
      { geo: kit.rbox(0.18, 0.03, 0.04, 0.005), pos: [0, -0.1, 0.07] },
    ]);
    F("wrist_drive", drive, m.steel, "internal", "ar-forearm-drive", { ex: [0, -0.2, 0.0] });
    const foreCable = kit.tubes("ar.foreCable", [
      [
        [0.04, -0.1, -0.08],
        [0.08, -0.3, -0.11],
        [0.07, -0.55, -0.1],
        [0.03, -0.7, -0.05],
      ],
      [
        [-0.04, -0.1, -0.08],
        [-0.08, -0.3, -0.11],
        [-0.07, -0.55, -0.1],
        [-0.03, -0.7, -0.05],
      ],
    ]);
    F("forearm_harness", foreCable, m.cable, "internal", "ar-harness", { ex: [0, -0.08, -0.22] });

    /* ---- hand ---- */
    const hand = group(fore, "hand", [0, -0.76, 0], [pose.wristFlex, 0, 0]);
    hand.scale.setScalar(1.3);
    const H = kit.scope(hand, "arms", side);
    const palm = kit.merge("ar.palm", () => [
      { geo: kit.sphere(0.065, 14, 10), pos: [0, 0, 0] },
      { geo: kit.rbox(0.1, 0.17, 0.19, 0.015), pos: [-0.012, -0.12, 0] },
    ]);
    H("palm_block", palm, m.frameDark, "frame", "ar-palm", { ex: [0, -0.32, 0] });
    H("hand_armor", kit.rbox(0.04, 0.15, 0.18, 0.01), m.armorWhite, "armor", "ar-palm", {
      pos: [0.054, -0.12, 0],
      ex: [0.2, -0.32, 0],
    });
    const fingers = kit.merge(`ar.fingers.${side}`, () => fingerPieces(kit, pose));
    H("fingers", fingers, m.frameDark, "frame", "ar-fingers", { ex: [0, -0.44, 0] });

    if (side === "R") {
      gripAnchor.position.set(-0.075, -0.255, 0.0);
      hand.add(gripAnchor);
    }
  });

  return { gripAnchor };
}
