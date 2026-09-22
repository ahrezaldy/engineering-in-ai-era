"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";

/** 3D tilt toward the cursor, with an optional lift on hover. */
export function Tilt({
  children,
  className,
  max = 8,
  lift = 6,
  perspective = 1000,
}: {
  children: React.ReactNode;
  className?: string;
  max?: number;
  lift?: number;
  perspective?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotionSafe();
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const z = useMotionValue(0);

  const cfg = { stiffness: 220, damping: 20 };
  const rx = useSpring(useTransform(py, [-0.5, 0.5], [max, -max]), cfg);
  const ry = useSpring(useTransform(px, [-0.5, 0.5], [-max, max]), cfg);
  const ty = useSpring(z, cfg);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={
        reduced
          ? undefined
          : { rotateX: rx, rotateY: ry, y: ty, transformPerspective: perspective }
      }
      onPointerMove={(e) => {
        if (reduced || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        px.set((e.clientX - r.left) / r.width - 0.5);
        py.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onPointerEnter={() => !reduced && z.set(-lift)}
      onPointerLeave={() => {
        px.set(0);
        py.set(0);
        z.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}
