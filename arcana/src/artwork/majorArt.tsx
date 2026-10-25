import type { ComponentType } from "react";
import {
  Cup, Sword, Wand, Pentacle, Figure, Sun, Crescent, Sparkle, Lemniscate, Waves, Cloud, Guides, Glow, Rosette, ElementGlyph,
} from "@/artwork/primitives";
import { CARD_BG, D, DF, DOT, F, H, L, LB, R, S, SO, SS, T, arcPath, crescentPath, lemniscatePath, pentagramPath, pol, polygonPath, starPath, vesicaPath } from "@/artwork/style";

/*
 * The 22 Major Arcana. Coordinates are in the 200 × 300 card face; the
 * illustration area is roughly x 22–178, y 42–250, centred on x = 100.
 */

function Fool() {
  return (
    <g>
      <Guides cy={128} r={64} axis={false} />
      <circle cx={146} cy={74} r={13} {...H} />
      <circle cx={146} cy={74} r={6.5} {...S} />
      <line x1={22} y1={190} x2={178} y2={190} {...H} />
      <path d="M22 206 H113 L118 214 V250 H22 Z" {...T} />
      <path d="M22 206 H113 L118 214 V250" {...L} />
      {[222, 232, 242].map((y) => (
        <line key={y} x1={112} y1={y} x2={104} y2={y + 4} {...H} />
      ))}
      <path d="M118 196 Q144 158 170 192" {...DOT} />
      <Figure x={98} y={206} s={1.05} arms="out" />
      <line x1={113} y1={176} x2={124} y2={150} {...L} />
      <circle cx={125.5} cy={147} r={3.4} {...D} />
      <Rosette x={81} y={180} r={2} />
    </g>
  );
}

function Magician() {
  const nodes = [100, 136, 172, 208];
  return (
    <g>
      <rect x={50} y={82} width={100} height={142} {...H} strokeDasharray="1 3" />
      <Lemniscate x={100} y={60} a={14} />
      <path d="M96 76 L100 72 L104 76" {...F} />
      <line x1={100} y1={74} x2={100} y2={236} {...L} />
      <path d="M96 232 L100 236 L104 232" {...F} />
      {nodes.map((y, i) => (
        <g key={y}>
          <line x1={i % 2 ? 100 : 76} y1={y} x2={i % 2 ? 124 : 100} y2={y} {...F} />
          <circle cx={100} cy={y} r={2.3} {...D} />
        </g>
      ))}
      <Wand x={66} y={100} len={44} leaves={2} />
      <Cup x={136} y={136} s={1.05} />
      <Sword x={66} y={172} len={44} />
      <Pentacle x={136} y={208} r={10} />
    </g>
  );
}

function HighPriestess() {
  return (
    <g>
      {[0, 1, 2, 3, 4].map((i) => (
        <path key={i} d={`M64 ${74 + i * 34} Q100 ${84 + i * 34} 136 ${74 + i * 34}`} {...H} />
      ))}
      <rect x={42} y={66} width={18} height={168} {...D} />
      {[46.5, 51, 55.5].map((x) => (
        <line key={x} x1={x} y1={72} x2={x} y2={228} {...H} />
      ))}
      <rect x={140} y={66} width={18} height={168} {...R} />
      <rect x={38} y={60} width={26} height={6} {...D} />
      <rect x={136} y={60} width={26} height={6} {...D} />
      <rect x={38} y={234} width={26} height={6} {...D} />
      <rect x={136} y={234} width={26} height={6} {...D} />
      <circle cx={100} cy={96} r={6} {...D} />
      <Crescent x={86} y={96} r={6} rot={180} />
      <Crescent x={114} y={96} r={6} />
      <Glow x={100} y={160} r={34} />
      <path d={crescentPath(26, 22, 13)} transform="translate(100 160) rotate(-90)" {...D} />
      <path d={crescentPath(26, 22, 13)} transform="translate(100 160) rotate(-90) scale(0.62)" {...F} />
      <Waves x0={66} x1={134} y={222} rows={2} gap={6} />
    </g>
  );
}

