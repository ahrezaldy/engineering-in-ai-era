"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Beaker,
  Bot,
  Compass,
  Gauge,
  Hammer,
  ShieldCheck,
} from "lucide-react";
import { SlideShell } from "@/components/deck/SlideShell";
import { Tilt } from "@/components/ui/Tilt";
import { Magnetic } from "@/components/ui/Magnetic";
import { EASE_OUT, SPRING } from "@/lib/motion";

const ITEMS = [
  { key: "build", Icon: Hammer, title: "Build more", detail: "More of the roadmap fits inside the same quarter." },
  { key: "experiment", Icon: Beaker, title: "Experiment more", detail: "A test that used to need a business case can now just be tried." },
  { key: "iterate", Icon: Gauge, title: "Iterate faster", detail: "Shorter loop between shipping something and learning from it." },
  { key: "automate", Icon: Bot, title: "Automate more", detail: "Repetitive engineering work stops being a permanent tax." },
  { key: "quality", Icon: ShieldCheck, title: "Improve quality", detail: "Reliability and tests stop losing the argument against features." },
  { key: "explore", Icon: Compass, title: "Explore ideas", detail: "Ideas that previously weren't worth the engineering cost." },
];

export function S08Possible() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <SlideShell
      kicker="02 · The economics"
      title="Some parts of implementation become dramatically faster"
      lede="Which means the same team can potentially do all of this."
    >
      <div className="grid h-full grid-cols-3 content-center gap-4">
        {ITEMS.map((item, i) => {
          const isOpen = open === item.key;
          return (
            <Magnetic key={item.key} strength={0.14} radius={70}>
              <Tilt max={7} lift={5}>
                <motion.button
                  layout
                  onClick={() => setOpen(isOpen ? null : item.key)}
                  initial={{ opacity: 0, y: 40, rotate: -1.5 }}
                  animate={{ opacity: 1, y: 0, rotate: 0 }}
                  transition={{
                    opacity: { duration: 0.6, ease: EASE_OUT, delay: 0.15 + i * 0.07 },
                    y: { duration: 0.7, ease: EASE_OUT, delay: 0.15 + i * 0.07 },
                    layout: SPRING,
                  }}
                  className={`flex w-full flex-col items-start gap-3 rounded-2xl border p-6 text-left transition-colors ${
                    isOpen
                      ? "border-accent bg-accent/8"
                      : "border-line bg-surface hover:border-accent/40"
                  }`}
                >
                  <motion.span
                    className="grid h-10 w-10 place-items-center rounded-xl bg-accent/10 text-accent"
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ ...SPRING, delay: 0.3 + i * 0.07 }}
                  >
                    <item.Icon size={18} strokeWidth={1.75} />
                  </motion.span>
                  <span className="text-[19px] font-semibold tracking-tight">{item.title}</span>
                  <AnimatePresence initial={false}>
                    {isOpen ? (
                      <motion.span
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.28, ease: EASE_OUT }}
                        className="overflow-hidden text-[13px] leading-snug text-muted"
                      >
                        {item.detail}
                      </motion.span>
                    ) : null}
                  </AnimatePresence>
                </motion.button>
              </Tilt>
            </Magnetic>
          );
        })}
      </div>
    </SlideShell>
  );
}
