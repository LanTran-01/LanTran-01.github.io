import type { ComponentType } from "react";
import { Pentacle, Figure, Seated, Kneeling, Horse, Throne, Castle, Tree, Bird, Glow, Scale } from "@/artwork/primitives";
import { D, DF, F, H, L, LB, R, S, SS, arcPath, lemniscatePath, pol } from "@/artwork/style";
import { seededRandom } from "@/domain/shuffleDeck";

/* Pentacles — earth. Circles, squares, and precise radial structures. */

function Ace() {
  return (
    <g>
      {Array.from({ length: 60 }, (_, i) => {
        const [x0, y0] = pol(100, 104, 40, i * 6);
        const [x1, y1] = pol(100, 104, i % 5 === 0 ? 46 : 43, i * 6);
        return <line key={i} x1={x0} y1={y0} x2={x1} y2={y1} {...(i % 5 === 0 ? F : H)} />;
      })}
      <circle cx={100} cy={104} r={36} {...F} />
      <Pentacle x={100} y={104} r={30} />
      <path d="M58 244 V198 A42 42 0 0 1 142 198 V244" {...L} />
      <path d="M66 244 V200 A34 34 0 0 1 134 200 V244" {...F} />
      {Array.from({ length: 9 }, (_, i) => (
        <path key={i} d={arcPath(100, 198, 38, 185 + i * 19, 196 + i * 19)} {...H} />
      ))}
      <path d="M88 244 L96 214 M112 244 L104 214" {...H} />
      <path d="M86 214 L100 196 L114 214" {...F} />
      {[34, 166].map((x) => (
        <g key={x}>
          <line x1={x} y1={244} x2={x} y2={228} {...F} />
          <path d={`M${x - 3} 226 L${x} 220 L${x + 3} 226`} {...F} />
        </g>
      ))}
    </g>
  );
}

function Two() {
  return (
    <g>
      <path d="M22 196 C40 180 52 212 72 196 C92 180 108 212 128 196 C148 180 160 210 178 194" {...F} />
      <path d="M22 206 C40 192 52 220 72 206 C92 192 108 220 128 206 C148 192 160 218 178 204" {...H} />
      {[
        [40, 186, -14],
        [158, 188, 16],
      ].map(([x, y, r]) => (
        <g key={x} transform={`translate(${x} ${y}) rotate(${r})`}>
          <path d="M-7 0 H7 L4 4 H-4 Z" {...D} />
          <path d="M0 0 V-11 L6 -2 Z" {...D} />
        </g>
      ))}
      <path d={lemniscatePath(32)} transform="translate(100 140)" {...F} />
      <Figure x={100} y={236} s={1.32} arms="out" />
      <Pentacle x={70} y={140} r={12} />
      <Pentacle x={130} y={140} r={12} />
      <line x1={22} y1={236} x2={178} y2={236} {...H} />
    </g>
  );
}

function Three() {
  return (
    <g>
      <path d="M46 238 V122 Q46 62 100 52 Q154 62 154 122 V238" {...L} />
      <path d="M56 238 V124 Q56 72 100 64 Q144 72 144 124 V238" {...H} />
      <Pentacle x={100} y={86} r={10} />
      <Pentacle x={82} y={114} r={10} />
      <Pentacle x={118} y={114} r={10} />
      <rect x={60} y={206} width={30} height={8} {...D} />
      <Figure x={74} y={206} s={0.82} arms="right-up" />
      <line x1={82} y1={167} x2={88} y2={160} {...F} />
      <Figure x={118} y={238} s={0.82} arms="forward" />
      <Figure x={138} y={238} s={0.78} robe="raised" hood />
      <rect x={124} y={190} width={16} height={11} {...DF} />
      <line x1={46} y1={238} x2={154} y2={238} {...H} />
    </g>
  );
}