function Empress() {
  const stars = Array.from({ length: 12 }, (_, i) => pol(100, 136, 58, -165 + i * 13.6));
  return (
    <g>
      <circle cx={100} cy={52} r={5} {...L} />
      <line x1={100} y1={57} x2={100} y2={68} {...L} />
      <line x1={95} y1={63} x2={105} y2={63} {...L} />
      {stars.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 1.2 : 0.8} {...SS} />
      ))}
      <path d={vesicaPath(100, 136, 34, 60)} {...L} />
      <path d={vesicaPath(100, 136, 26, 47)} {...F} />
      <path d={vesicaPath(100, 136, 18, 34)} {...F} />
      <path d={vesicaPath(100, 136, 10, 21)} {...T} />
      <path d={vesicaPath(100, 136, 10, 21)} {...F} />
      <circle cx={100} cy={136} r={3.6} {...S} />
      {[-1, 1].map((side) => (
        <g key={side}>
          <path d={`M100 236 Q${100 + side * 4} 212 ${100 + side * 26} 198`} {...F} />
          {[0, 1, 2, 3].map((k) => {
            const t = 0.25 + k * 0.2;
            const x = 100 + side * (4 * 2 * t * (1 - t) + 26 * t * t);
            const y = 236 * (1 - t) * (1 - t) + 2 * t * (1 - t) * 212 + t * t * 198;
            return <ellipse key={k} cx={x} cy={y} rx={1.3} ry={3} transform={`rotate(${side * 50} ${x} ${y})`} {...F} />;
          })}
        </g>
      ))}
      <path d="M26 244 Q100 226 174 244" {...H} />
    </g>
  );
}

function Emperor() {
  return (
    <g>
      <path d="M22 196 L40 172 L52 184 L64 164" {...H} />
      <path d="M178 196 L160 172 L148 184 L136 164" {...H} />
      <rect x={52} y={96} width={96} height={96} {...LB} fill="none" />
      <rect x={66} y={110} width={68} height={68} {...F} />
      <line x1={100} y1={110} x2={100} y2={178} {...H} />
      <line x1={66} y1={144} x2={134} y2={144} {...H} />
      <rect x={88} y={132} width={24} height={24} {...D} />
      <rect x={95} y={139} width={10} height={10} {...S} />
      <circle cx={100} cy={80} r={8} {...D} />
      <line x1={100} y1={72} x2={100} y2={62} {...L} />
      <line x1={95.5} y1={66} x2={104.5} y2={66} {...L} />
      <path d="M52 96 a7 7 0 1 1 -7 -7 a3.5 3.5 0 1 1 3.5 3.5" {...F} />
      <path d="M148 96 a7 7 0 1 0 7 -7 a3.5 3.5 0 1 0 -3.5 3.5" {...F} />
      <rect x={76} y={192} width={48} height={9} {...D} />
      <rect x={64} y={201} width={72} height={9} {...D} />
      <rect x={52} y={210} width={96} height={9} {...D} />
      <line x1={22} y1={226} x2={178} y2={226} {...H} />
    </g>
  );
}

function Hierophant() {
  return (
    <g>
      <path d="M48 236 V112 A52 52 0 0 1 152 112 V236" {...F} />
      <path d="M58 236 V114 A42 42 0 0 1 142 114 V236" {...H} />
      <line x1={100} y1={70} x2={100} y2={164} {...LB} />
      <line x1={93} y1={82} x2={107} y2={82} {...L} />
      <line x1={89} y1={93} x2={111} y2={93} {...L} />
      <line x1={85} y1={104} x2={115} y2={104} {...L} />
      <circle cx={100} cy={66} r={3} {...S} />
      {[-1, 1].map((side) => (
        <g key={side} transform={`translate(100 196) rotate(${side * 42})`}>
          <line x1={0} y1={-26} x2={0} y2={20} {...L} />
          <circle cx={0} cy={25} r={4.5} {...D} />
          <path d="M0 -26 H5 V-21 H2 V-17 H0" {...F} />
        </g>
      ))}
      <Figure x={70} y={236} s={0.62} arms="hold" />
      <Figure x={130} y={236} s={0.62} arms="hold" />
      <line x1={48} y1={236} x2={152} y2={236} {...H} />
    </g>
  );
}

