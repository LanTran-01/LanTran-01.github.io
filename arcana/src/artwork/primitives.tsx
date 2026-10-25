import type { ReactNode } from "react";
import type { Element } from "@/domain/types";
import {
  D, DF, F, H, INK, L, LB, R, S, SO, SS, T, CARD_BG,
  at, crescentPath, lemniscatePath, pentagramPath, pol, starPath, wavePath, cloudPath,
} from "@/artwork/style";

/**
 * Reusable drawing primitives. Each is defined in its own local coordinates
 * and placed with x / y / r (rotation) / s (scale). Compositions in the suit
 * and major files combine these into card-specific scenes.
 */

export interface Place {
  x: number;
  y: number;
  r?: number;
  s?: number;
}

/* ---- suit emblems -------------------------------------------------------- */

/** Chalice, about 20 wide and 24 tall, centred on its bowl/stem joint. */
export function Cup({ x, y, r = 0, s = 1, solid = false }: Place & { solid?: boolean }) {
  return (
    <g transform={at(x, y, r, s)}>
      <path d="M-9 -12 A9 9 0 0 0 9 -12 Z" {...(solid ? SO : D)} />
      {!solid && <path d="M-5.6 -12 A5.6 5.6 0 0 0 5.6 -12" {...F} />}
      <line x1={0} y1={-3} x2={0} y2={8.5} {...L} />
      <circle cx={0} cy={2.6} r={1.5} {...S} />
      <path d="M-6 11.5 H6 L2.2 8.5 H-2.2 Z" {...D} />
    </g>
  );
}

/** Sword pointing up (rotate 180 for point-down), centred on its length. */
export function Sword({ x, y, r = 0, s = 1, len = 92 }: Place & { len?: number }) {
  const t = -len / 2;
  const g = len / 2 - 14;
  const e = len / 2;
  return (
    <g transform={at(x, y, r, s)}>
      <path d={`M0 ${t} L2.3 ${t + 8} V${g} H-2.3 V${t + 8} Z`} {...D} />
      <line x1={0} y1={t + 9} x2={0} y2={g - 3} {...F} />
      <line x1={-9.5} y1={g} x2={9.5} y2={g} {...L} />
      <circle cx={-9.5} cy={g} r={1.15} {...S} />
      <circle cx={9.5} cy={g} r={1.15} {...S} />
      <line x1={0} y1={g + 1} x2={0} y2={e - 4.2} {...LB} />
      <circle cx={0} cy={e - 2.2} r={2.1} {...D} />
    </g>
  );
}

/** Living staff with buds and leaves, centred on its length, top up. */
export function Wand({ x, y, r = 0, s = 1, len = 92, leaves = 3 }: Place & { len?: number; leaves?: number }) {
  const t = -len / 2;
  const e = len / 2;
  const leafNodes: ReactNode[] = [];
  for (let i = 0; i < leaves; i++) {
    const ly = t + 9 + i * 10;
    const side = i % 2 ? 1 : -1;
    leafNodes.push(
      <g key={i}>
        <path d={`M0 ${ly} q${side * 3.5} -1 ${side * 5.5} -5.5`} {...F} />
        <ellipse cx={side * 6.6} cy={ly - 7.2} rx={1.25} ry={2.6} transform={`rotate(${side * 35} ${side * 6.6} ${ly - 7.2})`} {...F} />
      </g>,
    );
  }
  return (
    <g transform={at(x, y, r, s)}>
      <line x1={0} y1={t + 3} x2={0} y2={e} {...LB} />
      <circle cx={0} cy={t + 1.6} r={1.9} {...S} />
      {leafNodes}
      <line x1={-2.2} y1={e} x2={2.2} y2={e} {...L} />
    </g>
  );
}

/** Coin with an inscribed pentagram. */
export function Pentacle({ x, y, r = 11, rot = 0, s = 1 }: Place & { rot?: number }) {
  return (
    <g transform={at(x, y, 0, s)}>
      <circle r={r} {...D} />
      <circle r={r * 0.8} {...F} />
      <path d={pentagramPath(0, 0, r * 0.78, rot)} {...F} />
    </g>
  );
}

/* ---- figures ------------------------------------------------------------- */

export type Arms = "down" | "up" | "out" | "left-up" | "right-up" | "forward" | "back" | "cross" | "hold";
type Robe = "outline" | "raised" | "solid";

const ROBE = { outline: D, raised: R, solid: SO } as const;

