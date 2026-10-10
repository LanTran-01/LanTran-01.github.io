import { Navigate, Route, Routes } from "react-router";
import { AppShell } from "@/components/layout/AppShell";
import { ExplorerPage } from "@/pages/ExplorerPage";
import { ComponentDetailPage } from "@/pages/ComponentDetailPage";
import { SystemsPage } from "@/pages/SystemsPage";

/**
 * Routes render *overlays* only. The 3D viewer lives in AppShell and is never
 * unmounted, so moving between the overview, an assembly and the systems map
 * keeps the scene, camera and loaded model.
 */
export function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<ExplorerPage />} />
        <Route path="explore/:slug" element={<ComponentDetailPage />} />
        <Route path="systems" element={<SystemsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
