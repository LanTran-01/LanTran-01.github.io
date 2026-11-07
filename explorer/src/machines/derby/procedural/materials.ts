import { MeshStandardMaterial } from "three";

/**
 * Palette for the Derby exhibit.
 *
 * A modern display round: a pale grey painted airframe, a ceramic-white
 * radome, bare-metal joint rings, one muted blue display band, dark hangers
 * and a sooty nozzle. Deliberately cool and quiet beside the V-2's
 * black-and-white. Emissive stays black because the viewer animates colour,
 * emissive and opacity on per-mesh clones.
 */
export interface DerbyMaterials {
  /** Painted airframe and control surfaces. */
  paint: MeshStandardMaterial;
  /** Wings and canards: the same paint, a touch smoother. */
  surface: MeshStandardMaterial;
  /** Radome. */
  radome: MeshStandardMaterial;
  /** Bare-metal joint rings, nose tip. */
  metal: MeshStandardMaterial;
  /** Panel lines, screws. */
  seam: MeshStandardMaterial;
  /** Display band (representative). */
  band: MeshStandardMaterial;
  /** Hangers, hinge fairings, connector. */
  dark: MeshStandardMaterial;
  /** Nozzle interior and end closures. */
  soot: MeshStandardMaterial;
  /** Nozzle rim. */
  nozzle: MeshStandardMaterial;
}

function std(name: string, color: string, roughness: number, metalness: number, envMapIntensity = 1): MeshStandardMaterial {
  return new MeshStandardMaterial({ name, color, roughness, metalness, emissive: "#000000", envMapIntensity });
}

export function createDerbyMaterials(): DerbyMaterials {
  return {
    paint: std("db.paint", "#c9cdd2", 0.42, 0.22),
    surface: std("db.surface", "#c3c8ce", 0.36, 0.26),
    radome: std("db.radome", "#e2e0d9", 0.3, 0.04, 1.1),
    metal: std("db.metal", "#9aa1a9", 0.3, 0.82),
    seam: std("db.seam", "#7b828a", 0.4, 0.55),
    band: std("db.band", "#3f6b8f", 0.44, 0.2),
    dark: std("db.dark", "#3a3f46", 0.42, 0.62),
    soot: std("db.soot", "#141517", 0.88, 0.12),
    nozzle: std("db.nozzle", "#57534e", 0.46, 0.7),
  };
}

export function materialList(m: DerbyMaterials): MeshStandardMaterial[] {
  return Object.values(m);
}