function Lovers() {
  return (
    <g>
      {Array.from({ length: 24 }, (_, i) => {
        const a = i * 15;
        const [x0, y0] = pol(100, 80, 25, a);
        const [x1, y1] = pol(100, 80, i % 2 ? 31 : 36, a);
        return <line key={i} x1={x0} y1={y0} x2={x1} y2={y1} {...F} />;
      })}
      <circle cx={100} cy={80} r={20} {...D} />
      <circle cx={100} cy={80} r={11} {...F} />
      <path d="M100 128 A22 22 0 0 1 100 172 A22 22 0 0 1 100 128 Z" {...T} />
      <circle cx={88} cy={150} r={22} {...L} />
      <circle cx={112} cy={150} r={22} {...L} />
      <path d="M84 236 L100 200 L116 236" {...H} />
      <Figure x={60} y={236} s={0.95} arms="forward" />
      <Figure x={140} y={236} s={0.95} arms="back" />
      <line x1={26} y1={236} x2={174} y2={236} {...H} />
    </g>
  );
}

function Chariot() {
  return (
    <g>
      <path d="M58 72 H142 V84 H58 Z" {...D} />
      {[70, 85, 100, 115, 130].map((x) => (
        <Sparkle key={x} x={x} y={78} r={2.4} />
      ))}
      <line x1={62} y1={84} x2={62} y2={140} {...F} />
      <line x1={138} y1={84} x2={138} y2={140} {...F} />
      <Figure x={100} y={150} s={1} arms="out" />
      <rect x={60} y={136} width={80} height={48} {...D} />
      <circle cx={100} cy={156} r={5} {...F} />
      <path d="M95 156 Q82 148 72 152 M105 156 Q118 148 128 152" {...F} />
      {[70, 130].map((x) => (
        <g key={x}>
          <circle cx={x} cy={198} r={13} {...D} />
          {[0, 60, 120].map((a) => {
            const [x0, y0] = pol(x, 198, 13, a);
            const [x1, y1] = pol(x, 198, 13, a + 180);
            return <line key={a} x1={x0} y1={y0} x2={x1} y2={y1} {...H} />;
          })}
          <circle cx={x} cy={198} r={2.4} {...S} />
        </g>
      ))}
      <path d="M56 232 L82 232 L82 216 Z" {...SO} />
      <path d="M144 232 L118 232 L118 216 Z" {...D} />
      <path d="M90 162 L76 214 M110 162 L124 214" {...DOT} />
      <line x1={26} y1={234} x2={174} y2={234} {...H} />
    </g>
  );
}

function Strength() {
  return (
    <g>
      <Lemniscate x={86} y={62} a={13} />
      <path d={starPath(118, 148, 40, 31, 18)} {...F} />
      <circle cx={118} cy={148} r={27} {...D} />
      <circle cx={118} cy={148} r={19} {...F} />
      <circle cx={118} cy={148} r={10} {...H} />
      <circle cx={118} cy={148} r={3.2} {...S} />
      <Figure x={64} y={222} s={1.12} arms="down" />
      <path d="M68 186 Q78 170 92 158" {...L} />
      <path d="M62 190 Q60 210 84 206 Q104 202 112 178" {...DOT} />
      <line x1={26} y1={222} x2={174} y2={222} {...H} />
      <Waves x0={26} x1={174} y={232} rows={2} gap={7} amp={1.2} period={16} />
    </g>
  );
}

function Hermit() {
  const [lx, ly] = [120, 144];
  return (
    <g>
      <Sparkle x={150} y={62} r={2.6} />
      <circle cx={40} cy={80} r={0.9} {...SS} />
      <circle cx={164} cy={104} r={0.9} {...SS} />
      <circle cx={54} cy={56} r={0.7} {...SS} />
      <path d="M22 250 L86 206 L104 216 L178 250 Z" {...T} />
      <path d="M22 250 L86 206 L104 216 L178 250" {...F} />
      <circle cx={lx} cy={ly} r={24} {...H} />
      {Array.from({ length: 12 }, (_, i) => {
        const [x0, y0] = pol(lx, ly, 11, i * 30);
        const [x1, y1] = pol(lx, ly, i % 2 ? 16 : 20, i * 30);
        return <line key={i} x1={x0} y1={y0} x2={x1} y2={y1} {...F} />;
      })}
      <line x1={70} y1={206} x2={70} y2={128} {...LB} />
      <Figure x={88} y={206} s={1.32} hood robe="raised" bowed />
      <path d="M96 168 L113 150" {...L} />
      <line x1={lx} y1={ly - 13} x2={lx - 4} y2={ly - 8} {...F} />
      <path d={polygonPath(lx, ly, 8, 6, 30)} {...D} />
      <path d={starPath(lx, ly, 5, 2.2, 6)} {...S} />
    </g>
  );
}

