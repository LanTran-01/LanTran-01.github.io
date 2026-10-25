import type { ComponentType } from "react";
import { Sword, Figure, Seated, Horse, Throne, Waves, Cloud, Castle, Bird, Crescent, Tree, InkDot, Scale } from "@/artwork/primitives";
import { D, DF, DOT, F, H, L, R, arcPath, pol } from "@/artwork/style";

/* Swords — air. Sharp lines, diagonals, and intersecting geometry. */

function Ace() {
  return (
    <g>
      <Cloud x={24} y={130} bumps={[5, 7, 5]} />
      <Cloud x={140} y={112} bumps={[4, 6, 5]} />
      <path d="M22 244 L48 214 L64 228 L90 198 L112 226 L138 204 L178 244" {...F} />
      <Sword x={100} y={150} len={144} />
      <path d="M86 86 L89 70 L95 79 L100 64 L105 79 L111 70 L114 86 Z" {...D} />
      <path d="M88 86 Q74 96 72 118" {...F} />
      {[0, 1, 2].map((i) => (
        <ellipse key={i} cx={75 - i * 1.2} cy={96 + i * 8} rx={1.4} ry={3.2} transform={`rotate(-40 ${75 - i * 1.2} ${96 + i * 8})`} {...F} />
      ))}
      <path d="M112 86 Q128 96 130 120" {...F} />
      {[0, 1, 2, 3].map((i) => (
        <line key={i} x1={124 + i * 1.5} y1={94 + i * 7} x2={132 + i * 1.5} y2={92 + i * 7} {...F} />
      ))}
      {[[76, 60], [126, 54], [64, 76], [138, 72]].map(([x, y]) => (
        <InkDot key={`${x}${y}`} x={x} y={y} r={1} />
      ))}
    </g>
  );
}

function Two() {
  return (
    <g>
      <Crescent x={156} y={62} r={9} rot={200} />
      <Waves x0={24} x1={176} y={168} rows={4} gap={7} amp={0.8} period={22} />
      <path d="M150 192 L158 182 L170 184 L174 194" {...DF} />
      <path d="M30 194 L36 186 L46 190" {...DF} />
      <Seated x={100} y={232} s={1.2} />
      <Sword x={132.3} y={153.5} r={36} len={112} />
      <Sword x={67.7} y={153.5} r={-36} len={112} />
      <line x1={92} y1={191} x2={108} y2={191} stroke="#ECECEC" strokeWidth={2.4} strokeLinecap="round" />
      <rect x={70} y={232} width={60} height={6} {...D} />
    </g>
  );
}

function Three() {
  return (
    <g>
      {Array.from({ length: 15 }, (_, i) => {
        const x = 28 + i * 10.3;
        const y0 = 50 + ((i * 37) % 30);
        return <path key={i} d={`M${x} ${y0} L${x - 3} ${y0 + 160}`} {...H} strokeDasharray="5 6" />;
      })}
      <Cloud x={30} y={66} bumps={[6, 9, 7, 5]} />
      <Cloud x={108} y={58} bumps={[5, 8, 8]} />
      <path d="M100 186 L72 156 A19 19 0 0 1 100 128 A19 19 0 0 1 128 156 Z" {...R} />
      <Sword x={100} y={140} r={180} len={122} />
      <Sword x={100} y={146} r={145} len={112} />
      <Sword x={100} y={146} r={215} len={112} />
    </g>
  );
}

function Four() {
  return (
    <g>
      <path d="M38 92 V64 A10 10 0 0 1 58 64 V92 Z" {...DF} />
      <line x1={48} y1={56} x2={48} y2={92} {...H} />
      <line x1={38} y1={72} x2={58} y2={72} {...H} />
      <Sword x={88} y={124} r={180} len={76} />
      <Sword x={118} y={118} r={180} len={76} />
      <Sword x={148} y={124} r={180} len={76} />
      <rect x={38} y={196} width={124} height={32} {...D} />
      <rect x={44} y={202} width={112} height={20} {...H} />
      <Sword x={100} y={212} r={90} len={96} />
      <path d="M60 188 L150 186 L150 196 L60 196 Z" {...R} />
      <circle cx={53} cy={190} r={6} {...D} />
      <path d="M90 186 L94 176 L98 186" {...L} />
      <line x1={26} y1={236} x2={174} y2={236} {...H} />
    </g>
  );
}

