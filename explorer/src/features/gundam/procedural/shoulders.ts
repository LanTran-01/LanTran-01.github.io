import type { Object3D } from "three";
import { LAYOUT } from "./layout";
import { bilateral, clamp01, extrudeGeo, lerp, warp, type Kit } from "./primitives";

/**
 * Shoulder armor assembly — the Xi's signature read after the head: very large,
 * layered pauldrons that flare outward and sweep upward to a point. Each side
 * stacks a main shell, a swept top plate, navy front/rear facings, a lower
 * step plate and a navy outer flare. Inside: an open box frame, the two-axis
 * shoulder actuator and an equipment hardpoint bay.
 */
export function buildShoulders(kit: Kit, root: Object3D) {
  const { m } = kit;

  bilateral(root, "shoulders", LAYOUT.shoulder, (s, side) => {
    const S = kit.scope(s, "shoulders", side);

    /* ---- frame ---- */
    // Open box frame (posts + rails) so the actuator stays visible in cutaway.
    const frame = kit.merge("sh.frame", () => [
      ...([
        [-0.08, 0.19],
        [0.2, 0.19],
        [-0.08, -0.19],
        [0.2, -0.19],
      ] as const).map(([x, z]) => ({ geo: kit.rbox(0.035, 0.34, 0.035, 0.006), pos: [x, 0, z] as const })),
      { geo: kit.rbox(0.32, 0.035, 0.035, 0.006), pos: [0.06, -0.155, 0.19] },
      { geo: kit.rbox(0.32, 0.035, 0.035, 0.006), pos: [0.06, -0.155, -0.19] },
      { geo: kit.rbox(0.3, 0.04, 0.4, 0.008), pos: [0.06, 0.17, 0] },
      { geo: kit.rbox(0.05, 0.16, 0.16, 0.008), pos: [-0.08, 0.1, -0.17] },
      { geo: kit.rbox(0.26, 0.04, 0.04, 0.006), pos: [0.36, 0.17, 0.12] },
      { geo: kit.rbox(0.26, 0.04, 0.04, 0.006), pos: [0.36, 0.17, -0.12] },
      { geo: kit.cyl(0.075, 0.085, 0.1, 16), pos: [0.0, -0.13, 0] },
    ]);
    S("shoulder_frame", frame, m.frame, "frame", "sh-frame");

    /* ---- internals ---- */
    const joint = kit.merge("sh.joint", () => [
      { geo: kit.cylX(0.1, 0.2, 20), pos: [0.03, 0, 0] },
      { geo: kit.torus(0.115, 0.018, 6, 24), pos: [0.03, 0, 0], rot: [0, Math.PI / 2, 0] },
      { geo: kit.cyl(0.04, 0.04, 0.1, 12), pos: [0.08, 0.1, 0.1] },
      { geo: kit.cyl(0.04, 0.04, 0.1, 12), pos: [0.08, 0.1, -0.1] },
    ]);
    S("shoulder_actuator", joint, m.steel, "internal", "sh-joint", { ex: [0.06, 0, 0] });
    const bay = kit.merge("sh.bay", () => [
      { geo: kit.rbox(0.18, 0.14, 0.36, 0.012), pos: [0, 0, 0] },
      { geo: kit.rbox(0.2, 0.018, 0.018, 0.004), pos: [0.0, 0.08, 0.14] },
      { geo: kit.rbox(0.2, 0.018, 0.018, 0.004), pos: [0.0, 0.08, -0.14] },
      { geo: kit.cylZ(0.022, 0.38, 10), pos: [0.0, -0.08, 0] },
    ]);
    S("equipment_hardpoint", bay, m.darkSteel, "internal", "sh-hardpoint", { pos: [0.42, 0.13, 0], ex: [0.3, 0.26, 0] });

    /* ---- armor ---- */
    const main = kit.memo("sh.main", () =>
      warp(
        extrudeGeo(
          [
            [-0.08, -0.04],
            [0.6, -0.12],
            [0.72, 0.2],
            [0.7, 0.56],
            [0.42, 0.53],
            [0.04, 0.34],
            [-0.12, 0.2],
          ],
          0.78,
          "xy",
          0.03,
        ),
        // outer and upper regions narrow front-to-back → faceted, swept block
        (x, y, z) => [x, y, z * lerp(1, 0.8, clamp01((x - 0.3) / 0.42)) * lerp(1, 0.86, clamp01((y - 0.2) / 0.36))],
      ),
    );
    S("pauldron_shell", main, m.armorWhite, "armor", "sh-armor", { ex: [0.3, 0.12, 0] });

    // Swept top plate rising to the signature point.
    const upper = kit.memo("sh.upper", () =>
      warp(
        extrudeGeo(
          [
            [-0.06, 0.3],
            [0.4, 0.5],
            [0.64, 0.6],
            [0.73, 0.95],
            [0.83, 0.82],
            [0.79, 0.5],
            [0.44, 0.43],
            [-0.04, 0.22],
          ],
          0.7,
          "xy",
          0.022,
        ),
        (x, y, z) => {
          const t = clamp01((y - 0.52) / 0.46);
          return [x, y, z * lerp(1, 0.42, t) - 0.08 * t];
        },
      ),
    );
    S("pauldron_top_plate", upper, m.armorWhite, "armor", "sh-upper", { pos: [0, 0, -0.07], ex: [0.24, 0.46, -0.04] });

    // Front / rear layering: raised white upper facing over a navy lower band.
    const facing = kit.extrude(
      "sh.facing",
      [
        [0.05, 0.15],
        [0.58, 0.09],
        [0.66, 0.3],
        [0.64, 0.52],
        [0.42, 0.49],
        [0.07, 0.31],
      ],
      0.06,
      "xy",
      0.012,
    );
    const band = kit.extrude(
      "sh.band",
      [
        [0.0, -0.03],
        [0.57, -0.11],
        [0.61, 0.07],
        [0.04, 0.12],
      ],
      0.05,
      "xy",
      0.01,
    );
    for (const z of [1, -1] as const) {
      const tag = z > 0 ? "front" : "rear";
      S(`pauldron_${tag}_facing`, facing, m.armorWhite, "armor", "sh-armor", { pos: [0, 0, 0.41 * z], ex: [0.12, 0.06, 0.48 * z] });
      S(`pauldron_${tag}_band`, band, m.armorNavy, "armor", "sh-armor", { pos: [0, 0, 0.405 * z], ex: [0.12, -0.04, 0.44 * z] });
    }

    const step = kit.extrude(
      "sh.step",
      [
        [0.04, -0.06],
        [0.6, -0.17],
        [0.66, -0.02],
        [0.07, 0.06],
      ],
      0.72,
      "xy",
      0.016,
    );
    S("pauldron_lower_step", step, m.armorNavy, "armor", "sh-armor", { pos: [0, -0.045, 0], ex: [0.3, -0.26, 0] });

    // Outer flare: white plate kicking outward at the bottom, navy rib, ochre tab.
    const flare = kit.memo("sh.flare", () =>
      warp(
        extrudeGeo(
          [
            [-0.32, 0.32],
            [0.18, 0.36],
            [0.4, 0.14],
            [0.37, -0.28],
            [0.2, -0.46],
            [-0.3, -0.44],
            [-0.41, -0.1],
          ],
          0.1,
          "zy",
          0.02,
        ),
        // narrower toward the bottom edge, thinner at the outer face's lower half
        (x, y, z) => [x, y, z * lerp(1, 0.84, clamp01(-y / 0.42))],
      ),
    );
    S("flared_leading_edge", flare, m.armorWhite, "armor", "sh-flare", {
      pos: [0.72, 0.0, 0],
      rot: [0, 0, 0.14],
      ex: [0.6, 0, 0],
    });
    const rib = kit.extrude(
      "sh.flareRib",
      [
        [-0.34, 0.05],
        [0.34, 0.05],
        [0.32, -0.06],
        [-0.32, -0.06],
      ],
      0.04,
      "zy",
      0.01,
    );
    S("flare_rib", rib, m.armorNavy, "armor", "sh-flare", { pos: [0.822, -0.27, 0], rot: [0, 0, 0.14], ex: [0.7, -0.02, 0] });
    S("flare_tab", kit.rbox(0.03, 0.06, 0.16, 0.008), m.ochre, "armor", "sh-flare", {
      pos: [0.79, 0.16, 0.18],
      rot: [0, 0, 0.14],
      ex: [0.7, 0.02, 0],
    });
  });
}
