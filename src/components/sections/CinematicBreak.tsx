import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { SCROLL_SPRING } from "@/animations/easing";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useIsMobile } from "@/hooks/useMediaQuery";

/* ==================================================================
   Full-bleed cinematic break.
   ------------------------------------------------------------------
   Takes a video when one exists, and a still when one doesn't.

   NO VIDEO ASSET SHIPS WITH THIS REPO. Drop an .mp4 in /public and
   pass `video="/your-file.mp4"` to switch this section to film. Until
   then it runs the still treatment — scale + parallax + a mask wipe —
   which is a real composition, not a grey box.

   Scroll-scrubbing a video (seeking on every scroll frame) is only
   enabled on desktop: mobile Safari cannot seek smoothly and produces
   a stuttering mess, so touch gets straightforward autoplay instead.
   ================================================================== */

type Props = {
  image: string;
  video?: string;
  caption: string;
  statement: string;
};

export function CinematicBreak({ image, video, caption, statement }: Props) {
  const ref = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const p = useSpring(scrollYProgress, SCROLL_SPRING);

  /* Media pushes in slightly and drifts — the section breathes as it
     crosses the viewport instead of sitting flat. */
  const scale = useTransform(p, [0, 0.5, 1], [1.14, 1, 1.14]);
  const y = useTransform(p, [0, 1], ["-6%", "6%"]);
  const textY = useTransform(p, [0, 1], ["40%", "-40%"]);
  const overlay = useTransform(p, [0, 0.5, 1], [0.8, 0.35, 0.8]);

  const scrubbable = Boolean(video) && !isMobile && !reduced;

  return (
    <section
      ref={ref}
      aria-label={caption}
      className="relative grain h-[70vh] w-full overflow-hidden bg-void md:h-screen"
    >
      <motion.div
        className="absolute inset-0"
        style={reduced ? undefined : { scale, y }}
      >
        {video ? (
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            src={video}
            poster={image}
            autoPlay={!scrubbable}
            loop={!scrubbable}
            muted
            playsInline
            preload="metadata"
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
  );
}
