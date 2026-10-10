import { SYSTEM_EDGES, SYSTEM_NODES, getSystemNode, getSystemParent } from "@/data/subsystems";
import type { ComponentId, FlowKind, SystemEdge, SystemNode } from "@/data/types";

/**
 * Pure graph logic for the systems map: which nodes are visible for a given
 * expand state, how raw edges resolve onto visible nodes, adjacency and the
 * highlight set for a selection. No React, no DOM.
 */

export const FLOW_ORDER: FlowKind[] = ["power", "data", "control", "propellant"];

/** Ids of every top-level node that has children. */
export const EXPANDABLE_IDS: string[] = SYSTEM_NODES.filter((n) => n.children?.length).map((n) => n.id);

/** Every node id, parents and children. */
export const ALL_NODE_IDS: string[] = SYSTEM_NODES.flatMap((n) => [n.id, ...(n.children ?? []).map((c) => c.id)]);

export interface VisibleNode {
  node: SystemNode;
  parentId: string | null;
  depth: 0 | 1;
  /** Column of the node; children inherit their parent's column. */
  col: number;
}

/** Top-level nodes in (col, row) order, each followed by its children when expanded. */
export function visibleNodes(expanded: ReadonlySet<string>): VisibleNode[] {
  const out: VisibleNode[] = [];
  const tops = [...SYSTEM_NODES].sort((a, b) => a.col - b.col || a.row - b.row);
  for (const n of tops) {
    out.push({ node: n, parentId: null, depth: 0, col: n.col });
    if (n.children && expanded.has(n.id)) {
      const kids = [...n.children].sort((a, b) => a.row - b.row);
      for (const c of kids) out.push({ node: c, parentId: n.id, depth: 1, col: n.col });
    }
  }
  return out;
}

/** The node itself when visible, otherwise its nearest visible ancestor. */
export function resolveVisibleId(id: string, expanded: ReadonlySet<string>): string | null {
  const node = getSystemNode(id);
  if (!node) return null;
  const parent = getSystemParent(id);
  if (parent && !expanded.has(parent.id)) return parent.id;
  return id;
}

export interface ResolvedEdge {
  /** `${from}>${to}:${kind}` — stable across renders for a given expand state. */
  key: string;
  from: string;
  to: string;
  kind: FlowKind;
  /** The raw data edges merged into this visible edge (length > 1 when deduped). */
  sources: SystemEdge[];
}

/**
 * Maps raw edges onto visible endpoints, drops edges that collapse into a
 * single node and merges duplicates (same endpoints and kind).
 */
export function resolveEdges(expanded: ReadonlySet<string>, kinds: ReadonlySet<FlowKind>): ResolvedEdge[] {
  const merged = new Map<string, ResolvedEdge>();
  for (const e of SYSTEM_EDGES) {
    if (!kinds.has(e.kind)) continue;
    const from = resolveVisibleId(e.from, expanded);
    const to = resolveVisibleId(e.to, expanded);
    if (!from || !to || from === to) continue;
    const key = `${from}>${to}:${e.kind}`;
    const hit = merged.get(key);
    if (hit) hit.sources.push(e);
    else merged.set(key, { key, from, to, kind: e.kind, sources: [e] });
  }
  return [...merged.values()];
}

export interface Adjacency {
  incoming: Map<string, ResolvedEdge[]>;
  outgoing: Map<string, ResolvedEdge[]>;
}

export function buildAdjacency(edges: ResolvedEdge[]): Adjacency {
  const incoming = new Map<string, ResolvedEdge[]>();
  const outgoing = new Map<string, ResolvedEdge[]>();
  const push = (m: Map<string, ResolvedEdge[]>, k: string, e: ResolvedEdge) => {
    const list = m.get(k);
    if (list) list.push(e);
    else m.set(k, [e]);
  };
  for (const e of edges) {
    push(outgoing, e.from, e);
    push(incoming, e.to, e);
  }
  return { incoming, outgoing };
}

export interface Highlight {
  nodes: Set<string>;
  edges: Set<string>;
}

/**
 * The selected node, its direct neighbours and every edge touching it. When an
 * expanded parent is selected, its visible children count as part of it, so
 * the highlight matches the inputs / outputs listed in the detail panel.
 */
