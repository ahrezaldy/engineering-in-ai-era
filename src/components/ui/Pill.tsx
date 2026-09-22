"use client";

import { motion } from "motion/react";
import { SPRING } from "@/lib/motion";

export function Pill({
  children,
  tone = "neutral",
  className = "",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "accent" | "warn";
  className?: string;
}) {
  const tones = {
    neutral: "border-line bg-surface-2 text-muted",
    accent: "border-accent/30 bg-accent/10 text-accent",
    warn: "border-warn/30 bg-warn/10 text-warn",
  } as const;
  return (
    <motion.span
      whileHover={{ y: -2 }}
      transition={SPRING}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[11px] tracking-wider uppercase ${tones[tone]} ${className}`}
    >
      {children}
    </motion.span>
  );
}
