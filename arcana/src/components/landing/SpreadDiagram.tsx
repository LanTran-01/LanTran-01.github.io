import { useMemo } from "react";
import type { SpreadId } from "@/domain/types";
import { CARD_RATIO, DIAGRAM_LABELS, spreadGeometry } from "@/domain/spreadGeometry";

/**
 * A miniature, to-scale drawing of a spread's arrangement, derived from the
 * same geometry as the reading stage.
 */
export function SpreadDiagram({ id, active = false }: { id: SpreadId; active?: boolean }) {
  const g = useMemo(() => spreadGeometry(id, "wide", 100, DIAGRAM_LABELS), [id]);
  const w = 100;
  const h = w * CARD_RATIO;
  const pad = 24;
  // Square viewBox so every diagram shares the same visual footprint.
  const side = Math.max(g.width, g.height) + pad * 2;
  const ox = (side - g.width) / 2;
  const oy = (side - g.height) / 2;
  return (
    <svg viewBox={`0 0 ${side} ${side}`} width="100%" height="100%" aria-hidden="true" focusable="false">
      {g.slots.map((slot) => (
        <rect
          key={slot.index}
          x={ox + slot.cx - w / 2}
          y={oy + slot.cy - h / 2}
          width={w}
          height={h}
          rx={w * 0.08}
          transform={slot.rotate ? `rotate(90 ${ox + slot.cx} ${oy + slot.cy})` : undefined}
          fill={active ? (slot.crossing ? "#4b4d51" : "#2b2c2f") : slot.crossing ? "#2a2b2d" : "#151516"}
          stroke={active ? "#d6dbe2" : "#5a5c60"}
          strokeWidth={side / 120}
        />
      ))}
    </svg>
  );
}