export function highlightFor(id: string | null, adj: Adjacency, expanded: ReadonlySet<string>): Highlight | null {
  if (!id) return null;
  const node = getSystemNode(id);
  const group = [id, ...(node?.children && expanded.has(id) ? node.children.map((c) => c.id) : [])];
  const nodes = new Set<string>(group);
  const edges = new Set<string>();
  for (const g of group) {
    for (const e of adj.incoming.get(g) ?? []) {
      edges.add(e.key);
      nodes.add(e.from);
    }
    for (const e of adj.outgoing.get(g) ?? []) {
      edges.add(e.key);
      nodes.add(e.to);
    }
  }
  return { nodes, edges };
}

/** Visible nodes linked to an assembly. A collapsed parent counts when any child matches. */
export function nodesForComponent(
  componentId: ComponentId | null,
  visible: VisibleNode[],
  expanded: ReadonlySet<string>,
): Set<string> {
  const out = new Set<string>();
  if (!componentId) return out;
  for (const v of visible) {
    const n = v.node;
    if (n.componentIds.includes(componentId)) out.add(n.id);
    else if (v.depth === 0 && n.children && !expanded.has(n.id) && n.children.some((c) => c.componentIds.includes(componentId)))
      out.add(n.id);
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Inputs / outputs for the detail panel                               */
/* ------------------------------------------------------------------ */

export interface NodeFlow {
  key: string;
  peer: SystemNode;
  kind: FlowKind;
  label?: string;
  /** Set when the flow actually attaches to one of this node's children. */
  via?: SystemNode;
}

/**
 * Raw (unresolved) inputs and outputs of a node. For a parent, flows of its
 * children are included with `via`, and flows internal to its subtree are skipped.
 */
export function nodeFlows(id: string): { inputs: NodeFlow[]; outputs: NodeFlow[] } {
  const node = getSystemNode(id);
  if (!node) return { inputs: [], outputs: [] };
  const subtree = new Set<string>([id, ...(node.children ?? []).map((c) => c.id)]);
  const inputs: NodeFlow[] = [];
  const outputs: NodeFlow[] = [];
  const seen = new Set<string>();
  for (const e of SYSTEM_EDGES) {
    const fromIn = subtree.has(e.from);
    const toIn = subtree.has(e.to);
    if (fromIn === toIn) continue;
    const own = fromIn ? e.from : e.to;
    const peerId = fromIn ? e.to : e.from;
    const peer = getSystemNode(peerId);
    if (!peer) continue;
    const dir = fromIn ? "out" : "in";
    const via = own !== id ? getSystemNode(own) : undefined;
    const key = `${dir}:${peerId}:${e.kind}:${own}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const flow: NodeFlow = { key, peer, kind: e.kind, label: e.label, via };
    (dir === "out" ? outputs : inputs).push(flow);
  }
  const order = (a: NodeFlow, b: NodeFlow) => FLOW_ORDER.indexOf(a.kind) - FLOW_ORDER.indexOf(b.kind);
  return { inputs: inputs.sort(order), outputs: outputs.sort(order) };
}

/** Number of raw edges per kind, for legend counts. */
export const FLOW_COUNTS: Record<FlowKind, number> = SYSTEM_EDGES.reduce(
  (acc, e) => {
    acc[e.kind] += 1;
    return acc;
  },
  { power: 0, data: 0, control: 0, propellant: 0 } as Record<FlowKind, number>,
);

/* ------------------------------------------------------------------ */
/* Spatial keyboard navigation                                         */
/* ------------------------------------------------------------------ */

export type Direction = "left" | "right" | "up" | "down";

interface Centred {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

/**
 * Nearest node in a direction. Candidates must lie in the half-plane of the
 * direction; the score weights off-axis distance more heavily so movement
 * feels like it follows the grid.
 */
export function nodeInDirection(fromId: string, dir: Direction, boxes: Iterable<Centred>): string | null {
  const list = [...boxes];
  const from = list.find((b) => b.id === fromId);
  if (!from) return null;
  const fx = from.x + from.w / 2;
  const fy = from.y + from.h / 2;
  let best: string | null = null;
  let bestScore = Infinity;
  for (const b of list) {
    if (b.id === fromId) continue;
    const dx = b.x + b.w / 2 - fx;
    const dy = b.y + b.h / 2 - fy;
    const along = dir === "left" ? -dx : dir === "right" ? dx : dir === "up" ? -dy : dy;
    const across = dir === "left" || dir === "right" ? Math.abs(dy) : Math.abs(dx);
    if (along <= 4) continue;
    const score = along + across * (dir === "left" || dir === "right" ? 1.6 : 3);
    if (score < bestScore) {
      bestScore = score;
      best = b.id;
    }
  }
  return best;
}
