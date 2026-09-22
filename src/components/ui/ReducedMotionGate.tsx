"use client";

import { MotionConfig } from "motion/react";

/**
 * `reducedMotion="user"` makes Motion drop transform/layout animation and keep
 * opacity when the OS asks for reduced motion. Slides additionally check
 * `useReducedMotion()` to stop idle loops and 3D auto-rotation.
 */
export function ReducedMotionGate({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