function armPaths(arms: Arms): string[] {
  switch (arms) {
    case "up":
      return ["M-3.4 -32 L-10 -47", "M3.4 -32 L10 -47"];
    case "out":
      return ["M-3.4 -31 L-15 -24.5", "M3.4 -31 L15 -24.5"];
    case "left-up":
      return ["M-3.4 -32 L-9.5 -48"];
    case "right-up":
      return ["M3.4 -32 L9.5 -48"];
    case "forward":
      return ["M3.4 -31 L15.5 -27"];
    case "back":
      return ["M-3.4 -31 L-15.5 -27"];
    case "cross":
      return ["M-6.5 -22 L5.5 -28", "M6.5 -22 L-5.5 -28"];
    case "hold":
      return ["M-5.5 -25 L0 -20.5 L5.5 -25"];
    default:
      return [];
  }
}

export interface FigureProps extends Place {
  arms?: Arms;
  robe?: Robe;
  hood?: boolean;
  bowed?: boolean;
  /** Seen from behind: the head is drawn solid. */
  back?: boolean;
  children?: ReactNode;
}

/** Standing figure: head circle over a trapezoid robe. Feet at y = 0, about 45 tall. */
export function Figure({ x, y, r = 0, s = 1, arms = "down", robe = "outline", hood, bowed, back, children }: FigureProps) {
  const hx = bowed ? 2.6 : 0;
  const hy = bowed ? -37.5 : -40;
  return (
    <g transform={at(x, y, r, s)}>
      <path d="M-3.6 -34.5 H3.6 L10 0 H-10 Z" {...ROBE[robe]} />
      {armPaths(arms).map((d) => (
        <path key={d} d={d} {...L} />
      ))}
      {hood && <path d={`M${hx - 7} ${hy + 4} Q${hx - 7} ${hy - 8.5} ${hx} ${hy - 8.5} Q${hx + 7} ${hy - 8.5} ${hx + 7} ${hy + 4}`} {...L} />}
      <circle cx={hx} cy={hy} r={4.6} {...(back ? SO : D)} />
      {children}
    </g>
  );
}

/** Frontal seated figure. Base at y = 0, head at about -34. */
export function Seated({ x, y, r = 0, s = 1, arms = "down", robe = "outline", bowed, children }: Omit<FigureProps, "hood" | "back">) {
  const hx = bowed ? 2.4 : 0;
  const hy = bowed ? -31.5 : -34;
  const armSet: Record<Arms, string[]> = {
    down: [],
    up: ["M-3.2 -27 L-9 -40", "M3.2 -27 L9 -40"],
    out: ["M-3.2 -26 L-13 -20", "M3.2 -26 L13 -20"],
    "left-up": ["M-3.2 -27 L-8.5 -41"],
    "right-up": ["M3.2 -27 L8.5 -41"],
    forward: ["M3.2 -26 L14 -22"],
    back: ["M-3.2 -26 L-14 -22"],
    cross: ["M-6 -18 L5 -24", "M6 -18 L-5 -24"],
    hold: ["M-5 -21 L0 -16.5 L5 -21"],
  };
  return (
    <g transform={at(x, y, r, s)}>
      <path d="M-3.6 -28.5 H3.6 L8.6 -13 H-8.6 Z" {...ROBE[robe]} />
      <path d="M-9.6 -13 H9.6 V-7 H-9.6 Z" {...ROBE[robe]} />
      <line x1={-6} y1={-7} x2={-6} y2={0} {...L} />
      <line x1={6} y1={-7} x2={6} y2={0} {...L} />
      {armSet[arms].map((d) => (
        <path key={d} d={d} {...L} />
      ))}
      <circle cx={hx} cy={hy} r={4.4} {...D} />
      {children}
    </g>
  );
}

/** Kneeling figure facing right. Base at y = 0. */
export function Kneeling({ x, y, r = 0, s = 1, flip = false }: Place & { flip?: boolean }) {
  return (
    <g transform={`${at(x, y, r, s)}${flip ? " scale(-1 1)" : ""}`}>
      <path d="M-3.2 -21 H3.2 L7 -8 H-7 Z" {...R} />
      <path d="M-7 -8 H8 L10 0 H-6 Z" {...R} />
      <path d="M3 -18 L11 -22" {...L} />
      <circle cx={0.8} cy={-26} r={4} {...D} />
    </g>
  );
}

export type Gait = "still" | "walk" | "charge";

