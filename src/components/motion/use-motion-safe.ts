"use client";

import { useReducedMotion } from "framer-motion";

export function useMotionSafe() {
  const reduced = useReducedMotion();
  return {
    reduced: Boolean(reduced),
    duration: reduced ? 0 : 0.5,
    ease: [0.22, 1, 0.36, 1] as const,
  };
}
