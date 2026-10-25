import ui from "@/components/ui/ui.module.css";
import s from "./layout.module.css";

interface SiteHeaderProps {
  onHome: () => void;
  onSpreads: () => void;
  onAbout: () => void;
}

export function SiteHeader({ onHome, onSpreads, onAbout }: SiteHeaderProps) {
  return (
    <header className={s.header}>
      <a
        href="./"
        className={s.wordmark}
        aria-label="ARCANA, home"
        onClick={(e) => {
          e.preventDefault();
          onHome();
        }}
      >
        ARCANA
      </a>
      <nav className={s.nav} aria-label="Site">
        <button type="button" className={`${ui.btn} ${ui.ghost}`} onClick={onSpreads}>
          Spreads
        </button>
        <button type="button" className={`${ui.btn} ${ui.ghost}`} onClick={onAbout}>
          About
        </button>
      </nav>
    </header>
  );
}
