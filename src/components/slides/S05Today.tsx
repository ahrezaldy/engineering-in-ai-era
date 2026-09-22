"use client";

import { useState } from "react";
import { motion } from "motion/react";
import {
  Bug,
  Code2,
  FileText,
  FlaskConical,
  MessageSquareCode,
  Network,
  Recycle,
  Search,
} from "lucide-react";
import { SlideShell } from "@/components/deck/SlideShell";
import { EASE_OUT, SPRING } from "@/lib/motion";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";

const HELPS = [
  { label: "Boilerplate code", Icon: Code2, stage: 0 },
  { label: "Tests", Icon: FlaskConical, stage: 2 },
  { label: "Documentation", Icon: FileText, stage: 2 },
  { label: "Debugging", Icon: Bug, stage: 2 },
  { label: "Refactoring", Icon: Recycle, stage: 3 },
  { label: "Code explanation", Icon: MessageSquareCode, stage: 3 },
  { label: "Research", Icon: Search, stage: 0 },
  { label: "Architecture exploration", Icon: Network, stage: 1 },
];

const LOOP = ["Problem", "AI + Engineer", "Validate", "Ship"];
const R = 124;
const CIRCUMFERENCE = 2 * Math.PI * R;
const TRAVELLER = 46;

export function S05Today() {
  const reduced = useReducedMotionSafe();
  const [lit, setLit] = useState<number | null>(null);

  return (
    <SlideShell
      kicker="01 · The change"
      title="Today, AI is already inside the loop"
      lede="Fling a card at the loop. Every one of these used to be engineering hours."
    >
      <div className="grid h-full grid-cols-[1.1fr_0.9fr] items-center gap-16">
        <motion.div
          className="grid grid-cols-2 gap-3"
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05, delayChildren: 0.3 } } }}
        >
          {HELPS.map(({ label, Icon, stage }) => (
            <motion.div
              key={label}
              drag={!reduced}
              dragSnapToOrigin
              dragElastic={0.22}
              dragTransition={{ bounceStiffness: 340, bounceDamping: 26 }}
              whileDrag={{ scale: 1.06, zIndex: 20, cursor: "grabbing" }}
              onHoverStart={() => setLit(stage)}
              onHoverEnd={() => setLit(null)}
              variants={{
                hidden: { opacity: 0, scale: 0.88, filter: "blur(6px)" },
                show: {
                  opacity: 1,
                  scale: 1,
                  filter: "blur(0px)",
                  transition: { duration: 0.55, ease: EASE_OUT },
                },
              }}
              whileHover={{ y: -3 }}
              className="flex cursor-grab items-center gap-3 rounded-xl border border-line bg-surface px-4 py-3 select-none"
            >
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-accent/10 text-accent">
                <Icon size={15} strokeWidth={1.75} />
              </span>
              <span className="text-[14px] font-medium">{label}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* The new shape of the work: a loop, not a line. */}
        <div className="relative grid place-items-center">
          <svg viewBox="0 0 320 320" className="h-[320px] w-[320px]">
            <motion.circle
              cx={160}
              cy={160}
              r={R}
              fill="none"
              stroke="var(--line)"
              strokeWidth={1.5}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.1, ease: EASE_OUT, delay: 0.5 }}
            />
            {/* The travelling segment moves by dash offset rather than by rotating the
                circle: rotating an SVG shape needs a transform origin, and getting that
                wrong drags the arc off its own track. */}
            <motion.circle
              cx={160}
              cy={160}
              r={R}
              fill="none"
              stroke="var(--accent)"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeDasharray={`${TRAVELLER} ${CIRCUMFERENCE - TRAVELLER}`}
              initial={{ opacity: 0, strokeDashoffset: 0 }}
              animate={
                reduced
                  ? { opacity: 0.6, strokeDashoffset: 0 }
                  : { opacity: 1, strokeDashoffset: -CIRCUMFERENCE }
              }
              transition={{
                strokeDashoffset: { duration: 6, repeat: Infinity, ease: "linear" },
                opacity: { duration: 0.6, delay: 1.4 },
              }}
            />
          </svg>

          {LOOP.map((node, i) => {
            const angle = (i / LOOP.length) * Math.PI * 2 - Math.PI / 2;
            const on = lit === i;
            return (
              <motion.div
                key={node}
                className="absolute"
                style={{
                  left: `calc(50% + ${Math.cos(angle) * R}px)`,
                  top: `calc(50% + ${Math.sin(angle) * R}px)`,
                }}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: on ? 1.12 : 1 }}
                transition={{ opacity: { duration: 0.4, delay: 0.9 + i * 0.12 }, scale: SPRING }}
              >
                <div
                  className={`-translate-x-1/2 -translate-y-1/2 rounded-full border px-4 py-2 font-mono text-[12px] whitespace-nowrap transition-colors ${
                    on
                      ? "border-accent bg-accent text-bg"
                      : "border-line bg-surface text-fg"
                  }`}
                >
                  {node}
                </div>
              </motion.div>
            );
          })}

          <motion.div
            className="absolute text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.6, duration: 0.6 }}
          >
            <div className="font-mono text-[11px] tracking-[0.16em] text-faint uppercase">
              Learn
            </div>
            <div className="mt-0.5 text-[11px] text-faint/70">and go again</div>
          </motion.div>
        </div>
      </div>
    </SlideShell>
  );
}
