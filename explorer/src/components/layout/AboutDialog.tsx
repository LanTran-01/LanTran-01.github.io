import { useEffect, useRef } from "react";
import { MACHINE, TERMS } from "@/data/machine";
import { CloseIcon } from "./Icons";
import styles from "./AboutDialog.module.css";

interface AboutDialogProps {
  open: boolean;
  onClose: () => void;
}

const { about } = MACHINE;
const article = /^[aeiou]/i.test(TERMS.part) ? "an" : "a";

const CONTROLS: [string[], string][] = [
  [["Drag"], "Rotate the camera"],
  [["Scroll", "Pinch"], "Zoom"],
  [["Right-drag", "2-finger"], "Pan"],
  [["Click"], `Select ${article} ${TERMS.part}`],
  [["Esc"], `Clear sub-selection, then back to the full ${TERMS.whole}`],
  [["R"], "Reset the view"],
  [MACHINE.modes.list.map((m) => m.key), MACHINE.modes.list.map((m) => m.label).join(" · ")],
  [["←", "→"], `Previous / next ${TERMS.part}`],
];

function BasisLegendList() {
  return (
    <dl className={styles.legend}>
      <dt>
        <span className={styles.tagRef}>{MACHINE.basis.reference.short}</span>
      </dt>
      <dd>{MACHINE.basis.reference.about}</dd>
      <dt>
        <span className={styles.tag}>{MACHINE.basis.conceptual.short}</span>
      </dt>
      <dd>{MACHINE.basis.conceptual.about}</dd>
    </dl>
  );
}

function ControlsList() {
  return (
    <dl className={styles.controls}>
      {CONTROLS.map(([keys, action]) => (
        <div key={action} className={styles.controlRow}>
          <dt>
            {keys.map((k) => (
              <kbd key={k} className="kbd">
                {k}
              </kbd>
            ))}
          </dt>
          <dd>{action}</dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * Modal "About" sheet. Uses a native <dialog> opened with showModal(), which
 * makes the rest of the page inert (focus is trapped inside), closes on Esc and
 * restores focus to the trigger.
 */
export function AboutDialog({ open, onClose }: AboutDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const handleClose = () => onClose();
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [onClose]);

  return (
    <dialog
      ref={ref}
      className={styles.dialog}
      aria-labelledby="about-title"
      aria-describedby="about-lede"
      onClick={(e) => {
        // Clicks on the ::backdrop land on the dialog element itself.
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={styles.inner}>
        <header className={styles.head}>
          <div>
            <p className="label">{about.label}</p>
            <h2 id="about-title" className={styles.title}>
              {about.title}
            </h2>
          </div>
          <button type="button" className={styles.close} onClick={onClose} aria-label="Close about dialog" autoFocus>
            <CloseIcon />
          </button>
        </header>

        <p id="about-lede" className={styles.lede}>
          {about.lede}
        </p>

        {about.sections.map((section, i) => {
          const id = `about-s${i + 1}`;
          return (
            <section key={section.title} className={styles.section} aria-labelledby={id}>
              <span className={styles.idx}>{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3 id={id} className={styles.h3}>
                  {section.title}
                </h3>
                {"kind" in section ? (
                  section.kind === "basis" ? (
                    <BasisLegendList />
                  ) : (
                    <ControlsList />
                  )
                ) : section.fine ? (
                  <p className={styles.fine}>{section.body}</p>
                ) : (
                  section.body
                )}
              </div>
            </section>
          );
        })}
      </div>
    </dialog>
  );
}
