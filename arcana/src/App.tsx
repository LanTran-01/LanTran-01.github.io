import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useArcanaSession } from "@/state/useArcanaSession";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { AboutDialog } from "@/components/layout/AboutDialog";
import { LandingPage } from "@/components/landing/LandingPage";
import { ReadingScreen } from "@/components/reading/ReadingScreen";
import { CONFIGURE_ID, scrollToConfigure } from "@/components/landing/configure";

/** Captured before the session normalises the URL, so links such as /tarot/#configure still land on the spreads. */
const initialHash = typeof location !== "undefined" ? location.hash : "";

/**
 * Two screens share one session: the landing configurator and the reading.
 * Entering a reading starts at the top; returning from one lands on the
 * spread selection so the next choice is immediately at hand.
 */
export function App() {
  const session = useArcanaSession();
  const { screen, reading } = session.state;
  const [aboutOpen, setAboutOpen] = useState(false);
  const previous = useRef(screen);

  useEffect(() => {
    if (initialHash === `#${CONFIGURE_ID}` && screen === "landing") requestAnimationFrame(() => scrollToConfigure(false));
    // Only on first load.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(() => {
    if (previous.current === screen) return;
    if (screen === "reading") window.scrollTo(0, 0);
    else scrollToConfigure(false);
    previous.current = screen;
  }, [screen]);

  const onReading = screen === "reading" && reading;

  return (
    <>
      <SiteHeader
        onHome={() => {
          if (onReading) session.leave();
          window.scrollTo({ top: 0 });
        }}
        onSpreads={() => (onReading ? session.leave() : scrollToConfigure())}
        onAbout={() => setAboutOpen(true)}
      />
      {onReading ? <ReadingScreen key={reading.id} session={session} reading={reading} /> : <LandingPage session={session} />}
      <AboutDialog open={aboutOpen} onClose={() => setAboutOpen(false)} />
    </>
  );
}
