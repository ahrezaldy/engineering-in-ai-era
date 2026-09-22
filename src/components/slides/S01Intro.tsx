"use client";

import { motion } from "motion/react";
import { ThreeCanvas } from "@/components/three/ThreeCanvas";
import { PointerCamera, SceneLights } from "@/components/three/SceneKit";
import { LatticeField } from "./scenes/LatticeField";
import { RevealText } from "@/components/ui/RevealText";
import { SlideShell } from "@/components/deck/SlideShell";
import { DECK } from "@/lib/deck-config";
import { EASE_OUT } from "@/lib/motion";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";

export function S01Intro() {
  const reduced = useReducedMotionSafe();

  return (
    <SlideShell bleed>
      <div className="absolute inset-0">
        <ThreeCanvas camera={{ position: [0, 0, 8.5], fov: 42 }}>
          <SceneLights />
          <PointerCamera amount={0.7} enabled={!reduced} />
          <LatticeField />
        </ThreeCanvas>
      </div>

      {/* Readability scrim — the lattice runs behind the type, not through it. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(100deg, var(--bg) 0%, var(--bg) 34%, color-mix(in srgb, var(--bg) 62%, transparent) 58%, transparent 92%)",
        }}
      />

      <div className="pointer-events-none absolute inset-0 flex flex-col justify-center px-20">
        <motion.div
          className="deck-kicker mb-5"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.25 }}
        >
          {DECK.event} · {DECK.dateLabel}
        </motion.div>

        <RevealText
          text={DECK.title}
          as="h1"
          by="word"
          delay={0.4}
          stagger={0.07}
          className="deck-display max-w-5xl"
        />

        <div className="relative mt-4 w-fit">
          <RevealText
            text={DECK.subtitle}
            as="p"
            by="word"
            delay={0.85}
            className="text-2xl font-normal tracking-tight text-muted"
          />
          <motion.span
            className="absolute -bottom-2 left-0 block h-px w-full origin-left bg-accent"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.7, ease: EASE_OUT, delay: 1.25 }}
          />
        </div>

        <motion.div
          className="mt-14 flex items-center gap-8"
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 1.4 } } }}
        >
          {[
            ["Speaker", DECK.speaker],
            ["Event", DECK.event],
            ["Date", DECK.dateLabel],
          ].map(([label, value]) => (
            <motion.div
              key={label}
              variants={{
                hidden: { opacity: 0, y: 14 },
                show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE_OUT } },
              }}
              className="border-l border-line pl-4"
            >
              <div className="deck-kicker mb-1 text-[10px]">{label}</div>
              <div className="text-[15px] font-medium">{value}</div>
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          className="mt-16 max-w-xl font-mono text-[13px] leading-relaxed text-faint"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 2.1 }}
        >
          &ldquo;If AI can already write a significant amount of our code, what exactly are we
          going to be paid for as engineers in the next few years?&rdquo;
          <motion.span
            className="ml-1 inline-block h-[1.1em] w-[2px] translate-y-[0.18em] bg-accent"
            animate={reduced ? { opacity: 1 } : { opacity: [1, 1, 0, 0] }}
            transition={{ duration: 1.1, repeat: Infinity, times: [0, 0.5, 0.5, 1] }}
          />
        </motion.p>
      </div>

      <motion.div
        className="pointer-events-none absolute bottom-20 left-20 font-mono text-[11px] tracking-[0.16em] text-faint/70 uppercase"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.8, duration: 0.8 }}
      >
        Drag to disturb · click to pulse · → to begin
      </motion.div>
    </SlideShell>
  );
}
