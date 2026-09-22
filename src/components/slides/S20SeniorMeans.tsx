"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { SlideShell } from "@/components/deck/SlideShell";
import { Magnetic } from "@/components/ui/Magnetic";
import { EASE_OUT, SPRING } from "@/lib/motion";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";

const NOT = ["Knows the most frameworks", "Writes code the fastest", "Has the most years"];

const IS = [
  { text: "Identifying important problems", gloss: "Before anyone asks for a ticket." },
  { text: "Making good trade-offs", gloss: "And being able to say which one you took, and why." },
  { text: "Understanding system-level consequences", gloss: "Two layers past the file you changed." },
  { text: "Knowing when not to build something", gloss: "The cheapest solution is often the one you didn't ship." },
  { text: "Challenging assumptions", gloss: "Including the ones in the requirement." },
  { text: "Helping others make better decisions", gloss: "Not making the decisions for them." },
  { text: "Using AI to multiply team capability", gloss: "Not just your own throughput." },
];

const LADDER = [
  { level: "Junior", quote: "I can implement this." },
  { level: "Mid", quote: "I can figure out how to solve this." },
  { level: "Senior", quote: "I understand what we should solve and why." },
  { level: "Senior+", quote: "I can make the team better at solving these problems." },
];

export function S20SeniorMeans() {
  const reduced = useReducedMotionSafe();
  const [step, setStep] = useState(0);
  const [hover, setHover] = useState<string | null>(null);

  return (
    <SlideShell kicker="06 · What we do about it" title="What &ldquo;senior&rdquo; means in the AI era">
      <div className="grid h-full grid-cols-[0.8fr_1.2fr] gap-14">
        <div className="flex flex-col justify-center gap-10">
          <div>
            <div className="deck-kicker mb-4 text-warn">It is not simply</div>
            <ul className="space-y-2.5">
              {NOT.map((n, i) => (
                <li key={n} className="relative w-fit">
                  <motion.span
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 0.55, x: 0 }}
                    transition={{ duration: 0.45, ease: EASE_OUT, delay: 0.2 + i * 0.12 }}
                    className="block text-[18px] text-warn"
                  >
                    {n}
                  </motion.span>
                  <motion.span
                    className="absolute top-1/2 left-0 block h-[2px] w-full origin-left rounded-full bg-warn"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.4, ease: EASE_OUT, delay: 0.75 + i * 0.14 }}
                  />
                </li>
              ))}
            </ul>
          </div>

          {/* Click-through voice ladder */}
          <div>
            <div className="deck-kicker mb-4">The progression</div>
            <div className="space-y-2">
              {LADDER.map((l, i) => {
                const active = i === step;
                const seen = i <= step;
                return (
                  <motion.button
                    key={l.level}
                    onClick={() => setStep(i)}
                    animate={{ opacity: seen ? 1 : 0.3 }}
                    transition={SPRING}
                    className="block w-full text-left"
                  >
                    <div className="flex items-baseline gap-3">
                      <Magnetic strength={0.4} radius={40}>
                        <span
                          className={`block h-2 w-2 rounded-full transition-colors ${
                            active ? "bg-accent" : seen ? "bg-faint" : "bg-line"
                          }`}
                        />
                      </Magnetic>
                      <motion.span
                        animate={{ fontSize: active ? "1.35rem" : "1rem" }}
                        transition={reduced ? { duration: 0 } : SPRING}
                        className={`leading-snug ${active ? "font-medium text-fg" : "text-muted"}`}
                      >
                        &ldquo;{l.quote}&rdquo;
                      </motion.span>
                    </div>
                    <span className="ml-5 font-mono text-[10px] tracking-[0.16em] text-faint uppercase">
                      {l.level}
                    </span>
                  </motion.button>
                );
              })}
            </div>
            <button
              onClick={() => setStep((s) => (s + 1) % LADDER.length)}
              className="mt-4 ml-5 font-mono text-[11px] tracking-wider text-faint uppercase transition-colors hover:text-fg"
            >
              click to advance →
            </button>
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <div className="deck-kicker mb-5 text-accent">Increasingly, it is</div>
          <ul className="space-y-3">
            {IS.map((item, i) => (
              <motion.li
                key={item.text}
                onMouseEnter={() => setHover(item.text)}
                onMouseLeave={() => setHover(null)}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: EASE_OUT, delay: 1.2 + i * 0.09 }}
                className="cursor-default border-l-2 border-accent/50 pl-5"
              >
                <span className="text-[22px] leading-snug font-medium">{item.text}</span>
                <AnimatePresence>
                  {hover === item.text ? (
                    <motion.span
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.22 }}
                      className="block overflow-hidden text-[13px] text-muted"
                    >
                      {item.gloss}
                    </motion.span>
                  ) : null}
                </AnimatePresence>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </SlideShell>
  );
}
