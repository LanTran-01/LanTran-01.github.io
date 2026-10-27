import { COLUMNS, FLOW_KINDS, FLOW_ORDER, LANES, SYSTEM_EDGES, SYSTEM_NODES } from "@machine/systems";
import type { ComponentId, SystemNode } from "./types";

/**
 * Systems graph of the machine this build explores (see `@machine` in
 * vite.config.ts), plus the lookups shared by every machine.
 */

export { COLUMNS, FLOW_KINDS, FLOW_ORDER, LANES, SYSTEM_EDGES, SYSTEM_NODES };

/* ------------------------------------------------------------------ */
/* Lookups                                                             */
/* ------------------------------------------------------------------ */

const nodeIndex = new Map<string, { node: SystemNode; parent: SystemNode | null }>();
for (const n of SYSTEM_NODES) {
  nodeIndex.set(n.id, { node: n, parent: null });
  for (const child of n.children ?? []) nodeIndex.set(child.id, { node: child, parent: n });
}

export function getSystemNode(id: string): SystemNode | undefined {
  return nodeIndex.get(id)?.node;
}

export function getSystemParent(id: string): SystemNode | null {
  return nodeIndex.get(id)?.parent ?? null;
}

/** Top-level and child nodes that physically live in a given assembly. */
export function systemNodesForComponent(id: ComponentId): SystemNode[] {
  return [...nodeIndex.values()].map((v) => v.node).filter((n) => n.componentIds.includes(id));
}
