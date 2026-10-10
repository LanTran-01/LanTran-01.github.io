/**
 * Small mutable bridge between the in-canvas parts of the viewer (camera rig,
 * interaction, callout layout) and the DOM overlays drawn on top of the canvas.
 *
 * Per-frame values flow through here instead of React state so that hover
 * labels and callouts can be positioned without re-rendering.
 */

export interface HoverLabelDom {
  root: HTMLDivElement | null;
  title: HTMLSpanElement | null;
  meta: HTMLSpanElement | null;
  sub: HTMLSpanElement | null;
}

export interface CalloutDom {
  container: HTMLDivElement | null;
  labels: Map<string, HTMLElement>;
  paths: Map<string, SVGPathElement>;
  dots: Map<string, SVGCircleElement>;
  /** Requests a render so a newly mounted overlay gets positioned. Set by the canvas. */
  invalidate: (() => void) | null;
}

export const viewerRuntime = {
  hoverLabel: { root: null, title: null, meta: null, sub: null } as HoverLabelDom,
  callouts: {
    container: null,
    labels: new Map(),
    paths: new Map(),
    dots: new Map(),
    invalidate: null,
  } as CalloutDom,
  /** True while the camera rig runs a programmatic move (callouts hide to avoid jitter). */
  rigTransitioning: false,
};
