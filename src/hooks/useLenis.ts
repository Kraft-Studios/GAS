import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "./useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

/* Lenis owns scrolling for the whole app. It must drive ScrollTrigger's
   ticker rather than run alongside it, otherwise pinned sections drift a
   frame behind the content and the horizontal builds section tears. */
export function useLenis() {
  const lenisRef = useRef<Lenis | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    /* Reduced motion gets native scrolling — smoothing is itself motion. */
    if (reduced) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
      /* Touch smoothing fights native momentum and feels broken on iOS. */
      syncTouch: false,
      touchMultiplier: 1.6,
    });
    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const onTick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(onTick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reduced]);

  return lenisRef;
}
