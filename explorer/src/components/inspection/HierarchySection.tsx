import { useMemo, useRef, type KeyboardEvent } from "react";
import { countSubassemblies, findSubassembly, subassemblySubtreeIds } from "@/data/components";
import type { ComponentSpec, Subassembly } from "@/data/types";
import { useExplorerStore } from "@/state/explorerStore";
import { isModeSupported, useModeCapabilities, useSelectedCapabilities } from "@/hooks/useInspectionModes";
import { MACHINE, TERMS } from "@/data/machine";
import { CloseIcon } from "@/components/layout/Icons";
import { LayerTag } from "./BasisTag";
import { SectionHead } from "./SectionHead";
import { layerLabel } from "./labels";
import s from "./inspection.module.css";
import t from "./HierarchySection.module.css";

/** Toggle a subassembly; reveal internals by switching exterior → cutaway when possible. */
function useSelectSubassembly() {
  const caps = useModeCapabilities();
  return (node: Subassembly) => {
    const st = useExplorerStore.getState();
    if (st.selectedSubassembly === node.id) {
      st.setSelectedSubassembly(null);
      return;
    }
    st.setSelectedSubassembly(node.id);
    if (node.layer === "internal" && st.mode === "exterior" && isModeSupported("cutaway", caps)) st.setMode("cutaway");
  };
}

interface NodeProps {
  node: Subassembly;
  inSelection: Set<string>;
  modelled: Set<string> | null;
  onSelect: (node: Subassembly) => void;
}

function subtreeModelled(node: Subassembly, modelled: Set<string>): boolean {
  if (modelled.has(node.id)) return true;
  return (node.children ?? []).some((c) => subtreeModelled(c, modelled));
}

function TreeNode({ node, inSelection, modelled, onSelect }: NodeProps) {
  const selectedId = useExplorerStore((st) => st.selectedSubassembly);
  const hoveredId = useExplorerStore((st) => st.hoveredSubassembly);
  const setHovered = useExplorerStore((st) => st.setHoveredSubassembly);
  const selected = selectedId === node.id;
  const included = !selected && inSelection.has(node.id);
  const absent = modelled ? !subtreeModelled(node, modelled) : false;

  return (
    <li className={t.node}>
      <button
        type="button"
        className={t.row}
        data-tree-row=""
        aria-pressed={selected}
        data-included={included || undefined}
        data-hover={hoveredId === node.id || undefined}
        data-absent={absent || undefined}
        title={absent ? `${node.name} — not modelled in the current prototype` : node.description}
        onClick={() => onSelect(node)}
        onMouseEnter={() => setHovered(node.id)}
        onMouseLeave={() => {
          if (useExplorerStore.getState().hoveredSubassembly === node.id) setHovered(null);
        }}
        onFocus={() => setHovered(node.id)}
        onBlur={() => {
          if (useExplorerStore.getState().hoveredSubassembly === node.id) setHovered(null);
        }}
      >
        <span className={t.code}>{node.code}</span>
        <span className={t.name}>
          {node.name}
          {absent && <span className="visually-hidden"> (not modelled in the current prototype)</span>}
        </span>
        <LayerTag layer={node.layer} />
      </button>
      {node.children && node.children.length > 0 && (
        <ul className={t.children}>
          {node.children.map((c) => (
            <TreeNode key={c.id} node={c} inSelection={inSelection} modelled={modelled} onSelect={onSelect} />
          ))}
        </ul>
      )}
    </li>
  );
}

const cutawayLabel = (MACHINE.modes.list.find((m) => m.id === "cutaway")?.label ?? "Cutaway").toLowerCase();
/** "cutaway", or "internal view" for machines that call the mode "Internal". */
const CUTAWAY_NAME = cutawayLabel === "internal" ? "internal view" : cutawayLabel;

