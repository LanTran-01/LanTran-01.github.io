import type { ComponentType } from "react";
import { Wand, Figure, Seated, Horse, Throne, Castle, House, Tree, Sparkle, Waves, Rosette, Scale } from "@/artwork/primitives";
import { D, DF, DOT, F, H, L, LB, S, SO, pol, starPath } from "@/artwork/style";

/* Wands — fire. Vertical forms, branching lines, and directional shapes. */

function Ace() {
  const falling: [number, number, number][] = [
    [72, 92, 30], [132, 104, -20], [64, 132, 60], [140, 140, 10], [76, 170, -40], [128, 176, 45],
  ];
  return (
    <g>
      {Array.from({ length: 8 }, (_, i) => {
        const [x0, y0] = pol(100, 62, 6, i * 45);
        const [x1, y1] = pol(100, 62, i % 2 ? 10 : 14, i * 45);
        return <line key={i} x1={x0} y1={y0} x2={x1} y2={y1} {...F} />;
      })}
      <Wand x={100} y={144} len={150} leaves={6} />
      {falling.map(([x, y, r]) => (
        <ellipse key={`${x}${y}`} cx={x} cy={y} rx={1.4} ry={3} transform={`rotate(${r} ${x} ${y})`} {...F} />
      ))}
      <path d="M22 230 Q44 206 70 214" {...H} />
      <Castle x={46} y={214} s={1.1} />
      <path d="M120 244 C132 228 150 236 160 222 C168 212 176 214 178 210" {...F} />
      <line x1={22} y1={236} x2={96} y2={236} {...H} />
    </g>
  );
}

function Two() {
  return (
    <g>
      <line x1={24} y1={150} x2={176} y2={150} {...H} />
      <path d="M24 150 Q40 140 56 150 M130 150 Q150 136 176 148" {...H} />
      <Wand x={156} y={156} len={156} leaves={4} />
      <Figure x={112} y={236} s={1.32} arms="forward" />
      <line x1={92} y1={110} x2={92} y2={236} {...LB} />
      <circle cx={92} cy={108} r={1.9} {...S} />
      <path d="M92 118 q-3.5 -1 -5.5 -5.5" {...F} />
      <circle cx={134} cy={192} r={9} {...D} />
      <ellipse cx={134} cy={192} rx={4} ry={9} {...F} />
      <line x1={125} y1={192} x2={143} y2={192} {...F} />
      <rect x={24} y={206} width={152} height={30} {...D} />
      {[44, 64, 84, 104, 124, 144, 164].map((x) => (
        <line key={x} x1={x} y1={206} x2={x} y2={236} {...H} />
      ))}
    </g>
  );
}

function Three() {
  const ships: [number, number, number][] = [
    [124, 176, 1], [152, 184, 0.8], [104, 190, 0.7],
  ];
  return (
    <g>
      <line x1={22} y1={168} x2={178} y2={168} {...F} />
      <Waves x0={22} x1={178} y={180} rows={4} gap={8} amp={0.9} period={20} />
      {ships.map(([x, y, s]) => (
        <g key={x} transform={`translate(${x} ${y}) scale(${s})`}>
          <path d="M-8 0 H8 L5 4 H-5 Z" {...D} />
          <path d="M0 0 V-13 L7 -2 Z" {...D} />
        </g>
      ))}
      <path d="M22 236 L56 214 H116 L132 236" {...D} />
      <Wand x={50} y={160} len={120} leaves={3} />
      <Wand x={120} y={156} len={116} leaves={3} />
      <Figure x={86} y={216} s={1.3} back robe="raised" />
      <Wand x={100} y={152} len={124} leaves={3} />
    </g>
  );
}

function Four() {
  const xs = [46, 82, 118, 154];
  return (
    <g>
      <Castle x={100} y={182} s={2.1} />
      <path d="M46 112 Q64 132 82 112 Q100 132 118 112 Q136 132 154 112" {...F} />
      {[55, 64, 73, 91, 100, 109, 127, 136, 145].map((x, i) => (
        <Rosette key={x} x={x} y={118 + (i % 3 === 1 ? 6 : 2)} r={2} />
      ))}
      <path d="M46 112 l-4 18 M154 112 l4 18" {...DOT} />
      <Figure x={88} y={222} s={0.72} arms="up" />
      <Figure x={112} y={222} s={0.72} arms="up" />
      {xs.map((x) => (
        <Wand key={x} x={x} y={168} len={120} leaves={2} />
      ))}
      <line x1={22} y1={228} x2={178} y2={228} {...H} />
    </g>
  );
}

