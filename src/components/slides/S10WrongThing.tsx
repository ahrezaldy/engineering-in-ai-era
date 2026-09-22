"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { RotateCcw, Target } from "lucide-react";
import { SlideShell } from "@/components/deck/SlideShell";
import { EASE_OUT, SPRING } from "@/lib/motion";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";

const TRACK = 560;
const OFFSET_PER_X = 34; // how far off-target the fast runner drifts per extra multiplier

export function S10WrongThing() {
  const reduced = useReducedMotionSafe();
  const [speed, setSpeed] = useState(2);
  // `id` restarts the race; `done` only ever flips true from the timer below, and a
  // restart resets it in the same update that bumps the id.
  const [run, setRun] = useState({ id: 0, done: false });
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const miss = Math.round((speed - 1) * OFFSET_PER_X);
  const durationA = reduced ? 0.01 : 2.6 / speed;
  const runId = run.id;
  const done = run.done;

  const restart = (nextSpeed = speed) => {
    setSpeed(nextSpeed);
    setRun((r) => ({ id: r.id + 1, done: false }));
  };

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(
      () => setRun((r) => (r.id === runId ? { ...r, done: true } : r)),
      (durationA + 0.25) * 1000,
    );
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [runId, durationA]);

  return (
    <SlideShell
      kicker="02 · The economics"
      title="If coding becomes 2× faster, does the product become 2× better?"
    >
      <div className="flex h-full flex-col justify-center gap-10">
        <div className="relative w-full max-w-[720px]">
          {/* Fast but aimed wrong */}
          <div className="mb-10">
            <div className="mb-2 flex items-baseline gap-3">
              <span className="font-mono text-[12px] tracking-wider text-warn uppercase">
                Fast
              </span>
              <span className="text-[13px] text-muted">{speed.toFixed(1)}× implementation speed</span>
            </div>
            <div className="relative h-14">
              <div className="absolute top-1/2 right-0 left-0 h-px -translate-y-1/2 bg-line" />
              <Target
                size={22}
                strokeWidth={1.75}
                className="absolute top-1/2 -translate-y-1/2 text-accent"
                style={{ left: TRACK }}
              />
              <motion.div
                key={`a-${runId}-${speed}`}
                className="absolute top-1/2 h-9 w-9 -translate-y-1/2 rounded-lg border-2 border-warn bg-warn/20"
                initial={{ x: 0, y: "-50%" }}
                animate={{ x: TRACK + miss, y: "-50%" }}
                transition={{ duration: durationA, ease: EASE_OUT }}
              />
              <motion.div
                className="absolute top-1/2 h-14 border-l border-dashed border-warn/60"
                style={{ left: TRACK }}
                animate={{ opacity: done && miss > 4 ? 1 : 0, width: miss }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Slower but aimed right */}
          <div>
            <div className="mb-2 flex items-baseline gap-3">
              <span className="font-mono text-[12px] tracking-wider text-accent uppercase">
                Aimed
              </span>
              <span className="text-[13px] text-muted">1.0× implementation speed</span>
            </div>
            <div className="relative h-14">
              <div className="absolute top-1/2 right-0 left-0 h-px -translate-y-1/2 bg-line" />
              <Target
                size={22}
                strokeWidth={1.75}
                className="absolute top-1/2 -translate-y-1/2 text-accent"
                style={{ left: TRACK }}
              />
              <motion.div
                key={`b-${runId}`}
                className="absolute top-1/2 h-9 w-9 -translate-y-1/2 rounded-lg border-2 border-accent bg-accent/20"
                initial={{ x: 0, y: "-50%" }}
                animate={{ x: TRACK, y: "-50%" }}
                transition={{ duration: reduced ? 0.01 : 2.6, ease: EASE_OUT }}
              />
            </div>
          </div>
        </div>

        <div className="flex items-end gap-12">
          <motion.div
            key={`verdict-${runId}-${done}`}
            initial={{ opacity: 0, scale: 1.6 }}
            animate={{ opacity: done ? 1 : 0, scale: done ? 1 : 1.6 }}
            transition={SPRING}
            className="w-[120px]"
          >
            <span className="deck-display leading-none">No.</span>
          </motion.div>

          <div className="max-w-md">
            <p className="deck-body">
              We can become faster at building the wrong thing. The distance from the target is
              the part the speed number never shows.
            </p>
            <div className="mt-4 font-mono text-[13px]">
              <span className="text-faint">distance from target</span>{" "}
              <motion.span
                key={miss}
                initial={{ opacity: 0.4 }}
                animate={{ opacity: 1 }}
                className={miss > 60 ? "text-warn" : "text-fg"}
              >
                {miss}
              </motion.span>
            </div>
          </div>

          <div className="ml-auto w-[220px]">
            <label className="deck-kicker mb-3 block">Implementation speed</label>
            <input
              type="range"
              min={1}
              max={5}
              step={0.5}
              value={speed}
              onChange={(e) => restart(Number(e.target.value))}
              className="w-full accent-[var(--warn)]"
            />
            <button
              onClick={() => restart()}
              className="mt-3 flex items-center gap-1.5 font-mono text-[11px] tracking-wider text-faint uppercase transition-colors hover:text-fg"
            >
              <RotateCcw size={12} /> replay
            </button>
          </div>
        </div>
      </div>
    </SlideShell>
  );
}
