"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { SlideShell } from "@/components/deck/SlideShell";
import { ThreeCanvas } from "@/components/three/ThreeCanvas";
import { PointerCamera, SceneLights } from "@/components/three/SceneKit";
import { LEVELS, SeniorityLadder, type LevelId } from "./scenes/SeniorityLadder";
import { useDeck, useSlideKeyCapture } from "@/lib/deck-store";
import type { SlideProps } from "@/components/slides";
import { EASE_OUT, SPRING } from "@/lib/motion";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";

const MATRIX: Record<LevelId, { row: string; value: string }[]> = {
  junior: [
    { row: "Problem", value: "Understand the given problem" },
    { row: "Approach", value: "Follow and learn approaches" },
    { row: "Execution", value: "Execute well" },
    { row: "AI", value: "Use AI safely" },
  ],
  mid: [
    { row: "Problem", value: "Find the actual problem" },
    { row: "Approach", value: "Explore solutions" },
    { row: "Execution", value: "Execute independently" },
    { row: "AI", value: "Use AI to multiply productivity" },
  ],
  senior: [
    { row: "Problem", value: "Identify problems worth solving" },
    { row: "Approach", value: "Define trade-offs and direction" },
    { row: "Execution", value: "Enable others to execute" },
    { row: "AI", value: "Build AI into the engineering workflow" },
  ],
};

const PROGRESSION: Record<LevelId, string> = {
  junior: "Execute",
  mid: "Solve",
  senior: "Identify & Multiply",
};

export function S19Seniority({ slideIndex }: SlideProps) {
  const reduced = useReducedMotionSafe();
  const { index } = useDeck();
  const [level, setLevel] = useState<LevelId>("junior");
  const [visited, setVisited] = useState<LevelId[]>(["junior"]);

  const go = (id: LevelId) => {
    setLevel(id);
    setVisited((v) => (v.includes(id) ? v : [...v, id]));
  };

  const stepLevel = (delta: 1 | -1) => {
    const i = LEVELS.findIndex((l) => l.id === level);
    const next = LEVELS[Math.min(Math.max(i + delta, 0), LEVELS.length - 1)];
    if (next.id !== level) go(next.id);
    return next.id !== level;
  };

  // Left/right step through levels while this slide is up; only hand the key back to
  // the deck once the end of the ladder is reached.
  useSlideKeyCapture(index === slideIndex, (e) => {
    if (e.key === "ArrowRight") return stepLevel(1);
    if (e.key === "ArrowLeft") return stepLevel(-1);
    return false;
  });

  return (
    <SlideShell kicker="06 · What we do about it" title="Junior → Mid → Senior">
      <div className="grid h-full grid-cols-[0.95fr_1.05fr] gap-10">
        <div className="relative">
          <ThreeCanvas camera={{ position: [0, 0, 8.0], fov: 46 }}>
            <SceneLights />
            <PointerCamera amount={0.35} enabled={!reduced} />
            <SeniorityLadder level={level} visited={visited} onSelect={go} />
          </ThreeCanvas>
        </div>

        <div className="flex flex-col justify-center gap-6">
          <div className="flex gap-2">
            {LEVELS.map((l) => (
              <button
                key={l.id}
                onClick={() => go(l.id)}
                className={`relative rounded-lg px-5 py-2.5 font-mono text-[12px] tracking-wider uppercase transition-colors ${
                  level === l.id ? "text-bg" : "text-muted hover:text-fg"
                }`}
              >
                {level === l.id ? (
                  <motion.span
                    layoutId="level-pill"
                    transition={SPRING}
                    className="absolute inset-0 rounded-lg bg-accent"
                  />
                ) : (
                  <span className="absolute inset-0 rounded-lg border border-line" />
                )}
                <span className="relative">{l.label}</span>
              </button>
            ))}
            <span className="self-center pl-3 font-mono text-[10px] tracking-[0.14em] text-faint uppercase">
              ← → steps levels
            </span>
          </div>

          <div className="rounded-2xl border border-line bg-surface p-6">
            <AnimatePresence mode="wait">
              <motion.dl
                key={level}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.3, ease: EASE_OUT }}
                className="space-y-4"
              >
                {MATRIX[level].map((r, i) => (
                  <motion.div
                    key={r.row}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: EASE_OUT, delay: i * 0.06 }}
                    className="grid grid-cols-[92px_1fr] items-baseline gap-4 border-b border-line/60 pb-3 last:border-0 last:pb-0"
                  >
                    <dt className="font-mono text-[11px] tracking-[0.14em] text-faint uppercase">
                      {r.row}
                    </dt>
                    <dd className="text-[18px] leading-snug">{r.value}</dd>
                  </motion.div>
                ))}
              </motion.dl>
            </AnimatePresence>
          </div>

          {/* Fills in only as each level is actually visited. */}
          <div className="flex items-center gap-3">
            {LEVELS.map((l, i) => (
              <div key={l.id} className="flex items-center gap-3">
                <motion.span
                  animate={{
                    opacity: visited.includes(l.id) ? 1 : 0.25,
                    y: visited.includes(l.id) ? 0 : 4,
                  }}
                  transition={reduced ? { duration: 0 } : SPRING}
                  className={`text-[19px] font-medium ${
                    visited.includes(l.id) ? "text-accent" : "text-faint"
                  }`}
                >
                  {PROGRESSION[l.id]}
                </motion.span>
                {i < LEVELS.length - 1 ? <span className="text-faint">→</span> : null}
              </div>
            ))}
          </div>

          <p className="text-[13px] leading-snug text-faint">
            A direction, not a rigid definition of someone&rsquo;s level. AI makes implementation
            easier at every level — it does not hand anyone senior judgment.
          </p>
        </div>
      </div>
    </SlideShell>
  );
}
