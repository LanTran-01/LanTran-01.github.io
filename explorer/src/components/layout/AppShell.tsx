import { Outlet } from "react-router";
import { GundamViewer } from "@/components/viewer/GundamViewer";
import { useGlobalShortcuts } from "@/hooks/useGlobalShortcuts";
import { TopBar } from "./TopBar";
import { StatusBar } from "./StatusBar";
import { RouteSync } from "./RouteSync";
import { LoadingOverlay } from "./LoadingOverlay";
import styles from "./AppShell.module.css";

export function AppShell() {
  useGlobalShortcuts();
  return (
    <div className={styles.shell}>
      <RouteSync />
      <div className={styles.canvas}>
        <GundamViewer />
      </div>
      <LoadingOverlay />
      <TopBar />
      <main className={styles.overlay}>
        <Outlet />
      </main>
      <StatusBar />
    </div>
  );
}