function Five() {
  const wands: [number, number, number][] = [
    [92, 146, 34], [110, 150, -40], [100, 132, 78], [96, 160, -70], [106, 140, 8],
  ];
  const sparks: [number, number][] = [
    [100, 140], [86, 156], [116, 130], [104, 166], [94, 120],
  ];
  return (
    <g>
      <circle cx={100} cy={144} r={62} {...H} strokeDasharray="1 3" />
      {wands.map(([x, y, r], i) => (
        <Wand key={i} x={x} y={y} r={r} len={140} leaves={3} />
      ))}
      {sparks.map(([x, y]) => (
        <Sparkle key={`${x}${y}`} x={x} y={y} r={3.2} />
      ))}
      <line x1={22} y1={236} x2={178} y2={236} {...H} />
    </g>
  );
}

function Six() {
  return (
    <g>
      {[36, 50, 150, 164, 176].map((x, i) => (
        <g key={x}>
          <line x1={x} y1={236} x2={x + (i < 2 ? -2 : 2)} y2={128 + (i % 2) * 10} {...F} />
          <circle cx={x + (i < 2 ? -2 : 2)} cy={127 + (i % 2) * 10} r={1.5} {...F} />
        </g>
      ))}
      {[30, 44, 58, 146, 160].map((x) => (
        <circle key={x} cx={x} cy={222} r={4.4} {...DF} />
      ))}
      <Horse x={94} y={232} s={1.4} gait="walk" riderArm="M5 -36 L18 -52" />
      <line x1={120} y1={164} x2={120} y2={68} {...LB} />
      <circle cx={120} cy={62} r={8.5} {...F} />
      {Array.from({ length: 10 }, (_, i) => {
        const [x, y] = pol(120, 62, 8.5, i * 36);
        return <ellipse key={i} cx={x} cy={y} rx={1.2} ry={2.6} transform={`rotate(${i * 36} ${x} ${y})`} {...F} />;
      })}
      <line x1={22} y1={236} x2={178} y2={236} {...H} />
    </g>
  );
}

function Seven() {
  const below: [number, number, number][] = [
    [32, 216, -6], [50, 220, 4], [68, 224, -3], [132, 224, 5], [150, 220, -4], [168, 222, 6],
  ];
  return (
    <g>
      <line x1={22} y1={246} x2={178} y2={246} {...H} />
      <path d="M22 196 L80 182 H120 L178 204" {...F} />
      {below.map(([x, y, r]) => (
        <Wand key={x} x={x} y={y} r={r} len={48} leaves={2} />
      ))}
      <Figure x={100} y={184} s={1.26} arms="out" />
      <Wand x={100} y={152} r={-48} len={104} leaves={3} />
    </g>
  );
}

function Eight() {
  const dir: [number, number] = [-0.5, 0.866];
  return (
    <g>
      {Array.from({ length: 8 }, (_, i) => {
        const k = i - 3.5;
        return <Wand key={i} x={98 + dir[0] * k * 10} y={128 + dir[1] * k * 10} r={120} len={118} leaves={2} />;
      })}
      <path d="M22 232 C60 220 92 236 128 226 C150 220 166 224 178 222" {...F} />
      <path d="M22 214 L46 198 L64 208 L86 192" {...H} />
      <House x={160} y={222} s={0.8} />
    </g>
  );
}

function Nine() {
  return (
    <g>
      {Array.from({ length: 8 }, (_, i) => (
        <Wand key={i} x={30 + i * 20} y={170} len={116} leaves={2} />
      ))}
      <line x1={22} y1={228} x2={178} y2={228} {...H} />
      <Figure x={86} y={236} s={1.36} robe="raised" arms="forward" />
      <line x1={80} y1={176} x2={92} y2={178} stroke="#ECECEC" strokeWidth={2.2} strokeLinecap="round" />
      <Wand x={108} y={174} r={6} len={128} leaves={2} />
    </g>
  );
}

