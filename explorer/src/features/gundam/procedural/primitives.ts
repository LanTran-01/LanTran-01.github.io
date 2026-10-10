import {
  BufferAttribute,
  BufferGeometry,
  CatmullRomCurve3,
  CylinderGeometry,
  Euler,
  ExtrudeGeometry,
  Group,
  LatheGeometry,
  Matrix4,
  Mesh,
  Quaternion,
  Shape,
  SphereGeometry,
  TorusGeometry,
  TubeGeometry,
  Vector2,
  Vector3,
  type Material,
  type Object3D,
} from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import type { ComponentId, PartLayer } from "@/data/types";
import { setPartTag } from "../modelTypes";
import type { XiMaterials } from "./materials";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type V3 = readonly [number, number, number];
export type P2 = readonly [number, number];
export type Side = "L" | "R";

/**
 * Plane an extruded outline is drawn in.
 *  - "xy": front view, extruded along Z
 *  - "zy": side profile (first coord = z), extruded along X
 *  - "xz": top view (second coord = z), extruded along Y
 */
export type Plane = "xy" | "zy" | "xz";

export interface PartOpts {
  pos?: V3;
  rot?: V3;
  scale?: V3;
  /** Explode offset in the parent's local space. */
  ex?: V3;
}

export interface Piece {
  geo: BufferGeometry;
  pos?: V3;
  rot?: V3;
  scale?: V3;
  /** Overrides pos/rot/scale when given. */
  matrix?: Matrix4;
}

export type PartFn = (
  name: string,
  geo: BufferGeometry,
  mat: Material,
  layer: PartLayer,
  subassemblyId: string,
  opts?: PartOpts,
) => Mesh;

/* ------------------------------------------------------------------ */
/* Pure geometry helpers                                               */
/* ------------------------------------------------------------------ */

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const clamp01 = (t: number) => (t < 0 ? 0 : t > 1 ? 1 : t);

export function composeMatrix(pos: V3 = [0, 0, 0], rot: V3 = [0, 0, 0], scale: V3 = [1, 1, 1]): Matrix4 {
  return new Matrix4().compose(
    new Vector3(...pos),
    new Quaternion().setFromEuler(new Euler(rot[0], rot[1], rot[2])),
    new Vector3(...scale),
  );
}

function shapeFromPoints(pts: readonly P2[]): Shape {
  const s = new Shape();
  s.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) s.lineTo(pts[i][0], pts[i][1]);
  s.closePath();
  return s;
}

/** Move a geometry so its bounding-box centre on one axis sits at 0. */
function centreAxis(geo: BufferGeometry, axis: "x" | "y" | "z") {
  geo.computeBoundingBox();
  const bb = geo.boundingBox!;
  const c = (bb.min[axis] + bb.max[axis]) / 2;
  geo.translate(axis === "x" ? -c : 0, axis === "y" ? -c : 0, axis === "z" ? -c : 0);
}

/**
 * Angular armor plate: polygon outline extruded with a single-segment chamfer,
 * centred on the extrusion axis. The chamfer keeps the outline at the given size.
 * Several outlines may be passed to build one geometry (e.g. paired eye lenses).
 */
export function extrudeGeo(
  outlines: readonly P2[] | readonly (readonly P2[])[],
  depth: number,
  plane: Plane = "xy",
  bevel = 0.012,
): BufferGeometry {
  const list = (Array.isArray(outlines[0]?.[0]) ? outlines : [outlines]) as readonly (readonly P2[])[];
  const b = Math.min(bevel, depth * 0.3);
  const geo = new ExtrudeGeometry(
    list.map(shapeFromPoints),
    {
      depth: Math.max(depth - 2 * b, 0.002),
      bevelEnabled: b > 0,
      bevelThickness: b,
      bevelSize: b,
      bevelOffset: -b,
      bevelSegments: 1,
      curveSegments: 4,
    },
  );
  geo.deleteAttribute("uv");
  centreAxis(geo, "z");
  if (plane === "zy") geo.rotateY(-Math.PI / 2);
  else if (plane === "xz") geo.rotateX(Math.PI / 2);
  return geo;
}

