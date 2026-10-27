import type { Mesh } from "three";
import { getComponent, subassemblySubtreeIds } from "@/data/components";
import type { ComponentId, Subassembly } from "@/data/types";
import type { ViewerModelIndex } from "@/features/model/annotateModel";

export interface CalloutItem {
  sub: Subassembly;
  meshes: Mesh[];
}

/** Below this many labels a single-branch assembly is expanded one level. */
const MIN_ITEMS = 3;

function itemFor(model: ViewerModelIndex, sub: Subassembly): CalloutItem | null {
  const meshes: Mesh[] = [];
  for (const sid of subassemblySubtreeIds(sub.id)) {
    const list = model.bySubassembly.get(sid);
    if (list) meshes.push(...list);
  }
  return meshes.length > 0 ? { sub, meshes } : null;
}

/**
 * Top-level subassemblies of `id` with at least one mesh in their subtree.
 * Assemblies with very few top-level branches (e.g. the armament, which is a
 * single rifle) are expanded so the callouts name the parts that matter.
 */
export function calloutItems(model: ViewerModelIndex | null, id: ComponentId | null): CalloutItem[] {
  if (!model || !id) return [];
  let out: CalloutItem[] = [];
  for (const sub of getComponent(id).subassemblies) {
    const it = itemFor(model, sub);
    if (it) out.push(it);
  }
  while (out.length < MIN_ITEMS) {
    const i = out.findIndex((it) => (it.sub.children?.length ?? 0) >= 2);
    if (i < 0) break;
    const children = out[i].sub.children!.map((c) => itemFor(model, c)).filter((c): c is CalloutItem => !!c);
    if (children.length < 2) break;
    out = [...out.slice(0, i), ...children, ...out.slice(i + 1)];
  }
  return out;
}
