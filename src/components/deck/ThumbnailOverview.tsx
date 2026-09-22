"use client";

import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { useDeck } from "@/lib/deck-store";
import { SLIDES } from "@/components/slides";
import { CHAPTERS } from "@/lib/deck-config";
import { EASE_OUT, SPRING } from "@/lib/motion";

function chapterOf(n: number) {
  return CHAPTERS.find((c) => n >= c.start && n <= c.end);
}

export function ThumbnailOverview() {
  const { overviewOpen, setOverviewOpen, index, goTo } = useDeck();

  return (
    <AnimatePresence>
      {overviewOpen ? (
        <motion.div
          className="fixed inset-0 z-[100] bg-bg/85 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28, ease: EASE_OUT }}
        >
          <div className="flex h-full flex-col px-16 py-12">
            <div className="mb-8 flex shrink-0 items-baseline justify-between">
              <div>
                <div className="deck-kicker mb-1.5">All slides</div>
                <h2 className="text-2xl font-semibold tracking-tight">
                  Jump anywhere
                  <span className="ml-3 font-mono text-sm font-normal text-faint">
                    or type a number and press Enter
                  </span>
                </h2>
              </div>
              <button
                aria-label="Close overview"
                onClick={() => setOverviewOpen(false)}
                className="glass grid h-9 w-9 place-items-center rounded-full text-muted hover:text-fg"
              >
                <X size={15} />
              </button>
            </div>

            <div className="no-scrollbar grid min-h-0 flex-1 grid-cols-5 content-start gap-4 overflow-y-auto pb-4">
              {SLIDES.map((s, i) => {
                const n = i + 1;
                const active = n === index;
                const ch = chapterOf(n);
                return (
                  <motion.button
                    key={s.id}
                    onClick={() => {
                      goTo(n);
                      setOverviewOpen(false);
                    }}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: EASE_OUT, delay: Math.min(i, 20) * 0.018 }}
                    whileHover={{ y: -4 }}
                    className={`group relative aspect-16/10 overflow-hidden rounded-lg border p-3.5 text-left transition-colors ${
                      active
                        ? "border-accent bg-accent/8"
                        : "border-line bg-surface hover:border-accent/40"
                    }`}
                  >
                    <div className="flex h-full flex-col justify-between">
                      <div>
                        <div className="font-mono text-[10px] tracking-[0.16em] text-faint">
                          {String(n).padStart(2, "0")}
                          {ch ? <span className="ml-1.5 opacity-60">{ch.index}</span> : null}
                        </div>
                        <div className="mt-2 line-clamp-3 text-[13px] leading-snug font-medium text-balance">
                          {s.title}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {s.has3d ? (
                          <span className="rounded-sm bg-accent/15 px-1.5 py-0.5 font-mono text-[9px] tracking-wider text-accent">
                            3D
                          </span>
                        ) : null}
                        {s.kind !== "content" ? (
                          <span className="rounded-sm bg-surface-2 px-1.5 py-0.5 font-mono text-[9px] tracking-wider text-faint uppercase">
                            {s.kind}
                          </span>
                        ) : null}
                      </div>
                    </div>
                    {active ? (
                      <motion.div
                        layoutId="thumb-active"
                        transition={SPRING}
                        className="pointer-events-none absolute inset-0 rounded-lg ring-2 ring-accent"
                      />
                    ) : null}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
