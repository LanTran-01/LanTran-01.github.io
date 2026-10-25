import { useEffect, useMemo, useState } from "react";
import type { Reading } from "@/domain/types";
import { readingToText } from "@/domain/readingModel";
import { Dialog } from "@/components/ui/Dialog";
import { Check, CopyIcon, Refresh } from "@/components/ui/Icons";
import ui from "@/components/ui/ui.module.css";
import dlg from "@/components/ui/dialog.module.css";
import s from "./reading.module.css";

/** Clipboard API first; a hidden-textarea copy as a fallback; false if both are refused. */
async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fall through to the legacy path
  }
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    return ok;
  } catch {
    return false;
  }
}

type CopyState = "idle" | "copied" | "failed";

export function ReadingActions({ reading, onNew }: { reading: Reading; onNew: () => void }) {
  const [state, setState] = useState<CopyState>("idle");
  const text = useMemo(() => readingToText(reading), [reading]);

  useEffect(() => {
    if (state !== "copied") return;
    const t = window.setTimeout(() => setState("idle"), 2400);
    return () => window.clearTimeout(t);
  }, [state]);

  const copy = async () => setState((await copyText(text)) ? "copied" : "failed");

  return (
    <div className={s.actions}>
      <button type="button" className={`${ui.btn} ${ui.primary} ${ui.large}`} onClick={copy}>
        {state === "copied" ? <Check /> : <CopyIcon />}
        {state === "copied" ? "Copied" : "Copy reading"}
      </button>
      <button type="button" className={`${ui.btn} ${ui.secondary} ${ui.large}`} onClick={onNew}>
        <Refresh />
        New reading
      </button>
      <p className="visually-hidden" role="status">
        {state === "copied" ? "Reading copied to the clipboard." : state === "failed" ? "Copying was blocked. The reading is shown so you can copy it manually." : ""}
      </p>

      <Dialog open={state === "failed"} onClose={() => setState("idle")} labelledBy="copy-fallback-title">
        <div className={dlg.body}>
          <p className={ui.label}>Copy reading</p>
          <h2 id="copy-fallback-title" className={dlg.title}>
            Your browser blocked clipboard access.
          </h2>
          <p className={dlg.text}>Select the text below and copy it manually.</p>
          <textarea className={dlg.textarea} readOnly value={text} onFocus={(e) => e.currentTarget.select()} autoFocus />
          <div className={dlg.actions}>
            <button type="button" className={`${ui.btn} ${ui.secondary}`} onClick={() => setState("idle")}>
              Close
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
