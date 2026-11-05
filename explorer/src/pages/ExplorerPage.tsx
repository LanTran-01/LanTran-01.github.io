import { useRef, useState } from "react";
import { COMPONENTS, TOTAL_SUBASSEMBLIES } from "@/data/components";
import { MACHINE, MACHINE_SCOPE, TERMS, capitalize } from "@/data/machine";
import { Panel } from "@/components/layout/Panel";
import { BottomSheet } from "@/components/layout/BottomSheet";
import { PeekButton, SheetPeek } from "@/components/layout/SheetPeek";
import { ResetIcon } from "@/components/layout/Icons";
import { ModelIdPanel } from "@/components/inspection/ModelIdPanel";
import { ExhibitNotes, ExhibitPanel } from "@/components/inspection/ExhibitNotes";
import { ComponentIndex } from "@/components/navigation/ComponentIndex";
import { InteractionHint } from "@/components/navigation/InteractionHint";
import { ResetViewButton } from "@/components/navigation/ResetViewButton";
import { ViewModeBar } from "@/components/navigation/ViewModeBar";
import { useMediaQuery, MOBILE_QUERY } from "@/hooks/useMediaQuery";
import { useViewInset } from "@/hooks/useViewInset";
import { useExplorerStore } from "@/state/explorerStore";
import layout from "@/components/layout/PageLayout.module.css";

const { exhibit } = MACHINE;

function DesktopOverview() {
  const ref = useRef<HTMLElement>(null);
  useViewInset(ref, "left");
  // With an exhibit panel on the right, the floating controls sit at the edge of the free canvas area.
  const beside = exhibit ? "" : undefined;
  return (
    <>
      <Panel ref={ref} as="aside" side="left" className={layout.left} aria-label={`${capitalize(TERMS.whole)} overview`}>
        <ModelIdPanel />
        <ComponentIndex />
      </Panel>
      {exhibit && <ExhibitPanel exhibit={exhibit} />}
      <InteractionHint />
      {MACHINE_SCOPE && (
        <div className={layout.controlsTop} data-beside-panel={beside}>
          <ViewModeBar />
        </div>
      )}
      <div className={layout.controls} data-beside-panel={beside}>
        <ResetViewButton />
      </div>
    </>
  );
}

function MobileOverview() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState(TERMS.parts);
  const resetCamera = useExplorerStore((s) => s.resetCamera);
  return (
    <>
      <InteractionHint touch />
      {MACHINE_SCOPE && (
        <div className={layout.sheetControls}>
          <ViewModeBar />
        </div>
      )}
      <BottomSheet
        label={`${capitalize(TERMS.whole)} overview`}
        open={open}
        onOpenChange={setOpen}
        activeTab={tab}
        onTabChange={setTab}
        peek={
          <SheetPeek
            open={open}
            onToggle={() => setOpen(!open)}
            kicker={`${MACHINE.overview.kicker} · ${COMPONENTS.length} ${TERMS.parts} · ${TOTAL_SUBASSEMBLIES} subassemblies`}
            title={MACHINE.overview.title}
            after={
              <PeekButton label="Reset view" onClick={resetCamera}>
                <ResetIcon />
              </PeekButton>
            }
          />
        }
        tabs={[
          {
            id: TERMS.parts,
            label: capitalize(TERMS.parts),
            content: <ComponentIndex onNavigate={() => setOpen(false)} />,
          },
          { id: "model", label: "Model", content: <ModelIdPanel /> },
          ...(exhibit
            ? [{ id: "exhibit", label: exhibit.title, content: <ExhibitNotes exhibit={exhibit} /> }]
            : []),
        ]}
      />
    </>
  );
}

/** Overview route (`/`): machine identification, assembly index, first-visit hint. */
export function ExplorerPage() {
  const mobile = useMediaQuery(MOBILE_QUERY);
  return mobile ? <MobileOverview /> : <DesktopOverview />;
}
