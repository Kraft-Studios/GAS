import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useHasPointer } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/* ==================================================================
   Custom cursor — desktop, fine-pointer, non-reduced-motion only.
   ------------------------------------------------------------------
   A small dot that grows into a ring over anything interactive. No
   contextual wording — the interaction itself (a link underlining, a
   button lifting) already says what will happen when it's clicked.

   The native cursor is only hidden once this component has actually
   mounted (via a class on <html>), so a touch device or a reduced-motion
   user is never left with no cursor at all.
   ================================================================== */

const INTERACTIVE_SELECTOR =
  'a, button, input, textarea, select, [role="button"], [data-cursor], [tabindex]:not([tabindex="-1"])';

export function CustomCursor() {
  const hasPointer = useHasPointer();
  const reduced = useReducedMotion();
  const enabled = hasPointer && !reduced;

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 900, damping: 42, mass: 0.28 });
  const sy = useSpring(y, { stiffness: 900, damping: 42, mass: 0.28 });

  const [active, setActive] = useState(false);
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    document.documentElement.classList.add("has-custom-cursor");

    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);

      const el = (e.target as HTMLElement | null)?.closest?.(INTERACTIVE_SELECTOR);
      setActive(Boolean(el));
    };

    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);
    /* Leaving the window should park the cursor, not freeze it mid-screen. */
    const onLeave = () => {
      x.set(-100);
      y.set(-100);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.addEventListener("pointerleave", onLeave);

    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[150] rounded-full border border-bone mix-blend-difference"
      style={{ x: sx, y: sy, translateX: "-50%", translateY: "-50%" }}
      animate={{
        width: active ? 34 : 8,
        height: active ? 34 : 8,
        backgroundColor: active ? "transparent" : "#F2F0EB",
        scale: pressed ? 0.82 : 1,
      }}
      transition={{ type: "spring", stiffness: 380, damping: 30 }}
    />
  );
}
