import { useMemo, useRef } from "react";
import type { SpreadId } from "@/domain/types";
import { getSpread, positionNumber } from "@/domain/spreadDefinitions";
import { CARD_RATIO, PREVIEW_LABELS, fitCardWidth, spreadGeometry } from "@/domain/spreadGeometry";
import { useElementWidth } from "@/hooks/useElementSize";
import { TarotCardBackStatic } from "@/components/cards/TarotCard";
import s from "./landing.module.css";

const BASE = 100;
const MAX: Record<SpreadId, number> = { single: 200, three: 168, five: 124, ten: 96 };

/**
 * The configurator's product view: ten card backs that glide into the chosen
 * spread's arrangement. Cards not used by the spread rest, hidden, in a deck
 * at the centre.
 */
export function SpreadPreview({ spreadId, height }: { spreadId: SpreadId; height: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const width = useElementWidth(ref);
  const spread = getSpread(spreadId);

  const layout = useMemo(() => {
    if (!width) return null;
    const w = fitCardWidth(spreadId, "wide", width - 64, height - 96, { min: 40, max: MAX[spreadId] }, PREVIEW_LABELS);
    const g = spreadGeometry(spreadId, "wide", w, PREVIEW_LABELS);
    return { g, ox: (width - g.width) / 2, oy: (height - g.height) / 2 - 12 };
  }, [spreadId, width, height]);

  return (
    <div ref={ref} className={s.preview} style={{ height }} aria-hidden="true">
      <div className={s.previewFloor} />
      {layout &&
        Array.from({ length: 10 }, (_, i) => {
          const slot = layout.g.slots.find((sl) => sl.index === i);
          const k = layout.g.card / BASE;
          const x = slot ? layout.ox + slot.cx : width / 2;
          const y = slot ? layout.oy + slot.cy : height / 2;
          const rot = slot ? slot.rotate : 0;
          return (
            <div
              key={i}
              className={s.previewCard}
              style={{
                width: BASE,
                height: BASE * CARD_RATIO,
                zIndex: slot?.crossing ? 3 : slot ? 2 : 1,
                opacity: slot ? 1 : 0,
                transform: `translate(${x - BASE / 2}px, ${y - (BASE * CARD_RATIO) / 2}px) rotate(${rot}deg) scale(${slot ? k : k * 0.85})`,
                transitionDelay: `${i * 22}ms`,
              }}
            >
              <TarotCardBackStatic />
            </div>
          );
        })}
      {layout &&
        layout.g.slots.map((slot) => {
          const l = slot.label;
          const left = layout.ox + (l.align === "center" ? l.x - l.width / 2 : l.x);
          const top = layout.oy + l.y;
          const shift = l.anchor === "bottom" ? "-100%" : l.anchor === "middle" ? "-50%" : "0";
          return (
            <span
              key={`${spreadId}-${slot.index}`}
              className={s.previewLabel}
              data-align={l.align}
              style={{ left, top, width: l.width, transform: `translateY(${shift})`, animationDelay: `${180 + slot.index * 40}ms` }}
            >
              <span className={s.previewNum}>{positionNumber(slot.index)}</span> {spread.positions[slot.index].label}
            </span>
          );
        })}
    </div>
  );
}