/** In-place vertex warp (taper, shear, bulge). Normals are recomputed. */
export function warp(geo: BufferGeometry, fn: (x: number, y: number, z: number) => V3): BufferGeometry {
  const p = geo.getAttribute("position") as BufferAttribute;
  for (let i = 0; i < p.count; i++) {
    const [x, y, z] = fn(p.getX(i), p.getY(i), p.getZ(i));
    p.setXYZ(i, x, y, z);
  }
  p.needsUpdate = true;
  geo.computeVertexNormals();
  geo.computeBoundingBox();
  geo.computeBoundingSphere();
  return geo;
}

/** Reverse triangle winding of a non-indexed geometry (after a mirroring transform). */
function flipWinding(geo: BufferGeometry) {
  for (const name of Object.keys(geo.attributes)) {
    const a = geo.getAttribute(name) as BufferAttribute;
    const n = a.itemSize;
    const arr = a.array;
    for (let t = 0; t < a.count; t += 3) {
      for (let k = 0; k < n; k++) {
        const i1 = (t + 1) * n + k;
        const i2 = (t + 2) * n + k;
        const tmp = arr[i1];
        arr[i1] = arr[i2];
        arr[i2] = tmp;
      }
    }
    a.needsUpdate = true;
  }
}

/**
 * Merge many transformed pieces into a single geometry (one draw call).
 * Only position + normal survive; mirrored pieces get their winding fixed.
 */
export function mergePieces(pieces: readonly Piece[]): BufferGeometry {
  const parts: BufferGeometry[] = [];
  for (const p of pieces) {
    const g = p.geo.index ? p.geo.toNonIndexed() : p.geo.clone();
    for (const name of Object.keys(g.attributes)) {
      if (name !== "position" && name !== "normal") g.deleteAttribute(name);
    }
    if (!g.getAttribute("normal")) g.computeVertexNormals();
    g.clearGroups();
    const m = p.matrix ?? composeMatrix(p.pos, p.rot, p.scale);
    g.applyMatrix4(m);
    if (m.determinant() < 0) flipWinding(g);
    parts.push(g);
  }
  const merged = mergeGeometries(parts, false);
  for (const g of parts) g.dispose();
  if (!merged) throw new Error("mergePieces: incompatible geometries");
  merged.computeBoundingBox();
  merged.computeBoundingSphere();
  return merged;
}

/* ------------------------------------------------------------------ */
/* Kit: geometry cache + tagged mesh factory                           */
/* ------------------------------------------------------------------ */

/**
 * Build-scoped helper. Caches geometries so mirrored sides and repeated parts
 * share buffers, and creates meshes that always carry a `PartTag`.
 */
export class Kit {
  private readonly cache = new Map<string, BufferGeometry>();
  /** Temporary geometries used only as merge inputs; disposed by `finish()`. */
  private readonly scratch: BufferGeometry[] = [];
  readonly m: XiMaterials;

  constructor(materials: XiMaterials) {
    this.m = materials;
  }

  /** Cache any geometry under an explicit key (used for warped / merged shapes). */
  memo(key: string, make: () => BufferGeometry): BufferGeometry {
    let g = this.cache.get(key);
    if (!g) {
      g = make();
      this.cache.set(key, g);
    }
    return g;
  }

  /** Geometry used only as a merge input (not cached, disposed after the build). */
  tmp(g: BufferGeometry): BufferGeometry {
    this.scratch.push(g);
    return g;
  }

  finish() {
    for (const g of this.scratch) g.dispose();
    this.scratch.length = 0;
  }

  rbox(w: number, h: number, d: number, r = 0.02, seg = 1): BufferGeometry {
    const rr = Math.min(r, Math.min(w, h, d) * 0.45);
    return this.memo(`rbox:${w}:${h}:${d}:${rr}:${seg}`, () => {
      const g = new RoundedBoxGeometry(w, h, d, seg, rr);
      g.deleteAttribute("uv");
      return g;
    });
  }

  cyl(rTop: number, rBot: number, h: number, seg = 16, open = false): BufferGeometry {
    return this.memo(`cyl:${rTop}:${rBot}:${h}:${seg}:${open}`, () => {
      const g = new CylinderGeometry(rTop, rBot, h, seg, 1, open);
      g.deleteAttribute("uv");
      return g;
    });
  }