function WheelOfFortune() {
  const ticks = Array.from({ length: 48 }, (_, i) => i * 7.5);
  return (
    <g>
      {ticks.map((a, i) => {
        const [x0, y0] = pol(100, 140, 57, a);
        const [x1, y1] = pol(100, 140, i % 6 === 0 ? 64 : 60, a);
        return <line key={a} x1={x0} y1={y0} x2={x1} y2={y1} {...(i % 6 === 0 ? F : H)} />;
      })}
      <circle cx={100} cy={140} r={56} {...L} />
      <circle cx={100} cy={140} r={44} {...F} />
      {Array.from({ length: 8 }, (_, i) => {
        const [x0, y0] = pol(100, 140, 9, i * 45);
        const [x1, y1] = pol(100, 140, 44, i * 45);
        return <line key={i} x1={x0} y1={y0} x2={x1} y2={y1} {...F} />;
      })}
      <circle cx={100} cy={140} r={22} {...D} />
      <circle cx={100} cy={140} r={9} {...F} />
      <circle cx={100} cy={140} r={3.4} {...S} />
      <path d="M95 92 L100 86 L105 92 Z" {...S} />
      <path d="M95 188 L100 194 L105 188 Z" {...F} />
      <circle cx={148} cy={140} r={3} {...F} />
      <rect x={49.5} y={137.5} width={5} height={5} {...F} />
      <path d="M36 80 C24 104 48 116 36 140 C24 164 48 176 36 200" {...F} />
      <path d="M164 204 V84 M158 92 L164 84 L170 92" {...F} />
      {(
        [
          [34, 56, "air"],
          [166, 56, "water"],
          [34, 226, "earth"],
          [166, 226, "fire"],
        ] as const
      ).map(([x, y, el]) => (
        <g key={el}>
          <circle cx={x} cy={y} r={8} {...H} />
          <ElementGlyph element={el} x={x} y={y} size={3.6} />
        </g>
      ))}
    </g>
  );
}

function Justice() {
  return (
    <g>
      <rect x={28} y={70} width={10} height={170} {...H} />
      <rect x={162} y={70} width={10} height={170} {...H} />
      <path d={polygonPath(100, 62, 6, 4)} {...F} />
      <Sword x={100} y={142} len={124} />
      <line x1={50} y1={118} x2={150} y2={118} {...L} />
      <circle cx={100} cy={118} r={2.8} {...D} />
      {[54, 146].map((x) => (
        <g key={x}>
          <path d={`M${x} 118 L${x - 11} 160 M${x} 118 L${x + 11} 160`} {...H} />
          <path d={`M${x - 14} 160 Q${x} 172 ${x + 14} 160 Z`} {...D} />
        </g>
      ))}
      <rect x={70} y={216} width={60} height={8} {...D} />
      <rect x={60} y={224} width={80} height={8} {...D} />
    </g>
  );
}

function HangedMan() {
  return (
    <g>
      <line x1={58} y1={60} x2={58} y2={238} {...L} />
      <line x1={142} y1={60} x2={142} y2={238} {...L} />
      <line x1={50} y1={62} x2={150} y2={62} {...LB} />
      {[90, 130, 170, 210].map((y, i) => (
        <path key={y} d={i % 2 ? `M58 ${y} l-6 -5` : `M142 ${y} l6 -5`} {...F} />
      ))}
      <line x1={100} y1={62} x2={100} y2={76} {...F} />
      <circle cx={100} cy={166} r={24} {...H} />
      <circle cx={100} cy={166} r={17} {...F} />
      <line x1={100} y1={76} x2={100} y2={114} {...L} />
      <path d="M100 113 L116 98 L101 86" {...L} />
      <path d="M95 113 H105 L110 152 H90 Z" {...R} />
      <path d="M91 148 L100 126 L109 148" {...F} />
      <circle cx={100} cy={160} r={6.5} {...D} />
      <line x1={58} y1={238} x2={142} y2={238} {...H} />
    </g>
  );
}

