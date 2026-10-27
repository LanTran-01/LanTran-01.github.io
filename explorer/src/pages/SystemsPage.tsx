import { SystemsPanel } from "@/components/architecture/SystemsPanel";
import { ViewModeBar } from "@/components/navigation/ViewModeBar";
import { MACHINE_SCOPE } from "@/data/machine";
import { useMediaQuery, MOBILE_QUERY } from "@/hooks/useMediaQuery";
import layout from "@/components/layout/PageLayout.module.css";

/**
 * /systems — the conceptual systems architecture map, shown over the
 * persistent 3D viewer (which stays visible to the right on desktop). When
 * modes apply to the whole machine, the view-mode control floats over the model.
 */
export function SystemsPage() {
  const mobile = useMediaQuery(MOBILE_QUERY);
  return (
    <>
      <SystemsPanel />
      {MACHINE_SCOPE && !mobile && (
        <div className={layout.controlsTop}>
          <ViewModeBar />
        </div>
      )}
    </>
  );
}