function Five() {
  return (
    <g>
      <path d="M24 76 L46 62 L62 74 L88 54 L110 72 L132 58 L150 70 L176 56" {...F} />
      <path d="M24 92 L52 82 L74 92 L102 78 L130 90 L176 76" {...H} />
      <Waves x0={110} x1={176} y={176} rows={2} gap={6} amp={1.2} period={14} />
      <Figure x={150} y={180} s={0.45} bowed />
      <Figure x={166} y={182} s={0.4} bowed robe="raised" />
      <Sword x={136} y={232} r={96} len={60} />
      <Sword x={124} y={222} r={74} len={56} />
      <Sword x={62} y={156} r={-22} len={74} />
      <Sword x={74} y={152} r={-12} len={74} />
      <Figure x={84} y={236} s={1.32} arms="forward" />
      <Sword x={104} y={168} r={14} len={74} />
      <line x1={26} y1={236} x2={174} y2={236} {...H} />
    </g>
  );
}

function Six() {
  return (
    <g>
      <path d="M24 138 H70" {...H} />
      <Tree x={36} y={138} h={18} r={6} />
      <Tree x={52} y={138} h={14} r={5} />
      <line x1={24} y1={222} x2={96} y2={222} {...H} />
      <line x1={24} y1={230} x2={90} y2={230} {...H} />
      <Waves x0={100} x1={176} y={222} rows={2} gap={8} amp={2.6} period={12} />
      {[68, 80, 92, 104, 116, 128].map((x, i) => (
        <Sword key={x} x={x} y={160 + (i % 2) * 4} r={180} len={58} />
      ))}
      <Figure x={76} y={200} s={0.6} robe="raised" hood bowed />
      <path d="M44 196 H156 Q144 214 100 216 Q56 214 44 196 Z" {...D} />
      <Figure x={146} y={196} s={0.82} />
      <line x1={156} y1={122} x2={132} y2={236} {...L} />
    </g>
  );
}

function Seven() {
  return (
    <g>
      {[
        [40, 152],
        [66, 146],
        [92, 154],
      ].map(([x, y]) => (
        <g key={x}>
          <path d={`M${x - 12} ${y} L${x} ${y - 18} L${x + 12} ${y} Z`} {...DF} />
          <line x1={x} y1={y - 18} x2={x} y2={y - 26} {...H} />
          <path d={`M${x} ${y - 26} l5 2 l-5 2`} {...H} />
        </g>
      ))}
      <Sword x={150} y={206} r={180} len={58} />
      <Sword x={164} y={210} r={186} len={54} />
      <Figure x={90} y={236} s={1.3} r={-6} />
      {[0, 1, 2, 3, 4].map((i) => (
        <Sword key={i} x={86 + i * 5} y={178 - i * 3} r={50 + (i - 2) * 2} len={70} />
      ))}
      <circle cx={88} cy={190} r={3} {...D} />
      <line x1={26} y1={236} x2={174} y2={236} {...H} />
    </g>
  );
}

function Eight() {
  const xs = [30, 44, 58, 72, 128, 142, 156, 170];
  return (
    <g>
      <path d="M58 104 Q100 76 142 104" {...H} />
      <Castle x={100} y={92} s={1.1} />
      {xs.map((x, i) => (
        <Sword key={x} x={x} y={196 + (i % 2) * 4} r={180} len={68} />
      ))}
      <Figure x={100} y={232} s={1.32} robe="raised" />
      {[196, 206, 216].map((y) => (
        <line key={y} x1={100 - (y - 186) * 0.3 - 5} y1={y} x2={100 + (y - 186) * 0.3 + 5} y2={y} {...F} />
      ))}
      <line x1={93} y1={180} x2={107} y2={180} stroke="#ECECEC" strokeWidth={2.4} strokeLinecap="round" />
      <ellipse cx={64} cy={240} rx={12} ry={2} {...H} />
      <ellipse cx={142} cy={242} rx={10} ry={1.8} {...H} />
      <line x1={26} y1={232} x2={174} y2={232} {...H} />
    </g>
  );
}

function Nine() {
  return (
    <g>
      {Array.from({ length: 9 }, (_, i) => (
        <Sword key={i} x={100} y={58 + i * 13} r={90} len={124} />
      ))}
      <rect x={34} y={208} width={132} height={18} {...D} />
      {Array.from({ length: 10 }, (_, i) => (
        <rect key={i} x={38 + i * 12.6} y={212} width={7} height={7} {...(i % 3 ? F : H)} />
      ))}
      <rect x={34} y={226} width={132} height={10} {...D} />
      <path d="M78 208 V186 H96" {...R} />
      <Figure x={88} y={210} s={0.95} bowed arms="hold" />
      <path d="M84 178 L88 172 M94 178 L92 172" {...L} />
    </g>
  );
}

