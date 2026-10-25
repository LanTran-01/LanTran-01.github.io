import { Dialog } from "@/components/ui/Dialog";
import { Close } from "@/components/ui/Icons";
import ui from "@/components/ui/ui.module.css";
import dlg from "@/components/ui/dialog.module.css";
import s from "./layout.module.css";

export function AboutDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Dialog open={open} onClose={onClose} labelledBy="about-title">
      <div className={dlg.body}>
        <button type="button" className={`${ui.iconBtn} ${dlg.close}`} onClick={onClose} aria-label="Close">
          <Close />
        </button>
        <p className={ui.label}>About</p>
        <h2 id="about-title" className={dlg.title}>
          A quiet instrument for reflection.
        </h2>
        <dl className={s.aboutList}>
          <div>
            <dt>The deck</dt>
            <dd>All 78 cards of the traditional tarot, each with an original monochrome illustration and its own upright and reversed meanings.</dd>
          </div>
          <div>
            <dt>The draw</dt>
            <dd>
              When a reading begins, the whole deck is shuffled with your browser's cryptographic random source. Each position receives a distinct card and an
              orientation, fixed until you start again.
            </dd>
          </div>
          <div>
            <dt>The interpretation</dt>
            <dd>
              Each reading combines the card's meaning, the role of its position, and simple keyword cues from your question. It is composed on this device; there is
              no AI service, account or server.
            </dd>
          </div>
          <div>
            <dt>Your privacy</dt>
            <dd>The current reading is kept in this tab so a refresh does not lose it. Closing the tab clears it. Nothing is sent anywhere.</dd>
          </div>
        </dl>
        <p className={dlg.text}>Tarot here is a language of symbols to think with, not a prediction of events.</p>
      </div>
    </Dialog>
  );
}