  /** Cylinder whose axis runs along X. */
  cylX(r: number, h: number, seg = 16): BufferGeometry {
    return this.memo(`cylX:${r}:${h}:${seg}`, () => this.cyl(r, r, h, seg).clone().rotateZ(Math.PI / 2));
  }

  /** Cylinder whose axis runs along Z. */
  cylZ(r: number, h: number, seg = 16, rTop = r): BufferGeometry {
    return this.memo(`cylZ:${r}:${rTop}:${h}:${seg}`, () => this.cyl(rTop, r, h, seg).clone().rotateX(Math.PI / 2));
  }

  sphere(r: number, ws = 16, hs = 12): BufferGeometry {
    return this.memo(`sph:${r}:${ws}:${hs}`, () => {
      const g = new SphereGeometry(r, ws, hs);
      g.deleteAttribute("uv");
      return g;
    });
  }

  torus(r: number, tube: number, rs = 8, ts = 32, arc = Math.PI * 2): BufferGeometry {
    return this.memo(`tor:${r}:${tube}:${rs}:${ts}:${arc}`, () => {
      const g = new TorusGeometry(r, tube, rs, ts, arc);
      g.deleteAttribute("uv");
      return g;
    });
  }

  /** Lathe around Y from a (radius, y) profile. */
  lathe(key: string, profile: readonly P2[], seg = 24): BufferGeometry {
    return this.memo(`lathe:${key}`, () => {
      const g = new LatheGeometry(profile.map(([r, y]) => new Vector2(r, y)), seg);
      g.deleteAttribute("uv");
      return g;
    });
  }

  /** Cable run through control points (not cached — each run is unique). */
  tube(points: readonly V3[], radius: number, tubular = 32, radial = 6): BufferGeometry {
    const curve = new CatmullRomCurve3(points.map((p) => new Vector3(...p)), false, "centripetal");
    const g = new TubeGeometry(curve, tubular, radius, radial, false);
    g.deleteAttribute("uv");
    return g;
  }

  extrude(key: string, outlines: readonly P2[] | readonly (readonly P2[])[], depth: number, plane: Plane = "xy", bevel = 0.012) {
    return this.memo(`ext:${key}`, () => extrudeGeo(outlines, depth, plane, bevel));
  }

  merge(key: string, make: () => readonly Piece[]): BufferGeometry {
    return this.memo(`merge:${key}`, () => mergePieces(make()));
  }

  /** Factory that adds tagged meshes for one component to a parent. */
  scope(parent: Object3D, componentId: ComponentId, side?: Side): PartFn {
    return (name, geo, mat, layer, subassemblyId, o = {}) => {
      const mesh = new Mesh(geo, mat);
      mesh.name = side ? `${componentId}.${name}.${side}` : `${componentId}.${name}`;
      if (o.pos) mesh.position.set(...o.pos);
      if (o.rot) mesh.rotation.set(...o.rot);
      if (o.scale) mesh.scale.set(...o.scale);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      setPartTag(mesh, {
        componentId,
        layer,
        subassemblyId,
        ...(o.ex ? { explode: [o.ex[0], o.ex[1], o.ex[2]] as [number, number, number] } : {}),
      });
      parent.add(mesh);
      return mesh;
    };
  }
}

/* ------------------------------------------------------------------ */
/* Group helpers                                                       */
/* ------------------------------------------------------------------ */

export function group(parent: Object3D, name: string, pos: V3 = [0, 0, 0], rot: V3 = [0, 0, 0]): Group {
  const g = new Group();
  g.name = name;
  g.position.set(...pos);
  g.rotation.set(...rot);
  parent.add(g);
  return g;
}

/**
 * Build a left (+X) part and its mirror image on the right (−X).
 * The builder works in left-side coordinates; the right copy lives under a
 * group with scale.x = −1, so geometry, poses and explode offsets mirror for free.
 */
export function bilateral(parent: Object3D, name: string, pos: V3, build: (g: Group, side: Side) => void) {
  for (const side of ["L", "R"] as const) {
    const g = new Group();
    g.name = `${name}.${side}`;
    g.position.set(side === "L" ? pos[0] : -pos[0], pos[1], pos[2]);
    if (side === "R") g.scale.x = -1;
    parent.add(g);
    build(g, side);
  }
}
