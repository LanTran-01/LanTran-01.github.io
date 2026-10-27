import { Kit as BaseKit } from "@/features/model/procedural/primitives";
import type { CubeSatMaterials } from "./materials";

/** The shared procedural toolkit, with `Kit` bound to the CubeSat palette. */
export * from "@/features/model/procedural/primitives";

export class Kit extends BaseKit<CubeSatMaterials> {}
