import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { getComponentBySlug } from "@/data/components";
import { useExplorerStore } from "@/state/explorerStore";

/** Mirrors the URL into the store (selection + view). Unknown slugs go home. */
export function RouteSync() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const syncRoute = useExplorerStore((s) => s.syncRoute);

  useEffect(() => {
    const explore = pathname.match(/^\/explore\/([^/]+)\/?$/);
    if (explore) {
      const spec = getComponentBySlug(decodeURIComponent(explore[1]));
      if (!spec) {
        navigate("/", { replace: true });
        return;
      }
      syncRoute("explorer", spec.id);
      return;
    }
    if (/^\/systems\/?$/.test(pathname)) {
      syncRoute("systems", null);
      return;
    }
    syncRoute("explorer", null);
  }, [pathname, navigate, syncRoute]);

  return null;
}
