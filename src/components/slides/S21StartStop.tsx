"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Check, X } from "lucide-react";
import { SlideShell } from "@/components/deck/SlideShell";
import { EASE_OUT, SPRING } from "@/lib/motion";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";

const START = [
  "Ask better questions",
  "Understand the problem before coding",
  "Use AI early for exploration",
  "Generate multiple possible approaches",
  "Verify AI output",
  "Think about edge cases",
  "Understand business context",
  "Automate repetitive engineering work",
  "Share useful AI workflows with the team",
];

const STOP = [
  "Measuring yourself by lines of code",
  "Blindly accepting AI-generated code",
  "Treating requirements as unquestionable",
  "Using AI only as autocomplete",
  "Assuming \u201cAI said it\u201d means \u201cit\u2019s correct\u201d",
  "Optimising only for ticket completion",
];

export function S21StartStop() {
  const reduced = useReducedMotionSafe();
  const [ticked, setTicked] = useState<Set<string>>(new Set());

  const toggle = (k: string) =>
    setTicked((t) => {
      const n = new Set(t);
      if (n.has(k)) n.delete(k);
      else n.add(k);
      return n;
    });

  const total = START.length + STOP.length;

  return (
    <SlideShell
      kicker="06 · What we do about it"
      title="What to start, what to stop"
      lede="Tick the ones you will actually change on Monday."
    >
      <div className="grid h-full grid-cols-2 gap-14">
        <div>
          <div className="deck-kicker mb-4 text-accent">Start</div>
          <ul className="space-y-1.5">
            {START.map((s, i) => {
              const on = ticked.has(s);
              return (
                <motion.li
                  key={s}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: EASE_OUT, delay: 0.2 + i * 0.05 }}
                >
                  <motion.button
                    onClick={() => toggle(s)}
                    whileHover={{ x: 3 }}
                    transition={SPRING}
                    className="flex w-full items-center gap-3 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-surface"
                  >
                    <motion.span
                      animate={{
                        backgroundColor: on ? "var(--accent)" : "rgba(0, 0, 0, 0)",
                        borderColor: on ? "var(--accent)" : "var(--line)",
                      }}
                      transition={SPRING}
                      className="grid h-5 w-5 shrink-0 place-items-center rounded-md border"
                    >
                      <motion.span
                        animate={{ scale: on ? 1 : 0, opacity: on ? 1 : 0 }}
                        transition={SPRING}
                        className="text-bg"
                      >
                        <Check size={12} strokeWidth={3} />
                      </motion.span>
                    </motion.span>
                    <span className={`text-[17px] ${on ? "text-fg" : "text-muted"}`}>{s}</span>
                  </motion.button>
                </motion.li>
              );
            })}
          </ul>
        </div>

        <div>
          <div className="deck-kicker mb-4 text-warn">Stop</div>
          <ul className="space-y-1.5">
            {STOP.map((s, i) => {
              const on = ticked.has(s);
              return (
                <motion.li
                  key={s}
                  initial={{ opacity: 0, y: -24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: EASE_OUT, delay: 0.5 + i * 0.05 }}
                >
                  <motion.button
                    onClick={() => toggle(s)}
                    whileHover={{ x: 3 }}
                    transition={SPRING}
                    className="flex w-full items-center gap-3 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-surface"
                  >
                    <motion.span
                      animate={{
                        backgroundColor: on ? "var(--warn)" : "rgba(0, 0, 0, 0)",
                        borderColor: on ? "var(--warn)" : "var(--line)",
                      }}
                      transition={SPRING}
                      className="grid h-5 w-5 shrink-0 place-items-center rounded-md border"
                    >
                      <motion.span
                        animate={{ scale: on ? 1 : 0, opacity: on ? 1 : 0 }}
                        transition={SPRING}
                        className="text-bg"
                      >
                        <X size={12} strokeWidth={3} />
                      </motion.span>
                    </motion.span>
                    <span
                      className={`text-[17px] transition-colors ${
                        on ? "text-faint line-through" : "text-muted"
                      }`}
                    >
                      {s}
                    </span>
                  </motion.button>
                </motion.li>
              );
            })}
          </ul>

          <motion.div
            className="mt-10 flex items-baseline gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            <motion.span
              key={ticked.size}
              initial={reduced ? false : { scale: 1.3 }}
              animate={{ scale: 1 }}
              transition={SPRING}
              className="font-mono text-[40px] leading-none font-semibold tabular-nums"
            >
              {String(ticked.size).padStart(2, "0")}
            </motion.span>
            <span className="font-mono text-[15px] text-faint">/ {total} committed</span>
          </motion.div>
        </div>
      </div>
    </SlideShell>
  );
}
