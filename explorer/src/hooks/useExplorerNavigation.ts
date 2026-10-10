import { useCallback } from "react";
import { useNavigate } from "react-router";
import type { ComponentId } from "@/data/types";
import { getComponent } from "@/data/components";

/** The only sanctioned way to change selection or view: through the URL. */
export function useExplorerNavigation() {
  const navigate = useNavigate();

  const selectComponent = useCallback(
    (id: ComponentId | null) => navigate(id ? `/explore/${getComponent(id).slug}` : "/"),
    [navigate],
  );
  const openSystems = useCallback(() => navigate("/systems"), [navigate]);
  const goHome = useCallback(() => navigate("/"), [navigate]);

  return { selectComponent, openSystems, goHome };
}
