import type { Transition, Variants } from "motion/react";

export const EASE_OUT = [0.16, 1, 0.3, 1] as const;
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;

export const SPRING: Transition = { type: "spring", stiffness: 260, damping: 30, mass: 0.9 };
export const SPRING_SOFT: Transition = { type: "spring", stiffness: 140, damping: 22, mass: 1 };
export const SPRING_SNAP: Transition = { type: "spring", stiffness: 520, damping: 34, mass: 0.6 };

/**
 * Every variant below is authored at full intensity. `ReducedMotionGate` sets
 * Motion's `MotionConfig reducedMotion="user"`, which strips transforms and keeps
 * opacity, and `useMotionScale()` shortens durations. Motion is reduced, never off.
 */

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.62, ease: EASE_OUT, delay: i * 0.06 },
  }),
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: (i: number = 0) => ({
    opacity: 1,
    transition: { duration: 0.5, ease: EASE_OUT, delay: i * 0.06 },
  }),
};

export const scaleBlurIn: Variants = {
  hidden: { opacity: 0, scale: 0.9, filter: "blur(8px)" },
  show: (i: number = 0) => ({
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.62, ease: EASE_OUT, delay: i * 0.05 },
  }),
};

export const popIn: Variants = {
  hidden: { opacity: 0, scale: 0.72 },
  show: (i: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { ...SPRING, delay: i * 0.05 },
  }),
};

export const stagger = (gap = 0.06, delay = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: gap, delayChildren: delay } },
});

export const drawLine: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  show: (i: number = 0) => ({
    pathLength: 1,
    opacity: 1,
    transition: { pathLength: { duration: 0.7, ease: EASE_OUT, delay: i * 0.1 }, opacity: { duration: 0.2, delay: i * 0.1 } },
  }),
};

export const growWidth: Variants = {
  hidden: { scaleX: 0 },
  show: (i: number = 0) => ({
    scaleX: 1,
    transition: { duration: 0.65, ease: EASE_OUT, delay: i * 0.08 },
  }),
};
