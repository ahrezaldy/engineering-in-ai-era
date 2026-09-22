"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ChevronRight,
  Fingerprint,
  HelpCircle,
  Play,
  RotateCcw,
  Scale,
  ShieldCheck,
  Target,
  TrendingUp,
  Wrench,
} from "lucide-react";
import { SlideShell } from "@/components/deck/SlideShell";
import { ThreeCanvas } from "@/components/three/ThreeCanvas";
import { PointerCamera, SceneLights } from "@/components/three/SceneKit";
import {
  CHAIN,
  EVALUATE_STEP,
  GENERATE_STEP,
  JudgmentChain,
  OWN_STEP,
} from "./scenes/JudgmentChain";
import { EASE_OUT, SPRING } from "@/lib/motion";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";

const QUESTIONS = [
  { Icon: Target, text: "Is this actually the right problem?" },
  { Icon: Scale, text: "Is this solution appropriate?" },
  { Icon: HelpCircle, text: "What are the trade-offs?" },
  { Icon: ShieldCheck, text: "Is it secure?" },
  { Icon: Wrench, text: "Will we be able to maintain it?" },
  { Icon: TrendingUp, text: "What happens at scale?" },
  { Icon: Fingerprint, text: "Can I trust this output?" },
];

const GENERATED = ["5 possible architectures", "3 implementations", "20 test cases", "10 refactors"];

const STEP_MS = 900;

