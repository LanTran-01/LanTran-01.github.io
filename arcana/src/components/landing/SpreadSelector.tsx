import type { SpreadDefinition, SpreadId } from "@/domain/types";
import { SPREADS } from "@/domain/spreadDefinitions";
import { SpreadDiagram } from "@/components/landing/SpreadDiagram";
import s from "./landing.module.css";

interface SpreadSelectorProps {
  value: SpreadId;
  onChange: (id: SpreadId) => void;
}

/** Native radio group styled as selectable panels: arrow keys move between spreads. */
export function SpreadSelector({ value, onChange }: SpreadSelectorProps) {
  return (
    <div className={s.options}>
      {SPREADS.map((spread) => (
        <SpreadOption key={spread.id} spread={spread} checked={spread.id === value} onSelect={() => onChange(spread.id)} />
      ))}
    </div>
  );
}

function SpreadOption({ spread, checked, onSelect }: { spread: SpreadDefinition; checked: boolean; onSelect: () => void }) {
  const descId = `spread-desc-${spread.id}`;
  return (
    <label className={s.option} data-checked={checked || undefined}>
      <input type="radio" name="spread" value={spread.id} checked={checked} onChange={onSelect} className={s.radio} aria-describedby={descId} />
      <span className={s.optionDiagram}>
        <SpreadDiagram id={spread.id} active={checked} />
      </span>
      <span className={s.optionText}>
        <span className={s.optionTop}>
          <span className={s.optionName}>{spread.name}</span>
          <span className={s.optionCount}>
            {spread.count} {spread.count === 1 ? "card" : "cards"}
          </span>
        </span>
        <span id={descId} className={s.optionTagline}>
          {spread.tagline}
        </span>
      </span>
    </label>
  );
}
