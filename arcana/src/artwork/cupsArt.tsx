import type { ComponentType } from "react";
import { Cup, Figure, Seated, Horse, Throne, Waves, Cloud, Tree, House, Rosette, Glow, Crescent, Sparkle, Scale } from "@/artwork/primitives";
import { D, DF, DOT, F, H, L, LB, S, arcPath, pol, polygonPath, starPath, vesicaPath } from "@/artwork/style";

/* Cups — water. Circles, flowing arcs, and balanced organic forms. */

function Ace() {
  return (
    <g>
      <circle cx={100} cy={112} r={46} {...H} strokeDasharray="1 3" />
      <circle cx={100} cy={112} r={36} {...H} />
      <path d="M93 62 L100 70 L107 62" {...L} />
      <circle cx={100} cy={76} r={1.6} {...S} />
      <path d="M80 94 C58 120 74 170 62 214" {...DOT} />
      <path d="M84 96 C72 128 88 176 82 216" {...DOT} />
      <path d="M120 94 C142 120 126 170 138 214" {...DOT} />
      <path d="M116 96 C128 128 112 176 118 216" {...DOT} />
      <path d="M100 150 V214" {...DOT} />
      <Cup x={100} y={118} s={2.1} />
      <Waves x0={26} x1={174} y={222} rows={3} gap={7} amp={1.6} period={14} strong />
    </g>
  );
}

function Two() {
  const left = "M100 150 C88 140 112 130 100 120 C88 110 112 100 100 92";
  return (
    <g>
      <line x1={100} y1={86} x2={100} y2={156} {...H} />
      <path d={left} {...F} />
      <path d={left} transform="translate(200 0) scale(-1 1)" {...F} />
      <circle cx={100} cy={82} r={4.4} {...D} />
      <path d="M95 81 Q84 70 72 76 Q82 78 86 84 M105 81 Q116 70 128 76 Q118 78 114 84" {...F} />
      <Cup x={70} y={168} r={14} s={1.35} />
      <Cup x={130} y={168} r={-14} s={1.35} />
      <Figure x={56} y={230} s={0.7} arms="forward" />
      <Figure x={144} y={230} s={0.7} arms="back" />
      <line x1={26} y1={230} x2={174} y2={230} {...H} />
      <House x={100} y={230} s={0.8} />
    </g>
  );
}

function Three() {
  const cups: [number, number, number][] = [
    [100, 96, 0],
    [72, 146, -12],
    [128, 146, 12],
  ];
  return (
    <g>
      {cups.map(([x, y]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r={30} {...H} />
      ))}
      {cups.map(([x, y, r]) => (
        <g key={`c${x}${y}`}>
          <line x1={x} y1={y + 12} x2={x + (x - 100) * 0.35} y2={y + 44} {...F} />
          <Cup x={x} y={y} r={r} s={1.2} />
        </g>
      ))}
      {[
        [84, 218], [96, 214], [108, 216], [120, 220], [90, 226], [102, 224], [114, 228],
      ].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={4} {...DF} />
      ))}
      <line x1={26} y1={232} x2={174} y2={232} {...H} />
    </g>
  );
}

function Four() {
  return (
    <g>
      <Tree x={40} y={226} h={120} r={22} />
      <Seated x={78} y={222} s={1.1} arms="cross" />
      <Cloud x={130} y={70} bumps={[5, 7, 6]} />
      <path d="M150 72 C150 82 142 88 134 92" {...L} />
      <Cup x={128} y={106} r={-8} s={1} />
      <circle cx={128} cy={106} r={16} {...H} strokeDasharray="1 3" />
      {[104, 128, 152].map((x) => (
        <Cup key={x} x={x} y={218} s={0.9} />
      ))}
      <line x1={26} y1={229} x2={174} y2={229} {...H} />
    </g>
  );
}

function Five() {
  return (
    <g>
      <Waves x0={26} x1={174} y={146} rows={3} gap={6} amp={1.3} period={14} />
      <path d="M126 148 Q148 122 170 148" {...L} />
      <line x1={126} y1={148} x2={126} y2={162} {...F} />
      <line x1={170} y1={148} x2={170} y2={162} {...F} />
      <Figure x={90} y={226} s={1.3} robe="raised" hood bowed />
      {[34, 52, 70].map((x, i) => (
        <g key={x}>
          <Cup x={x} y={222 - (i % 2) * 2} r={-96} s={0.82} />
          <path d={`M${x - 10} ${224 - (i % 2) * 2} q-4 3 -2 5`} {...F} />
        </g>
      ))}
      <Cup x={136} y={216} s={0.9} />
      <Cup x={158} y={216} s={0.9} />
      <line x1={26} y1={227} x2={174} y2={227} {...H} />
    </g>
  );
}

