export const CONFIGURE_ID = "configure";

const smoothBehavior = (): ScrollBehavior => (matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth");

/** Scrolls the spread configurator into view. */
export function scrollToConfigure(smooth = true) {
  document.getElementById(CONFIGURE_ID)?.scrollIntoView({ behavior: smooth ? smoothBehavior() : "auto" });
}

export function scrollBehavior(): ScrollBehavior {
  return smoothBehavior();
}
