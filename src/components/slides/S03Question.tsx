"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { SlideShell } from "@/components/deck/SlideShell";
import { RevealText } from "@/components/ui/RevealText";
import { EASE_OUT, SPRING } from "@/lib/motion";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";

export function S03Question() {
  const reduced = useReducedMotionSafe();
  const [votes, setVotes] = useState({ yes: 0, no: 0 });
  const total = Math.max(votes.yes + votes.no, 1);

  return (
    <SlideShell bleed>
      <div className="flex h-full flex-col justify-center px-20">
        <motion.div
          className="deck-kicker mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          To start with
        </motion.div>

        {/* The hold lands on "paid for" — the same beat taken out loud. */}
        <RevealText
          text="If AI can already write a significant amount of our code, what exactly are we going to be paid for"
          as="h2"
          by="word"
          stagger={0.038}
          holdAfter={12}
          holdFor={0.75}
          className="deck-title max-w-5xl text-balance"
        />
        <RevealText
          text="as engineers in the next few years?"
          as="h2"
          by="word"
          stagger={0.038}
          delay={1.55}
          className="deck-title max-w-5xl text-balance text-accent"
        />

        <motion.div
          className="mt-12 max-w-2xl space-y-2"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE_OUT, delay: 3.1 }}
        >
          <p className="deck-body">
            This is <span className="font-medium text-fg">not primarily a talk about AI tools</span>.
          </p>
          <p className="deck-body">
            The question is: if AI changes how software is built, what changes in what we expect
            from engineers?
          </p>
        </motion.div>

        {/* Live show-of-hands, clicked from the stage. */}
        <motion.div
          className="mt-14 w-fit rounded-2xl border border-line bg-surface p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE_OUT, delay: 3.5 }}
        >
          <div className="deck-kicker mb-4">Used AI to write code this week?</div>
          <div className="flex items-center gap-3">
            {(["yes", "no"] as const).map((k) => (
              <motion.button
                key={k}
                onClick={() => setVotes((v) => ({ ...v, [k]: v[k] + 1 }))}
                whileTap={{ scale: 0.94 }}
                whileHover={{ y: -2 }}
                transition={SPRING}
                className={`relative overflow-hidden rounded-lg border px-6 py-2.5 font-mono text-[13px] tracking-wider uppercase ${
                  k === "yes"
                    ? "border-accent/40 bg-accent/10 text-accent"
                    : "border-warn/40 bg-warn/10 text-warn"
                }`}
              >
                <motion.span
                  className={`absolute inset-y-0 left-0 ${k === "yes" ? "bg-accent/20" : "bg-warn/20"}`}
                  animate={{ width: `${(votes[k] / total) * 100}%` }}
                  transition={reduced ? { duration: 0 } : SPRING}
                />
                <span className="relative">
                  {k} <span className="ml-2 tabular-nums opacity-70">{votes[k]}</span>
                </span>
              </motion.button>
            ))}
            <button
              onClick={() => setVotes({ yes: 0, no: 0 })}
              className="ml-2 font-mono text-[11px] tracking-wider text-faint uppercase transition-colors hover:text-fg"
            >
              reset
            </button>
          </div>
          <p className="mt-4 max-w-sm text-[13px] text-faint">
            Now imagine the AI gets significantly better. What part of our job becomes more
            valuable?
          </p>
        </motion.div>
      </div>
    </SlideShell>
  );
}
