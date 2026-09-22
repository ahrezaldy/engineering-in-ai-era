"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

/**
 * `useReducedMotion()` reads a media query the server cannot know about, so using it
 * directly to choose *initial* styles, `drag` props or transforms makes the first client
 * render disagree with the SSR output and React reports a hydration mismatch.
 *
 * This reports `false` until after mount — matching what the server rendered — and the
 * real value from then on. Motion's own `MotionConfig reducedMotion="user"` still reduces
 * the animations themselves; this only governs what is rendered on the very first pass.
 */
export function useReducedMotionSafe(): boolean {
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  return mounted ? Boolean(reduced) : false;
}