function Four() {
  const skyline: [number, number, number][] = [
    [24, 18, 30], [42, 14, 44], [56, 20, 22], [130, 16, 38], [146, 12, 52], [158, 18, 28],
  ];
  return (
    <g>
      {skyline.map(([x, w, h]) => (
        <rect key={x} x={x} y={200 - h} width={w} height={h} {...H} />
      ))}
      <line x1={22} y1={200} x2={178} y2={200} {...H} />
      <Seated x={100} y={224} s={1.3} arms="hold" />
      <Pentacle x={100} y={196} r={11} />
      <Pentacle x={100} y={164} r={10} />
      <Pentacle x={80} y={234} r={9} />
      <Pentacle x={120} y={234} r={9} />
    </g>
  );
}

function Five() {
  const rnd = seededRandom(55);
  const snow = Array.from({ length: 46 }, () => [24 + rnd() * 152, 48 + rnd() * 192] as const);
  return (
    <g>
      <path d="M122 158 V74 A24 24 0 0 1 170 74 V158 Z" {...D} />
      <Glow x={146} y={110} r={30} />
      <line x1={146} y1={52} x2={146} y2={158} {...H} />
      <line x1={122} y1={110} x2={170} y2={110} {...H} />
      {[
        [134, 80], [158, 80], [146, 106], [134, 132], [158, 132],
      ].map(([x, y]) => (
        <Pentacle key={`${x}${y}`} x={x} y={y} r={7} />
      ))}
      {snow.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={0.75} {...SS} />
      ))}
      <Figure x={66} y={232} s={1.18} r={8} bowed robe="raised" />
      <line x1={52} y1={236} x2={56} y2={196} {...L} />
      <Figure x={108} y={232} s={1.12} hood bowed />
      <line x1={22} y1={236} x2={178} y2={236} {...H} />
    </g>
  );
}

function Six() {
  const arc = Array.from({ length: 6 }, (_, i) => pol(100, 132, 70, 210 + i * 24));
  return (
    <g>
      {arc.map(([x, y], i) => (
        <Pentacle key={i} x={x} y={y} r={8} />
      ))}
      <Figure x={100} y={224} s={1.32} arms="out" />
      <line x1={70} y1={150} x2={110} y2={150} {...L} transform="rotate(-6 90 150)" />
      <line x1={90} y1={148} x2={90} y2={170} {...F} />
      {[72, 108].map((x) => (
        <g key={x}>
          <path d={`M${x} 150 L${x - 6} 162 M${x} 150 L${x + 6} 162`} {...H} />
          <path d={`M${x - 8} 162 Q${x} 168 ${x + 8} 162 Z`} {...D} />
        </g>
      ))}
      {[[124, 196], [128, 204], [124, 212]].map(([x, y]) => (
        <circle key={y} cx={x} cy={y} r={1.2} {...S} />
      ))}
      <Kneeling x={142} y={236} s={1.1} flip />
      <Kneeling x={52} y={236} s={1.05} />
      <line x1={22} y1={236} x2={178} y2={236} {...H} />
    </g>
  );
}

function Seven() {
  const coins: [number, number][] = [
    [114, 140], [142, 132], [128, 164], [158, 162], [116, 190], [148, 194],
  ];
  return (
    <g>
      {[
        "M134 236 C120 206 108 170 112 130",
        "M134 236 C138 200 150 160 160 128",
        "M134 236 C130 210 132 180 128 150",
        "M134 236 C150 214 162 190 168 168",
      ].map((d) => (
        <path key={d} d={d} {...F} />
      ))}
      {coins.map(([x, y]) => (
        <Pentacle key={`${x}${y}`} x={x} y={y} r={8.5} />
      ))}
      <Figure x={64} y={236} s={1.3} r={5} arms="forward" />
      <line x1={86} y1={150} x2={68} y2={236} {...LB} />
      <path d="M68 236 L60 232" {...L} />
      <Pentacle x={94} y={232} r={8} />
      <line x1={22} y1={240} x2={178} y2={240} {...H} />
    </g>
  );
}