export function S15Judgment() {
  const reduced = useReducedMotionSafe();
  const [stage, setStage] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  // Walk the chain once on arrival so the room sees it build, then hand over control.
  const play = (from = 0) => {
    if (timer.current) clearInterval(timer.current);
    setStage(from);
    timer.current = setInterval(
      () =>
        setStage((s) => {
          if (s >= CHAIN.length - 1) {
            if (timer.current) clearInterval(timer.current);
            return s;
          }
          return s + 1;
        }),
      reduced ? 200 : STEP_MS,
    );
  };

  useEffect(() => {
    // Autoplay on arrival. The first tick is scheduled rather than applied inline, so the
    // effect does not set state during its own run.
    if (timer.current) clearInterval(timer.current);
    timer.current = setInterval(
      () =>
        setStage((s) => {
          if (s >= CHAIN.length - 1) {
            if (timer.current) clearInterval(timer.current);
            return s;
          }
          return s + 1;
        }),
      reduced ? 200 : STEP_MS,
    );
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [reduced]);

  const jump = (i: number) => {
    if (timer.current) clearInterval(timer.current);
    setStage(i);
  };

  const generating = stage >= GENERATE_STEP;
  const evaluating = stage >= EVALUATE_STEP;
  const owned = stage >= OWN_STEP;

  return (
    <SlideShell bleed>
      <div className="absolute inset-0">
        <ThreeCanvas camera={{ position: [0, 0.45, 7.6], fov: 46 }}>
          <SceneLights />
          <PointerCamera amount={0.4} enabled={!reduced} />
          <JudgmentChain stage={stage} onSelect={jump} />
        </ThreeCanvas>
      </div>

      <div className="pointer-events-none absolute inset-0 px-16 py-14">
        <div className="deck-kicker mb-3">05 · What good looks like now</div>
        <h2 className="deck-title text-[2.4rem] leading-[1.06]">
          AI generates.
          <br />
          You decide.
        </h2>

        {/* F2 — the questions the engineer still owns. They belong to "Evaluate". */}
        <motion.div
          className="pointer-events-auto absolute top-[46%] left-16 w-[330px] -translate-y-1/2"
          animate={{ opacity: evaluating ? 1 : 0.32 }}
          transition={{ duration: 0.5, ease: EASE_OUT }}
        >
          <button
            onClick={() => jump(EVALUATE_STEP)}
            className="deck-kicker mb-3 block text-left transition-colors hover:text-fg"
          >
            Evaluate means asking
          </button>
          <ul className="space-y-1.5">
            {QUESTIONS.map(({ Icon, text }, i) => (
              <motion.li
                key={text}
                initial={{ opacity: 0, x: -14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.45, ease: EASE_OUT, delay: 0.3 + i * 0.06 }}
                className="flex items-center gap-2.5 text-[13.5px]"
              >
                <span
                  className={`grid h-6 w-6 shrink-0 place-items-center rounded-md border transition-colors ${
                    evaluating
                      ? "border-accent/40 bg-accent/10 text-accent"
                      : "border-line bg-surface/60 text-faint"
                  }`}
                >
                  <Icon size={12} strokeWidth={1.75} />
                </span>
                <span className={evaluating ? "text-fg" : "text-muted"}>{text}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* F1 — what AI handed over. Belongs to "Generate possibilities". */}
        <motion.div
          className="pointer-events-auto absolute top-[46%] right-16 w-[290px] -translate-y-1/2"
          animate={{ opacity: generating ? 1 : 0.32 }}
          transition={{ duration: 0.5, ease: EASE_OUT }}
        >
          <div className="rounded-xl border border-line bg-surface/80 p-5 backdrop-blur-sm">
            <button
              onClick={() => jump(GENERATE_STEP)}
              className="deck-kicker mb-3 block text-left transition-colors hover:text-fg"
            >
              AI can give you
            </button>
            <ul className="space-y-1.5">
              {GENERATED.map((g, i) => (
                <motion.li
                  key={g}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.45, ease: EASE_OUT, delay: 0.3 + i * 0.08 }}
                  className={`font-mono text-[12px] ${generating ? "text-fg" : "text-muted"}`}
                >
                  {g}
                </motion.li>
              ))}
            </ul>
          </div>

          <AnimatePresence>
            {owned ? (
              <motion.div
                initial={{ opacity: 0, y: 14, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={SPRING}
                className="mt-3 rounded-xl border border-accent bg-accent/10 p-5"
              >
                <p className="text-[16px] leading-snug font-semibold text-balance">
                  AI can generate the solution. The engineer owns the decision.
                </p>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </motion.div>

        {/* The chain itself, as a stepper. */}
        <div className="pointer-events-auto absolute inset-x-0 bottom-16 flex flex-col items-center gap-4">
          <AnimatePresence mode="wait">
            <motion.p
              key={stage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: EASE_OUT }}
              className="text-[26px] font-medium tracking-tight"
            >
              {CHAIN[stage].full}
            </motion.p>
          </AnimatePresence>

          <div className="flex items-center gap-1 rounded-full border border-line bg-surface/85 p-1.5 backdrop-blur-md">
            {CHAIN.map((c, i) => (
              <button
                key={c.id}
                onClick={() => jump(i)}
                className={`relative rounded-full px-3.5 py-1.5 font-mono text-[11px] tracking-wider uppercase transition-colors ${
                  stage === i ? "text-bg" : i <= stage ? "text-fg" : "text-faint hover:text-muted"
                }`}
              >
                {stage === i ? (
                  <motion.span
                    layoutId="chain-pill"
                    transition={SPRING}
                    className={`absolute inset-0 rounded-full ${
                      c.side === "ai" ? "bg-warn" : "bg-accent"
                    }`}
                  />
                ) : null}
                <span className="relative">{c.short}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => jump(Math.min(stage + 1, CHAIN.length - 1))}
              disabled={stage >= CHAIN.length - 1}
              className="flex items-center gap-1.5 font-mono text-[11px] tracking-wider text-faint uppercase transition-colors hover:text-fg disabled:opacity-30"
            >
              step <ChevronRight size={12} />
            </button>
            <button
              onClick={() => play(0)}
              className="flex items-center gap-1.5 font-mono text-[11px] tracking-wider text-faint uppercase transition-colors hover:text-fg"
            >
              <Play size={11} /> replay
            </button>
            <button
              onClick={() => jump(0)}
              className="flex items-center gap-1.5 font-mono text-[11px] tracking-wider text-faint uppercase transition-colors hover:text-fg"
            >
              <RotateCcw size={11} /> reset
            </button>
          </div>
        </div>
      </div>
    </SlideShell>
  );
}