/** Horse facing right with an optional rider. Hooves at y = 0. */
export function Horse({ x, y, r = 0, s = 1, gait = "walk", rider = true, riderArm }: Place & { gait?: Gait; rider?: boolean; riderArm?: string }) {
  const legs: Record<Gait, string[]> = {
    still: ["M-11 -16 L-11 0", "M-6 -15 L-6 0", "M8 -15 L8 0", "M12 -16 L12 0"],
    walk: ["M-11 -16 L-14 0", "M-6 -15 L-3.5 0", "M8 -15 L5 0", "M12 -16 L16 -1.5"],
    charge: ["M-11 -16 L-23 -7", "M-6 -15 L-15 -2", "M8 -15 L21 -7", "M12 -16 L27 -13"],
  };
  return (
    <g transform={at(x, y, r, s)}>
      {legs[gait].map((d) => (
        <path key={d} d={d} {...L} />
      ))}
      <path d="M-16 -24 q-7 2 -6.5 13" {...F} />
      <ellipse cx={0} cy={-22} rx={16.5} ry={7.6} {...R} />
      <path d="M10 -26 L18.5 -40 L27 -37.6 L26 -33.6 L19.5 -33.8 L15.5 -21 Z" {...R} />
      <path d="M18.5 -40 L18 -44.5" {...L} />
      <path d="M12.5 -28 L18 -38.5" {...F} />
      {rider && (
        <g>
          <path d="M-2 -41 H4 L7.5 -27 H-5 Z" {...D} />
          <path d="M2 -27 L4 -15" {...L} />
          {riderArm && <path d={riderArm} {...L} />}
          <circle cx={1} cy={-45.5} r={4.1} {...D} />
        </g>
      )}
    </g>
  );
}

/* ---- architecture -------------------------------------------------------- */

/** Throne back with seat, base at y. */
export function Throne({ x, y, w = 38, h = 76, top = "flat" }: { x: number; y: number; w?: number; h?: number; top?: "flat" | "arch" | "step" }) {
  const l = x - w / 2;
  const rr = x + w / 2;
  const t = y - h;
  const back =
    top === "arch"
      ? `M${l} ${y} V${t + w / 2} A${w / 2} ${w / 2} 0 0 1 ${rr} ${t + w / 2} V${y} Z`
      : top === "step"
        ? `M${l} ${y} V${t + 8} H${l + 6} V${t} H${rr - 6} V${t + 8} H${rr} V${y} Z`
        : `M${l} ${y} V${t} H${rr} V${y} Z`;
  return (
    <g>
      <path d={back} {...D} />
      <path d={back} transform={`translate(${x} ${y - h / 2}) scale(0.8) translate(${-x} ${-(y - h / 2)})`} {...H} />
      <path d={`M${l - 5} ${y - 14} H${rr + 5} V${y - 9} H${l - 5} Z`} {...D} />
    </g>
  );
}

export function Castle({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={at(x, y, 0, s)}>
      <path d="M-9 0 V-9 H-7 V-11 H-5 V-9 H-3 V-11 H-1 V-9 H1 V-15 H3 V-17 H5 V-15 H7 V-9 H9 V0 Z" {...DF} />
      <line x1={4} y1={-6} x2={4} y2={-3} {...F} />
    </g>
  );
}

export function House({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={at(x, y, 0, s)}>
      <path d="M-8 0 V-9 L0 -16 L8 -9 V0 Z" {...DF} />
      <rect x={-2} y={-6} width={4} height={6} {...F} />
    </g>
  );
}

export function Tree({ x, y, h = 40, r = 12 }: { x: number; y: number; h?: number; r?: number }) {
  return (
    <g>
      <line x1={x} y1={y} x2={x} y2={y - h + r} {...F} />
      <circle cx={x} cy={y - h} r={r} {...DF} />
      <circle cx={x} cy={y - h} r={r * 0.55} {...H} />
    </g>
  );
}

/* ---- sky and landscape --------------------------------------------------- */

export function Sun({ x, y, r = 10, rays = 12, len = 7, solid = true }: { x: number; y: number; r?: number; rays?: number; len?: number; solid?: boolean }) {
  return (
    <g>
      {Array.from({ length: rays }, (_, i) => {
        const a = (i * 360) / rays;
        const [x0, y0] = pol(x, y, r + 3, a);
        const [x1, y1] = pol(x, y, r + 3 + (i % 2 ? len * 0.6 : len), a);
        return <line key={i} x1={x0} y1={y0} x2={x1} y2={y1} {...F} />;
      })}
      <circle cx={x} cy={y} r={r} {...(solid ? S : D)} />
    </g>
  );
}

/** Solid crescent; opening faces right at r = 0. */
export function Crescent({ x, y, r = 10, rot = 0, outline = false }: { x: number; y: number; r?: number; rot?: number; outline?: boolean }) {
  return <path d={crescentPath(r, r * 0.86, r * 0.52)} transform={at(x, y, rot)} {...(outline ? D : S)} />;
}

/** Four-point sparkle. */
export function Sparkle({ x, y, r = 4, solid = true }: { x: number; y: number; r?: number; solid?: boolean }) {
  return <path d={starPath(x, y, r, r * 0.22, 4)} {...(solid ? S : F)} />;
}

