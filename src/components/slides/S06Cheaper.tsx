"use client";

import { useState } from "react";
import { motion, useMotionValue, useMotionValueEvent } from "motion/react";
import { RotateCcw } from "lucide-react";
import { SlideShell } from "@/components/deck/SlideShell";
import { RevealText } from "@/components/ui/RevealText";
import { EASE_OUT, SPRING } from "@/lib/motion";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";

const REST_SHARE = 35;
const BAR_WIDTH = 720;

const OTHERS = [
  { label: "Problem selection", share: 22 },
  { label: "Judgment", share: 24 },
  { label: "Ownership", share: 19 },
];

export function S06Cheaper() {
  const reduced = useReducedMotionSafe();
  const [share, setShare] = useState(REST_SHARE);
  const [replayKey, setReplayKey] = useState(0);
  const x = useMotionValue(0);

  useMotionValueEvent(x, "change", (v) => {
    const pct = Math.round(Math.min(Math.max(REST_SHARE + (v / BAR_WIDTH) * 100, 8), 88));
    setShare(pct);
  });

  const caption =
    share > 62
      ? "If implementation were still the whole job, this is what the bar would look like."
      : share > 45
        ? "Somewhere in between — where a lot of teams actually are today."
        : "And this is the direction it is heading.";

  return (
    <SlideShell kicker="01 · The change" title="Implementation is becoming cheaper">
      <div className="flex h-full flex-col justify-center gap-12">
        <div className="max-w-4xl">
          <RevealText
            text="Coding is not becoming unimportant. It is becoming a smaller part of the value an engineer provides."
            as="p"
            by="word"
            delay={0.3}
            className="text-[26px] leading-snug font-medium text-balance"
          />
        </div>

        <div key={replayKey} className="w-full max-w-[720px]">
          <div className="deck-kicker mb-3">The value an engineer provides</div>

          <div className="relative flex h-16 overflow-hidden rounded-xl border border-line">
            <motion.div
              className="flex items-center justify-center bg-warn/18 text-warn"
              initial={reduced ? false : { width: "80%" }}
              animate={{ width: `${share}%` }}
              transition={reduced ? { duration: 0 } : { ...SPRING, delay: reduced ? 0 : 0.6 }}
            >
              <span className="truncate px-3 font-mono text-[12px] tracking-wide">
                Implementation
              </span>
            </motion.div>

            {OTHERS.map((o, i) => {
              const scaled = ((100 - share) / (100 - REST_SHARE)) * o.share;
              return (
                <motion.div
                  key={o.label}
                  className="flex items-center justify-center border-l border-line bg-accent/12 text-accent"
                  initial={reduced ? false : { width: "6.6%" }}
                  animate={{ width: `${scaled}%` }}
                  transition={reduced ? { duration: 0 } : { ...SPRING, delay: reduced ? 0 : 0.6 + i * 0.08 }}
                >
                  <motion.span
                    className="truncate px-3 font-mono text-[12px] tracking-wide"
                    animate={{ opacity: scaled > 11 ? 1 : 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    {o.label}
                  </motion.span>
                </motion.div>
              );
            })}

            {/* Drag handle sitting on the boundary. */}
            <motion.div
              drag={reduced ? false : "x"}
              dragConstraints={{ left: -(BAR_WIDTH * 0.28), right: BAR_WIDTH * 0.53 }}
              dragElastic={0.04}
              dragMomentum={false}
              style={{ x, left: `${REST_SHARE}%` }}
              whileHover={{ scaleX: 1.6 }}
              whileDrag={{ scaleX: 1.6 }}
              className="absolute inset-y-0 z-10 w-[3px] -translate-x-1/2 cursor-ew-resize bg-fg/70"
            >
              <span className="absolute top-1/2 left-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full border border-line bg-surface shadow-sm" />
            </motion.div>
          </div>

          <div className="mt-4 flex items-baseline gap-4">
            <motion.p
              key={caption}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: EASE_OUT }}
              className="text-[14px] text-muted"
            >
              {caption}
            </motion.p>
            <button
              onClick={() => {
                x.set(0);
                setShare(REST_SHARE);
                setReplayKey((k) => k + 1);
              }}
              className="ml-auto flex shrink-0 items-center gap-1.5 font-mono text-[11px] tracking-wider text-faint uppercase transition-colors hover:text-fg"
            >
              <RotateCcw size={12} /> replay
            </button>
          </div>
          <p className="mt-2 font-mono text-[11px] tracking-[0.16em] text-faint uppercase">
            Drag the divider
          </p>
        </div>
      </div>
    </SlideShell>
  );
}
