import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { EASE_SOFT } from "@/animations/easing";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/* ==================================================================
   Full-screen mask transition.
   ------------------------------------------------------------------
   A panel wipes up over the outgoing page and away from the incoming
   one, so routes never hard-cut. The page content also lifts slightly,
   which sells the panel as passing in front of it rather than the two
   being unrelated.

   Framer owns this rather than GSAP because it is driven by React's
   mount/unmount lifecycle through AnimatePresence — that is Framer's
   job, and doing it in GSAP would mean manually tracking exit states.
   ================================================================== */

export function PageTransition({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();

  if (reduced) return <>{children}</>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: EASE_SOFT }}
    >
      {/* the mask */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[90] origin-bottom bg-void"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        exit={{ scaleY: 1, originY: 0 }}
        transition={{ duration: 0.75, ease: EASE_SOFT }}
      />
      {children}
    </motion.div>
  );
}