function Ten() {
  return (
    <g>
      <House x={152} y={226} s={1.3} />
      <House x={172} y={226} s={0.9} />
      <Tree x={136} y={226} h={30} r={7} />
      <line x1={22} y1={226} x2={178} y2={226} {...H} />
      <Figure x={84} y={226} s={1.3} r={14} robe="raised" />
      {Array.from({ length: 10 }, (_, i) => (
        <Wand key={i} x={92 + i * 2.4} y={154 + Math.abs(i - 4.5)} r={-18 + i * 4} len={118} leaves={1} />
      ))}
      <path d="M78 186 L96 172" {...L} />
    </g>
  );
}

function Page() {
  return (
    <g>
      <path d="M118 196 L132 176 L146 196 Z M140 196 L156 172 L172 196 Z" {...DF} />
      <path d="M22 206 Q60 192 100 204 Q140 216 178 200" {...H} />
      <path d="M22 222 Q70 210 110 222 Q150 232 178 218" {...H} />
      <Figure x={84} y={236} s={1.4} arms="forward" />
      <path d="M78 216 a2 2 0 1 1 4 0 a4 4 0 1 1 -8 0" {...F} />
      <Wand x={112} y={144} len={142} leaves={5} />
    </g>
  );
}

function Knight() {
  return (
    <g>
      <path d="M140 222 L152 204 L164 222 Z M156 222 L170 198 L178 210" {...DF} />
      {[[32, 226], [52, 230], [150, 238]].map(([x, y]) => (
        <path key={x} d={`M${x} ${y} q-4 -6 0 -10 q2 4 4 0 q4 6 0 10 Z`} {...F} />
      ))}
      <g transform="rotate(-22 76 232)">
        <Horse x={92} y={232} s={1.36} gait="charge" riderArm="M5 -36 L20 -54" />
      </g>
      <Wand x={146} y={96} r={30} len={92} leaves={3} />
      <line x1={22} y1={236} x2={178} y2={236} {...H} />
    </g>
  );
}

function Queen() {
  const lion = (x: number) => (
    <g>
      <path d={starPath(x, 176, 9, 6.6, 12)} {...F} />
      <circle cx={x} cy={176} r={5.6} {...D} />
    </g>
  );
  return (
    <Scale x={100} y={240} s={1.1}>
      <Throne x={100} y={222} w={64} h={116} top="step" />
      {[84, 116].map((x) => (
        <Rosette key={x} x={x} y={118} r={3.2} />
      ))}
      {lion(62)}
      {lion(138)}
      <Seated x={100} y={222} s={1.28} arms="out" />
      <Wand x={126} y={150} len={110} leaves={3} />
      <line x1={76} y1={196} x2={76} y2={172} {...F} />
      <circle cx={76} cy={168} r={4.2} {...D} />
      {Array.from({ length: 10 }, (_, i) => {
        const [x, y] = pol(76, 168, 6.6, i * 36);
        return <ellipse key={i} cx={x} cy={y} rx={1} ry={2.2} transform={`rotate(${i * 36} ${x} ${y})`} {...F} />;
      })}
      <g transform="translate(100 238)">
        <ellipse cx={0} cy={-4} rx={7} ry={5} {...SO} />
        <circle cx={6} cy={-10} r={3.4} {...SO} />
        <path d="M4 -12.5 L4.6 -16 L6.6 -13 M7.6 -13 L9 -16 L9.4 -12" {...SO} />
        <path d="M-7 -2 q-6 -2 -4 -8" {...L} />
      </g>
    </Scale>
  );
}

function King() {
  return (
    <Scale x={100} y={240} s={1.12}>
      <Throne x={118} y={222} w={48} h={118} />
      <circle cx={118} cy={124} r={11} {...F} />
      <path d="M126 116 l5 -3 l-1 5" {...F} />
      <circle cx={118} cy={124} r={4} {...H} />
      <path d={starPath(104, 168, 7, 5, 10)} {...H} />
      <path d={starPath(132, 168, 7, 5, 10)} {...H} />
      <Seated x={96} y={222} s={1.3} arms="back" />
      <Wand x={70} y={150} r={-6} len={124} leaves={4} />
      <path d="M42 236 C48 226 56 236 62 228 C66 224 72 226 74 230" {...F} />
      <circle cx={40} cy={237} r={1.6} {...S} />
      <line x1={30} y1={240} x2={170} y2={240} {...H} />
    </Scale>
  );
}

export const WANDS_ART: readonly ComponentType[] = [Ace, Two, Three, Four, Five, Six, Seven, Eight, Nine, Ten, Page, Knight, Queen, King];