function Six() {
  const flower = (x: number, y: number) => <Rosette x={x} y={y - 17} r={2.6} />;
  return (
    <g>
      <House x={150} y={170} s={1.6} />
      {[64, 100, 136].map((x, i) => (
        <g key={x}>
          {flower(x, i === 1 ? 92 : 100)}
          <Cup x={x} y={i === 1 ? 92 : 100} s={0.95} />
        </g>
      ))}
      <Figure x={78} y={196} s={0.68} arms="forward" />
      <Figure x={118} y={196} s={0.56} />
      <Cup x={94} y={174} s={0.55} />
      {flower(94, 178)}
      {[56, 100, 144].map((x) => (
        <g key={x}>
          {flower(x, 222)}
          <Cup x={x} y={222} s={0.95} />
        </g>
      ))}
      <line x1={26} y1={233} x2={174} y2={233} {...H} />
    </g>
  );
}

function Seven() {
  const slots: [number, number][] = [
    [46, 104], [82, 98], [118, 98], [154, 104], [64, 156], [100, 152], [136, 156],
  ];
  const symbols = [
    <circle key="a" cx={0} cy={0} r={4} {...F} />,
    <path key="b" d="M-4.5 3 L0 -4.5 L4.5 3 Z" {...F} />,
    <rect key="c" x={-3.5} y={-3.5} width={7} height={7} {...F} />,
    <Crescent key="d" x={0} y={0} r={4.5} rot={-30} />,
    <Sparkle key="e" x={0} y={0} r={5} />,
    <path key="f" d="M0 0 a1.5 1.5 0 0 1 3 0 a3 3 0 0 1 -6 0 a4.5 4.5 0 0 1 9 0" {...F} />,
    <path key="g" d={polygonPath(0, 0, 4.6, 4)} {...F} />,
  ];
  return (
    <g>
      <path d="M30 186 C14 150 30 70 70 70 C90 54 120 56 136 70 C176 70 188 150 170 186 Z" {...H} />
      {slots.map(([x, y], i) => (
        <g key={i}>
          <g transform={`translate(${x} ${y - 22})`}>{symbols[i]}</g>
          <Cup x={x} y={y} s={0.95} />
        </g>
      ))}
      <Figure x={100} y={254} s={1.1} back robe="solid" />
    </g>
  );
}

function Eight() {
  const bottom = [40, 58, 76, 94, 112];
  const top = [49, 67, 103];
  return (
    <g>
      <circle cx={146} cy={70} r={15} {...F} />
      <Crescent x={146} y={70} r={13} rot={160} />
      <path d="M118 178 L134 150 L148 162 L164 136 L178 154" {...F} />
      <path d="M122 236 C134 214 140 196 150 176" {...DOT} />
      <Figure x={150} y={180} s={0.78} hood robe="raised" />
      <line x1={157} y1={160} x2={160} y2={182} {...L} />
      {bottom.map((x) => (
        <Cup key={x} x={x} y={222} s={0.72} />
      ))}
      {top.map((x) => (
        <Cup key={x} x={x} y={203} s={0.72} />
      ))}
      <rect x={81} y={196} width={8} height={14} {...H} strokeDasharray="1 2" />
      <line x1={26} y1={231} x2={174} y2={231} {...H} />
    </g>
  );
}

function Nine() {
  return (
    <g>
      <path d={arcPath(100, 176, 70, 195, 345)} {...F} />
      {Array.from({ length: 9 }, (_, i) => {
        const [x, y] = pol(100, 176, 70, 200 + i * 17.5);
        return <Cup key={i} x={x} y={y - 9} s={0.72} />;
      })}
      <Glow x={100} y={196} r={30} />
      <rect x={70} y={210} width={60} height={8} {...D} />
      <Seated x={100} y={226} s={1.15} arms="cross" />
      <line x1={26} y1={226} x2={174} y2={226} {...H} />
    </g>
  );
}

