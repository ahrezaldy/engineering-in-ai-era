"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { OrbitControls } from "@react-three/drei";
import { SlideShell } from "@/components/deck/SlideShell";
import { ThreeCanvas } from "@/components/three/ThreeCanvas";
import { SceneLights } from "@/components/three/SceneKit";
import { ValueStack, type StackSelection } from "./scenes/ValueStack";
import { EASE_OUT } from "@/lib/motion";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";

const CAPABILITIES: { id: StackSelection; n: string; title: string; body: string }[] = [
  {
    id: "problem",
    n: "1",
    title: "Problem solving",
    body: "Understand what actually needs to be solved.",
  },
  {
    id: "judgment",
    n: "2",
    title: "Technical judgment",
    body: "Choose appropriate solutions and understand trade-offs.",
  },
  {
    id: "leverage",
    n: "3",
    title: "AI leverage",
    body: "Use AI to increase speed and capability.",
  },
  {
    id: "business",
    n: "4",
    title: "Business awareness",
    body: "Understand why the problem matters.",
  },
];

export function S12ValueStack() {
  const [selected, setSelected] = useState<StackSelection | null>(null);
  const reduced = useReducedMotionSafe();

  return (
    <SlideShell kicker="05 · What good looks like now" title="The new engineering value stack">
      <div className="grid h-full grid-cols-[1.25fr_0.75fr] gap-10">
        <div className="relative -my-6">
          <ThreeCanvas camera={{ position: [0, 1.4, 9.2], fov: 42 }}>
            <SceneLights />
            <ValueStack selected={selected} onSelect={setSelected} />
            <OrbitControls
              enablePan={false}
              enableZoom={false}
              autoRotate={!reduced && selected === null}
              autoRotateSpeed={0.45}
              minPolarAngle={Math.PI / 2 - 0.36}
              maxPolarAngle={Math.PI / 2 + 0.12}
              minAzimuthAngle={-0.7}
              maxAzimuthAngle={0.7}
              dampingFactor={0.06}
            />
          </ThreeCanvas>
          <p className="pointer-events-none absolute bottom-0 left-0 font-mono text-[11px] tracking-[0.16em] text-faint uppercase">
            Drag to orbit · click a pillar or the slab
          </p>
        </div>

        <ul className="flex flex-col justify-center gap-3">
          {CAPABILITIES.map((c, i) => {
            const on = selected === c.id;
            const dim = selected !== null && !on;
            return (
              <motion.li
                key={c.id}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: dim ? 0.35 : 1, x: 0 }}
                transition={{ duration: 0.55, ease: EASE_OUT, delay: 0.3 + i * 0.09 }}
                onMouseEnter={() => setSelected(c.id)}
                className={`cursor-default rounded-xl border p-4 transition-colors ${
                  on ? "border-accent bg-accent/8" : "border-line bg-surface"
                }`}
              >
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-[12px] text-accent">{c.n}</span>
                  <span className="text-[17px] font-semibold tracking-tight">{c.title}</span>
                </div>
                <AnimatePresence initial={false}>
                  <motion.p
                    key={String(on)}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-1 pl-[1.6rem] text-[13px] leading-snug text-muted"
                  >
                    {c.body}
                  </motion.p>
                </AnimatePresence>
              </motion.li>
            );
          })}

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="mt-2 border-l-2 border-accent pl-4 text-[15px] leading-snug font-medium text-balance"
          >
            Not &ldquo;how much code can I produce?&rdquo; but &ldquo;how much valuable problem
            can I solve?&rdquo;
          </motion.p>
        </ul>
      </div>
    </SlideShell>
  );
}
