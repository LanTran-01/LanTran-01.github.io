import { useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { COMPONENTS, adjacentComponent, getComponentBySlug } from "@/data/components";
import type { ComponentSpec } from "@/data/types";
import { Panel } from "@/components/layout/Panel";
import { BottomSheet } from "@/components/layout/BottomSheet";
import { PeekButton, SheetPeek } from "@/components/layout/SheetPeek";
import { ArrowLeftIcon, ChevronLeftIcon, ChevronRightIcon } from "@/components/layout/Icons";
import { ComponentIndex } from "@/components/navigation/ComponentIndex";
import { InspectionPanel } from "@/components/inspection/InspectionPanel";
import { IdentificationSection } from "@/components/inspection/IdentificationSection";
import { ModeSection } from "@/components/inspection/ModeSection";
import { HierarchySection } from "@/components/inspection/HierarchySection";
import { TechDataSection } from "@/components/inspection/TechDataSection";
import { NavigationSection } from "@/components/inspection/NavigationSection";
import { useMediaQuery, MOBILE_QUERY } from "@/hooks/useMediaQuery";
import { useViewInset } from "@/hooks/useViewInset";
import { useExplorerStore } from "@/state/explorerStore";
import layout from "@/components/layout/PageLayout.module.css";

function DesktopDetail({ spec }: { spec: ComponentSpec }) {
  const rail = useRef<HTMLElement>(null);
  useViewInset(rail, "left");
  return (
    <>
      <Panel ref={rail} as="aside" side="left" className={layout.rail} aria-label="Assemblies">
        <ComponentIndex variant="rail" />
        <Link to="/" className={layout.railBack} title="Back to full machine (Esc)">
          <ArrowLeftIcon size={14} />
          <span className={layout.railBackText}>Full machine</span>
        </Link>
      </Panel>
      <InspectionPanel spec={spec} />
    </>
  );
}

function MobileDetail({ spec }: { spec: ComponentSpec }) {
  const navigate = useNavigate();
  const mode = useExplorerStore((s) => s.mode);
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("inspect");
  const index = COMPONENTS.findIndex((c) => c.id === spec.id) + 1;
  const prev = adjacentComponent(spec.id, -1);
  const next = adjacentComponent(spec.id, 1);

  return (
    <BottomSheet
      label={`Inspection: ${spec.name}`}
      open={open}
      onOpenChange={setOpen}
      activeTab={tab}
      onTabChange={setTab}
      peek={
        <SheetPeek
          open={open}
          onToggle={() => setOpen(!open)}
          kicker={
            <>
              {String(index).padStart(2, "0")}/{COMPONENTS.length} · {spec.prefix} · {mode}
            </>
          }
          title={spec.name}
          before={
            <PeekButton label={`Previous assembly: ${prev.name}`} onClick={() => navigate(`/explore/${prev.slug}`)}>
              <ChevronLeftIcon />
            </PeekButton>
          }
          after={
            <PeekButton label={`Next assembly: ${next.name}`} onClick={() => navigate(`/explore/${next.slug}`)}>
              <ChevronRightIcon />
            </PeekButton>
          }
        />
      }
      tabs={[
        {
          id: "assemblies",
          label: "Assemblies",
          content: <ComponentIndex onNavigate={() => setOpen(false)} />,
        },
        {
          id: "inspect",
          label: "Inspect",
          content: (
            <div className={layout.sheetSection}>
              <IdentificationSection spec={spec} compact />
              <ModeSection spec={spec} />
              <HierarchySection spec={spec} />
            </div>
          ),
        },
        {
          id: "data",
          label: "Data",
          content: (
            <div className={layout.sheetSection}>
              <TechDataSection spec={spec} withDescription />
              <NavigationSection spec={spec} />
            </div>
          ),
        },
      ]}
    />
  );
}

/** `/explore/:slug` — one assembly under inspection. Unknown slugs are redirected by RouteSync. */
export function ComponentDetailPage() {
  const { slug } = useParams();
  const spec = getComponentBySlug(slug);
  const mobile = useMediaQuery(MOBILE_QUERY);
  if (!spec) return null;
  return mobile ? <MobileDetail spec={spec} /> : <DesktopDetail spec={spec} />;
}
