"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, AtSign } from "lucide-react";
import { SlideShell } from "@/components/deck/SlideShell";
import { ThreeCanvas } from "@/components/three/ThreeCanvas";
import { Particles, SceneLights } from "@/components/three/SceneKit";
import { RevealText } from "@/components/ui/RevealText";
import { Magnetic } from "@/components/ui/Magnetic";
import { DECK } from "@/lib/deck-config";
import { EASE_OUT, SPRING } from "@/lib/motion";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";

const CONTACTS = [
  { label: "linkedin.com/in/ahrezaldy", href: "https://linkedin.com/in/ahrezaldy", external: true },
  { label: "github.com/ahrezaldy", href: "https://github.com/ahrezaldy", external: true },
  { label: "ahrezaldy@gmail.com", href: "mailto:ahrezaldy@gmail.com", external: false },
] as const;

const PROMPTS = [
  {
    short: "The remaining 20%",
    full: "If AI can implement 80% of a ticket, what should the engineer spend the remaining 20% on?",
    areas: "requirements · architecture · validation · security · testing · edge cases · business context",
  },
  {
    short: "Fast, or right?",
    full: "Would you rather have an engineer who codes extremely fast, or one who identifies that the requirement itself is wrong before coding starts?",
    areas: "problem selection · judgment",
  },
  {
    short: "Still manual",
    full: "What engineering work are we still doing manually that AI or automation could handle?",
    areas: "practical opportunities inside this team",
  },
  {
    short: "The extra time",
    full: "If AI makes you 2× faster, what would you do with the extra time?",
    areas: "more tickets · quality · learning · automation · helping teammates · new ideas · tech debt",
  },
  {
    short: "The extra capacity",
    full: "If AI makes us 2× more productive, what will we do with the extra capacity — lower cost, more output, better engineering, or bigger ambition?",
    areas: "no single answer — this one is for the room",
  },
];

export function S25QA() {
  const reduced = useReducedMotionSafe();
  const [open, setOpen] = useState<number | null>(null);

  return (
    <SlideShell bleed>
      <div className="absolute inset-0">
        {/* interactive={false} puts pointer-events:none on the div R3F listens on, so a
            PointerCamera or repelPointer here could never fire. Ambient drift only. */}
        <ThreeCanvas camera={{ position: [0, 0, 8], fov: 45 }} interactive={false}>
          <SceneLights intensity={0.6} />
          <Particles count={520} spread={16} size={0.04} speed={0.03} />
        </ThreeCanvas>
      </div>

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 30% 45%, color-mix(in srgb, var(--bg) 88%, transparent) 0%, color-mix(in srgb, var(--bg) 55%, transparent) 55%, transparent 85%)",
        }}
      />

      <div className="absolute inset-0 flex flex-col justify-center px-20">
        <div className="deck-kicker mb-6">Over to you</div>

        <RevealText
          text="The engineer of the AI era is not the one who writes code the fastest."
          as="p"
          by="word"
          stagger={0.04}
          className="max-w-4xl text-[2.4rem] leading-tight font-medium tracking-tight text-muted"
        />
        <RevealText
          text="It is the one who can turn problems into outcomes most effectively."
          as="p"
          by="word"
          stagger={0.04}
          delay={1.05}
          className="mt-2 max-w-4xl text-[2.4rem] leading-tight font-semibold tracking-tight"
        />

        {/* Discussion prompts — click one to bring it up to display size. */}
        <div className="pointer-events-auto mt-14 flex flex-wrap gap-2">
          {PROMPTS.map((p, i) => (
            <Magnetic key={p.short} strength={0.2} radius={70}>
              <motion.button
                onClick={() => setOpen(open === i ? null : i)}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: EASE_OUT, delay: 2 + i * 0.08 }}
                className={`rounded-full border px-5 py-2.5 font-mono text-[12px] tracking-wider uppercase transition-colors ${
                  open === i
                    ? "border-accent bg-accent/12 text-accent"
                    : "border-line bg-surface/70 text-muted backdrop-blur-sm hover:text-fg"
                }`}
              >
                {p.short}
              </motion.button>
            </Magnetic>
          ))}
        </div>

        <div className="mt-8 min-h-[130px] max-w-4xl">
          <AnimatePresence mode="wait">
            {open !== null ? (
              <motion.div
                key={open}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.32, ease: EASE_OUT }}
              >
                <p className="text-[27px] leading-snug font-medium tracking-tight text-balance">
                  {PROMPTS[open].full}
                </p>
                <p className="mt-3 font-mono text-[12px] text-faint">{PROMPTS[open].areas}</p>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        <motion.div
          className="pointer-events-auto mt-10 flex flex-wrap items-center gap-x-6 gap-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.6, duration: 0.7 }}
        >
          <div className="relative">
            <motion.span
              className="absolute -inset-4 rounded-full bg-accent/15 blur-xl"
              animate={reduced ? { opacity: 0.4 } : { opacity: [0.25, 0.55, 0.25] }}
              transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
            />
            <Magnetic strength={0.3} radius={90}>
              <motion.a
                href="#/slide/1"
                whileHover={{ y: -2 }}
                transition={SPRING}
                className="relative flex items-center gap-2.5 rounded-full border border-accent/40 bg-accent/10 px-6 py-3"
              >
                <AtSign size={15} className="text-accent" />
                <span className="text-[15px] font-medium">{DECK.speaker}</span>
              </motion.a>
            </Magnetic>
          </div>
          <div className="flex max-w-[620px] flex-wrap gap-2">
            {CONTACTS.map((c) => (
              <Magnetic key={c.label} strength={0.25} radius={70}>
                <motion.a
                  href={c.href}
                  {...(c.external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
                  whileHover={{ y: -2 }}
                  transition={SPRING}
                  className="group flex items-center gap-2 rounded-full border border-line bg-surface/70 px-4 py-2 font-mono text-[12px] text-muted backdrop-blur-sm transition-colors hover:border-fg/25 hover:text-fg"
                >
                  {c.label}
                  <ArrowUpRight
                    size={12}
                    className="-translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
                  />
                </motion.a>
              </Magnetic>
            ))}
            <div className="mt-1 w-full font-mono text-[11px] tracking-[0.16em] text-faint uppercase">
              {DECK.event} · {DECK.dateLabel}
            </div>
          </div>
        </motion.div>
      </div>
    </SlideShell>
  );
}
