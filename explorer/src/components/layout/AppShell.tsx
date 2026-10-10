import { Outlet } from "react-router";
import { GundamViewer } from "@/components/viewer/GundamViewer";
import { TopBar } from "./TopBar";
import { StatusBar } from "./StatusBar";
import { RouteSync } from "./RouteSync";
import styles from "./AppShell.module.css";

export function AppShell() {
  return (
    <div className={styles.shell}>
      <RouteSync />
      <div className={styles.canvas}>
        <GundamViewer />
      </div>
      <TopBar />
      <main className={styles.overlay}>
        <Outlet />
      </main>
      <StatusBar />
    </div>
  );
}
