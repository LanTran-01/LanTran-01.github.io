import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { getComponent } from "@/data/components";
import { getSystemNode, getSystemParent } from "@/data/subsystems";
import type { ComponentId, FlowKind } from "@/data/types";
import {
  EXPANDABLE_IDS,
  FLOW_ORDER,
  buildAdjacency,
  highlightFor,
  nodeInDirection,
  nodesForComponent,
  resolveEdges,
  visibleNodes,
  type Direction,
} from "@/features/hardware-architecture/graph";
import { computeLayout } from "@/features/hardware-architecture/layout";
import { usePanZoom, type Rect } from "@/features/hardware-architecture/usePanZoom";
import { useTweenedLayout } from "@/features/hardware-architecture/useTweenedLayout";
import { MOBILE_QUERY, useMediaQuery } from "@/hooks/useMediaQuery";
import { useViewInset } from "@/hooks/useViewInset";
import { useExplorerStore } from "@/state/explorerStore";
import { Legend } from "./Legend";
import { NodeDetail } from "./NodeDetail";
import { SystemsDiagram } from "./SystemsDiagram";
import { ZoomControls } from "./ZoomControls";
import styles from "./SystemsPanel.module.css";

const ARROWS: Record<string, Direction> = {
  ArrowLeft: "left",
  ArrowRight: "right",
  ArrowUp: "up",
  ArrowDown: "down",
};

/** Mobile initial zoom keeps nodes tappable; the user pans to the rest. */
const MOBILE_MIN_K = 0.66;

const fmtCoord = (v: number) => `${v < 0 ? "−" : "+"}${Math.abs(Math.round(v)).toString().padStart(4, "0")}`;

/**
 * The /systems overlay: an interactive node-and-edge map of the conceptual
 * systems architecture, synced both ways with the 3D viewer through the store.
 *
 *  - URL `?node=` owns the selection (replace navigation, no history spam).
 *  - Selection → `store.setSystemsNode(id, componentIds)` → viewer highlights assemblies.
 *  - `store.systemsComponent` / `store.hovered` (from the 3D view) → soft node highlight.
 */
