"use client";

import { motion } from "motion/react";
import { SlideShell } from "@/components/deck/SlideShell";
import { FlowChain } from "@/components/ui/FlowChain";
import { Tilt } from "@/components/ui/Tilt";
import { EASE_OUT } from "@/lib/motion";

const STAGES = [
  { label: "Requirement", note: "Someone else decides what gets built." },
  { label: "Design", note: "Shape the solution before touching code." },
  { label: "Code", note: "The part the job was named after." },
  { label: "Test", note: "Prove it does what it claims." },
  { label: "Review", note: "Another engineer's time, serially." },
  { label: "Deploy", note: "The end of the line." },
];

export function S04Before() {
  return (
    <SlideShell
      kicker="01 · The change"
      title="Before AI: an engineer was someone who could build software"
    >
      <div className="grid h-full grid-cols-[0.95fr_1.05fr] items-center gap-20">
        <div className="space-y-6">
          <motion.blockquote
            className="border-l-2 border-warn pl-5 text-2xl leading-snug font-medium text-balance"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.2 }}
          >
            &ldquo;Engineer = someone who can build software.&rdquo;
          </motion.blockquote>

          <motion.p
            className="deck-body max-w-md"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.4 }}
          >
            One direction. One person carrying each stage in turn. Every step costs
            engineering time, and the cost of the whole chain is what made ideas expensive.
          </motion.p>

          <motion.div
            className="flex gap-3 pt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <span className="font-mono text-[11px] tracking-[0.16em] text-faint uppercase">
              Hover a stage · click to pin
            </span>
          </motion.div>
        </div>

        <Tilt max={5} lift={0} className="mx-auto w-[320px]">
          <FlowChain nodes={STAGES.map((s) => ({ ...s, tone: "warn" as const }))} delay={0.35} />
        </Tilt>
      </div>
    </SlideShell>
  );
}
