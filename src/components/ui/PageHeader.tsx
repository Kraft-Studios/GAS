import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { SplitText } from "./SplitText";
import { SectionMark } from "./TechLabel";
import { SCROLL_SPRING } from "@/animations/easing";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/* ==================================================================
   Shared masthead for the secondary routes, so they read as part of one
   site rather than several different designs.

   With `background` (or `backgroundVideo`) set it becomes a full-bleed
   masthead, built on the same sticky-scroll-zoom rig as the homepage
   hero and the "SHOT BY THE COLLECTIVE" break: a tall track holds a
   `sticky top-0 h-screen` frame, so the media sits static and fills
   the screen at rest, then pushes in as the reader scrolls through the
   track — the same pattern used across the site, not a one-off.

   `backgroundVideo`, when set, wins over `background` — the video
   plays (autoplay, muted, loop, same as every other background film on
   the site) with `background` as its poster frame and reduced-motion
   fallback, always at object-cover (there is no "never crop" mode for
   video the way there is for a still — a poster-frame-safe crop is
   chosen per source instead).

   For a still image, three ways to fit the source into the frame,
   chosen per page:

     "cover" (default) — edge to edge, centred, the same true fill the
       homepage hero and the Services video use. No letterboxing.

     "contain" — a blurred, scaled-up backdrop fills the frame for
       atmosphere, and the real image sits on top at object-contain,
       guaranteed never cropped. Only worth it for a source where losing
       any edge would lose something the reader needs — most photos
       don't need this, "cover" is the one that actually matches the
       rest of the site.

     "bottom" — a single object-cover layer anchored to the bottom
       edge, a deliberate crop rather than a safety net. Right when a
       photo carries detail specifically in its lower half that should
       fill the screen (the Services masthead's Golf, where the number
       plate and exhaust are the point, not the roofline above them).

   Title/eyebrow/intro stay hidden at rest and rise in only once the
   reader scrolls — the same curve as the homepage hero's statement
   (opacity 0→1 and a 40px rise across p 0.2→0.5/0.55) — rather than
   sitting fully visible on load. A masthead that greets you with
   everything already on screen reads as a static page; this one reads
   as the same cinematic system as the hero.

   Pinned to the dark cinematic palette regardless of the site's
   light/dark theme (see .theme-pin-dark in styles/index.css) — this is
   real photography with a scrim built for light text, the same as the
   hero and every other full-bleed film moment on the site, and it
   should not flip to a light scrim with dark text just because the
   reader toggled the page chrome.
   ================================================================== */

export function PageHeader({
  index,
  eyebrow,
  title,
  intro,
  background,
  backgroundVideo,
  backgroundAlt,
  backgroundFit = "cover",
}: {
  index: string;
  eyebrow: string;
  title: string;
  intro?: string;
  /* Full-bleed background image. Omit for the plain carbon masthead. */
  background?: string;
  /* Full-bleed background video. Takes priority over `background`,
     which then serves as its poster frame / reduced-motion fallback. */
  backgroundVideo?: string;
  backgroundAlt?: string;
  backgroundFit?: "cover" | "contain" | "bottom";
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });
  const p = useSpring(scrollYProgress, SCROLL_SPRING);

  /* Static at rest, then a slow push as the track scrolls — the same
     shape as the hero's dive, just gentler: this is a masthead the
     reader scrolls past, not a section that holds them. */
  const scale = useTransform(p, [0, 1], [1, 1.5]);
  const shade = useTransform(p, [0, 1], [0.4, 0.78]);

  /* Hidden at rest, rises in on scroll — the exact curve the homepage
     hero uses for its statement (uiOpacity/uiY in Hero.tsx), so a
     masthead reads as the same system instead of just dumping its
     title on screen the instant the page loads. */
  const textOpacity = useTransform(p, [0.2, 0.5], [0, 1]);
  const textY = useTransform(p, [0.2, 0.55], [40, 0]);

  if (!background && !backgroundVideo) {
    return (
      <header className="relative bg-carbon px-5 pb-16 pt-32 md:px-8 md:pb-24 md:pt-48">
        <div className="mx-auto max-w-[1600px]">
          <SectionMark index={index} label={eyebrow} className="mb-10" />
          <SplitText
            as="h1"
            text={title}
            className="display max-w-[14ch] text-[14vw] text-bone md:text-[8vw]"
          />
          {intro && (
            <p className="mt-8 max-w-lg text-base leading-relaxed text-dim md:text-lg">
              {intro}
            </p>
          )}
        </div>
      </header>
    );
  }

  return (
    <div ref={trackRef} className="theme-pin-dark relative h-[170vh]">
      <header className="sticky top-0 flex h-screen items-end overflow-hidden bg-void px-5 pb-16 pt-40 md:px-8 md:pb-24 md:pt-48">
        {/* ---------------- the frame, pushing in */}
        <motion.div
          className="absolute inset-0 will-change-transform"
          style={reduced ? undefined : { scale }}
        >
          {backgroundVideo && !reduced ? (
            <video
              className="absolute inset-0 h-full w-full object-cover"
              src={backgroundVideo}
              poster={background}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              aria-hidden={backgroundAlt ? undefined : true}
            />
          ) : backgroundVideo ? (
            /* Reduced motion: the poster frame, static, no video request. */
            <img
              src={background}
              alt={backgroundAlt ?? ""}
              aria-hidden={backgroundAlt ? undefined : true}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : backgroundFit === "bottom" ? (
            <img
              src={background}
              alt={backgroundAlt ?? ""}
              aria-hidden={backgroundAlt ? undefined : true}
              className="absolute inset-0 h-full w-full object-cover object-bottom"
            />
          ) : backgroundFit === "cover" ? (
            <img
              src={background}
              alt={backgroundAlt ?? ""}
              aria-hidden={backgroundAlt ? undefined : true}
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
          ) : (
            <>
              {/* atmosphere fill — blurred, cropped freely, purely
                  decorative so cropping it loses nothing the reader
                  needs to see */}
              <img
                src={background}
                alt=""
                aria-hidden
                className="absolute inset-0 h-full w-full scale-110 object-cover opacity-70 blur-2xl"
              />
              {/* the real photo — never cropped, so every part of it,
                  including anything specific placed near an edge,
                  survives */}
              <img
                src={background}
                alt={backgroundAlt ?? ""}
                aria-hidden={backgroundAlt ? undefined : true}
                className="absolute inset-0 h-full w-full object-contain"
              />
            </>
          )}
        </motion.div>

        {/* ---------------- grade */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <motion.div
            className="absolute inset-0 bg-void"
            style={reduced ? { opacity: 0.55 } : { opacity: shade }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/90" />
          {/* keeps the nav bar legible over any frame */}
          <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-black/85 via-black/45 to-transparent" />
        </div>

        {/* ---------------- type */}
        <motion.div
          className="relative mx-auto w-full max-w-[1600px]"
          style={reduced ? undefined : { y: textY, opacity: textOpacity }}
        >
          <SectionMark index={index} label={eyebrow} className="mb-10" />
          <SplitText
            as="h1"
            text={title}
            className="display max-w-[14ch] text-[14vw] text-bone md:text-[8vw]"
          />
          {intro && (
            <p className="mt-8 max-w-lg text-base leading-relaxed text-dim md:text-lg">
              {intro}
            </p>
          )}
        </motion.div>
      </header>
    </div>
  );
}
