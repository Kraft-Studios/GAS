import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { GAS } from "@/lib/constants";
import { FRAMES } from "@/lib/gallery";
import { EASE_SOFT } from "@/animations/easing";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { lockScroll, unlockScroll } from "@/lib/scrollLock";

/* ==================================================================
   Loading screen.
   ------------------------------------------------------------------
   Progress is real, not a fake timer. It tracks the three things that
   actually gate the first frame of the hero:

     1. webfonts       — the display type IS the design; reflowing from
                         fallback metrics looks broken
     2. the poster     — what shows before the video has any frames
     3. video metadata — enough to start playback

   Deliberately NOT wired to three.js. The hero is film now, so the 3D
   chunk is code-split and arrives later; importing drei's useProgress
   here would pull ~342 KB (gzipped) of Three back into the initial
   bundle purely to display a number.

   The graceful-fallback requirement is the important part: no asset may
   hold the page hostage. A hard ceiling dismisses the screen regardless
   of what is still in flight.
   ================================================================== */

const MAX_WAIT_MS = 4000;
const HERO_VIDEO = "/gas-header.mp4";

type Step = { key: string; done: boolean };

export function LoadingScreen() {
  const reduced = useReducedMotion();
  const [steps, setSteps] = useState<Step[]>([
    { key: "fonts", done: false },
    { key: "poster", done: false },
    { key: "film", done: false },
  ]);
  const [current, setCurrent] = useState("");
  const [expired, setExpired] = useState(false);
  const [done, setDone] = useState(false);

  const complete = (key: string) =>
    setSteps((s) => s.map((x) => (x.key === key ? { ...x, done: true } : x)));

  useEffect(() => {
    let cancelled = false;
    const guard = (fn: () => void) => () => {
      if (!cancelled) fn();
    };

    /* ---- fonts */
    setCurrent("archivo");
    if (typeof document !== "undefined" && "fonts" in document) {
      document.fonts.ready.then(guard(() => complete("fonts")));
    } else {
      complete("fonts");
    }

    /* ---- poster frame */
    const img = new Image();
    img.src = FRAMES.heroFallback;
    /* decode() resolves only once the bitmap is ready to paint, which
       is the thing that actually matters here. */
    const posterDone = guard(() => {
      complete("poster");
      setCurrent("gas-header.mp4");
    });
    if (img.decode) img.decode().then(posterDone).catch(posterDone);
    else {
      img.onload = posterDone;
      img.onerror = posterDone;
    }

    /* ---- video metadata. Skipped under reduced motion, where the hero
       renders the still and never requests the file. */
    if (reduced) {
      complete("film");
    } else {
      const v = document.createElement("video");
      v.preload = "metadata";
      v.muted = true;
      const filmDone = guard(() => complete("film"));
      v.onloadedmetadata = filmDone;
      v.onerror = filmDone;
      v.src = HERO_VIDEO;
    }

    return () => {
      cancelled = true;
    };
  }, [reduced]);

  /* The ceiling. */
  useEffect(() => {
    const t = setTimeout(() => setExpired(true), MAX_WAIT_MS);
    return () => clearTimeout(t);
  }, []);

  const ready = steps.every((s) => s.done);

  useEffect(() => {
    if (done) return;
    if (ready || expired) {
      /* Brief hold so the bar visibly completes rather than snapping. */
      const t = setTimeout(() => setDone(true), reduced ? 0 : 380);
      return () => clearTimeout(t);
    }
  }, [ready, expired, done, reduced]);

  useEffect(() => {
    if (done) return;
    lockScroll();
    return unlockScroll;
  }, [done]);

  const settled = steps.filter((s) => s.done).length;
  const shown = expired ? 100 : Math.round((settled / steps.length) * 100);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-void"
          initial={{ opacity: 1 }}
          exit={reduced ? { opacity: 0 } : { y: "-100%" }}
          transition={{ duration: reduced ? 0.3 : 1, ease: EASE_SOFT }}
          role="status"
          aria-live="polite"
          aria-label={`Loading, ${shown} percent`}
        >
          <p className="wordmark mb-10 text-sm text-bone md:text-base">
            {GAS.name}
          </p>

          <div className="relative h-px w-48 overflow-hidden bg-line md:w-72">
            <motion.div
              className="absolute inset-y-0 left-0 bg-bone"
              animate={{ width: `${shown}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>

          <p className="label mt-5">{String(shown).padStart(3, "0")}</p>
          <p className="label mt-2 max-w-[70vw] truncate text-muted/50">
            {ready ? GAS.tagline : current}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