export function Lemniscate({ x, y, a = 10 }: { x: number; y: number; a?: number }) {
  return <path d={lemniscatePath(a)} transform={at(x, y)} {...L} />;
}

export function Waves({ x0 = 22, x1 = 178, y, rows = 2, gap = 7, amp = 1.8, period = 12, strong = false }: { x0?: number; x1?: number; y: number; rows?: number; gap?: number; amp?: number; period?: number; strong?: boolean }) {
  return (
    <g>
      {Array.from({ length: rows }, (_, i) => (
        <path key={i} d={wavePath(x0 + (i % 2) * (period / 2), x1, y + i * gap, amp, period)} {...(strong && i === 0 ? F : H)} />
      ))}
    </g>
  );
}

export function Cloud({ x, y, bumps = [5, 7, 6, 4] }: { x: number; y: number; bumps?: readonly number[] }) {
  return <path d={cloudPath(x, y, bumps)} {...H} />;
}

export function Bird({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <path d="M-4 -1.5 Q-2 -2.5 0 0 Q2 -2.5 4 -1.5" transform={at(x, y, 0, s)} {...F} />;
}

export function Ground({ y, x0 = 22, x1 = 178 }: { y: number; x0?: number; x1?: number }) {
  return <line x1={x0} y1={y} x2={x1} y2={y} {...H} />;
}

/** Small five-dot rosette (flowers, roses). */
export function Rosette({ x, y, r = 2.2 }: { x: number; y: number; r?: number }) {
  return (
    <g>
      {Array.from({ length: 5 }, (_, i) => {
        const [px, py] = pol(x, y, r, -90 + i * 72);
        return <circle key={i} cx={px} cy={py} r={r * 0.62} {...F} />;
      })}
      <circle cx={x} cy={y} r={r * 0.35} {...SS} />
    </g>
  );
}

/** Faint construction geometry shared across the deck: a guide circle and axis. */
export function Guides({ cy = 140, r = 62, axis = true }: { cy?: number; r?: number; axis?: boolean }) {
  return (
    <g opacity={0.9}>
      <circle cx={100} cy={cy} r={r} {...H} strokeDasharray="1 3" />
      {axis && <line x1={100} y1={cy - r - 10} x2={100} y2={cy + r + 10} {...H} strokeDasharray="1 3" />}
    </g>
  );
}

/* ---- element glyphs (card footer) ---------------------------------------- */

export function ElementGlyph({ element, x, y, size = 5 }: { element: Element; x: number; y: number; size?: number }) {
  const up = element === "fire" || element === "air";
  const h = size * 0.9;
  const tri = up ? `M${x - size} ${y + h / 2} L${x} ${y - h / 2} L${x + size} ${y + h / 2} Z` : `M${x - size} ${y - h / 2} L${x} ${y + h / 2} L${x + size} ${y - h / 2} Z`;
  const barY = up ? y + h * 0.12 : y - h * 0.12;
  const bar = element === "air" || element === "earth";
  return (
    <g>
      <path d={tri} {...F} />
      {bar && <line x1={x - size * 0.78} y1={barY} x2={x + size * 0.78} y2={barY} {...F} />}
    </g>
  );
}

/* ---- small suit marks for the card header -------------------------------- */

export function SuitMark({ suit, x, y }: { suit: "cups" | "swords" | "wands" | "pentacles"; x: number; y: number }) {
  switch (suit) {
    case "cups":
      return <Cup x={x} y={y} s={0.38} />;
    case "swords":
      return <Sword x={x} y={y} s={0.42} len={30} />;
    case "wands":
      return <Wand x={x} y={y} s={0.42} len={30} leaves={1} />;
    default:
      return <Pentacle x={x} y={y} r={4.6} />;
  }
}

/** Occluding backdrop rectangle, used where a scene needs to sit in front of guides. */
export function Mask({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return <rect x={x} y={y} width={w} height={h} fill={CARD_BG} />;
}

export function InkDot({ x, y, r = 1 }: { x: number; y: number; r?: number }) {
  return <circle cx={x} cy={y} r={r} fill={INK} />;
}

/** Scales a group about an anchor point (used to give court scenes more presence). */
export function Scale({ x, y, s, children }: { x: number; y: number; s: number; children: ReactNode }) {
  return <g transform={`translate(${x} ${y}) scale(${s}) translate(${-x} ${-y})`}>{children}</g>;
}

/** A soft light pool behind a focal element. */
export function Glow({ x, y, r }: { x: number; y: number; r: number }) {
  return <circle cx={x} cy={y} r={r} {...T} />;
}
