"use client";

import { motion } from "motion/react";
import { Info, Landmark } from "lucide-react";
import { SlideShell } from "@/components/deck/SlideShell";
import { RevealText } from "@/components/ui/RevealText";
import { Tilt } from "@/components/ui/Tilt";
import { EASE_OUT } from "@/lib/motion";

/**
 * The talk's framing, in the speaker's own words (Theme M in SOURCE-NOTES), plus the
 * source document's note C5 on why the management view matters to engineers.
 *
 * Deliberately 2D and amber-free, like the speaker slide: amber means output/volume in
 * this deck, and this slide has nothing to say about either.
 */
export function S27Goals() {
  return (
    <SlideShell kicker="Why this talk" title="A view from the management side of the table">
      <div className="grid h-full grid-cols-[1.35fr_1fr] items-center gap-14">
        <div>
          <RevealText
            text="Engineers rarely get to hear how upper management thinks about engineering. My goal today is to share that view: what leadership is asking about engineering in the AI era, and why."
            as="p"
            by="word"
            delay={0.3}
            stagger={0.022}
            className="text-[30px] leading-snug font-medium tracking-tight text-balance"
          />

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE_OUT, delay: 1.35 }}
            className="mt-8 border-l-2 border-accent pl-5 text-[19px] leading-snug text-balance text-muted italic"
          >
            You don&rsquo;t need to think like an executive. But knowing how they think explains
            why expectations are changing.
          </motion.p>
        </div>

        <div className="flex flex-col gap-4">
          <Tilt max={6} lift={4}>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: EASE_OUT, delay: 1.6 }}
              className="flex items-center gap-4 rounded-2xl border border-line bg-surface p-6"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent">
                <Landmark size={20} strokeWidth={1.75} />
              </span>
              <div>
                <div className="text-[22px] leading-tight font-semibold tracking-tight">
                  About 5 years
                </div>
                <div className="mt-1 text-[14px] leading-snug text-muted">
                  working directly with upper management
                </div>
              </div>
            </motion.div>
          </Tilt>

          {/* A deliberate aside rather than fine print: its own card, its own weight. */}
          <Tilt max={6} lift={4}>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: EASE_OUT, delay: 1.75 }}
              className="glass flex gap-4 rounded-2xl p-6"
            >
              <Info size={20} strokeWidth={1.75} className="mt-0.5 shrink-0 text-muted" />
              <div>
                <div className="text-[17px] font-semibold">Take it with a grain of salt</div>
                <p className="mt-1.5 text-[15px] leading-snug text-muted">
                  This is one perspective, shaped by my own experience. Not every management team
                  thinks this way — yours may not.
                </p>
              </div>
            </motion.div>
          </Tilt>
        </div>
      </div>
    </SlideShell>
  );
}