function Death() {
  return (
    <g>
      <rect x={56} y={94} width={52} height={52} {...S} />
      <rect x={45} y={104} width={6} height={6} {...S} />
      <rect x={38} y={114} width={4} height={4} {...SS} />
      <rect x={33} y={122} width={2.5} height={2.5} {...SS} />
      <circle cx={120} cy={126} r={32} {...D} />
      <circle cx={120} cy={126} r={22} {...H} />
      <line x1={22} y1={200} x2={178} y2={200} {...F} />
      <path d={arcPath(100, 200, 15, 180, 360)} {...L} />
      {[200, 220, 240, 260, 280, 300, 320, 340].map((a) => {
        const [x0, y0] = pol(100, 200, 19, a);
        const [x1, y1] = pol(100, 200, 25, a);
        return <line key={a} x1={x0} y1={y0} x2={x1} y2={y1} {...F} />;
      })}
      <rect x={66} y={168} width={7} height={32} {...DF} />
      <rect x={127} y={168} width={7} height={32} {...DF} />
      <Waves x0={26} x1={174} y={212} rows={3} gap={7} amp={1.4} period={14} />
      <Rosette x={100} y={238} r={3} />
    </g>
  );
}

function Temperance() {
  return (
    <g>
      <Sun x={100} y={60} r={5} rays={10} len={5} />
      <path d="M100 76 C112 100 88 112 100 120" {...H} strokeDasharray="1 3" />
      <rect x={82} y={122} width={36} height={36} {...L} />
      <path d="M86 154 L100 128 L114 154 Z" {...F} />
      <circle cx={100} cy={145} r={2.2} {...S} />
      <Cup x={58} y={104} r={42} s={1.15} />
      <Cup x={142} y={186} r={-8} s={1.15} />
      <path d="M66 92 C116 72 166 120 142 168" {...DOT} />
      <Waves x0={24} x1={98} y={222} rows={3} gap={7} amp={1.6} period={12} />
      <line x1={102} y1={222} x2={176} y2={222} {...F} />
      {[110, 124, 138, 152, 166].map((x) => (
        <line key={x} x1={x} y1={226} x2={x - 6} y2={236} {...H} />
      ))}
    </g>
  );
}

function Devil() {
  return (
    <g>
      <path d="M88 64 Q72 56 74 38 Q80 50 90 58" {...D} />
      <path d="M112 64 Q128 56 126 38 Q120 50 110 58" {...D} />
      <circle cx={100} cy={78} r={19} {...D} />
      <path d={pentagramPath(100, 78, 16, 180)} {...F} />
      {[-1, 1].map((side) => (
        <path
          key={side}
          d={`M${100 + side * 30} 134 L${100 + side * 58} 112 L${100 + side * 54} 128 L${100 + side * 72} 122 L${100 + side * 62} 142 L${100 + side * 30} 152`}
          {...F}
        />
      ))}
      <rect x={70} y={130} width={60} height={46} {...D} />
      <line x1={70} y1={142} x2={130} y2={142} {...H} />
      <circle cx={100} cy={160} r={3.4} {...L} />
      <path d="M97 162 Q84 196 66 202" {...DOT} />
      <path d="M103 162 Q116 196 134 202" {...DOT} />
      <Figure x={64} y={240} s={0.88} />
      <Figure x={136} y={240} s={0.88} />
      <line x1={26} y1={240} x2={174} y2={240} {...H} />
    </g>
  );
}