function Eight() {
  return (
    <g>
      <Castle x={46} y={110} s={1} />
      <path d="M22 116 Q46 104 78 116" {...H} />
      <line x1={150} y1={58} x2={150} y2={236} {...L} />
      {[70, 96, 122, 148, 174, 200].map((y) => (
        <Pentacle key={y} x={150} y={y} r={9.5} />
      ))}
      <rect x={58} y={200} width={48} height={6} {...D} />
      <line x1={64} y1={206} x2={64} y2={236} {...L} />
      <line x1={100} y1={206} x2={100} y2={236} {...L} />
      <Seated x={50} y={236} s={1.1} arms="forward" />
      <Pentacle x={88} y={191} r={8} />
      <path d="M66 196 L78 176" {...L} />
      <rect x={74} y={170} width={8} height={5} transform="rotate(-30 78 172)" {...D} />
      <Pentacle x={122} y={230} r={7.5} />
      <line x1={22} y1={238} x2={178} y2={238} {...H} />
    </g>
  );
}

function Nine() {
  const right: [number, number][] = [
    [128, 122], [156, 116], [132, 152], [160, 148], [130, 182], [158, 180],
  ];
  const left: [number, number][] = [
    [40, 150], [50, 178], [36, 204],
  ];
  return (
    <g>
      <path d="M144 238 C130 200 150 160 140 110 M144 238 C160 200 150 150 170 112" {...F} />
      <path d="M44 238 C30 210 54 180 42 140" {...F} />
      {[...right, ...left].map(([x, y]) => (
        <g key={`g${x}${y}`}>
          <circle cx={x + 9} cy={y + 8} r={1.4} {...F} />
          <circle cx={x + 12} cy={y + 9} r={1.4} {...F} />
          <circle cx={x + 10.5} cy={y + 11.5} r={1.4} {...F} />
        </g>
      ))}
      {[...right, ...left].map(([x, y]) => (
        <Pentacle key={`${x}${y}`} x={x} y={y} r={8.5} />
      ))}
      <Figure x={92} y={236} s={1.38} arms="left-up" robe="raised" />
      <g transform="translate(79 166)">
        <path d="M-4 0 Q0 -10 4 0 L2 4 H-2 Z" {...D} />
        <circle cx={0} cy={-9} r={2.4} {...D} />
        <path d="M2 -9.5 L4.6 -8.6 L2 -7.6" {...F} />
        <line x1={-5} y1={4.5} x2={5} y2={4.5} {...L} />
      </g>
      <path d="M118 236 a2 2 0 1 1 4 0 a4 4 0 1 1 -8 0" {...F} />
      <line x1={22} y1={240} x2={178} y2={240} {...H} />
    </g>
  );
}

function Ten() {
  const tree: Record<string, [number, number]> = {
    k: [100, 56], c: [128, 74], b: [72, 74], ch: [128, 110], g: [72, 110],
    t: [100, 128], n: [128, 154], h: [72, 154], y: [100, 174], m: [100, 206],
  };
  const paths = [
    "k-c", "k-b", "k-t", "c-b", "c-ch", "b-g", "c-t", "b-t", "ch-g", "ch-t", "g-t",
    "ch-n", "g-h", "t-n", "t-h", "t-y", "n-h", "n-y", "h-y", "y-m", "n-m", "h-m",
  ];
  return (
    <g>
      <line x1={34} y1={120} x2={34} y2={246} {...H} />
      <line x1={166} y1={120} x2={166} y2={246} {...H} />
      {paths.map((p) => {
        const [a, b] = p.split("-");
        return <line key={p} x1={tree[a][0]} y1={tree[a][1]} x2={tree[b][0]} y2={tree[b][1]} {...H} />;
      })}
      {Object.entries(tree).map(([k, [x, y]]) => (
        <Pentacle key={k} x={x} y={y} r={9.5} />
      ))}
      <Seated x={52} y={244} s={0.62} robe="raised" />
      <Figure x={142} y={244} s={0.56} />
      <Figure x={154} y={244} s={0.52} robe="raised" />
      <Figure x={128} y={244} s={0.36} />
      <line x1={22} y1={244} x2={178} y2={244} {...H} />
    </g>
  );
}

