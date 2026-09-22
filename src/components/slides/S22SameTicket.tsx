"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronRight, RotateCcw, Ticket } from "lucide-react";
import { SlideShell } from "@/components/deck/SlideShell";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { SPRING } from "@/lib/motion";

const A = [
  "Read ticket",
  "Ask AI to generate endpoint",
  "Copy code",
  "Add tests",
  "Open PR",
];

const B = [
  "Understand why the API is needed",
  'Clarify what "available" means',
  "Check existing data sources",
  "Identify performance implications",
  "Ask AI to explore possible implementations",
  "Compare approaches",
  "Implement",
  "Validate edge cases",
  "Measure performance",
  "Consider future consumers",
];

// Every badge is one of Approach B's steps that Approach A skipped.
const CONSEQUENCES: { at: number; label: string }[] = [
  { at: 6, label: 'What "available" means was never clarified' },
  { at: 7, label: "Existing data sources not checked" },
  { at: 8, label: "Performance implications unknown" },
  { at: 9, label: "Edge cases unvalidated" },
  { at: 10, label: "Future consumers unconsidered" },
];

/** Height is reserved whether or not any badges are showing, so nothing jumps. */
const CONSEQUENCE_STRIP = "mt-2 mb-2 flex h-[46px] flex-wrap content-start gap-1.5 overflow-hidden";

const CODE_A = `// generated, merged, done
app.get("/rooms/available", async (req, res) => {
  const rooms = await db.room.findMany({
    where: { status: "available" },
  });
  res.json(rooms);
});`;

const CODE_B = `// after asking what "available" means
app.get("/rooms/available", async (req, res) => {
  // availability is a range, not a flag
  const { from, to, propertyId } = parseRange(req.query);
  const rooms = await roomAvailability.search({ propertyId, from, to });
  res.json(rooms);
});`;

export function S22SameTicket() {
  const [step, setStep] = useState(0);
  const maxStep = B.length;
  const done = step >= maxStep;

  return (
    <SlideShell
      kicker="06 · What we do about it"
      title="Same ticket, different engineer"
      className="pt-12 pb-16"
    >
      <div className="flex h-full flex-col gap-3">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...SPRING, delay: 0.15 }}
          className="mx-auto flex w-fit items-center gap-3 rounded-xl border border-line bg-surface px-5 py-3"
        >
          <Ticket size={16} className="text-accent" />
          <span className="font-mono text-[14px]">
            &ldquo;Add an API to return available rooms.&rdquo;
          </span>
        </motion.div>

        {/* Controls sit directly under the ticket rather than at the foot of the slide:
            at shorter viewports the code blocks used to crowd them, and the primary
            button turns into reset at the end instead of going dead. */}
        <div className="flex shrink-0 flex-wrap items-center justify-center gap-x-5 gap-y-2">
          <motion.button
            onClick={() => (done ? setStep(0) : setStep((s) => Math.min(s + 1, maxStep)))}
            whileTap={{ scale: 0.96 }}
            whileHover={{ y: -1 }}
            transition={SPRING}
            className="flex items-center gap-2 rounded-lg border border-accent/40 bg-accent/10 px-5 py-2.5 font-mono text-[12px] tracking-wider text-accent uppercase"
          >
            {done ? (
              <>
                <RotateCcw size={13} /> start over
              </>
            ) : (
              <>
                advance both <ChevronRight size={14} />
              </>
            )}
          </motion.button>

          {!done ? (
            <button
              onClick={() => setStep(0)}
              className="flex items-center gap-1.5 font-mono text-[11px] tracking-wider text-faint uppercase transition-colors hover:text-fg"
            >
              <RotateCcw size={12} /> reset
            </button>
          ) : null}

          <span className="font-mono text-[12px] text-faint tabular-nums">
            step {String(step).padStart(2, "0")} / {maxStep}
          </span>

          <p className="w-full text-center text-[14px] font-medium text-balance">
            Both engineers use AI. The difference is how they think{" "}
            <span className="text-accent">before and after</span> the code is generated.
          </p>
        </div>

        {/* One grid for both lanes rather than two independent columns: shared rows mean
            the headers, step lists, consequence strips and code blocks line up by
            construction, however many badges lane A has collected. */}
        <div className="grid min-h-0 flex-1 grid-cols-2 grid-rows-[auto_auto_auto_minmax(0,1fr)] gap-x-8">
          <div className="deck-kicker mb-3 text-warn">Approach A · implementation focused</div>
          <div className="deck-kicker mb-3 text-accent">Approach B · engineering focused</div>

          <ol className="space-y-0.5">
            {A.map((s, i) => (
              <motion.li
                key={s}
                animate={{ opacity: step > i ? 1 : 0.5, x: step > i ? 0 : -6 }}
                transition={SPRING}
                className="flex items-baseline gap-3 text-[14px]"
              >
                <span className="font-mono text-[11px] text-faint tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{s}</span>
              </motion.li>
            ))}
          </ol>

          <ol className="grid grid-cols-2 gap-x-6 gap-y-0.5">
            {B.map((s, i) => (
              <motion.li
                key={s}
                animate={{ opacity: step > i ? 1 : 0.5, x: step > i ? 0 : -6 }}
                transition={SPRING}
                className="flex items-baseline gap-2.5 text-[14px] leading-snug"
              >
                <span className="font-mono text-[11px] text-faint tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{s}</span>
              </motion.li>
            ))}
          </ol>

          {/* Badges wrap inside a reserved strip instead of stacking, so nothing below
              them moves as they accumulate. */}
          <div className={CONSEQUENCE_STRIP}>
            <AnimatePresence>
              {CONSEQUENCES.filter((c) => step >= c.at).map((c) => (
                <motion.span
                  key={c.label}
                  initial={{ opacity: 0, y: -6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={SPRING}
                  className="h-fit rounded-md border border-warn/40 bg-warn/10 px-2.5 py-1 text-[11px] leading-tight text-warn"
                >
                  {c.label}
                </motion.span>
              ))}
            </AnimatePresence>
          </div>
          <div className={CONSEQUENCE_STRIP} aria-hidden />

          <motion.div
            className="no-scrollbar min-h-0 overflow-y-auto"
            animate={{ opacity: step >= A.length ? 1 : 0.5 }}
            transition={{ duration: 0.4 }}
          >
            <CodeBlock code={CODE_A} lang="ts" caption="rooms.ts" startDelay={0.1} />
          </motion.div>

          <motion.div
            className="no-scrollbar min-h-0 overflow-y-auto"
            animate={{ opacity: step >= B.length ? 1 : 0.5 }}
            transition={{ duration: 0.4 }}
          >
            <CodeBlock code={CODE_B} lang="ts" caption="rooms.ts" startDelay={0.1} />
          </motion.div>
        </div>


      </div>
    </SlideShell>
  );
}