export function SystemsPanel() {
  const isMobile = useMediaQuery(MOBILE_QUERY);
  const reducedMotion = useExplorerStore((s) => s.reducedMotion);
  const hovered = useExplorerStore((s) => s.hovered);
  const systemsComponent = useExplorerStore((s) => s.systemsComponent);
  const setSystemsNode = useExplorerStore((s) => s.setSystemsNode);
  const setSystemsComponent = useExplorerStore((s) => s.setSystemsComponent);
  const setHovered = useExplorerStore((s) => s.setHovered);
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();

  const rawNode = params.get("node");
  const selectedId = rawNode && getSystemNode(rawNode) ? rawNode : null;

  const [expanded, setExpanded] = useState<Set<string>>(() => {
    const parent = rawNode ? getSystemParent(rawNode) : null;
    return new Set(parent ? [parent.id] : []);
  });
  const [kinds, setKinds] = useState<Set<FlowKind>>(() => new Set(FLOW_ORDER));
  const [mobileView, setMobileView] = useState<"map" | "model">("map");
  const collapsed = isMobile && mobileView === "model";

  /* ---------------- derived graph ---------------- */
  const visible = useMemo(() => visibleNodes(expanded), [expanded]);
  const layout = useMemo(() => computeLayout(visible), [visible]);
  const display = useTweenedLayout(layout, reducedMotion ? 0 : 260);
  const edges = useMemo(() => resolveEdges(expanded, kinds), [expanded, kinds]);
  const adjacency = useMemo(() => buildAdjacency(edges), [edges]);
  const visibleSelected = selectedId && layout.byId.has(selectedId) ? selectedId : null;
  const highlight = useMemo(() => highlightFor(visibleSelected, adjacency, expanded), [visibleSelected, adjacency, expanded]);
  // Transient hover (3D or the detail panel's assembly buttons) previews over the sticky 3D filter.
  const softComponent = hovered ?? systemsComponent;
  const softIds = useMemo(() => nodesForComponent(softComponent, visible, expanded), [softComponent, visible, expanded]);
  const filterCount = useMemo(
    () => nodesForComponent(systemsComponent, visible, expanded).size,
    [systemsComponent, visible, expanded],
  );

  /* ---------------- refs ---------------- */
  const panelRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const contentRef = useRef<SVGGElement>(null);
  const detailRef = useRef<HTMLElement>(null);
  const zoomReadoutRef = useRef<HTMLSpanElement>(null);
  const coordRef = useRef<HTMLSpanElement>(null);
  const nodeRefs = useRef(new Map<string, SVGGElement>());
  const lastPointerDown = useRef(0);
  const layoutRef = useRef(layout);
  const selectedRef = useRef(selectedId);
  const expandedRef = useRef(expanded);
  useEffect(() => {
    layoutRef.current = layout;
    selectedRef.current = selectedId;
    expandedRef.current = expanded;
  });

  // Desktop: the panel covers the left of the viewport. Mobile: only the collapsed sheet offsets the camera.
  useViewInset(panelRef, isMobile ? "bottom" : "left", !isMobile || collapsed);

  /* ---------------- selection (URL-owned) ---------------- */
  const select = useCallback(
    (id: string | null) => {
      if (id === selectedRef.current) return;
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (id) next.set("node", id);
          else next.delete("node");
          return next;
        },
        { replace: true },
      );
    },
    [setParams],
  );

  // Drop unknown ?node= values.
  useEffect(() => {
    if (rawNode && !selectedId) select(null);
  }, [rawNode, selectedId, select]);

  // Mirror into the store (drives the 3D highlight) and reveal hidden children.
  useEffect(() => {
    const node = selectedId ? getSystemNode(selectedId) : undefined;
    setSystemsNode(node ? node.id : null, node ? node.componentIds : []);
    const parent = selectedId ? getSystemParent(selectedId) : null;
    if (parent) setExpanded((prev) => (prev.has(parent.id) ? prev : new Set(prev).add(parent.id)));
  }, [selectedId, setSystemsNode]);

  useEffect(
    () => () => {
      const s = useExplorerStore.getState();
      s.setSystemsNode(null, []);
      s.setHovered(null);
    },
    [],
  );

  /* ---------------- pan / zoom ---------------- */
  const panZoom = usePanZoom(svgRef, contentRef, {
    reducedMotion,
    onView: (v) => {
      if (zoomReadoutRef.current) zoomReadoutRef.current.textContent = `${Math.round(v.k * 100)}%`;
    },
    onPointerWorld: (p) => {
      if (coordRef.current) coordRef.current.textContent = p ? `X ${fmtCoord(p.x)}  Y ${fmtCoord(p.y)}` : "X ————  Y ————";
    },
    onBackgroundTap: () => select(null),
  });

  /** Viewport area not covered by the detail panel / overlays, in viewport pixels. */
  const freeArea = useCallback((): Rect | null => {
    const vp = viewportRef.current;
    if (!vp || vp.clientWidth < 10 || vp.clientHeight < 10) return null;
    const w = vp.clientWidth;
    const h = vp.clientHeight;
    const det = detailRef.current;
    const area: Rect = { left: 0, top: 8, right: w, bottom: h - 26 };
    if (det && isMobile) area.bottom = h - det.offsetHeight;
    else if (det) area.right = w - det.offsetWidth;
    return area;
  }, [isMobile]);

  const fit = useCallback(
    (animate: boolean) => {
      const vp = viewportRef.current;
      if (!vp) return;
      const area: Rect = { left: 0, top: 0, right: vp.clientWidth, bottom: vp.clientHeight - 18 };
      if (isMobile && !animate) panZoom.fitTo(layoutRef.current.bounds, area, { minK: MOBILE_MIN_K, align: "start" });
      else panZoom.fitTo(layoutRef.current.bounds, area, { animate });
    },
    [panZoom, isMobile],
  );

  // Fit on first render and whenever the viewport size changes.
  useLayoutEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;
    let last = "";
    const run = () => {
      const w = vp.clientWidth;
      const h = vp.clientHeight;
      if (w < 10 || h < 10) return;
      const sig = `${w}x${h}`;
      if (sig === last) return;
      const first = last === "";
      last = sig;
      fit(false);
      // Keep a selected node in view after a resize (the initial reveal is handled below).
      const id = selectedRef.current;
      const box = id ? layoutRef.current.byId.get(id) : undefined;
      const area = freeArea();
      if (!first && box && area) panZoom.ensureVisible(box, area);
    };
    run();
    const ro = new ResizeObserver(run);
    ro.observe(vp);
    return () => ro.disconnect();
  }, [fit, freeArea, panZoom]);

  // Reveal a newly selected node once it is part of the layout.
  const revealRef = useRef<string | null>(null);
  useEffect(() => {
    revealRef.current = selectedId;
  }, [selectedId]);
  useEffect(() => {
    const id = revealRef.current;
    if (!id) return;
    const box = layout.byId.get(id);
    if (!box) return;
    revealRef.current = null;
    const area = freeArea();
    if (area) panZoom.ensureVisible(box, area);
  }, [selectedId, layout, panZoom, freeArea]);

  /* ---------------- node interactions ---------------- */
  const activate = useCallback(
    (id: string, keyboard?: boolean) => {
      if (!keyboard && panZoom.wasDrag()) return;
      select(id);
    },
    [panZoom, select],
  );

  const toggle = useCallback(
    (id: string) => {
      const isOpen = expandedRef.current.has(id);
      setExpanded((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });
      const sel = selectedRef.current;
      if (isOpen && sel && getSystemParent(sel)?.id === id) select(id);
    },
    [select],
  );

  const allExpanded = EXPANDABLE_IDS.every((id) => expanded.has(id));
  const toggleAll = () => {
    if (allExpanded) {
      setExpanded(new Set());
      const parent = selectedId ? getSystemParent(selectedId) : null;
      if (parent) select(parent.id);
    } else {
      setExpanded(new Set(EXPANDABLE_IDS));
    }
  };

  const registerRef = useCallback((id: string, el: SVGGElement | null) => {
    if (el) nodeRefs.current.set(id, el);
    else nodeRefs.current.delete(id);
  }, []);

  const onFocusNode = useCallback(
    (id: string) => {
      // Pointer focus happens during a potential drag; only follow keyboard focus.
      if (performance.now() - lastPointerDown.current < 400) return;
      const box = layoutRef.current.byId.get(id);
      const area = freeArea();
      if (box && area) panZoom.ensureVisible(box, area);
    },
    [freeArea, panZoom],
  );

  const toggleKind = useCallback((k: FlowKind) => {
    setKinds((prev) => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });
  }, []);

  const openAssembly = useCallback(
    (id: ComponentId) => {
      setHovered(null);
      navigate(`/explore/${getComponent(id).slug}`);
    },
    [navigate, setHovered],
  );

  /* ---------------- keyboard ---------------- */
  const onKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === "Escape") {
      if (selectedId) {
        e.preventDefault();
        select(null);
        const el = nodeRefs.current.get(selectedId);
        if (el && detailRef.current?.contains(document.activeElement)) el.focus({ preventScroll: true });
      }
      return;
    }
    const inMap = viewportRef.current?.contains(e.target as Node);
    if (!inMap || e.altKey || e.metaKey || e.ctrlKey) return;
    if (e.key === "+" || e.key === "=") {
      e.preventDefault();
      panZoom.zoomBy(1.25);
    } else if (e.key === "-" || e.key === "_") {
      e.preventDefault();
      panZoom.zoomBy(0.8);
    } else if (e.key === "0") {
      e.preventDefault();
      fit(true);
    } else if (ARROWS[e.key]) {
      e.preventDefault();
      const focused = (document.activeElement as Element | null)?.closest?.("[data-node]")?.getAttribute("data-node");
      const base = focused ?? selectedId;
      const next = base ? nodeInDirection(base, ARROWS[e.key], layout.nodes) : (layout.nodes[0]?.id ?? null);
      if (next) {
        select(next);
        nodeRefs.current.get(next)?.focus({ preventScroll: true });
        const box = layout.byId.get(next);
        const area = freeArea();
        if (box && area) panZoom.ensureVisible(box, area);
      }
    }
  };

  // Esc also clears the selection when focus has left the panel (e.g. after clicking the 3D view).
  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key !== "Escape" || !selectedRef.current) return;
      if (panelRef.current?.contains(document.activeElement)) return;
      const tag = (document.activeElement as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      select(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [select]);

  const selectedNode = selectedId ? getSystemNode(selectedId) : undefined;
  const filterSpec = systemsComponent ? getComponent(systemsComponent) : null;

  return (
    <section
      ref={panelRef}
      className={`${styles.panel} ${collapsed ? styles.collapsed : ""}`}
      aria-label="Systems architecture"
      onKeyDown={onKeyDown}
    >
      <span className={styles.cornerTL} aria-hidden="true" />
      <span className={styles.cornerBR} aria-hidden="true" />

      <header className={styles.header}>
        <div className={styles.titleRow}>
          <span className={styles.titleIndex}>SYS / 01</span>
          <h1 className={styles.title}>Systems Architecture</h1>
          <span className={styles.counts}>
            {String(visible.length).padStart(2, "0")} NODES <i aria-hidden="true">/</i> {String(edges.length).padStart(2, "0")} FLOWS
          </span>
          {isMobile && (
            <button
              type="button"
              className={styles.viewToggle}
              onClick={() => setMobileView((v) => (v === "map" ? "model" : "map"))}
              aria-pressed={mobileView === "model"}
            >
              {mobileView === "map" ? "Show 3D" : "Open map"}
            </button>
          )}
        </div>
        <p className={styles.subtitle}>
          Conceptual illustration of how the RX-105&rsquo;s subsystems could be organised &mdash; not official design data.
        </p>
      </header>

      <div className={styles.toolbar}>
        <Legend kinds={kinds} onToggle={toggleKind} />
        <div className={styles.toolGroup}>
          <button type="button" className={styles.expandBtn} onClick={toggleAll} aria-pressed={allExpanded}>
            <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
              {allExpanded ? <path d="M2 6.5L5 3.5L8 6.5" /> : <path d="M2 3.5L5 6.5L8 3.5" />}
            </svg>
            {allExpanded ? "Collapse all" : "Expand all"}
          </button>
          <ZoomControls
            readoutRef={zoomReadoutRef}
            onZoomIn={() => panZoom.zoomBy(1.25)}
            onZoomOut={() => panZoom.zoomBy(0.8)}
            onFit={() => fit(true)}
          />
        </div>
      </div>

      <div className={styles.body}>
        <div
          ref={viewportRef}
          className={styles.viewport}
          onPointerDownCapture={() => {
            lastPointerDown.current = performance.now();
          }}
          onScroll={(e) => {
            // Focusing an off-screen node can scroll this clipped box; pan/zoom owns positioning.
            e.currentTarget.scrollTop = 0;
            e.currentTarget.scrollLeft = 0;
          }}
        >
          <SystemsDiagram
            svgRef={svgRef}
            contentRef={contentRef}
            display={display}
            edges={edges}
            adjacency={adjacency}
            expanded={expanded}
            selectedId={visibleSelected}
            highlight={highlight}
            softIds={softIds}
            filterActive={!!systemsComponent && !highlight}
            flowAnimation={!reducedMotion}
            onActivate={activate}
            onToggle={toggle}
            onFocusNode={onFocusNode}
            registerRef={registerRef}
          />
          <div className={styles.footer} aria-hidden="true">
            <span className={styles.hints}>
              {isMobile ? "Drag pan · Pinch zoom · Tap select" : "Drag pan · Wheel zoom · Tab / ←↑↓→ move · ↵ select · Esc clear"}
            </span>
            {!isMobile && (
              <span ref={coordRef} className={styles.coords}>
                X &mdash;&mdash;&mdash;&mdash; Y &mdash;&mdash;&mdash;&mdash;
              </span>
            )}
          </div>
        </div>

        {filterSpec && (
          <button
            type="button"
            className={styles.chip}
            data-ui=""
            onClick={() => setSystemsComponent(null)}
            aria-label={`Clear 3D filter: ${filterSpec.name}`}
          >
            <span className={styles.chipKey}>Filter</span>
            <span className={styles.chipValue}>{filterSpec.shortName}</span>
            <span className={styles.chipCount}>{String(filterCount).padStart(2, "0")}</span>
            <svg width="8" height="8" viewBox="0 0 10 10" aria-hidden="true">
              <path d="M1.5 1.5L8.5 8.5M8.5 1.5L1.5 8.5" />
            </svg>
          </button>
        )}

        {selectedId ? (
          <NodeDetail
            key={selectedId}
            ref={detailRef}
            nodeId={selectedId}
            onSelect={select}
            onClose={() => select(null)}
            onPreviewAssembly={setHovered}
            onOpenAssembly={openAssembly}
          />
        ) : (
          collapsed && (
            <p className={styles.sheetHint}>Tap the model to filter subsystems, or open the map to explore the architecture.</p>
          )
        )}
      </div>

      <div className="visually-hidden" aria-live="polite">
        {selectedNode ? `${selectedNode.code} ${selectedNode.label} selected` : ""}
      </div>
    </section>
  );
}