function Tower() {
  const fragments: [number, number, number, number][] = [
    [62, 96, 20, 6],
    [52, 128, -15, 4.5],
    [146, 132, 35, 5],
    [156, 104, 10, 3.5],
    [44, 166, 45, 3],
    [158, 168, -30, 4],
  ];
  return (
    <g>
      <path d="M58 238 L76 228 H124 L142 238" {...F} />
      <path d="M80 228 V104 H120 V228 Z" {...D} />
      <path d="M78 104 V96 H84 V100 H90 V96 H96 V100 H104 V96 H110 V100 H116 V96 H122 V104 Z" {...D} />
      {[124, 154, 184].map((y, i) => (
        <rect key={y} x={i === 1 ? 104 : 90} y={y} width={6} height={10} {...F} />
      ))}
      <path d="M94 228 V212 A6 6 0 0 1 106 212 V228" {...F} />
      <path d="M112 106 L104 132 L110 150 L101 178" {...L} />
      <g transform="translate(134 76) rotate(28)">
        <path d="M-12 6 V-2 L-7 -8 L-3 -1 L0 -10 L3 -1 L7 -8 L12 -2 V6 Z" {...D} />
      </g>
      <path d="M176 42 L144 70 L154 72 L114 104" {...LB} />
      {fragments.map(([x, y, rot, size], i) =>
        i % 2 ? (
          <rect key={i} x={x - size / 2} y={y - size / 2} width={size} height={size} transform={`rotate(${rot} ${x} ${y})`} {...SO} />
        ) : (
          <path key={i} d={`M${x} ${y - size} L${x + size} ${y + size} L${x - size} ${y + size} Z`} transform={`rotate(${rot} ${x} ${y})`} {...D} />
        ),
      )}
    </g>
  );
}

function Star() {
  const smalls: [number, number][] = [
    [44, 62], [156, 62], [30, 112], [170, 112], [46, 162], [154, 162], [100, 46],
  ];
  return (
    <g>
      <circle cx={100} cy={116} r={56} {...H} strokeDasharray="1 3" />
      <circle cx={100} cy={116} r={45} {...H} />
      <circle cx={100} cy={116} r={34} {...F} />
      {Array.from({ length: 8 }, (_, i) => {
        const a = 22.5 + i * 45;
        const [x0, y0] = pol(100, 116, 37, a);
        const [x1, y1] = pol(100, 116, 52, a);
        return <line key={i} x1={x0} y1={y0} x2={x1} y2={y1} {...F} />;
      })}
      <path d={starPath(100, 116, 28, 8, 8)} {...S} />
      <circle cx={100} cy={116} r={3} fill={CARD_BG} />
      {smalls.map(([x, y]) => (
        <path key={`${x}-${y}`} d={starPath(x, y, 4.5, 1.6, 8)} {...F} />
      ))}
      <line x1={26} y1={206} x2={174} y2={206} {...H} />
      <ellipse cx={100} cy={226} rx={44} ry={8} {...H} />
      <ellipse cx={100} cy={226} rx={30} ry={5.4} {...F} />
      <ellipse cx={100} cy={226} rx={15} ry={2.8} {...F} />
      <path d="M100 152 V218" {...DOT} />
    </g>
  );
}

function Moon() {
  return (
    <g>
      <circle cx={100} cy={88} r={34} {...H} strokeDasharray="1 3" />
      <path d={crescentPath(25, 21, 12)} transform="translate(92 88) rotate(0)" {...S} />
      <path d={crescentPath(25, 21, 12)} transform="translate(108 88) rotate(180)" {...D} />
      {[80, 92, 100, 108, 120].map((x, i) => (
        <path key={x} d={`M${x} ${126 + (i % 2) * 6} l0 5`} {...F} />
      ))}
      <rect x={30} y={150} width={14} height={46} {...DF} />
      <rect x={156} y={150} width={14} height={46} {...R} />
      <rect x={34.5} y={160} width={5} height={7} {...H} />
      <rect x={160.5} y={160} width={5} height={7} {...H} />
      <line x1={22} y1={196} x2={178} y2={196} {...F} />
      <path d="M100 232 C86 222 116 214 98 206 C88 202 106 199 100 196" {...DOT} />
      <path d="M62 214 L70 200 L78 214 Z" {...SO} />
      <path d="M122 214 L130 200 L138 214 Z" {...D} />
      <Waves x0={26} x1={174} y={230} rows={2} gap={7} amp={1.6} period={14} />
      <path d="M94 238 Q100 228 106 238" {...F} />
      <path d="M94 236 l-3 -4 M106 236 l3 -4" {...F} />
    </g>
  );
}

