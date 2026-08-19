import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EASE, EASE_SOFT } from "@/animations/easing";
import { GAS } from "@/lib/constants";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { lockScroll, unlockScroll } from "@/lib/scrollLock";

/* ==================================================================
   The opening sequence.
   ------------------------------------------------------------------
   Near-black. Small type states who this is, then what they believe,
   then the panel lifts away to reveal the vehicle.

   Runs once per session, not once per route change — sessionStorage
   keeps it from replaying every time someone navigates home, which is
   the thing that makes cinematic intros annoying rather than good.
   ================================================================== */

const SEEN_KEY = "gas:intro-seen";

export function HeroIntro() {
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (reduced) return;
    if (sessionStorage.getItem(SEEN_KEY)) return;

    setVisible(true);
    /* Scroll is locked for the duration so the camera move doesn't
       start behind the intro panel. */
    lockScroll();
    let released = false;
    const release = () => {
      if (released) return;
      released = true;
      unlockScroll();
    };

    const timers = [
      setTimeout(() => setStep(1), 700),
      setTimeout(() => setStep(2), 1900),
      setTimeout(() => {
        setVisible(false);
        sessionStorage.setItem(SEEN_KEY, "1");
        release();
      }, 3300),
    ];

    return () => {
      timers.forEach(clearTimeout);
      release();
    };
  }, [reduced]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="theme-pin-dark fixed inset-0 z-[100] flex flex-col items-center justify-center bg-void"
          initial={{ opacity: 1 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 1.1, ease: EASE_SOFT }}
          /* aria-hidden: this is decorative. The real <h1> is underneath
             and is what a screen reader should land on. */
          aria-hidden
        >
          <div className="flex flex-col items-center gap-5 px-6 text-center">
            <motion.p
              className="wordmark text-xs text-bone sm:text-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: step >= 0 ? 1 : 0, y: 0 }}
              transition={{ duration: 0.8, ease: EASE }}
            >
              {GAS.fullName}
            </motion.p>

            <motion.p
              className="display max-w-[16ch] text-[7vw] text-bone sm:text-[5vw] lg:text-[3.4vw]"
              initial={{ opacity: 0, y: 16 }}
              animate={step >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              transition={{ duration: 0.9, ease: EASE }}
            >
              {GAS.manifesto}
            </motion.p>

            <motion.p
              className="label"
              initial={{ opacity: 0 }}
              animate={{ opacity: step >= 2 ? 1 : 0 }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              EST. {GAS.founded}: {GAS.country.toUpperCase()}
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
