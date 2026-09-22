"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { SlideShell } from "@/components/deck/SlideShell";
import { useDeck } from "@/lib/deck-store";
import { EASE_OUT, SPRING } from "@/lib/motion";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";

const IDEAS = [
  "Internal platform",
  "Reliability work",
  "Repetitive job automation",
  "Third experiment this quarter",
  "Developer experience",
  "The thing nobody costed",
];

export function S07Gate() {
  const reduced = useReducedMotionSafe();
  const { next } = useDeck();
  const [lifting, setLifting] = useState(false);
  const [nudged, setNudged] = useState<number | null>(null);

  return (
    <SlideShell
      kicker="02 · The economics"
      title="AI doesn't just change how we code"
      lede="It changes the economics of software engineering."
    >
      <div className="relative flex h-full flex-col justify-center">
        <div className="relative mx-auto w-full max-w-4xl">
          {/* Ideas queued up behind the gate */}
          <motion.div
            className="grid grid-cols-3 gap-3"
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.25 } } }}
          >
            {IDEAS.map((idea, i) => (
              <motion.div
                key={idea}
                variants={{
                  hidden: { opacity: 0, y: 26 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT } },
                }}
                animate={
                  nudged === i && !reduced
                    ? { y: [0, -14, -9, 0], opacity: 1 }
                    : undefined
                }
                transition={{ duration: 0.5, ease: EASE_OUT }}
                onHoverStart={() => setNudged(i)}
                onHoverEnd={() => setNudged(null)}
                className={`cursor-default rounded-xl border px-4 py-5 text-[15px] font-medium transition-colors duration-500 ${
                  lifting
                    ? "border-accent/40 bg-accent/8 text-fg"
                    : "border-line bg-surface-2 text-faint"
                }`}
              >
                {idea}
              </motion.div>
            ))}
          </motion.div>

          {/* The cost gate */}
          <motion.button
            onClick={() => {
              if (lifting) {
                next();
                return;
              }
              setLifting(true);
            }}
            initial={{ y: -220, opacity: 0 }}
            animate={
              lifting
                ? { y: -150, opacity: 0.25 }
                : { y: 0, opacity: 1 }
            }
            transition={
              lifting
                ? { duration: 0.75, ease: EASE_OUT }
                : { ...SPRING, stiffness: 180, damping: 16, delay: 0.75 }
            }
            className="absolute inset-x-0 top-1/2 z-10 mx-auto flex w-fit -translate-y-1/2 cursor-pointer items-center gap-6 rounded-2xl border-2 border-warn bg-warn/12 px-10 py-6 backdrop-blur-sm"
          >
            <span className="font-mono text-4xl tracking-tight text-warn">2 eng × 2 mo</span>
            <span className="max-w-[190px] text-left text-[13px] leading-snug text-muted">
              A significant cost to even trying it
            </span>
          </motion.button>
        </div>

        <motion.p
          className="mx-auto mt-14 font-mono text-[11px] tracking-[0.16em] text-faint uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
        >
          {lifting ? "The gate is lifting →" : "Hover an idea · click the gate"}
        </motion.p>
      </div>
    </SlideShell>
  );
}
