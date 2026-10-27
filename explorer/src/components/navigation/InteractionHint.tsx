import { useEffect, useState } from "react";
import { useExplorerStore } from "@/state/explorerStore";
import { MACHINE, TERMS } from "@/data/machine";
import styles from "./InteractionHint.module.css";

const STORAGE_KEY = `${MACHINE.storagePrefix}.hint.dismissed`;
const PART = `${/^[aeiou]/i.test(TERMS.part) ? "AN" : "A"} ${TERMS.part.toUpperCase()}`;
const TIMEOUT_MS = 8000;

let dismissed = (() => {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
})();

function remember() {
  dismissed = true;
  try {
    sessionStorage.setItem(STORAGE_KEY, "1");
  } catch {
    /* storage unavailable: the module flag still covers this session */
  }
}

/**
 * First-visit affordance at the bottom centre of the free canvas area. Fades
 * after the first pointer/wheel interaction with the canvas or after ~8s.
 */
export function InteractionHint({ touch = false }: { touch?: boolean }) {
  const [initiallyDismissed] = useState(dismissed);
  const [visible, setVisible] = useState(!dismissed);
  const ready = useExplorerStore((s) => s.modelStatus.state === "ready");
  const insets = useExplorerStore((s) => s.viewInsets);

  useEffect(() => {
    if (!visible) return;
    const hide = () => {
      remember();
      setVisible(false);
    };
    const onCanvas = (e: Event) => {
      if (e.target instanceof Element && e.target.closest("canvas")) hide();
    };
    window.addEventListener("pointerdown", onCanvas, { passive: true });
    window.addEventListener("wheel", onCanvas, { passive: true });
    // Count the timeout from when there is actually something to interact with.
    const timer = ready ? window.setTimeout(hide, TIMEOUT_MS) : undefined;
    return () => {
      window.removeEventListener("pointerdown", onCanvas);
      window.removeEventListener("wheel", onCanvas);
      window.clearTimeout(timer);
    };
  }, [visible, ready]);

  if (initiallyDismissed) return null;
  const left = insets.left;
  const right = insets.right;

  return (
    <div
      className={styles.hint}
      data-hidden={!visible || undefined}
      style={{ left: `calc(${left}px + (100% - ${left + right}px) / 2)` }}
      aria-hidden={!visible || undefined}
    >
      <span className={styles.tick} aria-hidden="true" />
      {touch ? (
        <span>DRAG TO ROTATE · PINCH TO ZOOM · TAP {PART}</span>
      ) : (
        <span>DRAG TO ROTATE · SCROLL TO ZOOM · CLICK {PART}</span>
      )}
      <span className={styles.tick} aria-hidden="true" />
    </div>
  );
}
