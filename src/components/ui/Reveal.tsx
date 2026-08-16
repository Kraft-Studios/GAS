import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { EASE } from "@/animations/easing";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/* Fade-and-rise on scroll into view. The workhorse. */
export function Reveal({
  children,
  delay = 0,
  y = 26,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ y, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ delay, duration: 0.85, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
