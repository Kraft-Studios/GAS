import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { GAS } from "@/lib/constants";
import { FRAMES } from "@/lib/gallery";
import { SCROLL_SPRING } from "@/animations/easing";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useDevicePerformance } from "@/hooks/useDevicePerformance";
import { HeroIntro } from "./HeroIntro";

/* ==================================================================
   HERO — cinematic film header
   ------------------------------------------------------------------
   Real GAS footage (public/gas-header.mp4 — 1344x768, 10.1s, silent),
   playing on its own at ONE constant, reduced speed, on a 160vh scroll
   track with a sticky viewport. The full clip plays and loops natively —
   there is no fade to black in this footage (verified by stepping
   through it frame by frame all the way to 10.05s).

   An earlier version varied playbackRate on a timer to "hold" on two
   wheel close-ups the footage contains. It was reverted: dropped-frame
   counts via getVideoPlaybackQuality() showed decode was never actually
   struggling, but the abrupt jump between rates (0.7 down to 0.22-0.32
   with no easing) read as stutter regardless — a viewer has no way to
   tell "intentional slow motion" from "buffering" without a transition
   between the two. A single steady speed is the reliable choice; a real
   hold on those shots belongs in the edit of the source clip, not a
   runtime hack layered on top of it.

   The zoom is carried over from the reference project verbatim:

     track   160vh, sticky top-0 h-screen
     spring  stiffness 90, damping 26, mass 0.4
     scale   1 -> 1.8 across scroll progress 0 -> 0.55

   One spring drives both the push and the type, so the frame settles as
   the statement arrives rather than the two running on separate clocks.
   ================================================================== */

const HERO_VIDEO = `${import.meta.env.BASE_URL}gas-header.mp4`;

/* Playback speed. 1 is the footage's native rate. Constant for the
   entire loop — see the note above on why this replaced a variable-rate
   version. */
const PLAYBACK_RATE = 0.7;

export function Hero() {
  const trackRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();
  const perf = useDevicePerformance();
  const [videoBroken, setVideoBroken] = useState(false);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  const p = useSpring(scrollYProgress, SCROLL_SPRING);

  /* ---- the push */
  const camScale = useTransform(p, [0, 0.55], [1, 1.8]);

  /* ---- type rises in as the frame settles */
  const uiOpacity = useTransform(p, [0.2, 0.5], [0, 1]);
  const uiY = useTransform(p, [0.2, 0.55], [40, 0]);

  /* ---- the frame darkens as it pushes in */
  const shade = useTransform(p, [0, 0.55], [0.3, 0.62]);

  const useStill = reduced || perf.tier === "low" || videoBroken;

  /* Playback rate is a property, not an attribute — React cannot set it
     through JSX, and it resets whenever a new source loads, so it's
     re-applied on every loadedmetadata rather than set once. Looping
     itself is native (the `loop` attribute on the element below). */
  useEffect(() => {
    const v = videoRef.current;
    if (!v || useStill) return;

    const apply = () => {
      v.playbackRate = PLAYBACK_RATE;
    };

    apply();
    v.addEventListener("loadedmetadata", apply);

    return () => v.removeEventListener("loadedmetadata", apply);
  }, [useStill]);

  const media = useStill ? (
    <img
      src={FRAMES.heroFallback}
      alt=""
      aria-hidden
      className="absolute inset-0 h-full w-full object-cover"
    />
  ) : (
    <video
      ref={videoRef}
      className="absolute inset-0 h-full w-full object-cover"
      src={HERO_VIDEO}
      poster={FRAMES.heroFallback}
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      aria-hidden
      onError={() => setVideoBroken(true)}
    />
  );

  /* ------------------------------------------------------------------
     Reduced motion: a still frame and the statement. No film, no push.
     ------------------------------------------------------------------ */
  if (reduced) {
    return (
      <section
        className="theme-pin-dark relative h-screen w-full overflow-hidden bg-carbon"
        aria-label={GAS.fullName}
      >
        {media}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/45 via-black/15 to-black/85"
        />
        <div className="absolute inset-0 flex items-end px-5 pb-20 md:px-8">
          <h1 className="display max-w-[16ch] text-[13vw] text-bone md:text-[6.5vw]">
            {GAS.tagline}
          </h1>
        </div>
      </section>
    );
  }

  return (
    <section aria-label={GAS.fullName} className="theme-pin-dark relative">
      <HeroIntro />

      <div ref={trackRef} className="relative h-[160vh]">
        <div className="sticky top-0 h-screen w-full overflow-hidden bg-void">
          {/* ---------------- the film, pushing in */}
          <motion.div
            className="absolute inset-0 will-change-transform"
            style={{ scale: camScale }}
          >
            {media}
          </motion.div>

          {/* ---------------- grade */}
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <motion.div
              className="absolute inset-0 bg-void"
              style={{ opacity: shade }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/85" />

            {/* Nav scrim. The garage in this footage is a light grey box,
                and the bar's bone type sits directly on it — without a
                dedicated scrim the navigation fails contrast for the
                whole first screen. Local to the top strip so the frame
                itself stays bright. */}
            <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-black/85 via-black/45 to-transparent" />
          </div>

          {/* ---------------- corner chrome */}
          <div
            aria-hidden
            className="pointer-events-none absolute right-5 top-24 hidden md:block md:right-8"
          >
            <span className="label">{GAS.countryCode}</span>
          </div>

          {/* ---------------- the statement.
               This carries the <h1>: the hero has no visible wordmark,
               so the page's heading is the line that is actually on
               screen rather than a hidden one nobody sees. */}
          <motion.div
            className="pointer-events-none absolute bottom-24 left-0 right-0 px-5 md:bottom-28 md:px-8"
            style={{ opacity: uiOpacity, y: uiY }}
          >
            <p className="label mb-4">{GAS.manifesto}</p>
            <h1 className="display max-w-[16ch] text-[13vw] text-bone md:text-[6.5vw]">
              {GAS.tagline}
            </h1>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
