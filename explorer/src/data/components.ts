import { COMPONENTS } from "@machine/catalogue";
import type { ComponentId, ComponentSpec, Subassembly } from "./types";

/**
 * Component catalogue of the machine this build explores (see `@machine` in
 * vite.config.ts), plus the lookups shared by every machine.
 */

export { COMPONENTS };

/* ------------------------------------------------------------------ */
/* Lookups and helpers                                                 */
/* ------------------------------------------------------------------ */

export const COMPONENT_IDS: ComponentId[] = COMPONENTS.map((c) => c.id);

const byId = new Map(COMPONENTS.map((c) => [c.id, c]));
const bySlug = new Map(COMPONENTS.map((c) => [c.slug, c]));

export function getComponent(id: ComponentId): ComponentSpec {
  const c = byId.get(id);
  if (!c) throw new Error(`Unknown component: ${id}`);
  return c;
}

export function getComponentBySlug(slug: string | undefined): ComponentSpec | undefined {
  return slug ? bySlug.get(slug) : undefined;
}

export function isComponentId(value: unknown): value is ComponentId {
  return typeof value === "string" && byId.has(value as ComponentId);
}

/** Depth-first walk of a subassembly forest. */
export function walkSubassemblies(
  nodes: Subassembly[],
  visit: (node: Subassembly, depth: number, parent: Subassembly | null) => void,
  depth = 0,
  parent: Subassembly | null = null,
): void {
  for (const n of nodes) {
    visit(n, depth, parent);
    if (n.children) walkSubassemblies(n.children, visit, depth + 1, n);
  }
}

export function countSubassemblies(spec: ComponentSpec): number {
  let n = 0;
  walkSubassemblies(spec.subassemblies, () => n++);
  return n;
}

export const TOTAL_SUBASSEMBLIES = COMPONENTS.reduce((sum, c) => sum + countSubassemblies(c), 0);

/** Finds a subassembly anywhere in the catalogue, with its owning component. */
export function findSubassembly(
  id: string,
): { component: ComponentSpec; node: Subassembly; parent: Subassembly | null } | undefined {
  for (const component of COMPONENTS) {
    let found: { node: Subassembly; parent: Subassembly | null } | undefined;
    walkSubassemblies(component.subassemblies, (node, _d, parent) => {
      if (!found && node.id === id) found = { node, parent };
    });
    if (found) return { component, ...found };
  }
  return undefined;
}

/** The id itself plus every descendant id. Selecting a parent selects its whole subtree. */
export function subassemblySubtreeIds(id: string): Set<string> {
  const out = new Set<string>();
  const hit = findSubassembly(id);
  if (!hit) return out;
  out.add(hit.node.id);
  if (hit.node.children) walkSubassemblies(hit.node.children, (n) => out.add(n.id));
  return out;
}

/** Neighbour in catalogue order, wrapping around. */
export function adjacentComponent(id: ComponentId, step: 1 | -1): ComponentSpec {
  const i = COMPONENT_IDS.indexOf(id);
  const n = COMPONENTS.length;
  return COMPONENTS[(i + step + n) % n];
}
