"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { SlideShell } from "@/components/deck/SlideShell";
import { EASE_OUT, SPRING } from "@/lib/motion";

const BEFORE = [
  "When can Engineering deliver this?",
  "How many engineers do we need?",
  "How much capacity do we have?",
];

const AFTER = [
  "What can our existing team accomplish with AI?",
  "How much leverage are we getting from Engineering?",
  "Can we move faster without sacrificing quality?",
  "What work should we automate?",
];

const SHIFT = ["Engineering Capacity", "Engineering Leverage", "Business Impact"];

export function S11MgmtQuestions() {
  // Opens on "Before AI" so the speaker sets up the old questions first, then moves
  // the emphasis to the AI-era column by hovering it.
  const [side, setSide] = useState<"before" | "after">("before");
  const [noteOn, setNoteOn] = useState(false);

  return (
    <SlideShell kicker="03 · The management lens" title="The questions are changing">
      <div className="flex h-full flex-col justify-center gap-10">
        <div className="grid grid-cols-2 gap-6">
          {(
            [
              { key: "before", label: "Before AI", items: BEFORE, tone: "warn" },
              { key: "after", label: "AI era", items: AFTER, tone: "accent" },
            ] as const
          ).map((col, ci) => {
            const on = side === col.key;
            return (
              <motion.div
                key={col.key}
                onMouseEnter={() => setSide(col.key)}
                animate={{ opacity: on ? 1 : 0.42, scale: on ? 1 : 0.985 }}
                transition={SPRING}
                className={`relative rounded-2xl border p-7 ${
                  col.tone === "warn"
                    ? "border-warn/30 bg-warn/5"
                    : "border-accent/30 bg-accent/5"
                }`}
              >
                <div
                  style={{ color: col.tone === "warn" ? "var(--warn)" : "var(--accent)" }}
                  className="deck-kicker mb-5"
                >
                  {col.label}
                </div>
                <ul className="space-y-3.5">
                  {col.items.map((q, i) => (
                    <motion.li
                      key={q}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.5,
                        ease: EASE_OUT,
                        delay: 0.3 + ci * 0.5 + i * 0.09,
                      }}
                      onMouseEnter={() => setNoteOn(true)}
                      onMouseLeave={() => setNoteOn(false)}
                      className="cursor-default text-[19px] leading-snug"
                    >
                      &ldquo;{q}&rdquo;
                    </motion.li>
                  ))}
                </ul>
                {on ? (
                  <motion.div
                    layoutId="mgmt-emphasis"
                    transition={SPRING}
                    className={`absolute -top-px -bottom-px left-0 w-[3px] rounded-full ${
                      col.tone === "warn" ? "bg-warn" : "bg-accent"
                    }`}
                  />
                ) : null}
              </motion.div>
            );
          })}
        </div>

        <div className="relative flex items-center gap-10">
          <AnimatePresence>
            {noteOn ? (
              <motion.p
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="pointer-events-none absolute -top-8 left-0 text-[13px] leading-snug whitespace-nowrap text-muted"
              >
                Engineers don&rsquo;t need to think like executives. Understanding the management
                view just explains <em>why</em> the expectations are moving.
              </motion.p>
            ) : null}
          </AnimatePresence>

          {/* Capacity → Leverage → Impact */}
          <div className="flex shrink-0 items-center gap-3">
            {SHIFT.map((stage, i) => (
              <div key={stage} className="flex items-center gap-3">
                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: EASE_OUT, delay: 1.3 + i * 0.18 }}
                  className={`rounded-lg border px-4 py-2 font-mono text-[12px] whitespace-nowrap ${
                    i === SHIFT.length - 1
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-line bg-surface text-muted"
                  }`}
                >
                  {stage}
                </motion.span>
                {i < SHIFT.length - 1 ? (
                  <svg width="34" height="10" viewBox="0 0 34 10" fill="none">
                    <motion.path
                      d="M0 5 H28 M24 1.5 L28.5 5 L24 8.5"
                      stroke="var(--faint)"
                      strokeWidth="1.3"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.4, ease: EASE_OUT, delay: 1.45 + i * 0.18 }}
                    />
                  </svg>
                ) : null}
              </div>
            ))}
          </div>

          <motion.p
            className="ml-auto max-w-xs text-right text-[14px] font-medium text-balance"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 0.6 }}
          >
            AI doesn&rsquo;t only change engineers&rsquo; tools. It changes the expectations
            around engineering capacity.
          </motion.p>
        </div>
      </div>
    </SlideShell>
  );
}
