import { useExplorerStore } from "@/state/explorerStore";
import { ResetIcon } from "@/components/layout/Icons";
import styles from "./ResetViewButton.module.css";

interface ResetViewButtonProps {
  label?: string;
  /** "float" sits over the canvas; "inline" lives inside a panel. */
  variant?: "float" | "inline";
  className?: string;
}

/** Returns the camera to its framing for the current selection (store.resetCamera). */
export function ResetViewButton({ label = "Reset view", variant = "float", className }: ResetViewButtonProps) {
  const resetCamera = useExplorerStore((s) => s.resetCamera);
  return (
    <button
      type="button"
      className={[styles.button, className].filter(Boolean).join(" ")}
      data-variant={variant}
      onClick={resetCamera}
      aria-keyshortcuts="R"
    >
      <ResetIcon />
      <span>{label}</span>
      <kbd className="kbd" aria-hidden="true">
        R
      </kbd>
    </button>
  );
}
