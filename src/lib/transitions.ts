import type { Variants } from "motion/react";
import { EASE_IN_OUT, EASE_OUT } from "./motion";

export type TransitionKind = "push" | "dolly";

/** `custom` carries the travel direction: 1 forward, -1 back. */
export const pushVariants: Variants = {
  enter: (d: number) => ({ opacity: 0, x: d * 64, scale: 0.985 }),
  center: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0.58, ease: EASE_OUT, delay: 0.06 },
  },
  exit: (d: number) => ({
    opacity: 0,
    x: d * -48,
    scale: 0.96,
    transition: { duration: 0.34, ease: EASE_IN_OUT },
  }),
};

/** Hero slides dolly on the z axis instead of sliding sideways. */
export const dollyVariants: Variants = {
  enter: { opacity: 0, scale: 1.08, filter: "blur(10px)" },
  center: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: EASE_OUT, delay: 0.06 },
  },
  exit: {
    opacity: 0,
    scale: 0.94,
    filter: "blur(8px)",
    transition: { duration: 0.4, ease: EASE_IN_OUT },
  },
};

export const variantsFor = (kind: TransitionKind) =>
  kind === "dolly" ? dollyVariants : pushVariants;
