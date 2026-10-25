import { useMemo, useRef, type CSSProperties } from "react";
import type { Reading, SpreadId } from "@/domain/types";
import type { ResolvedReading } from "@/domain/readingModel";
import { positionNumber } from "@/domain/spreadDefinitions";
import { fitCardWidth, spreadGeometry, type FitLimits, type GeometryVariant, type LabelBox } from "@/domain/spreadGeometry";
import { useElementWidth } from "@/hooks/useElementSize";
import { TarotCard } from "@/components/cards/TarotCard";
import s from "./reading.module.css";

/** Card-width limits per spread. Minimums keep the ten-card cross from shrinking to thumbnails. */
const LIMITS: Record<SpreadId, Record<GeometryVariant, FitLimits>> = {
  single: { wide: { min: 230, max: 300 }, compact: { min: 170, max: 240 } },
  three: { wide: { min: 160, max: 232 }, compact: { min: 88, max: 150 } },
  five: { wide: { min: 128, max: 184 }, compact: { min: 80, max: 128 } },
  ten: { wide: { min: 108, max: 156 }, compact: { min: 72, max: 120 } },
};

interface SpreadLayoutProps {
  reading: Reading;
  resolved: ResolvedReading;
  variant: GeometryVariant;
  /** Height available before the page must scroll. */
  maxHeight: number;
  onActivate: (index: number) => void;
}

function labelStyle(l: LabelBox): CSSProperties {
  const shift = l.anchor === "bottom" ? "-100%" : l.anchor === "middle" ? "-50%" : "0";
  return {
    left: l.align === "center" ? l.x - l.width / 2 : l.x,
    top: l.y,
    width: l.width,
    transform: `translateY(${shift})`,
  };
}

/**
 * The card arrangement. Every position is a button in reading order, so Tab
 * walks the spread position by position. Labels sit outside the cards so the
 * crossing card's label stays upright.
 */
export function SpreadLayout({ reading, resolved, variant, maxHeight, onActivate }: SpreadLayoutProps) {
  const ref = useRef<HTMLDivElement>(null);
  const width = useElementWidth(ref);
  const { spread, drawn } = resolved;

  const geom = useMemo(() => {
    if (!width) return null;
    const w = fitCardWidth(spread.id, variant, width, maxHeight, LIMITS[spread.id][variant]);
    return spreadGeometry(spread.id, variant, w);
  }, [spread.id, variant, width, maxHeight]);

  const total = spread.count;
  const baseSelected = spread.id === "ten" && reading.selected === 0;

  return (
    <div ref={ref} className={s.stageWrap}>
      {geom && (
        <div
          className={s.stage}
          data-spread={spread.id}
          data-base-selected={baseSelected || undefined}
          style={{ width: geom.width, height: geom.height }}
        >
          {geom.slots.map((slot) => {
            const d = drawn[slot.index];
            const status = reading.status[slot.index];
            const shown = status !== "hidden";
            const pos = `Position ${slot.index + 1} of ${total}, ${d.position.label}`;
            const label =
              status === "hidden"
                ? `${pos}. Face-down card. Activate to reveal.`
                : status === "revealing"
                  ? `${pos}. Revealing.`
                  : `${pos}: ${d.card.name}, ${d.orientation}. Activate to read its interpretation.`;
            return (
              <div
                key={reading.draws[slot.index].cardId}
                className={s.slot}
                data-index={slot.index}
                data-crossing={slot.crossing || undefined}
                data-base={slot.base || undefined}
                style={{
                  left: slot.cx - geom.card / 2,
                  top: slot.cy - geom.cardH / 2,
                  width: geom.card,
                  height: geom.cardH,
                  zIndex: slot.z,
                  transform: slot.rotate ? "rotate(90deg)" : undefined,
                }}
              >
                <div className={s.dealer} style={{ animationDelay: `${120 + slot.index * 60}ms` }}>
                  <TarotCard
                    card={shown ? d.card : null}
                    orientation={shown ? d.orientation : undefined}
                    status={status}
                    selected={reading.selected === slot.index}
                    label={label}
                    onActivate={() => onActivate(slot.index)}
                  />
                </div>
              </div>
            );
          })}

          {geom.slots.map((slot) => {
            const d = drawn[slot.index];
            const revealed = reading.status[slot.index] === "revealed";
            return (
              <div
                key={`label-${reading.draws[slot.index].cardId}`}
                className={s.slotLabel}
                data-align={slot.label.align}
                data-selected={reading.selected === slot.index || undefined}
                style={labelStyle(slot.label)}
                aria-hidden="true"
              >
                <span className={s.slotPos}>
                  <span className={s.slotNum}>{positionNumber(slot.index)}</span>
                  {d.position.label}
                </span>
                {revealed && (
                  <span className={s.slotName}>
                    {d.card.name}
                    {d.orientation === "reversed" && <span className={s.slotRev}> · Rev.</span>}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
