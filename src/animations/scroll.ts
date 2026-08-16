import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

/* ==================================================================
   Vertical scroll -> horizontal panel movement.
   ------------------------------------------------------------------
   Pins the container and translates the track by exactly the overflow
   width, so the last panel lands flush with the right edge rather than
   over- or under-shooting at different viewport widths.

   Returns a cleanup function. Callers must invoke it — a leaked
   ScrollTrigger keeps measuring a detached node forever.
   ================================================================== */
export function createHorizontalScroll(
  container: HTMLElement,
  track: HTMLElement
): () => void {
  const ctx = gsap.context(() => {
    const getDistance = () => track.scrollWidth - container.offsetWidth;

    /* Nothing to do if the panels already fit — pinning here would trap
       the user in a section with no horizontal travel. */
    if (getDistance() <= 0) return;

    const tween = gsap.to(track, {
      x: () => -getDistance(),
      ease: "none",
      scrollTrigger: {
        trigger: container,
        start: "top top",
        /* Scroll distance equals horizontal distance: 1:1 feel. */
        end: () => `+=${getDistance()}`,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, container);

  return () => ctx.revert();
}