function Ten() {
  return (
    <g>
      <path d={arcPath(150, 198, 26, 180, 360)} {...H} />
      {[200, 225, 250, 275, 300, 325].map((a) => {
        const [x0, y0] = pol(150, 198, 30, a);
        const [x1, y1] = pol(150, 198, 36, a);
        return <line key={a} x1={x0} y1={y0} x2={x1} y2={y1} {...H} />;
      })}
      <line x1={22} y1={198} x2={178} y2={198} {...F} />
      {Array.from({ length: 10 }, (_, i) => (
        <Sword key={i} x={62 + i * 9.6} y={170 + (i % 3) * 2} r={180} len={84 - (i % 2) * 6} />
      ))}
      <path d="M46 210 L156 212 L156 224 L46 224 Z" {...R} />
      <circle cx={40} cy={216} r={6} {...D} />
      <line x1={22} y1={234} x2={178} y2={234} {...H} />
    </g>
  );
}

function Page() {
  return (
    <g>
      <path d="M28 96 C48 84 64 104 86 92" {...F} />
      <path d="M36 112 C56 102 72 118 94 108" {...H} />
      <path d="M24 136 C40 128 56 140 72 132" {...H} />
      {[[136, 62], [150, 70], [160, 58], [146, 52], [170, 76]].map(([x, y]) => (
        <Bird key={`${x}${y}`} x={x} y={y} s={0.9} />
      ))}
      <path d="M22 220 Q60 204 100 214 Q140 224 178 206" {...H} />
      <Figure x={82} y={236} s={1.36} arms="forward" />
      <Sword x={118} y={128} r={12} len={112} />
      <line x1={26} y1={236} x2={174} y2={236} {...H} />
    </g>
  );
}

function Knight() {
  return (
    <g>
      <path d="M22 84 C60 68 100 96 150 70" {...H} />
      <path d="M22 104 C64 92 104 116 156 92" {...H} />
      <path d="M30 238 Q26 210 40 192" {...F} />
      <path d="M44 238 Q42 214 54 198" {...F} />
      {[150, 160, 170, 180].map((y, i) => (
        <line key={y} x1={22 + i * 3} y1={y} x2={48 + i * 3} y2={y} {...DOT} />
      ))}
      <Horse x={92} y={224} s={1.4} r={-10} gait="charge" riderArm="M5 -36 L22 -50" />
      <Sword x={140} y={96} r={48} len={88} />
      <line x1={26} y1={236} x2={174} y2={236} {...H} />
    </g>
  );
}

function Queen() {
  return (
    <Scale x={100} y={236} s={1.16}>
      <Cloud x={34} y={236} bumps={[6, 9, 7, 8, 6, 9]} />
      <Bird x={146} y={84} s={1.2} />
      <Throne x={58} y={226} w={34} h={96} />
      <path d="M50 140 L58 148 L50 156 Z M66 140 L58 148 L66 156 Z" {...F} />
      <Seated x={66} y={226} s={1.2} arms="forward" />
      <Sword x={106} y={128} len={116} />
      <path d="M78 196 L98 186" {...L} />
      <path d="M78 194 L128 178" {...F} />
      <circle cx={130} cy={177} r={2.4} {...D} />
    </Scale>
  );
}

function King() {
  return (
    <Scale x={100} y={230} s={1.12}>
      <Cloud x={30} y={226} bumps={[6, 8, 7]} />
      <Cloud x={128} y={228} bumps={[5, 7, 6]} />
      <Bird x={144} y={70} />
      <Bird x={154} y={78} s={0.8} />
      <Throne x={100} y={222} w={58} h={124} top="step" />
      <Crescent x={82} y={110} r={5} rot={180} />
      <Crescent x={118} y={110} r={5} />
      <path d="M92 104 L100 110 L92 116 Z M108 104 L100 110 L108 116 Z" {...F} />
      <Seated x={100} y={222} s={1.3} arms="forward" />
      <Sword x={120} y={142} r={6} len={116} />
    </Scale>
  );
}

export const SWORDS_ART: readonly ComponentType[] = [Ace, Two, Three, Four, Five, Six, Seven, Eight, Nine, Ten, Page, Knight, Queen, King];
