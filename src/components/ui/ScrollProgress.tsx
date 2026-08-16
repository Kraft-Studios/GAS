import { motion, useScroll, useSpring } from "framer-motion";
import { SCROLL_SPRING } from "@/animations/easing";

/* A one-pixel rule across the top. Deliberately the least decorated
   thing on the page — it is a readout, not a feature. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, SCROLL_SPRING);

  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-[80] h-px origin-left bg-bone/70"
      style={{ scaleX }}
    />
  );
}
