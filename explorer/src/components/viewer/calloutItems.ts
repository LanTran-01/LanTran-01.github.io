import type { Mesh } from "three";
import { getComponent, subassemblySubtreeIds } from "@/data/components";
import type { ComponentId, Subassembly } from "@/data/types";
import type { ViewerModelIndex } from "@/features/gundam/annotateModel";

export interface CalloutItem {
  sub: Subassembly;
  meshes: Mesh[];
}

/** Top-level subassemblies of `id` with at least one mesh in their subtree. */
export function calloutItems(model: ViewerModelIndex | null, id: ComponentId | null): CalloutItem[] {
  if (!model || !id) return [];
  const out: CalloutItem[] = [];
  for (const sub of getComponent(id).subassemblies) {
    const meshes: Mesh[] = [];
    for (const sid of subassemblySubtreeIds(sub.id)) {
      const list = model.bySubassembly.get(sid);
      if (list) meshes.push(...list);
    }
    if (meshes.length > 0) out.push({ sub, meshes });
  }
  return out;
}
