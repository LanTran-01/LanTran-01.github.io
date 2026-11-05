import { BackSide, DoubleSide, MeshStandardMaterial, type Side } from "three";

/**
 * Palette for the V-2 exhibit.
 *
 * A museum finish rather than a factory one: the two paints of a Peenemünde
 * black-and-white roll pattern (a warm off-white and a soft black that still
 * catches the rim light), dark steel for joints and fittings, bare
 * heat-tinted steel for the engine, matte graphite for the jet vanes and the
 * dark yellow of a wartime firing table. Inside, aluminium tanks in pale
 * glass wool, grey equipment cases, bakelite, copper and dark cable. Emissive
 * stays black throughout because the viewer animates colour, emissive and
 * opacity on per-mesh clones.
 */
export interface V2Materials {
  /** Light quadrants of the roll pattern. */
  paintWhite: MeshStandardMaterial;
  /** Dark quadrants of the roll pattern. */
  paintBlack: MeshStandardMaterial;
  /** Joint rings, seams, hatch outlines, fasteners. */
  seam: MeshStandardMaterial;
  /** Fuze tip and small bright fittings. */
  steel: MeshStandardMaterial;
  /** Thrust ring, bearing shoes, hinge fairings, vane mounts. */
  darkSteel: MeshStandardMaterial;
  /** Jet vanes. */
  graphite: MeshStandardMaterial;
  /** Combustion chamber and nozzle, bare heat-tinted steel. */
  engine: MeshStandardMaterial;
  /** Burner cups on the chamber head. */
  engineHead: MeshStandardMaterial;
  /** Soot: nozzle interior, base plate. */
  soot: MeshStandardMaterial;
  /** Inside of the tail shell, seen through the base when the sections are apart. */
  interior: MeshStandardMaterial;
  /** Firing table — wartime dark yellow. */
  stand: MeshStandardMaterial;
  /** Blast deflector and table hardware. */
  deflector: MeshStandardMaterial;

  /* ---- interior ---- */
  /** Propellant tanks, opened on one side (double-sided). */
  tank: MeshStandardMaterial;
  /** Glass-wool insulation around the tanks (double-sided). */
  insulation: MeshStandardMaterial;
  /** Internal frames, struts, brackets and equipment decks. */
  structure: MeshStandardMaterial;
  /** Equipment cases: gyros, converters, radio sets. */
  equipment: MeshStandardMaterial;
  /** Dark instrument cases and panels. */
  equipmentDark: MeshStandardMaterial;
  /** Bakelite cases of the analog computer and junction boxes. */
  bakelite: MeshStandardMaterial;
  /** Vacuum-tube glass and dial faces. */
  glass: MeshStandardMaterial;
  /** Terminals, windings and pipe fittings. */
  copper: MeshStandardMaterial;
  /** Battery cases. */
  battery: MeshStandardMaterial;
  /** Cable harnesses and hoses. */
  cable: MeshStandardMaterial;
  /** Propellant and steam lines. */
  pipe: MeshStandardMaterial;
  /** Compressed-air bottles and small pressure vessels. */
  bottle: MeshStandardMaterial;
}

function std(
  name: string,
  color: string,
  roughness: number,
  metalness: number,
  extra: Partial<{ flat: boolean; side: Side; envMapIntensity: number }> = {},
): MeshStandardMaterial {
  const m = new MeshStandardMaterial({
    name,
    color,
    roughness,
    metalness,
    flatShading: extra.flat ?? false,
    emissive: "#000000",
    envMapIntensity: extra.envMapIntensity ?? 1,
  });
  if (extra.side !== undefined) m.side = extra.side;
  return m;
}

export function createV2Materials(): V2Materials {
  return {
    paintWhite: std("v2.paint.white", "#d9d7cf", 0.5, 0.08),
    paintBlack: std("v2.paint.black", "#2a2d32", 0.36, 0.24, { envMapIntensity: 1.5 }),
    seam: std("v2.seam", "#34383e", 0.42, 0.62),
    steel: std("v2.steel", "#a3aab2", 0.3, 0.85),
    darkSteel: std("v2.steel.dark", "#41464d", 0.44, 0.66),
    graphite: std("v2.graphite", "#2c2d30", 0.86, 0.12),
    engine: std("v2.engine", "#7d7a74", 0.4, 0.78),
    engineHead: std("v2.engine.head", "#8f949a", 0.34, 0.82),
    soot: std("v2.soot", "#141517", 0.9, 0.12),
    interior: std("v2.interior", "#1a1c1f", 0.8, 0.25, { side: BackSide }),
    stand: std("v2.stand", "#a08b5c", 0.62, 0.2),
    deflector: std("v2.deflector", "#3a3c40", 0.7, 0.45),

    tank: std("v2.int.tank", "#a7adb3", 0.36, 0.78, { side: DoubleSide }),
    insulation: std("v2.int.insulation", "#cdbf93", 0.96, 0.0, { side: DoubleSide }),
    structure: std("v2.int.structure", "#6a7077", 0.45, 0.62),
    equipment: std("v2.int.equipment", "#5d646b", 0.48, 0.5),
    equipmentDark: std("v2.int.equipmentDark", "#25292e", 0.5, 0.42),
    bakelite: std("v2.int.bakelite", "#3e2c22", 0.42, 0.1),
    glass: std("v2.int.glass", "#c3ced4", 0.12, 0.25),
    copper: std("v2.int.copper", "#b4733f", 0.34, 0.88),
    battery: std("v2.int.battery", "#2f3a31", 0.62, 0.15),
    cable: std("v2.int.cable", "#2b2f34", 0.72, 0.1),
    pipe: std("v2.int.pipe", "#8b9198", 0.34, 0.82),
    bottle: std("v2.int.bottle", "#3f5466", 0.4, 0.55),
  };
}

export function materialList(m: V2Materials): MeshStandardMaterial[] {
  return Object.values(m);
}
