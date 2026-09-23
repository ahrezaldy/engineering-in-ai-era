"use client";

import { AnimatePresence, motion } from "motion/react";
import { useDeck } from "@/lib/deck-store";
import { EASE_OUT } from "@/lib/motion";

const KEYS: [string, string][] = [
  ["→  Space  PgDn", "Next slide"],
  ["←  PgUp", "Previous slide"],
  ["Home / End", "First / last slide"],
  ["0–9 then Enter", "Jump to slide"],
  ["F", "Fullscreen"],
  ["Esc", "Exit fullscreen, else slide overview"],
  ["?", "This sheet"],
  ["← →  on slide 21", "Step seniority level"],
];

export function ShortcutsSheet() {
  const { shortcutsOpen, setShortcutsOpen } = useDeck();
  return (
    <AnimatePresence>
      {shortcutsOpen ? (
        <motion.div
          className="fixed inset-0 z-[110] grid place-items-center bg-bg/70 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShortcutsOpen(false)}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.34, ease: EASE_OUT }}
            className="glass w-[540px] rounded-2xl p-8"
          >
            <div className="deck-kicker mb-5">Keyboard</div>
            <dl className="space-y-3">
              {KEYS.map(([k, v], i) => (
                <motion.div
                  key={k}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * i, duration: 0.35, ease: EASE_OUT }}
                  className="flex items-baseline justify-between gap-6 border-b border-line/60 pb-2.5 last:border-0"
                >
                  <dt className="font-mono text-[12px] tracking-wide text-fg">{k}</dt>
                  <dd className="text-[13px] text-muted">{v}</dd>
                </motion.div>
              ))}
            </dl>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