function Ten() {
  return (
    <g>
      {[60, 54, 48].map((r, i) => (
        <path key={r} d={arcPath(100, 150, r, 180, 360)} {...(i === 0 ? F : H)} />
      ))}
      {Array.from({ length: 10 }, (_, i) => {
        const [x, y] = pol(100, 150, 70, 192 + i * 17.33);
        return <Cup key={i} x={x} y={y} s={0.56} />;
      })}
      <House x={40} y={226} s={1.4} />
      <Figure x={84} y={226} s={0.85} arms="left-up" />
      <Figure x={108} y={226} s={0.85} arms="right-up" />
      <Figure x={136} y={226} s={0.5} arms="up" />
      <Figure x={152} y={226} s={0.45} arms="up" />
      <line x1={26} y1={226} x2={174} y2={226} {...H} />
      <Waves x0={26} x1={174} y={236} rows={1} amp={1.2} period={16} />
    </g>
  );
}

function Page() {
  return (
    <g>
      <Waves x0={24} x1={176} y={200} rows={4} gap={7} amp={1.6} period={14} />
      <Figure x={88} y={236} s={1.38} arms="forward" />
      <path d="M74 182 L72 170 L86 164" {...F} />
      <Cup x={124} y={170} s={1.05} />
      <g transform="translate(124 150) rotate(-62)">
        <path d={vesicaPath(0, 0, 3.4, 8)} {...D} transform="rotate(90)" />
        <path d="M7 0 L12 -4 L12 4 Z" {...D} />
        <circle cx={-4} cy={-1} r={0.8} {...S} />
      </g>
      <line x1={26} y1={236} x2={174} y2={236} {...H} />
    </g>
  );
}

function Knight() {
  return (
    <g>
      <Horse x={88} y={226} s={1.35} gait="walk" riderArm="M5 -36 L20 -42" />
      <path d="M78 159 l-6 -4 M82 158 l-4 -6" {...F} />
      <Cup x={122} y={154} s={0.9} />
      <Waves x0={128} x1={176} y={226} rows={3} gap={6} amp={1.6} period={12} />
      <line x1={24} y1={226} x2={128} y2={226} {...H} />
      <path d="M26 166 L44 150 L60 160 L78 142" {...H} />
    </g>
  );
}

function Queen() {
  return (
    <Scale x={100} y={236} s={1.22}>
      <Throne x={90} y={222} w={42} h={96} top="arch" />
      {[19, 14, 9].map((r) => (
        <path key={r} d={arcPath(90, 147, r, 180, 360)} {...F} />
      ))}
      <Seated x={90} y={222} s={1.15} arms="forward" />
      <g transform="translate(122 186) scale(1.25)">
        <path d="M-6 -16 Q0 -22 6 -16" {...L} />
        <circle cx={0} cy={-21.5} r={1.4} {...S} />
        <path d="M-9 -12 q-4 3 0 6 M9 -12 q4 3 0 6" {...F} />
      </g>
      <Cup x={122} y={186} s={1.25} />
      <Waves x0={36} x1={164} y={226} rows={2} gap={6} amp={1.6} period={13} strong />
    </Scale>
  );
}

function King() {
  return (
    <Scale x={100} y={230} s={1.2}>
      <Waves x0={34} x1={166} y={208} rows={4} gap={6} amp={1.8} period={14} />
      <rect x={70} y={204} width={60} height={12} {...D} />
      <Throne x={100} y={204} w={42} h={84} top="step" />
      <Seated x={100} y={204} s={1.15} arms="forward" />
      <line x1={78} y1={150} x2={78} y2={204} {...LB} />
      <path d={starPath(78, 146, 4, 1.6, 4)} {...S} />
      <Cup x={122} y={172} s={0.85} />
      <path d="M42 196 Q48 176 62 182" {...F} />
      <g transform="translate(58 180) rotate(-30)">
        <path d={vesicaPath(0, 0, 2.6, 6)} transform="rotate(90)" {...D} />
        <path d="M5 0 L9 -3 L9 3 Z" {...D} />
      </g>
      <path d="M144 200 Q154 206 164 200 Z" {...D} />
      <path d="M154 200 V184 L164 198 Z" {...D} />
      <line x1={154} y1={184} x2={154} y2={180} {...F} />
    </Scale>
  );
}

export const CUPS_ART: readonly ComponentType[] = [Ace, Two, Three, Four, Five, Six, Seven, Eight, Nine, Ten, Page, Knight, Queen, King];
