"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Calculator } from "lucide-react";
import { SlideShell } from "@/components/deck/SlideShell";
import { EASE_OUT, SPRING } from "@/lib/motion";

const ROWS: { old: string; now: string; note: string }[] = [
  { old: "Write code", now: "Understand problems", note: "The scarce skill moved upstream of the editor." },
  { old: "Know syntax", now: "Know trade-offs", note: "Syntax is the cheapest thing to look up now." },
  { old: "Follow requirements", now: "Challenge requirements", note: "Faster building makes a wrong requirement more expensive, not less." },
  { old: "Implement solutions", now: "Explore solutions", note: "Generating five options costs almost nothing. Choosing between them does not." },
  { old: "Search for answers", now: "Use AI effectively + verify", note: "The verifying half is the part that is actually yours." },
  { old: "Complete tickets", now: "Deliver outcomes", note: "A closed ticket and a solved problem are not the same event." },
  { old: "Work independently", now: "Create leverage for others", note: "Multiplying the team beats optimising yourself." },
];

export function S18SkillShift() {
  const [open, setOpen] = useState<number | null>(null);
  const [analogy, setAnalogy] = useState(false);

  return (
    <SlideShell kicker="05 · What good looks like now" title="The skill shift">
      <div className="flex h-full flex-col justify-center gap-5">
        <div className="space-y-1">
          {ROWS.map((r, i) => {
            const isOpen = open === i;
            return (
              <motion.button
                key={r.old}
                onClick={() => setOpen(isOpen ? null : i)}
                initial={{ opacity: 0 }}
                animate={{ opacity: open !== null && !isOpen ? 0.32 : 1 }}
                transition={{ duration: 0.45, ease: EASE_OUT, delay: 0.2 + i * 0.09 }}
                className="group block w-full rounded-lg px-3 py-2 text-left transition-colors hover:bg-surface"
              >
                <div className="grid grid-cols-[1fr_72px_1fr] items-center gap-4">
                  <motion.span
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, ease: EASE_OUT, delay: 0.2 + i * 0.09 }}
                    className="text-right text-[21px] text-warn/85"
                  >
                    {r.old}
                  </motion.span>

                  <div className="relative h-4">
                    <svg viewBox="0 0 72 16" className="absolute inset-0 h-4 w-[72px]">
                      <motion.path
                        d="M4 8 H60 M54 3.5 L61 8 L54 12.5"
                        stroke="var(--line)"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        fill="none"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.4, ease: EASE_OUT, delay: 0.32 + i * 0.09 }}
                      />
                    </svg>
                    <motion.span
                      className="absolute top-1/2 h-[3px] w-[3px] -translate-y-1/2 rounded-full bg-accent opacity-0 group-hover:opacity-100"
                      animate={{ left: [4, 58] }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                    />
                  </div>

                  <motion.span
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, ease: EASE_OUT, delay: 0.44 + i * 0.09 }}
                    className="text-[21px] font-medium"
                  >
                    {r.now}
                  </motion.span>
                </div>

                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.p
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: EASE_OUT }}
                      className="overflow-hidden text-center text-[13px] text-muted"
                    >
                      <span className="block pt-2">{r.note}</span>
                    </motion.p>
                  ) : null}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </div>

        <div className="flex items-center gap-6">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3, duration: 0.6 }}
            className="text-[15px] font-medium"
          >
            AI does not eliminate engineering skills. It changes{" "}
            <span className="text-accent">where the scarce skill is</span>.
          </motion.p>

          <motion.button
            onClick={() => setAnalogy((a) => !a)}
            whileHover={{ y: -2 }}
            transition={SPRING}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="ml-auto flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 font-mono text-[11px] tracking-wider text-muted uppercase"
          >
            <Calculator size={13} /> the calculator analogy
          </motion.button>
        </div>

        <AnimatePresence>
          {analogy ? (
            <motion.blockquote
              initial={{ opacity: 0, y: 18, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: 12, height: 0 }}
              transition={{ duration: 0.35, ease: EASE_OUT }}
              className="overflow-hidden"
            >
              <span className="mt-1 block border-l-2 border-accent pl-5 text-[17px] leading-snug text-balance">
                Calculators didn&rsquo;t eliminate mathematicians. They changed which mathematical
                skills were valuable. AI coding assistants change the relative value of
                implementation versus reasoning and judgment.
              </span>
            </motion.blockquote>
          ) : null}
        </AnimatePresence>
      </div>
    </SlideShell>
  );
}
