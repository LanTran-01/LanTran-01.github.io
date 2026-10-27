import { MeshStandardMaterial } from "three";

/**
 * Palette for the illustrative CubeSat.
 *
 * Restrained and product-like: clear-anodised aluminium rails and frames
 * against dark anodised panels, deep blue-black solar cells, graphite circuit
 * boards with gold contacts, and two warm accents shared with the Ξ explorer —
 * gold insulation on the optics and an ochre tone on the antenna tapes.
 * Emissive stays black except on the small sensor windows, because the viewer
 * animates colour, emissive and opacity on per-mesh clones.
 */
export interface CubeSatMaterials {
  /** Rails, frames, hinges — clear-anodised aluminium. */
  aluminum: MeshStandardMaterial;
  /** Side panels, deployer, brackets — dark anodised. */
  anodized: MeshStandardMaterial;
  /** Solar cells. */
  cell: MeshStandardMaterial;
  /** Cell busbars and interconnects. */
  busbar: MeshStandardMaterial;
  /** Back of the wing panels. */
  substrate: MeshStandardMaterial;
  /** Circuit boards. */
  pcb: MeshStandardMaterial;
  /** IC packages, connector bodies. */
  chip: MeshStandardMaterial;
  /** Connector pins and pads. */
  gold: MeshStandardMaterial;
  /** RF shield cans, IMU housing. */
  shield: MeshStandardMaterial;
  /** Coil windings. */
  copper: MeshStandardMaterial;
  /** Antenna tape springs. */
  tape: MeshStandardMaterial;
  /** Battery cell wraps. */
  cellWrap: MeshStandardMaterial;
  /** Optics insulation blanket. */
  foil: MeshStandardMaterial;
  /** Lens glass. */
  glass: MeshStandardMaterial;
  /** Sun-sensor windows (faint cyan emissive). */
  sensor: MeshStandardMaterial;
  /** Reaction-wheel rotors. */
  rotor: MeshStandardMaterial;
  /** Dark machined parts: wheel housings, baffle, torquer cores. */
  dark: MeshStandardMaterial;
  /** GNSS patch dielectric. */
  ceramic: MeshStandardMaterial;
  /** Coaxial cable jackets. */
  cable: MeshStandardMaterial;
}

function std(
  name: string,
  color: string,
  roughness: number,
  metalness: number,
  extra: Partial<{ flat: boolean; emissive: string; emissiveIntensity: number }> = {},
): MeshStandardMaterial {
  return new MeshStandardMaterial({
    name,
    color,
    roughness,
    metalness,
    flatShading: extra.flat ?? false,
    emissive: extra.emissive ?? "#000000",
    emissiveIntensity: extra.emissiveIntensity ?? 1,
  });
}

export function createCubeSatMaterials(): CubeSatMaterials {
  return {
    aluminum: std("cs.aluminum", "#c4c9cf", 0.34, 0.78),
    anodized: std("cs.anodized", "#3b4149", 0.4, 0.62),
    cell: std("cs.cell", "#22325c", 0.16, 0.42),
    busbar: std("cs.busbar", "#7c8794", 0.32, 0.75),
    substrate: std("cs.substrate", "#41464e", 0.5, 0.45),
    pcb: std("cs.pcb", "#25303a", 0.58, 0.25),
    chip: std("cs.chip", "#121518", 0.42, 0.3),
    gold: std("cs.gold", "#c8a45c", 0.3, 0.9),
    shield: std("cs.shield", "#a9b0b9", 0.3, 0.82),
    copper: std("cs.copper", "#b5743f", 0.36, 0.85),
    tape: std("cs.tape", "#b08a3e", 0.4, 0.55),
    cellWrap: std("cs.cellwrap", "#d8dce1", 0.45, 0.12),
    foil: std("cs.foil", "#bf9a4c", 0.3, 0.92, { flat: true }),
    glass: std("cs.glass", "#0a0f16", 0.08, 0.5),
    sensor: std("cs.sensor", "#63c7ff", 0.25, 0.1, { emissive: "#63c7ff", emissiveIntensity: 0.55 }),
    rotor: std("cs.rotor", "#8f979f", 0.28, 0.88),
    dark: std("cs.dark", "#181b20", 0.55, 0.45),
    ceramic: std("cs.ceramic", "#cfc6b4", 0.55, 0.05),
    cable: std("cs.cable", "#3a4048", 0.68, 0.15),
  };
}

export function materialList(m: CubeSatMaterials): MeshStandardMaterial[] {
  return Object.values(m);
}
