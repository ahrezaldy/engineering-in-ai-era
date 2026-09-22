"use client";

import { motion } from "motion/react";
import { useDeck } from "@/lib/deck-store";
import { EASE_OUT } from "@/lib/motion";
import { CHAPTERS } from "@/lib/deck-config";

export function ProgressBar() {
  const { index, total, goTo } = useDeck();

  return (
    <div className="group pointer-events-auto absolute inset-x-0 bottom-0 z-40 h-6">
      <div className="absolute inset-x-0 bottom-0 h-[3px] bg-line/60">
        <motion.div
          className="h-full origin-left bg-accent"
          animate={{ scaleX: index / total }}
          transition={{ duration: 0.5, ease: EASE_OUT }}
          style={{ width: "100%" }}
        />
        {/* Chapter ticks double as a seek control. */}
        {CHAPTERS.map((c) => (
          <button
            key={c.id}
            aria-label={`Jump to ${c.label}`}
            onClick={() => goTo(c.start)}
            style={{ left: `${((c.start - 1) / total) * 100}%` }}
            className="absolute -top-1 h-[11px] w-[2px] -translate-x-1/2 bg-faint/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100 hover:bg-accent"
          />
        ))}
      </div>
      <button
        aria-label="Seek"
        className="absolute inset-0 cursor-pointer"
        onClick={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          const ratio = (e.clientX - r.left) / r.width;
          goTo(Math.max(1, Math.ceil(ratio * total)));
        }}
      />
    </div>
  );
}