function Page() {
  const vp: [number, number] = [150, 184];
  return (
    <g>
      <line x1={22} y1={184} x2={178} y2={184} {...F} />
      {[22, 52, 82, 112, 142, 172, 196].map((x) => (
        <line key={x} x1={x} y1={248} x2={vp[0] + (x - 110) * 0.08} y2={vp[1]} {...H} />
      ))}
      <Tree x={36} y={184} h={20} r={7} />
      <Tree x={52} y={184} h={16} r={6} />
      <path d="M150 184 L164 160 L178 184" {...DF} />
      <Figure x={88} y={236} s={1.4} arms="up" />
      <Glow x={102} y={146} r={22} />
      <Pentacle x={102} y={146} r={13} />
    </g>
  );
}

function Knight() {
  return (
    <g>
      {Array.from({ length: 8 }, (_, i) => (
        <line key={i} x1={22 + i * 22} y1={184} x2={6 + i * 24} y2={208} {...H} />
      ))}
      <line x1={22} y1={184} x2={178} y2={184} {...F} />
      <path d="M22 184 Q40 170 56 178 Q72 168 86 182" {...H} />
      <Horse x={92} y={232} s={1.46} gait="still" riderArm="M5 -36 L22 -38" />
      <Pentacle x={132} y={166} r={11} />
      <line x1={22} y1={232} x2={178} y2={232} {...H} />
    </g>
  );
}

function Queen() {
  const roses = Array.from({ length: 13 }, (_, i) => pol(100, 150, 72, 180 + i * 15));
  return (
    <g>
      <path d={arcPath(100, 150, 72, 180, 360)} {...F} />
      <line x1={28} y1={150} x2={28} y2={236} {...F} />
      <line x1={172} y1={150} x2={172} y2={236} {...F} />
      {roses.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={3.4} {...D} />
          <circle cx={x} cy={y} r={1.4} {...F} />
        </g>
      ))}
      <Throne x={100} y={224} w={50} h={92} top="arch" />
      <Seated x={100} y={224} s={1.3} arms="hold" />
      <Pentacle x={100} y={202} r={12} />
      <g transform="translate(150 236)">
        <ellipse cx={0} cy={-4} rx={7} ry={4.6} {...R} />
        <circle cx={6} cy={-9} r={3.2} {...R} />
        <path d="M5 -12 L3 -20 M8 -12 L8.6 -20" {...L} />
      </g>
      <line x1={22} y1={236} x2={178} y2={236} {...H} />
    </g>
  );
}

function King() {
  const bull = (x: number) => (
    <g>
      <circle cx={x} cy={104} r={6.5} {...D} />
      <path d={`M${x - 6} 101 q-4 -5 -1 -9 M${x + 6} 101 q4 -5 1 -9`} {...L} />
    </g>
  );
  const grapes = (x: number, y: number) =>
    [
      [0, 0], [3, 0], [6, 0], [1.5, 2.6], [4.5, 2.6], [3, 5.2],
    ].map(([dx, dy]) => <circle key={`${x}${y}${dx}${dy}`} cx={x + dx} cy={y + dy} r={1.4} {...F} />);
  return (
    <Scale x={100} y={236} s={1.1}>
      <Castle x={50} y={96} s={1} />
      <path d="M36 236 C32 196 52 170 40 130 M164 236 C168 196 148 170 160 130" {...F} />
      {grapes(36, 150)}
      {grapes(44, 190)}
      {grapes(154, 160)}
      {grapes(150, 200)}
      <Throne x={100} y={222} w={66} h={122} />
      {bull(74)}
      {bull(126)}
      <Seated x={100} y={222} s={1.32} arms="forward" />
      <path d="M93 177 L95 171 L100 175 L105 171 L107 177" {...L} />
      <line x1={80} y1={146} x2={80} y2={214} {...LB} />
      <circle cx={80} cy={142} r={4} {...D} />
      <Pentacle x={118} y={196} r={12} />
      <Bird x={146} y={84} />
    </Scale>
  );
}

export const PENTACLES_ART: readonly ComponentType[] = [Ace, Two, Three, Four, Five, Six, Seven, Eight, Nine, Ten, Page, Knight, Queen, King];