function SunCard() {
  return (
    <g>
      {Array.from({ length: 24 }, (_, i) => {
        const a = i * 15;
        const [x0, y0] = pol(100, 108, 36, a);
        const [x1, y1] = pol(100, 108, i % 2 ? 46 : 58, a);
        return <line key={i} x1={x0} y1={y0} x2={x1} y2={y1} {...(i % 2 ? F : L)} />;
      })}
      <circle cx={100} cy={108} r={30} {...H} />
      <circle cx={100} cy={108} r={24} {...S} />
      <rect x={24} y={196} width={152} height={12} {...D} />
      {[44, 64, 84, 104, 124, 144, 164].map((x) => (
        <line key={x} x1={x} y1={196} x2={x} y2={208} {...H} />
      ))}
      {[40, 62, 138, 160].map((x, i) => (
        <g key={x}>
          <line x1={x} y1={196} x2={x} y2={i % 3 ? 180 : 184} {...F} />
          <Rosette x={x} y={i % 3 ? 176 : 180} r={3} />
        </g>
      ))}
      <line x1={22} y1={236} x2={178} y2={236} {...H} />
    </g>
  );
}

function Judgement() {
  return (
    <g>
      <Cloud x={24} y={74} bumps={[6, 9, 7]} />
      <Cloud x={34} y={84} bumps={[5, 7, 5]} />
      {[14, 22, 30, 38].map((r) => (
        <path key={r} d={arcPath(108, 104, r, -20, 80)} {...(r < 30 ? F : H)} />
      ))}
      <line x1={46} y1={60} x2={98} y2={98} {...LB} />
      <path d="M92 92 L114 90 L104 112 Z" {...D} />
      <rect x={64} y={78} width={14} height={11} transform="rotate(36 71 83)" {...DF} />
      <path d="M71 79 V88 M66.5 83.5 H75.5" transform="rotate(36 71 83)" {...F} />
      {[
        [62, 0.78],
        [100, 0.9],
        [138, 0.78],
      ].map(([x, s]) => (
        <g key={x}>
          <Figure x={x} y={222} s={s} arms="up" />
          <path d={`M${x - 14} 212 V230 H${x + 14} V212`} {...D} />
        </g>
      ))}
      <Waves x0={26} x1={174} y={236} rows={2} gap={7} amp={1.6} period={14} />
    </g>
  );
}

function World() {
  const leaves = Array.from({ length: 28 }, (_, i) => i * (360 / 28));
  return (
    <g>
      <ellipse cx={100} cy={140} rx={42} ry={64} {...L} />
      <ellipse cx={100} cy={140} rx={36} ry={57} {...F} />
      {leaves.map((a) => {
        const rad = (a * Math.PI) / 180;
        const x = 100 + 39 * Math.cos(rad);
        const y = 140 + 60.5 * Math.sin(rad);
        return <line key={a} x1={x - 2} y1={y - 2} x2={x + 2} y2={y + 2} {...H} />;
      })}
      <path d={lemniscatePath(8)} transform="translate(100 76)" {...D} />
      <path d={lemniscatePath(8)} transform="translate(100 204)" {...D} />
      <circle cx={100} cy={110} r={5} {...D} />
      <path d="M100 116 L111 146 L100 176 L89 146 Z" {...R} />
      <path d="M93 128 L80 120 M107 128 L120 136" {...L} />
      <line x1={79} y1={112} x2={81} y2={128} {...F} />
      <line x1={120} y1={128} x2={122} y2={144} {...F} />
      <path d="M100 176 L94 192 M98 168 L108 188" {...L} />
      {(
        [
          [36, 62, "air"],
          [164, 62, "water"],
          [36, 220, "earth"],
          [164, 220, "fire"],
        ] as const
      ).map(([x, y, el]) => (
        <g key={el}>
          <circle cx={x} cy={y} r={9} {...F} />
          <ElementGlyph element={el} x={x} y={y} size={4} />
        </g>
      ))}
    </g>
  );
}

/** Major Arcana artwork by card number. */
export const MAJOR_ART: readonly ComponentType[] = [
  Fool, Magician, HighPriestess, Empress, Emperor, Hierophant, Lovers, Chariot, Strength, Hermit, WheelOfFortune,
  Justice, HangedMan, Death, Temperance, Devil, Tower, Star, Moon, SunCard, Judgement, World,
];
