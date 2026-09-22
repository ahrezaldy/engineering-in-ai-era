"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Banknote, LineChart, Rocket, Wrench } from "lucide-react";
import { SlideShell } from "@/components/deck/SlideShell";
import { Tilt } from "@/components/ui/Tilt";
import { RevealText } from "@/components/ui/RevealText";
import { EASE_OUT, SPRING } from "@/lib/motion";

const LENSES = [
  {
    role: "CEO",
    Icon: LineChart,
    question: "What business impact can Engineering create?",
    distinction: "Impact is the unit. Headcount is only one way of buying it.",
  },
  {
    role: "CPO",
    Icon: Rocket,
    question: "How quickly can we build, learn, and iterate?",
    distinction: "Faster learning loops matter more than faster typing.",
  },
  {
    role: "CTO",
    Icon: Wrench,
    question: "How do we increase technical leverage while maintaining quality?",
    distinction: "Leverage that costs quality is not leverage, it is borrowed time.",
  },
  {
    role: "CFO",
    Icon: Banknote,
    question: "How efficiently are we converting engineering cost into business value?",
    distinction: "Efficiency can mean fewer people. It can also mean the same people doing more.",
  },
];

export function S14CLevel() {
  const [open, setOpen] = useState<string | null>(null);
  const [reading, setReading] = useState<"fewer" | "more">("more");

  return (
    <SlideShell kicker="03 · The management lens" title="What C-level actually asks">
      <div className="flex h-full flex-col justify-center gap-8">
        <div className="flex gap-4">
          {LENSES.map((l, i) => {
            const isOpen = open === l.role;
            return (
              <motion.div
                key={l.role}
                layout
                transition={SPRING}
                style={{ flex: open === null ? 1 : isOpen ? 3.2 : 0.6 }}
                className="min-w-0"
              >
                <Tilt max={isOpen ? 0 : 7} lift={isOpen ? 0 : 5}>
                  <motion.button
                    onClick={() => setOpen(isOpen ? null : l.role)}
                    initial={{ opacity: 0, y: 28, rotate: i % 2 ? 1 : -1 }}
                    animate={{ opacity: 1, y: 0, rotate: 0 }}
                    transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.2 + i * 0.1 }}
                    className={`flex h-[260px] w-full flex-col items-start overflow-hidden rounded-2xl border p-6 text-left transition-colors ${
                      isOpen ? "border-accent bg-accent/8" : "border-line bg-surface hover:border-accent/40"
                    }`}
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-accent/10 text-accent">
                      <l.Icon size={16} strokeWidth={1.75} />
                    </span>
                    <span className="mt-4 font-mono text-[13px] tracking-[0.18em] text-faint">
                      {l.role}
                    </span>
                    <span
                      className={`mt-2 leading-snug font-medium text-balance transition-all ${
                        open === null || isOpen ? "text-[17px] opacity-100" : "text-[13px] opacity-0"
                      }`}
                    >
                      {l.question}
                    </span>
                    <AnimatePresence>
                      {isOpen ? (
                        <motion.span
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3, ease: EASE_OUT, delay: 0.12 }}
                          className="mt-auto text-[13px] leading-snug text-muted"
                        >
                          {l.distinction}
                        </motion.span>
                      ) : null}
                    </AnimatePresence>
                  </motion.button>
                </Tilt>
              </motion.div>
            );
          })}
        </div>

        <div className="flex items-end justify-between gap-10">
          <div>
            <RevealText
              text="More outcome from the same resources."
              as="p"
              by="word"
              delay={0.9}
              className="text-[30px] font-medium tracking-tight"
            />
            <p className="mt-2 text-[13px] text-faint">The one thing all four lenses share.</p>
          </div>

          {/* The distinction the source is explicit about. */}
          <div className="w-[420px] rounded-xl border border-line bg-surface p-5">
            <div className="deck-kicker mb-3">This does not have to mean</div>
            <div className="flex gap-2">
              {(
                [
                  { key: "fewer", label: "Fewer engineers" },
                  { key: "more", label: "Same capacity, more accomplished" },
                ] as const
              ).map((o) => (
                <button
                  key={o.key}
                  onClick={() => setReading(o.key)}
                  className={`relative rounded-lg px-3 py-2 text-left text-[12px] leading-snug transition-colors ${
                    reading === o.key ? "text-fg" : "text-faint"
                  }`}
                >
                  {reading === o.key ? (
                    <motion.span
                      layoutId="clevel-reading"
                      transition={SPRING}
                      className={`absolute inset-0 rounded-lg border ${
                        o.key === "fewer" ? "border-warn/40 bg-warn/10" : "border-accent/40 bg-accent/10"
                      }`}
                    />
                  ) : null}
                  <span className="relative">{o.label}</span>
                </button>
              ))}
            </div>
            <AnimatePresence mode="wait">
              <motion.p
                key={reading}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.25 }}
                className="mt-3 text-[13px] leading-snug text-muted"
              >
                {reading === "fewer"
                  ? "One reading — and the one everyone jumps to first."
                  : "The other reading. Extra capacity can go to reliability, tech debt, automation, experiments, developer experience, internal platforms, or new product bets."}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </SlideShell>
  );
}
