import { useMediaQuery } from "./useMediaQuery";

/* Framer exports its own, but the 3D scene and GSAP timelines need the
   same answer and shouldn't have to import Framer to get it. */
export function useReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
