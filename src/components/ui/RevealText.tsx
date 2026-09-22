"use client";

import { motion } from "motion/react";
import { EASE_OUT } from "@/lib/motion";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";

type Props = {
  text: string;
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
  className?: string;
  /** Per-word is the default; per-character is for short display lines only. */
  by?: "word" | "char";
  delay?: number;
  stagger?: number;
  /** Extra pause inserted after the word at this index — used for spoken beats. */
  holdAfter?: number;
  holdFor?: number;
};

export function RevealText({
  text,
  as = "div",
  className,
  by = "word",
  delay = 0,
  stagger,
  holdAfter,
  holdFor = 0.7,
}: Props) {
  const reduced = useReducedMotionSafe();
  const Tag = motion[as];
  const units = by === "word" ? text.split(" ") : Array.from(text);
  const gap = stagger ?? (by === "word" ? 0.045 : 0.018);

  return (
    <Tag className={className} initial="hidden" animate="show" aria-label={text}>
      {units.map((unit, i) => {
        const extra = holdAfter !== undefined && i > holdAfter ? holdFor : 0;
        return (
          <span key={`${unit}-${i}`} className="inline-block overflow-hidden align-bottom">
            <motion.span
              aria-hidden
              className="inline-block"
              variants={{
                hidden: { y: reduced ? 0 : "105%", opacity: reduced ? 0 : 1 },
                show: {
                  y: 0,
                  opacity: 1,
                  transition: {
                    duration: reduced ? 0.3 : 0.7,
                    ease: EASE_OUT,
                    delay: delay + i * gap + extra,
                  },
                },
              }}
            >
              {unit === " " ? " " : unit}
              {by === "word" && i < units.length - 1 ? " " : null}
            </motion.span>
          </span>
        );
      })}
    </Tag>
  );
}
