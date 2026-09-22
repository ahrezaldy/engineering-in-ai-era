"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { OrbitControls } from "@react-three/drei";
import { Play } from "lucide-react";
import { SlideShell } from "@/components/deck/SlideShell";
import { ThreeCanvas } from "@/components/three/ThreeCanvas";
import { SceneLights } from "@/components/three/SceneKit";
import { SPINE, SpineGraph } from "./scenes/SpineGraph";
import { RevealText } from "@/components/ui/RevealText";
import { useDeck, useSlideKeyCapture } from "@/lib/deck-store";
import type { SlideProps } from "@/components/slides";
import { EASE_OUT, SPRING } from "@/lib/motion";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";

const STEP_MS = 420;

export function S23Recap({ slideIndex }: SlideProps) {
  const reduced = useReducedMotionSafe();
  const { index } = useDeck();
  const [revealed, setRevealed] = useState(0);
  const [active, setActive] = useState<number | null>(null);
  const [graphFocused, setGraphFocused] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  // Build the argument one link at a time, so the room watches it assemble.
  useEffect(() => {
    if (timer.current) clearInterval(timer.current);
    timer.current = setInterval(() => {
      setRevealed((r) => {
        if (r >= SPINE.length) {
          if (timer.current) clearInterval(timer.current);
          return r;
        }
        return r + 1;
      });
    }, reduced ? 90 : STEP_MS);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [reduced]);

  const replay = () => {
    setRevealed(0);
    setActive(null);
    if (timer.current) clearInterval(timer.current);
    timer.current = setInterval(() => {
      setRevealed((r) => {
        if (r >= SPINE.length) {
          if (timer.current) clearInterval(timer.current);
          return r;
        }
        return r + 1;
      });
    }, reduced ? 90 : STEP_MS);
  };

  // Digits jump between nodes, but only while the pointer is over the graph — otherwise
  // they stay with the deck's slide-jump buffer.
  useSlideKeyCapture(index === slideIndex && graphFocused, (e) => {
    const n = Number(e.key);
    if (e.key >= "1" && e.key <= "8") {
      setActive(n - 1);
      setRevealed((r) => Math.max(r, n));
      return true;
    }
    return false;
  });

  return (
    <SlideShell bleed>
      <div
        className="absolute inset-0"
        onMouseEnter={() => setGraphFocused(true)}
        onMouseLeave={() => setGraphFocused(false)}
      >
        <ThreeCanvas camera={{ position: [0, 0.2, 8.4], fov: 46 }}>
          <SceneLights intensity={0.8} />
          <SpineGraph revealed={revealed} active={active} onSelect={setActive} />
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            enableDamping
            dampingFactor={0.07}
            minPolarAngle={Math.PI / 2 - 0.5}
            maxPolarAngle={Math.PI / 2 + 0.5}
          />
        </ThreeCanvas>
      </div>

      <div className="pointer-events-none absolute inset-0 flex flex-col justify-center px-16 py-14">
        <div className="deck-kicker mb-4">Recap · the spine of the argument</div>

        <ol className="pointer-events-auto max-w-[380px] space-y-1">
          {SPINE.map((s, i) => (
            <motion.li
              key={s.id}
              initial={{ opacity: 0, x: -14 }}
              animate={{
                opacity: revealed > i ? (active === null || active === i ? 1 : 0.35) : 0.12,
                x: 0,
              }}
              transition={{ duration: 0.4, ease: EASE_OUT }}
            >
              <button
                onMouseEnter={() => setActive(i)}
                onClick={() => setActive(active === i ? null : i)}
                className="flex w-full items-baseline gap-3 rounded-md px-2 py-1 text-left transition-colors hover:bg-surface/60"
              >
                <span className="font-mono text-[11px] text-faint tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className={`font-mono text-[13px] leading-snug ${
                    active === i ? "text-accent" : "text-muted"
                  }`}
                >
                  {s.short}
                </span>
              </button>
            </motion.li>
          ))}
        </ol>

        <div className="pointer-events-auto mt-8 flex items-center gap-4">
          <motion.button
            onClick={replay}
            whileTap={{ scale: 0.95 }}
            transition={SPRING}
            className="flex items-center gap-2 rounded-lg border border-line bg-surface/80 px-4 py-2 font-mono text-[11px] tracking-wider text-muted uppercase backdrop-blur-sm hover:text-fg"
          >
            <Play size={12} /> play argument
          </motion.button>
          <span className="font-mono text-[10px] tracking-[0.14em] text-faint uppercase">
            drag to orbit · click a node · 1–8 over the graph
          </span>
        </div>
      </div>

      {/* The active node's full wording, mirrored large on the right. */}
      <div className="pointer-events-none absolute inset-y-0 right-16 flex w-[420px] items-center">
        <AnimatePresence mode="wait">
          {active !== null ? (
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.32, ease: EASE_OUT }}
            >
              <div className="deck-kicker mb-3">
                Step {String(active + 1).padStart(2, "0")} of {SPINE.length}
              </div>
              <RevealText
                text={SPINE[active].full}
                as="p"
                by="word"
                className="text-[30px] leading-snug font-medium tracking-tight text-balance"
              />
            </motion.div>
          ) : revealed >= SPINE.length ? (
            <motion.div
              key="done"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="deck-kicker mb-3">The whole talk in one line</div>
              <p className="text-[28px] leading-snug font-medium tracking-tight text-balance">
                AI makes implementation cheaper, so the value of engineers shifts toward problem
                selection, judgment, ownership, leverage and business impact.
              </p>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </SlideShell>
  );
}
