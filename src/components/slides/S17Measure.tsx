"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { SlideShell } from "@/components/deck/SlideShell";
import { RevealText } from "@/components/ui/RevealText";
import { EASE_OUT, SPRING } from "@/lib/motion";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";

const OUTPUT = ["Story points", "Tickets completed", "Lines of code", "Number of PRs", "Hours worked"];

const OUTCOME = [
  "What problem did we solve?",
  "What outcome did we create?",
  "How quickly did we learn?",
  "What did it cost?",
  "Did quality improve?",
  "Did AI actually create leverage?",
];

type TrayId = "keep" | "drop";

/** How far outside a tray still counts as a hit — small targets need slack. */
const HIT_SLACK = 26;

export function S17Measure() {
  const reduced = useReducedMotionSafe();
  const [tray, setTray] = useState<Record<string, TrayId | null>>({});
  const [hover, setHover] = useState<string | null>(null);
  const [over, setOver] = useState<TrayId | null>(null);
  const trayEls = useRef<Record<TrayId, HTMLDivElement | null>>({ keep: null, drop: null });

  /**
   * Which tray is under this point. The previous version compared against the window
   * midpoint, but both trays live in the left-hand column, so "drop" was unreachable.
   */
  const trayAt = (x: number, y: number): TrayId | null => {
    for (const id of ["keep", "drop"] as const) {
      const el = trayEls.current[id];
      if (!el) continue;
      const r = el.getBoundingClientRect();
      if (
        x >= r.left - HIT_SLACK &&
        x <= r.right + HIT_SLACK &&
        y >= r.top - HIT_SLACK &&
        y <= r.bottom + HIT_SLACK
      ) {
        return id;
      }
    }
    return null;
  };

  return (
    <SlideShell kicker="04 · Output vs outcome" title="Measure differently">
      <div className="grid h-full grid-cols-[0.85fr_auto_1.15fr] items-center gap-10">
        {/* What we have been counting */}
        <div>
          <div className="deck-kicker mb-4 text-warn">Traditional output metrics</div>
          <div className="space-y-2">
            {OUTPUT.map((m, i) => (
              <motion.div
                key={m}
                drag={!reduced && !tray[m]}
                dragSnapToOrigin
                dragElastic={0.2}
                whileDrag={{ scale: 1.05, zIndex: 30 }}
                onDrag={(_, info) => setOver(trayAt(info.point.x, info.point.y))}
                onDragEnd={(_, info) => {
                  const target = trayAt(info.point.x, info.point.y);
                  setOver(null);
                  if (target) setTray((t) => ({ ...t, [m]: target }));
                }}
                initial={{ opacity: 0, x: -16 }}
                animate={{
                  opacity: tray[m] ? 0.25 : 1,
                  x: 0,
                }}
                transition={{
                  opacity: { duration: 0.45, ease: EASE_OUT, delay: 0.25 + i * 0.07 },
                  x: { duration: 0.45, ease: EASE_OUT, delay: 0.25 + i * 0.07 },
                }}
                className={`cursor-grab rounded-lg border border-warn/35 bg-warn/8 px-4 py-2.5 font-mono text-[13px] select-none active:cursor-grabbing ${
                  tray[m] === "drop" ? "line-through" : ""
                }`}
              >
                {m}
              </motion.div>
            ))}
          </div>

          {/* Keep / drop tray */}
          <div className="mt-6 grid grid-cols-2 gap-2">
            {(["keep", "drop"] as const).map((k) => {
              const items = Object.entries(tray).filter(([, v]) => v === k);
              const armed = over === k;
              return (
                <div
                  key={k}
                  ref={(el) => {
                    trayEls.current[k] = el;
                  }}
                  className={`min-h-[104px] rounded-lg border border-dashed p-3 transition-colors ${
                    armed
                      ? k === "keep"
                        ? "border-accent bg-accent/10"
                        : "border-warn bg-warn/10"
                      : k === "keep"
                        ? "border-accent/40"
                        : "border-warn/40"
                  }`}
                >
                  <div
                    className={`deck-kicker mb-1.5 text-[10px] ${
                      k === "keep" ? "text-accent" : "text-warn"
                    }`}
                  >
                    {k}
                  </div>
                  <AnimatePresence>
                    {items.map(([m]) => (
                      <motion.button
                        key={m}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={SPRING}
                        onClick={() => setTray((t) => ({ ...t, [m]: null }))}
                        className="mb-1 block w-full truncate rounded bg-surface-2 px-2 py-1 text-left font-mono text-[11px] text-muted"
                      >
                        {m}
                      </motion.button>
                    ))}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
          <p className="mt-3 font-mono text-[11px] tracking-[0.16em] text-faint uppercase">
            Drag a metric into keep or drop
          </p>
        </div>

        {/* The sweep between them */}
        <motion.div
          className="h-full w-px origin-top bg-line"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.6 }}
        />

        {/* What is worth asking instead */}
        <div>
          <div className="deck-kicker mb-4 text-accent">More meaningful questions</div>
          <ul className="space-y-2.5">
            {OUTCOME.map((q, i) => (
              <motion.li
                key={q}
                onMouseEnter={() => setHover(q)}
                onMouseLeave={() => setHover(null)}
                initial={{ opacity: 0, x: 18 }}
                animate={{
                  opacity: hover && hover !== q ? 0.4 : 1,
                  x: 0,
                  y: hover === q ? -2 : 0,
                }}
                transition={{
                  opacity: { duration: 0.45, ease: EASE_OUT, delay: 0.9 + i * 0.08 },
                  x: { duration: 0.45, ease: EASE_OUT, delay: 0.9 + i * 0.08 },
                  y: SPRING,
                }}
                className="relative cursor-default pl-5 text-[20px] leading-snug"
              >
                <motion.span
                  className="absolute top-1 bottom-1 left-0 w-[2px] origin-top rounded-full bg-accent"
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.35, ease: EASE_OUT, delay: 1.05 + i * 0.08 }}
                />
                {q}
              </motion.li>
            ))}
          </ul>

          <div className="mt-8">
            <RevealText
              text="Optimise for value, not volume."
              as="p"
              by="word"
              delay={1.7}
              className="text-[28px] font-medium tracking-tight text-accent"
            />
          </div>
        </div>
      </div>
    </SlideShell>
  );
}
