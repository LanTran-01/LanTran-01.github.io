import { Kit as BaseKit } from "@/features/model/procedural/primitives";
import type { V2Materials } from "./materials";

/** The shared procedural toolkit, with `Kit` bound to the V-2 palette. */
export * from "@/features/model/procedural/primitives";

export class Kit extends BaseKit<V2Materials> {}
