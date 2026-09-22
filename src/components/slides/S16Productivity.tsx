"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { RotateCcw } from "lucide-react";
import { SlideShell } from "@/components/deck/SlideShell";
import { EASE_OUT, SPRING } from "@/lib/motion";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";

const FAILURES = [
  "Requirements were wrong",
  "Bugs increased",
  "Architecture got worse",
  "Security issues increased",
  "Maintenance got harder",
  "More time reviewing generated code",
];

export function S16Productivity() {
  const reduced = useReducedMotionSafe();
  const [landed, setLanded] = useState<string[]>(FAILURES);
  const count = useMotionValue(100);
  const rounded = useTransform(count, (v) => Math.round(v));
  const [display, setDisplay] = useState(100);
  const unsub = useRef<(() => void) | null>(null);

  useEffect(() => {
    const stop = rounded.on("change", (v) => setDisplay(v));
    unsub.current = stop;
    const controls = animate(count, 500, {
      duration: reduced ? 0.2 : 1.2,
      ease: EASE_OUT,
      delay: 0.35,
    });
    return () => {
      controls.stop();
      stop();
    };
  }, [count, rounded, reduced]);

  // Each failure still stuck to the bar eats into what the raw number claims.
  const net = Math.max(0, Math.round(100 + (400 * (FAILURES.length - landed.length)) / FAILURES.length));

  return (
    <SlideShell
      kicker="04 · Output vs outcome"
      title="AI productivity is not business productivity"
    >
      <div className="grid h-full grid-cols-[1fr_360px] items-center gap-16">
        <div>
          <div className="mb-2 flex items-baseline gap-4">
            <span className="deck-kicker">Imagine</span>
            <span className="text-[13px] text-faint">
              the source calls this a hypothetical, not a measurement
            </span>
          </div>

          <div className="flex items-end gap-4">
            <span className="font-mono text-[76px] leading-none font-semibold tracking-tight tabular-nums">
              {display}
            </span>
            <span className="pb-3 font-mono text-[15px] text-muted">lines / day</span>
          </div>

          {/* The bar that looks like a win until the failures land on it. */}
          <div className="relative mt-8 h-20 w-full max-w-[640px] rounded-xl border border-line bg-surface-2">
            <motion.div
              className="absolute inset-y-0 left-0 rounded-xl bg-warn/25"
              initial={{ width: "20%" }}
              animate={{ width: `${(display / 500) * 100}%` }}
              transition={{ duration: 0 }}
            />
            <motion.div
              className="absolute inset-y-0 left-0 rounded-xl border-2 border-accent/60 bg-accent/12"
              animate={{ width: `${(net / 500) * 100}%` }}
              transition={SPRING}
            />
            <div className="absolute inset-0 flex items-center justify-between px-5">
              <span className="font-mono text-[12px] tracking-wider text-fg uppercase">
                Net productivity
              </span>
              <motion.span key={net} className="font-mono text-[18px] tabular-nums">
                {net}
              </motion.span>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-5">
            <span className="deck-display leading-none">≠</span>
            <p className="max-w-sm text-[17px] leading-snug font-medium text-balance">
              More code is not more productivity.
            </p>
            {landed.length < FAILURES.length ? (
              <button
                onClick={() => setLanded(FAILURES)}
                className="ml-auto flex items-center gap-1.5 font-mono text-[11px] tracking-wider text-faint uppercase transition-colors hover:text-fg"
              >
                <RotateCcw size={12} /> put them back
              </button>
            ) : null}
          </div>
        </div>

        {/* The things that landed on the bar. Drag one off to see the net recover. */}
        <div>
          <div className="deck-kicker mb-4">But what if</div>
          <div className="space-y-2">
            {FAILURES.map((f, i) => {
              const on = landed.includes(f);
              return (
                <motion.div
                  key={f}
                  drag={!reduced && on}
                  dragSnapToOrigin={false}
                  dragElastic={0.3}
                  onDragEnd={(_, info) => {
                    if (Math.abs(info.offset.x) > 90 || Math.abs(info.offset.y) > 90) {
                      setLanded((l) => l.filter((x) => x !== f));
                    }
                  }}
                  initial={{ opacity: 0, y: -26 }}
                  animate={{
                    opacity: on ? 1 : 0.22,
                    y: 0,
                    x: on ? 0 : 0,
                  }}
                  transition={{
                    opacity: { duration: 0.4, ease: EASE_OUT, delay: 1.5 + i * 0.1 },
                    y: { ...SPRING, delay: 1.5 + i * 0.1 },
                  }}
                  onClick={() => setLanded((l) => (on ? l.filter((x) => x !== f) : [...l, f]))}
                  className={`cursor-grab rounded-lg border px-4 py-2.5 text-[13px] select-none active:cursor-grabbing ${
                    on ? "border-warn/40 bg-warn/10 text-fg" : "border-line bg-surface text-faint line-through"
                  }`}
                >
                  {f}
                </motion.div>
              );
            })}
          </div>
          <p className="mt-4 font-mono text-[11px] tracking-[0.16em] text-faint uppercase">
            Drag one off · or click it
          </p>
        </div>
      </div>
    </SlideShell>
  );
}
