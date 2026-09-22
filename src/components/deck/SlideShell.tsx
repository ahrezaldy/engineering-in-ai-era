"use client";

import { motion } from "motion/react";
import { EASE_OUT } from "@/lib/motion";

type Props = {
  kicker?: string;
  title?: string;
  /** Rendered under the title; keep to one short line. */
  lede?: React.ReactNode;
  children: React.ReactNode;
  /** Hero slides drop the header grid and take the full canvas. */
  bleed?: boolean;
  className?: string;
};

/**
 * Common frame for every slide: consistent gutters, a kicker/title block with its own
 * entrance, and a content area that each slide composes freely.
 */
export function SlideShell({ kicker, title, lede, children, bleed = false, className = "" }: Props) {
  if (bleed) {
    return <div className={`relative h-full w-full ${className}`}>{children}</div>;
  }

  return (
    <div className={`flex h-full w-full flex-col px-20 pt-16 pb-24 ${className}`}>
      {(kicker || title) && (
        <header className="mb-8 shrink-0">
          {kicker ? (
            <motion.div
              className="deck-kicker mb-3"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: EASE_OUT }}
            >
              {kicker}
            </motion.div>
          ) : null}
          {title ? (
            <motion.h2
              className="deck-title max-w-5xl text-balance"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: EASE_OUT, delay: 0.06 }}
            >
              {title}
            </motion.h2>
          ) : null}
          {lede ? (
            <motion.div
              className="deck-body mt-4 max-w-3xl"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.16 }}
            >
              {lede}
            </motion.div>
          ) : null}
        </header>
      )}
      <div className="relative min-h-0 flex-1">{children}</div>
    </div>
  );
}
