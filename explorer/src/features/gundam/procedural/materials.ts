import { DoubleSide, MeshStandardMaterial } from "three";

/**
 * Shared palette for the procedural prototype.
 *
 * Restrained engineering palette that still evokes the RX-105: off-white primary
 * armor, slate-navy secondary armor, graphite frame, a muted ochre for the V-fin
 * and a few vent trims, darker steel tones for internals. Emissive stays black
 * except on small sensor / power-core accents (cyan family) because the viewer
 * animates colour, emissive and opacity on per-mesh clones.
 */
export interface XiMaterials {
  /** Primary outer armor (faceted). */
  armorWhite: MeshStandardMaterial;
  /** Secondary outer armor (faceted). */
  armorNavy: MeshStandardMaterial;
  /** V-fin and small vent trims. */
  ochre: MeshStandardMaterial;
  /** Structural frame members. */
  frame: MeshStandardMaterial;
  /** Joint housings, palms, sole pads. */
  frameDark: MeshStandardMaterial;
  /** Vent louvres, slots and recess floors. */
  louvre: MeshStandardMaterial;
  /** Internal mechanisms — bright machined steel. */
  steel: MeshStandardMaterial;
  /** Internal mechanisms — mid gunmetal housings. */
  gunmetal: MeshStandardMaterial;
  /** Internal mechanisms — dark housings / boards. */
  darkSteel: MeshStandardMaterial;
  /** Cable harness jackets. */
  cable: MeshStandardMaterial;
  /** Visor glass. */
  glass: MeshStandardMaterial;
  /** Eye / lens sensor accent (cyan emissive). */
  sensor: MeshStandardMaterial;
  /** Power-core glow (cyan emissive). */
  core: MeshStandardMaterial;
  /** Cockpit wrap display (double-sided, faint cyan). */
  display: MeshStandardMaterial;
  /** Open shells seen from both sides (cockpit capsule). */
  shell: MeshStandardMaterial;
  /** Nozzle bells (heat-resistant metal). */
  nozzle: MeshStandardMaterial;
}

function std(
  name: string,
  color: string,
  roughness: number,
  metalness: number,
  extra: Partial<{ flat: boolean; emissive: string; emissiveIntensity: number; double: boolean }> = {},
): MeshStandardMaterial {
  const m = new MeshStandardMaterial({
    name,
    color,
    roughness,
    metalness,
    flatShading: extra.flat ?? false,
    emissive: extra.emissive ?? "#000000",
    emissiveIntensity: extra.emissiveIntensity ?? 1,
  });
  if (extra.double) m.side = DoubleSide;
  return m;
}

export function createXiMaterials(): XiMaterials {
  return {
    armorWhite: std("xi.armor.white", "#d8dce1", 0.5, 0.1, { flat: true }),
    armorNavy: std("xi.armor.navy", "#1e2836", 0.46, 0.22, { flat: true }),
    ochre: std("xi.armor.ochre", "#b08a3e", 0.42, 0.3, { flat: true }),
    frame: std("xi.frame.graphite", "#3a3f47", 0.42, 0.6),
    frameDark: std("xi.frame.dark", "#272b31", 0.5, 0.55),
    louvre: std("xi.frame.louvre", "#202429", 0.55, 0.5, { flat: true }),
    steel: std("xi.int.steel", "#9aa2ac", 0.32, 0.7),
    gunmetal: std("xi.int.gunmetal", "#626a74", 0.4, 0.62),
    darkSteel: std("xi.int.dark", "#3b424b", 0.45, 0.55),
    cable: std("xi.int.cable", "#34404d", 0.68, 0.15),
    glass: std("xi.glass.visor", "#0a0e13", 0.12, 0.4),
    sensor: std("xi.sensor", "#63c7ff", 0.25, 0.1, { emissive: "#63c7ff", emissiveIntensity: 0.9 }),
    core: std("xi.core", "#9fdcff", 0.3, 0.1, { emissive: "#63c7ff", emissiveIntensity: 1.4 }),
    display: std("xi.display", "#0d1a22", 0.3, 0.2, { emissive: "#2d6f94", emissiveIntensity: 0.6, double: true }),
    shell: std("xi.int.shell", "#7b838d", 0.42, 0.5, { double: true }),
    nozzle: std("xi.nozzle", "#6c727b", 0.38, 0.7),
  };
}

export function materialList(m: XiMaterials): MeshStandardMaterial[] {
  return Object.values(m);
}
