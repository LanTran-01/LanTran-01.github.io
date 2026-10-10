import type { Basis, PartLayer } from "@/data/types";
import { LAYER_TEXT } from "./labels";
import styles from "./tags.module.css";

const BASIS_TEXT: Record<Basis, { short: string; title: string }> = {
  reference: { short: "REF", title: "Reference — broad, non-numeric published descriptor" },
  conceptual: { short: "CONCEPT", title: "Conceptual — invented for this visualization, not canon" },
};

export function BasisTag({ basis }: { basis: Basis }) {
  const t = BASIS_TEXT[basis];
  return (
    <span className={styles.tag} data-basis={basis} title={t.title}>
      {t.short}
      <span className="visually-hidden"> ({t.title})</span>
    </span>
  );
}



export function LayerTag({ layer }: { layer: PartLayer }) {
  return (
    <span className={styles.tag} data-layer={layer} title={`${LAYER_TEXT[layer].long} layer`}>
      {LAYER_TEXT[layer].short}
    </span>
  );
}

/** Caution-coloured marker for prototype / disclosure rows. */
export function ProtoTag({ children = "PROTO" }: { children?: string }) {
  return (
    <span className={styles.tag} data-proto="">
      {children}
    </span>
  );
}
