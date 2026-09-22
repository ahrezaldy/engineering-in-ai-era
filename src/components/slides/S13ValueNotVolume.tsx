"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { SlideShell } from "@/components/deck/SlideShell";
import { EASE_OUT } from "@/lib/motion";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";

export function S13ValueNotVolume() {
  const reduced = useReducedMotionSafe();
  const [defending, setDefending] = useState(false);
  const [burst, setBurst] = useState(0);

  return (
    <SlideShell bleed>
      <div className="flex h-full flex-col justify-center px-20">
        <div className="deck-kicker mb-10">05 · What good looks like now</div>

        {/* The old question, written then struck out. */}
        <div
          className="relative w-fit cursor-help"
          onMouseEnter={() => setDefending(true)}
          onMouseLeave={() => setDefending(false)}
        >
          <motion.h2
            className="deck-title text-warn"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: defending ? 1 : 0.55, y: defending ? -8 : 0 }}
            transition={{ duration: 0.55, ease: EASE_OUT, delay: 0.2 }}
          >
            &ldquo;How much code can I produce?&rdquo;
          </motion.h2>
          <motion.span
            className="absolute top-1/2 left-0 block h-[3px] w-full origin-left rounded-full bg-warn"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: defending ? 0 : 1 }}
            transition={{ duration: reduced ? 0.2 : 0.55, ease: EASE_OUT, delay: defending ? 0 : 1 }}
          />
          <AnimatePresence>
            {defending ? (
              <motion.span
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute -bottom-7 left-0 font-mono text-[11px] tracking-wider text-faint uppercase"
              >
                let go to strike it again
              </motion.span>
            ) : null}
          </AnimatePresence>
        </div>

        {/* The question that replaces it. */}
        <motion.button
          onClick={() => setBurst((b) => b + 1)}
          className="relative mt-10 w-fit cursor-pointer text-left"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: EASE_OUT, delay: 1.7 }}
        >
          <motion.h2
            key={burst}
            className="deck-title text-accent"
            animate={burst > 0 && !reduced ? { scale: [1, 1.025, 1] } : undefined}
            transition={{ duration: 0.45, ease: EASE_OUT }}
          >
            &ldquo;How much valuable problem can I solve?&rdquo;
          </motion.h2>

          {/* Particle burst from the baseline on click. */}
          <AnimatePresence>
            {burst > 0 && !reduced
              ? Array.from({ length: 16 }).map((_, i) => (
                  <motion.span
                    key={`${burst}-${i}`}
                    className="absolute bottom-1 left-0 h-1 w-1 rounded-full bg-accent"
                    initial={{ opacity: 1, x: 40 + i * 42, y: 0, scale: 1 }}
                    animate={{
                      opacity: 0,
                      y: -40 - (i % 5) * 22,
                      x: 40 + i * 42 + ((i % 3) - 1) * 26,
                      scale: 0.3,
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.9 + (i % 4) * 0.12, ease: EASE_OUT }}
                  />
                ))
              : null}
          </AnimatePresence>
        </motion.button>

        <motion.p
          className="mt-16 max-w-xl deck-body"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.4, duration: 0.7 }}
        >
          AI does not eliminate engineering skills. It changes where the scarce skill is.
        </motion.p>

        <motion.p
          className="mt-8 font-mono text-[11px] tracking-[0.16em] text-faint uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.8, duration: 0.6 }}
        >
          Hover the struck line to defend it · click the second line
        </motion.p>
      </div>
    </SlideShell>
  );
}
