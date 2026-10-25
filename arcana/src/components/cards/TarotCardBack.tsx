import { CARD_BG, D, F, H, L, S, SILVER, arcPath, pol, polygonPath } from "@/artwork/style";
import { Crescent } from "@/artwork/primitives";
import s from "./cardFace.module.css";

/**
 * The shared card back: double-line border, a central compass-and-star emblem,
 * symmetrical line work and a restrained circular motif. It reuses the face's
 * frame and guide-circle geometry so both sides read as one object.
 */
export function TarotCardBack() {
  const ticks = Array.from({ length: 36 }, (_, i) => i * 10);
  return (
    <svg className={s.svg} viewBox="0 0 200 300" aria-hidden="true" focusable="false">
      <rect width={200} height={300} fill={CARD_BG} />
      <rect x={0.5} y={0.5} width={199} height={299} rx={11} fill="none" stroke="#2b2c2f" strokeWidth={1} />
      <rect x={7} y={7} width={186} height={286} rx={5} fill="none" stroke="#3d3f44" strokeWidth={0.8} />
      <rect x={11.5} y={11.5} width={177} height={277} rx={3} fill="none" stroke={SILVER} strokeOpacity={0.5} strokeWidth={0.5} />

      {/* corner quarter-circles */}
      {[
        [11.5, 11.5, 0, 90],
        [188.5, 11.5, 90, 180],
        [188.5, 288.5, 180, 270],
        [11.5, 288.5, 270, 360],
      ].map(([x, y, a0, a1]) => (
        <path key={`${x}${y}`} d={arcPath(x, y, 12, a0, a1)} {...H} />
      ))}

      {/* axes with diamond terminals */}
      <line x1={100} y1={24} x2={100} y2={276} {...H} />
      <line x1={22} y1={150} x2={178} y2={150} {...H} />
      {[
        [100, 24],
        [100, 276],
        [22, 150],
        [178, 150],
      ].map(([x, y]) => (
        <path key={`${x}${y}`} d={polygonPath(x, y, 3, 4)} {...D} />
      ))}

      {/* top and bottom arcs */}
      <path d={arcPath(100, 22, 46, 25, 155)} {...H} />
      <path d={arcPath(100, 278, 46, 205, 335)} {...H} />
      <path d={arcPath(100, 30, 28, 30, 150)} {...F} strokeOpacity={0.6} />
      <path d={arcPath(100, 270, 28, 210, 330)} {...F} strokeOpacity={0.6} />

      {/* emblem */}
      {ticks.map((a, i) => {
        const [x0, y0] = pol(100, 150, 56, a);
        const [x1, y1] = pol(100, 150, i % 3 === 0 ? 62 : 59, a);
        return <line key={a} x1={x0} y1={y0} x2={x1} y2={y1} {...H} />;
      })}
      <circle cx={100} cy={150} r={52} {...H} fill={CARD_BG} />
      <circle cx={100} cy={150} r={46} {...F} />
      <path d={polygonPath(100, 150, 44, 4)} {...F} />
      <path d={polygonPath(100, 150, 44, 4, 45)} {...F} />
      <circle cx={100} cy={150} r={31} {...D} />
      <path d={polygonPath(100, 150, 31, 4, 45)} {...H} />
      <circle cx={100} cy={150} r={21} {...F} />
      <path d={polygonPath(100, 150, 15, 4)} {...L} />
      <circle cx={100} cy={150} r={4.2} {...S} />
      <circle cx={100} cy={150} r={8.5} {...H} />

      <Crescent x={100} y={84} r={6} rot={-90} />
      <Crescent x={100} y={216} r={6} rot={90} />
      <circle cx={60} cy={150} r={1.4} {...S} />
      <circle cx={140} cy={150} r={1.4} {...S} />
    </svg>
  );
}
