import { Link } from "react-router";
import type { ComponentSpec } from "@/data/types";
import { TERMS } from "@/data/machine";
import { AssemblyPager, AssemblySwitcher } from "@/components/navigation/AssemblyPager";
import { ArrowLeftIcon } from "@/components/layout/Icons";
import { SectionHead } from "./SectionHead";
import s from "./inspection.module.css";
import n from "./NavigationSection.module.css";

/** E — back to the full machine, previous / next, jump to any assembly. */
export function NavigationSection({ spec }: { spec: ComponentSpec }) {
  return (
    <section className={s.section} aria-labelledby="insp-e">
      <SectionHead index="E" title="Navigation" id="insp-e" />
      <Link to="/" className={n.back} aria-keyshortcuts="Escape">
        <ArrowLeftIcon />
        <span>Back to full {TERMS.whole}</span>
        <kbd className="kbd" aria-hidden="true">
          Esc
        </kbd>
      </Link>
      <div className={n.pager}>
        <AssemblyPager current={spec.id} />
      </div>
      <AssemblySwitcher current={spec.id} />
    </section>
  );
}
