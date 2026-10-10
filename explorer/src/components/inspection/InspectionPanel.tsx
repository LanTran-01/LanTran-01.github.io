import { useEffect, useRef } from "react";
import type { ComponentSpec } from "@/data/types";
import { Panel } from "@/components/layout/Panel";
import { useViewInset } from "@/hooks/useViewInset";
import { IdentificationSection } from "./IdentificationSection";
import { ModeSection } from "./ModeSection";
import { HierarchySection } from "./HierarchySection";
import { TechDataSection } from "./TechDataSection";
import { NavigationSection } from "./NavigationSection";
import styles from "./InspectionPanel.module.css";

/** Right-hand inspection panel (desktop). Scrolls internally; reports its width as the right view inset. */
export function InspectionPanel({ spec }: { spec: ComponentSpec }) {
  const ref = useRef<HTMLElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  useViewInset(ref, "right");

  // A new assembly starts at the top of the panel.
  useEffect(() => {
    scroller.current?.scrollTo({ top: 0 });
  }, [spec.id]);

  return (
    <Panel ref={ref} as="aside" side="right" className={styles.panel} aria-label={`Inspection: ${spec.name}`}>
      <div ref={scroller} className={styles.scroll}>
        <div key={spec.id} className={styles.content}>
          <IdentificationSection spec={spec} />
          <ModeSection spec={spec} />
          <HierarchySection spec={spec} />
          <TechDataSection spec={spec} />
          <NavigationSection spec={spec} />
        </div>
      </div>
    </Panel>
  );
}
