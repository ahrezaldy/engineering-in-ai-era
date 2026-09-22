"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { EASE_OUT, SPRING } from "@/lib/motion";

export type FlowNode = {
  label: string;
  /** Shown when the node is hovered or pinned. */
  note?: string;
  tone?: "neutral" | "accent" | "warn";
};

const TONES = {
  neutral: "border-line bg-surface text-fg",
  accent: "border-accent/40 bg-accent/8 text-fg",
  warn: "border-warn/40 bg-warn/8 text-fg",
} as const;

/**
 * The source's ASCII pipelines, rendered as animated nodes and drawn connectors
 * rather than a <pre> block. Nodes stagger in, connectors draw, then a pulse runs
 * the chain. Hover focuses a node; click pins that focus for talking over.
 */
export function FlowChain({
  nodes,
  delay = 0,
  pulse = true,
  className = "",
}: {
  nodes: FlowNode[];
  delay?: number;
  pulse?: boolean;
  className?: string;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const [pinned, setPinned] = useState<number | null>(null);
  const focus = pinned ?? hover;
  const totalIn = delay + nodes.length * 0.16 + 0.4;

  return (
    <motion.div
      className={`flex flex-col items-stretch ${className}`}
      onMouseLeave={() => setHover(null)}
    >
      {nodes.map((n, i) => (
        <div key={n.label}>
          <motion.button
            onMouseEnter={() => setHover(i)}
            onClick={() => setPinned((p) => (p === i ? null : i))}
            initial={{ opacity: 0, y: 14, scale: 0.94 }}
            animate={{
              opacity: focus === null || focus === i ? 1 : 0.38,
              y: 0,
              scale: focus === i ? 1.05 : 1,
            }}
            transition={{
              opacity: { duration: 0.45, ease: EASE_OUT, delay: i * 0.16 + delay },
              y: { duration: 0.45, ease: EASE_OUT, delay: i * 0.16 + delay },
              scale: SPRING,
            }}
            className={`w-full cursor-pointer rounded-lg border px-5 py-2.5 text-center font-mono text-[13px] tracking-wide transition-colors ${
              TONES[n.tone ?? "neutral"]
            } ${pinned === i ? "ring-1 ring-accent" : ""}`}
          >
            {n.label}
          </motion.button>

          <AnimatePresence>
            {focus === i && n.note ? (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25, ease: EASE_OUT }}
                className="overflow-hidden"
              >
                <p className="px-2 pt-2 text-center text-[12px] leading-snug text-muted">
                  {n.note}
                </p>
              </motion.div>
            ) : null}
          </AnimatePresence>

          {i < nodes.length - 1 ? (
            <div className="relative mx-auto h-8 w-px">
              <motion.div
                className="absolute inset-0 origin-top bg-line"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.28, ease: EASE_OUT, delay: i * 0.16 + delay + 0.12 }}
              />
              {pulse ? (
                <motion.div
                  className="absolute inset-x-[-1px] h-3 rounded-full bg-accent"
                  initial={{ opacity: 0 }}
                  animate={{ top: ["0%", "100%"], opacity: [0, 1, 0] }}
                  transition={{
                    duration: 0.45,
                    ease: "linear",
                    delay: totalIn + i * 0.18,
                    repeat: Infinity,
                    repeatDelay: nodes.length * 0.18 + 1.6,
                  }}
                />
              ) : null}
            </div>
          ) : null}
        </div>
      ))}
    </motion.div>
  );
}
