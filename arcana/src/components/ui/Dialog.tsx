import { useEffect, useRef, type ReactNode } from "react";
import s from "./dialog.module.css";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  labelledBy: string;
  /** "modal": centred panel. "sheet": full-height panel sliding up from the bottom (phones). */
  variant?: "modal" | "sheet";
  children: ReactNode;
}

/**
 * Native <dialog> wrapper: focus is trapped and restored by the browser,
 * Escape closes it, and clicking the backdrop closes it.
 */
export function Dialog({ open, onClose, labelledBy, variant = "modal", children }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    else if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className={variant === "sheet" ? s.sheet : s.modal}
      aria-labelledby={labelledBy}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
    >
      <div className={s.inner}>{children}</div>
    </dialog>
  );
}
