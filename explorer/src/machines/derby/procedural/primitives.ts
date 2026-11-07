import { Kit as BaseKit } from "@/features/model/procedural/primitives";
import type { DerbyMaterials } from "./materials";

/** The shared procedural toolkit, with `Kit` bound to the Derby palette. */
export * from "@/features/model/procedural/primitives";

export class Kit extends BaseKit<DerbyMaterials> {}
