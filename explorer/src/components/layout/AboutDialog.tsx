import { useEffect, useRef } from "react";
import { CloseIcon } from "./Icons";
import styles from "./AboutDialog.module.css";

interface AboutDialogProps {
  open: boolean;
  onClose: () => void;
}

const CONTROLS: [string[], string][] = [
  [["Drag"], "Rotate the camera"],
  [["Scroll", "Pinch"], "Zoom"],
  [["Right-drag", "2-finger"], "Pan"],
  [["Click"], "Select an assembly"],
  [["Esc"], "Clear sub-selection, then back to the full machine"],
  [["R"], "Reset the view"],
  [["1", "2", "3", "4"], "Exterior · Cutaway · Exploded · Architecture"],
  [["←", "→"], "Previous / next assembly"],
];

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
            <p className="label">About · Ξ Hardware Explorer</p>
            <h2 id="about-title" className={styles.title}>
              An unofficial engineering study
            </h2>
          </div>
          <button type="button" className={styles.close} onClick={onClose} aria-label="Close about dialog" autoFocus>
            <CloseIcon />
          </button>
        </header>

        <p id="about-lede" className={styles.lede}>
          An interactive explorer for investigating the RX-105 Ξ Gundam as a machine: its ten assemblies, a conceptual
          internal hardware breakdown and a conceptual systems architecture.
        </p>

        <section className={styles.section} aria-labelledby="about-s1">
          <span className={styles.idx}>01</span>
          <div>
            <h3 id="about-s1" className={styles.h3}>
              What you are looking at
            </h3>
            <p>
              The 3D machine is a <strong>procedural prototype silhouette</strong> built from geometric primitives. It
              is not an accurate or licensed Ξ Gundam model.
            </p>
            <p>
              Internal hardware, subassemblies, data flows and the systems map are <strong>conceptual
              visualizations</strong> written for this study. They are not canon and are not taken from official
              technical material. No precise measurements, ratings or materials are claimed.
            </p>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="about-s2">
          <span className={styles.idx}>02</span>
          <div>
            <h3 id="about-s2" className={styles.h3}>
              Data labels
            </h3>
            <dl className={styles.legend}>
              <dt>
                <span className={styles.tagRef}>REF</span>
              </dt>
              <dd>
                <strong>Reference.</strong> A broad, non-numeric descriptor that is widely published for the RX-105,
                for example that it carries a Minovsky flight system.
              </dd>
              <dt>
                <span className={styles.tag}>CONCEPT</span>
              </dt>
              <dd>
                <strong>Conceptual.</strong> Invented for this visualization to make the machine explorable.
              </dd>
            </dl>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="about-s3">
          <span className={styles.idx}>03</span>
          <div>
            <h3 id="about-s3" className={styles.h3}>
              Substituting a model
            </h3>
            <p>
              Put a GLB in <code>explorer/public/models/</code>, then set <code>source: &quot;gltf&quot;</code> in{" "}
              <code>src/data/modelConfig.ts</code> (or open the site with <code>?model=gltf</code>, or build with{" "}
              <code>VITE_MODEL_URL</code>). Edit <code>meshRules</code> so mesh names map onto assemblies. If loading
              fails, the viewer falls back to the prototype and says so in the status bar.
            </p>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="about-s4">
          <span className={styles.idx}>04</span>
          <div>
            <h3 id="about-s4" className={styles.h3}>
              Controls
            </h3>
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
          </div>
        </section>

        <section className={styles.section} aria-labelledby="about-s5">
          <span className={styles.idx}>05</span>
          <div>
            <h3 id="about-s5" className={styles.h3}>
              Trademarks
            </h3>
            <p className={styles.fine}>
              RX-105 Ξ Gundam and Mobile Suit Gundam: Hathaway are trademarks of their respective owners (© Sotsu ·
              Sunrise / Bandai Namco Filmworks). This is an unofficial, non-commercial fan engineering study. It is not
              affiliated with or endorsed by the rights holders.
            </p>
          </div>
        </section>
      </div>
    </dialog>
  );
}
