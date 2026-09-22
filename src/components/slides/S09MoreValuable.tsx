"use client";

import { useState } from "react";
import { AnimatePresence, Reorder, motion } from "motion/react";
import { GripVertical } from "lucide-react";
import { SlideShell } from "@/components/deck/SlideShell";
import { RevealText } from "@/components/ui/RevealText";
import { EASE_OUT, SPRING } from "@/lib/motion";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";

const GLOSS: Record<string, string> = {
  "Problem selection": "Choosing which problem is worth solving at all.",
  Judgment: "Choosing between options and owning the trade-off.",
  Ownership: "Staying responsible for the outcome, not just the merge.",
  "Business understanding": "Knowing why the problem matters to anyone else.",
  Leverage: "Making the rest of the team better, not just yourself faster.",
};

export function S09MoreValuable() {
  const reduced = useReducedMotionSafe();
  const [items, setItems] = useState(Object.keys(GLOSS));
  const [hover, setHover] = useState<string | null>(null);

  return (
    <SlideShell bleed>
      <div className="flex h-full flex-col justify-center px-20">
        <div className="deck-kicker mb-6">02 · The economics</div>

        <RevealText
          text="If engineering becomes cheaper, what becomes more valuable?"
          as="h2"
          by="word"
          stagger={0.05}
          className="deck-title max-w-4xl text-balance"
        />

        <Reorder.Group
          axis="y"
          values={items}
          onReorder={setItems}
          className="mt-12 max-w-4xl space-y-2"
        >
          {items.map((label, i) => (
            <Reorder.Item
              key={label}
              value={label}
              drag={!reduced ? "y" : false}
              whileDrag={{ scale: 1.02, zIndex: 10 }}
              dragTransition={{ bounceStiffness: 400, bounceDamping: 30 }}
              onHoverStart={() => setHover(label)}
              onHoverEnd={() => setHover(null)}
              className="cursor-grab list-none active:cursor-grabbing"
            >
              <motion.div
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  opacity: { duration: 0.5, ease: EASE_OUT, delay: 1.1 + i * 0.22 },
                  x: { duration: 0.5, ease: EASE_OUT, delay: 1.1 + i * 0.22 },
                  layout: SPRING,
                }}
                className="group relative flex items-center gap-4 rounded-xl border border-transparent px-4 py-3 transition-colors hover:border-line hover:bg-surface"
              >
                <GripVertical
                  size={15}
                  className="shrink-0 text-faint opacity-0 transition-opacity group-hover:opacity-100"
                />
                <div className="relative shrink-0">
                  <span className="text-[30px] font-medium tracking-tight whitespace-nowrap">
                    {label}
                  </span>
                  <motion.span
                    className="absolute -bottom-0.5 left-0 block h-px w-full origin-left bg-accent"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.5, ease: EASE_OUT, delay: 1.35 + i * 0.22 }}
                  />
                </div>
                <AnimatePresence>
                  {hover === label ? (
                    <motion.span
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.22 }}
                      className="ml-4 min-w-0 text-[13px] leading-snug text-muted"
                    >
                      {GLOSS[label]}
                    </motion.span>
                  ) : null}
                </AnimatePresence>
              </motion.div>
            </Reorder.Item>
          ))}
        </Reorder.Group>

        <motion.p
          className="mt-10 font-mono text-[11px] tracking-[0.16em] text-faint uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.4, duration: 0.6 }}
        >
          Drag to reorder — which of these matters most here?
        </motion.p>
      </div>
    </SlideShell>
  );
}
