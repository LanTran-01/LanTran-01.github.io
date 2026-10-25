import type { Reading } from "@/domain/types";
import type { ResolvedReading } from "@/domain/readingModel";
import { Dialog } from "@/components/ui/Dialog";
import { CardDetailPanel } from "@/components/reading/CardDetailPanel";
import s from "./reading.module.css";

interface CardDetailSheetProps {
  reading: Reading;
  resolved: ResolvedReading;
  index: number | null;
  onClose: () => void;
  onSelect: (index: number) => void;
  onReveal: (index: number) => void;
}

/** Phones: the focused card view, a full-height sheet over the spread. */
export function CardDetailSheet({ reading, resolved, index, onClose, onSelect, onReveal }: CardDetailSheetProps) {
  return (
    <Dialog open={index !== null} onClose={onClose} labelledBy="sheet-card-title" variant="sheet">
      <div className={s.sheetBody}>
        <span className={s.grabber} aria-hidden="true" />
        {index !== null && (
          <CardDetailPanel
            reading={reading}
            resolved={resolved}
            index={index}
            mode="sheet"
            headingId="sheet-card-title"
            onClose={onClose}
            onSelect={onSelect}
            onReveal={onReveal}
          />
        )}
      </div>
    </Dialog>
  );
}
