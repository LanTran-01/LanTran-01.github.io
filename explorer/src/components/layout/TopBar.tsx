import { useCallback, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import { useMediaQuery, MOBILE_QUERY } from "@/hooks/useMediaQuery";
import { useViewInset } from "@/hooks/useViewInset";
import { formatDegrees, useCameraTelemetry } from "@/hooks/useCameraTelemetry";
import { AboutDialog } from "./AboutDialog";
import styles from "./TopBar.module.css";

/** Live azimuth/elevation readout with a small heading dial. Writes the DOM via refs. */
function CameraBearing() {
  const needle = useRef<SVGGElement>(null);
  const az = useRef<HTMLSpanElement>(null);
  const el = useRef<HTMLSpanElement>(null);

  useCameraTelemetry((t) => {
    const known = t.distance > 0;
    needle.current?.setAttribute("transform", `rotate(${t.azimuth.toFixed(1)} 12 12)`);
    if (az.current) az.current.textContent = known ? formatDegrees(t.azimuth) : "—";
    if (el.current) el.current.textContent = known ? formatDegrees(t.elevation, 1, 2) : "—";
  });

  return (
    <div className={styles.bearing} aria-hidden="true" title="Camera azimuth / elevation">
      <svg width="24" height="24" viewBox="0 0 24 24" className={styles.dial}>
        <circle cx="12" cy="12" r="10.5" />
        <path d="M12 0.5v2.5M12 21v2.5M0.5 12H3M21 12h2.5" className={styles.dialTicks} />
        <g ref={needle}>
          <path d="M12 12V4.5" className={styles.needle} />
        </g>
        <circle cx="12" cy="12" r="1.2" className={styles.hub} />
      </svg>
      <dl className={styles.coords}>
        <div>
          <dt>AZ</dt>
          <dd ref={az}>—</dd>
        </div>
        <div>
          <dt>EL</dt>
          <dd ref={el}>—</dd>
        </div>
      </dl>
    </div>
  );
}

export function TopBar() {
  const ref = useRef<HTMLElement>(null);
  const { pathname } = useLocation();
  const mobile = useMediaQuery(MOBILE_QUERY);
  const [aboutOpen, setAboutOpen] = useState(false);
  const closeAbout = useCallback(() => setAboutOpen(false), []);
  useViewInset(ref, "top");

  const systems = pathname.startsWith("/systems");
  const items = [
    { to: "/", label: "Explorer", short: "Model", index: "01", active: !systems },
    { to: "/systems", label: "Systems", short: "Sys", index: "02", active: systems },
  ];

  return (
    <header ref={ref} className={styles.bar}>
      <Link to="/" className={styles.brand} aria-label="Ξ Hardware Explorer — full machine overview">
        <span className={styles.glyph} aria-hidden="true">
          Ξ
        </span>
        <span className={styles.wordmark}>{mobile ? "XI EXPLORER" : "XI HARDWARE EXPLORER"}</span>
      </Link>
      <span className={styles.badge} title="Procedural prototype silhouette — not an accurate or licensed model">
        {mobile ? "PROTO" : "PROTOTYPE MODEL"}
      </span>

      <nav className={styles.nav} aria-label="Primary">
        {items.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={styles.link}
            data-active={item.active || undefined}
            aria-current={item.active ? "page" : undefined}
          >
            {!mobile && <span className={styles.linkIdx}>{item.index}</span>}
            {mobile ? item.short : item.label}
          </Link>
        ))}
        <button
          type="button"
          className={styles.link}
          onClick={() => setAboutOpen(true)}
          aria-haspopup="dialog"
          data-active={aboutOpen || undefined}
        >
          {!mobile && <span className={styles.linkIdx}>03</span>}
          {mobile ? "Info" : "About"}
        </button>
      </nav>

      {!mobile && (
        <div className={styles.right}>
          <CameraBearing />
          <span className={styles.designation}>RX-105</span>
        </div>
      )}

      <AboutDialog open={aboutOpen} onClose={closeAbout} />
    </header>
  );
}
