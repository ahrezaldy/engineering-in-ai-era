"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { SlideShell } from "@/components/deck/SlideShell";
import { CHAPTERS } from "@/lib/deck-config";
import { useDeck } from "@/lib/deck-store";
import { EASE_OUT, SPRING } from "@/lib/motion";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";

const SUMMARIES: Record<string, { line: string; preview: string }> = {
  change: {
    line: "Implementation is getting cheaper. Coding is becoming a smaller slice of the job.",
    preview: "Requirement → Design → Code → Test → Review → Deploy  becomes  Problem → AI + Engineer → Validate → Ship → Learn",
  },
  economics: {
    line: "Cheaper implementation changes which ideas are worth trying at all.",
    preview: "2 engineers × 2 months used to be a real gate. What gets through when the gate lifts?",
  },
  management: {
    line: "The questions leadership asks about engineering are changing.",
    preview: "Engineering Capacity → Engineering Leverage → Business Impact",
  },
  value: {
    line: "More code is not more productivity. Measure the outcome, not the volume.",
    preview: "Optimise for value, not volume.",
  },
  engineer: {
    line: "Problem solving, judgment, AI leverage, business awareness.",
    preview: "AI can generate the solution. The engineer owns the decision.",
  },
  action: {
    line: "What to start, what to stop, and what to do with the capacity we get back.",
    preview: "Execute → Solve → Identify & Multiply",
  },
};

export function S02Overview() {
  const { goTo } = useDeck();
  const reduced = useReducedMotionSafe();
  const [hovered, setHovered] = useState<string | null>(CHAPTERS[0].id);
  const active = hovered ? SUMMARIES[hovered] : null;

  return (
    <SlideShell kicker="Overview" title="Where we're going">
      <div className="grid h-full grid-cols-[1.15fr_0.85fr] gap-16">
        <motion.ol
          className="relative flex flex-col justify-center gap-1"
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.25 } } }}
          onMouseLeave={() => setHovered(CHAPTERS[0].id)}
        >
          {/* Rail connecting every chapter. */}
          <motion.span
            className="absolute top-2 bottom-2 left-0 w-px origin-top bg-line"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.2 }}
          />

          {CHAPTERS.map((c) => {
            const isOn = hovered === c.id;
            return (
              <motion.li
                key={c.id}
                variants={{
                  hidden: { opacity: 0, x: -22 },
                  show: { opacity: 1, x: 0, transition: { duration: 0.55, ease: EASE_OUT } },
                }}
              >
                <button
                  onMouseEnter={() => setHovered(c.id)}
                  onFocus={() => setHovered(c.id)}
                  onClick={() => goTo(c.start)}
                  className="group relative block w-full cursor-pointer py-3 pl-7 text-left"
                >
                  {isOn ? (
                    <motion.span
                      layoutId="chapter-marker"
                      transition={SPRING}
                      className="absolute top-1/2 left-0 h-7 w-[3px] -translate-x-[1px] -translate-y-1/2 rounded-full bg-accent"
                    />
                  ) : null}
                  <motion.div
                    animate={{ x: isOn && !reduced ? 8 : 0 }}
                    transition={SPRING}
                    className="flex items-baseline gap-4"
                  >
                    <span
                      className={`font-mono text-[12px] tracking-[0.18em] transition-colors ${
                        isOn ? "text-accent" : "text-faint"
                      }`}
                    >
                      {c.index}
                    </span>
                    <span
                      className={`text-[28px] font-medium tracking-tight transition-colors ${
                        isOn ? "text-fg" : "text-muted"
                      }`}
                    >
                      {c.label}
                    </span>
                    <span className="ml-auto font-mono text-[11px] text-faint tabular-nums">
                      {String(c.start).padStart(2, "0")}–{String(c.end).padStart(2, "0")}
                    </span>
                    <ArrowUpRight
                      size={15}
                      className={`shrink-0 transition-all ${
                        isOn ? "translate-x-0 opacity-100" : "-translate-x-1 opacity-0"
                      }`}
                    />
                  </motion.div>
                  <AnimatePresence initial={false}>
                    {isOn ? (
                      <motion.p
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.32, ease: EASE_OUT }}
                        className="overflow-hidden pl-[3.4rem] text-[14px] text-muted"
                      >
                        <span className="block pt-1.5">{SUMMARIES[c.id].line}</span>
                      </motion.p>
                    ) : null}
                  </AnimatePresence>
                </button>
              </motion.li>
            );
          })}
        </motion.ol>

        {/* Live preview panel */}
        <div className="flex items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.45 }}
            className="relative aspect-4/3 w-full overflow-hidden rounded-2xl border border-line bg-surface p-8"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_15%,var(--accent),transparent_65%)] opacity-[0.07]" />
            <AnimatePresence mode="wait">
              <motion.div
                key={hovered ?? "none"}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: EASE_OUT }}
                className="flex h-full flex-col justify-between"
              >
                <div className="deck-kicker">
                  {CHAPTERS.find((c) => c.id === hovered)?.index} ·{" "}
                  {CHAPTERS.find((c) => c.id === hovered)?.label}
                </div>
                <p className="font-mono text-[15px] leading-relaxed text-balance text-fg">
                  {active?.preview}
                </p>
                <div className="font-mono text-[11px] tracking-wider text-faint uppercase">
                  Click to jump
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </SlideShell>
  );
}
