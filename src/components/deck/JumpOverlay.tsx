"use client";

import { AnimatePresence, motion } from "motion/react";
import { useDeck } from "@/lib/deck-store";
import { SPRING } from "@/lib/motion";

/** Shows the digits typed so far while a numeric jump is being composed. */
export function JumpOverlay() {
  const { jumpBuffer, total } = useDeck();
  const valid = jumpBuffer && Number(jumpBuffer) >= 1 && Number(jumpBuffer) <= total;

  return (
    <AnimatePresence>
      {jumpBuffer ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={SPRING}
          className="glass pointer-events-none fixed bottom-16 left-1/2 z-[120] -translate-x-1/2 rounded-xl px-6 py-3.5"
        >
          <span className="font-mono text-3xl tracking-[0.1em] tabular-nums">{jumpBuffer}</span>
          <span className="ml-3 font-mono text-[11px] tracking-wider text-faint uppercase">
            {valid ? "press enter" : `1–${total}`}
          </span>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
