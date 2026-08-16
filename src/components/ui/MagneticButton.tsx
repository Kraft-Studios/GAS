import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useHasPointer } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/* ==================================================================
   Magnetic button — the element leans toward the pointer.
   ------------------------------------------------------------------
   Used sparingly: primary CTAs only. Applied everywhere it becomes
   noise and makes the page feel unstable.

   Disabled on touch and under reduced motion, where it degrades to an
   ordinary button with no wrapper behaviour at all.
   ================================================================== */

export function MagneticButton({
  children,
  strength = 0.35,
  className = "",
}: {
  children: ReactNode;
  /* 0 = inert, 1 = the element tracks the pointer exactly. */
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const hasPointer = useHasPointer();
  const reduced = useReducedMotion();
  const enabled = hasPointer && !reduced;

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 18, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 260, damping: 18, mass: 0.5 });

  if (!enabled) return <div className={className}>{children}</div>;

  return (
    <motion.div
      ref={ref}
      className={`inline-block ${className}`}
      style={{ x: sx, y: sy }}
      onPointerMove={(e) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        /* Offset from the element's centre, scaled down. */
        x.set((e.clientX - (rect.left + rect.width / 2)) * strength);
        y.set((e.clientY - (rect.top + rect.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}
