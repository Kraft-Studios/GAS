import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { SCROLL_SPRING } from "@/animations/easing";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/* ==================================================================
   Full-bleed cinematic break — the same sticky-scroll-zoom rig as the
   homepage hero and the photo mastheads (PageHeader).
   ------------------------------------------------------------------
   A tall track holds a `sticky top-0 h-screen` frame: the media sits
   static and fills the screen at rest, then pushes in as the reader
   scrolls through the track. Nothing moves until the reader scrolls —
   this is the "stand static, then zoom on scroll" treatment, not a
   parallax drift.

   Takes a video when one exists, and a still when one doesn't. The
   homepage's "SHOT BY THE COLLECTIVE" break uses public/gas-collective.mp4
   (originally "spinning m4s.mp4" — re-encoded, see PLACEHOLDERS.md for
   why). Plays on its own — autoplay, muted, loop — the same as the
   homepage hero's background video.
   ================================================================== */

type Props = {
  image: string;
  video?: string;
  caption: string;
  statement: string;
};

export function CinematicBreak({ image, video, caption, statement }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });
  const p = useSpring(scrollYProgress, SCROLL_SPRING);

  /* Static at rest, then a steady push through the track. */
  const scale = useTransform(p, [0, 1], [1, 1.45]);
  const overlay = useTransform(p, [0, 1], [0.45, 0.75]);
  const textY = useTransform(p, [0, 1], ["0%", "-16%"]);

  return (
    <div ref={trackRef} className="theme-pin-dark relative h-[170vh]">
      <section
        aria-label={caption}
        className="grain sticky top-0 h-screen w-full overflow-hidden bg-void"
      >
        <motion.div
          className="absolute inset-0"
          style={reduced ? undefined : { scale }}
        >
          {video ? (
            <video
              className="absolute inset-0 h-full w-full object-cover"
              src={video}
              poster={image}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              aria-hidden
            />
          ) : (
            <img
              src={image}
              alt=""
              aria-hidden
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}
        </motion.div>

        <motion.div
          aria-hidden
          className="absolute inset-0 bg-void"
          style={reduced ? { opacity: 0.55 } : { opacity: overlay }}
        />

        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
          style={reduced ? undefined : { y: textY }}
        >
          <p className="label mb-5">{caption}</p>
          <p className="display max-w-[15ch] text-[11vw] text-bone md:text-[6vw]">
            {statement}
          </p>
        </motion.div>
      </section>
    </div>
  );
}