/** C — hardware hierarchy tree plus the selected subassembly's detail. */
export function HierarchySection({ spec }: { spec: ComponentSpec }) {
  const selectedId = useExplorerStore((st) => st.selectedSubassembly);
  const setSelected = useExplorerStore((st) => st.setSelectedSubassembly);
  const caps = useSelectedCapabilities();
  const onSelect = useSelectSubassembly();
  const treeRef = useRef<HTMLDivElement>(null);

  const inSelection = useMemo(() => (selectedId ? subassemblySubtreeIds(selectedId) : new Set<string>()), [selectedId]);
  const modelled = useMemo(() => (caps ? new Set(caps.subassemblies) : null), [caps]);
  const hit = selectedId ? findSubassembly(selectedId) : undefined;
  const detail = hit && hit.component.id === spec.id ? hit : undefined;

  // ↑/↓ move between rows, Home/End jump.
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(e.key)) return;
    const rows = [...(treeRef.current?.querySelectorAll<HTMLButtonElement>("[data-tree-row]") ?? [])];
    const i = rows.indexOf(document.activeElement as HTMLButtonElement);
    if (i < 0) return;
    e.preventDefault();
    const next =
      e.key === "Home" ? 0 : e.key === "End" ? rows.length - 1 : Math.min(rows.length - 1, Math.max(0, i + (e.key === "ArrowDown" ? 1 : -1)));
    rows[next]?.focus();
  };

  return (
    <section className={s.section} aria-labelledby="insp-c">
      <SectionHead index="C" title="Hardware hierarchy" id="insp-c" aside={`${countSubassemblies(spec)} NODES`} />
      <div ref={treeRef} className={t.tree} onKeyDown={onKeyDown}>
        <button
          type="button"
          className={t.root}
          onClick={() => setSelected(null)}
          aria-label={`${spec.name} — clear subassembly selection`}
          data-idle={!selectedId || undefined}
        >
          <span className={t.rootMark} aria-hidden="true" />
          <span className={t.code}>{spec.prefix}-000</span>
          <span className={t.rootName}>{spec.name}</span>
        </button>
        <ul className={t.children} data-level="0" aria-label={`${spec.shortName} subassemblies`}>
          {spec.subassemblies.map((n) => (
            <TreeNode key={n.id} node={n} inSelection={inSelection} modelled={modelled} onSelect={onSelect} />
          ))}
        </ul>
      </div>

      <div className={t.legend} aria-hidden="true">
        {(["armor", "frame", "internal"] as const).map((layer) => (
          <span key={layer}>
            <LayerTag layer={layer} /> {MACHINE.layers[layer].long.toLowerCase()}
          </span>
        ))}
        {modelled && modelled.size > 0 && (
          <span className={t.absentKey}>
            <span className={t.absentMark} /> not modelled
          </span>
        )}
      </div>

      {detail ? (
        <div className={t.detail} aria-live="polite">
          <div className={t.detailHead}>
            <span className={t.code}>{detail.node.code}</span>
            <span className={t.detailName}>{detail.node.name}</span>
            <button
              type="button"
              className={t.clear}
              onClick={() => setSelected(null)}
              aria-label="Clear subassembly selection"
              aria-keyshortcuts="Escape"
            >
              <CloseIcon size={14} />
            </button>
          </div>
          <p className={t.detailBody}>{detail.node.description}</p>
          <dl className={t.detailRows}>
            <div>
              <dt>Layer</dt>
              <dd>
                {layerLabel(detail.node.layer)} <LayerTag layer={detail.node.layer} />
              </dd>
            </div>
            <div>
              <dt>Parent</dt>
              <dd>
                {detail.parent ? (
                  <button type="button" className={t.parentLink} onClick={() => detail.parent && onSelect(detail.parent)}>
                    <span className={t.code}>{detail.parent.code}</span> {detail.parent.name}
                  </button>
                ) : (
                  <>
                    <span className={t.code}>{spec.prefix}-000</span> {spec.shortName} {TERMS.part}
                  </>
                )}
              </dd>
            </div>
            {detail.node.children && (
              <div>
                <dt>Children</dt>
                <dd className={t.mono}>{String(detail.node.children.length).padStart(2, "0")}</dd>
              </div>
            )}
          </dl>
        </div>
      ) : (
        <p className={s.note}>
          Select a node to isolate it in the 3D view. Internal nodes open the {CUTAWAY_NAME}.
        </p>
      )}
    </section>
  );
}
