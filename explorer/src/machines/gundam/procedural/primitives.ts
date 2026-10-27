import { Kit as BaseKit } from "@/features/model/procedural/primitives";
import type { XiMaterials } from "./materials";

/** The shared procedural toolkit, with `Kit` bound to the Ξ palette. */
export * from "@/features/model/procedural/primitives";

export class Kit extends BaseKit<XiMaterials> {}
