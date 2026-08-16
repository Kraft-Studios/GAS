import { useEffect, useRef } from "react";
import { BUILDS } from "@/data/builds";
import { SectionMark } from "@/components/ui/TechLabel";
import { createHorizontalScroll } from "@/animations/scroll";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useIsMobile } from "@/hooks/useMediaQuery";

/* ==================================================================
   Vertical scroll drives horizontal movement.
   ------------------------------------------------------------------
   Desktop only, and only when motion is allowed. On mobile and under
   reduced-motion this degrades to a native horizontal swipe strip —
   the same content and the same reading order, just without hijacking
   the scroll. Pinning on touch devices fights native momentum and is
   the single most common way this pattern breaks.
   ================================================================== */

export function HorizontalBuilds() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();

  const pinned = !reduced && !isMobile;

  useEffect(() => {
    if (!pinned) return;
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    return createHorizontalScroll(container, track);
  }, [pinned]);

  const panels = BUILDS.map((b) => (
    <article
      key={b.id}
      className="relative flex h-full w-[86vw] shrink-0 flex-col justify-end overflow-hidden border border-line bg-surface sm:w-[62vw] lg:w-[44vw]"
      aria-labelledby={`build-${b.id}`}
    >
      <img
        src={b.image}
        alt={`${b.title.replace("\n", " ")} — GAS Automotive`}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover opacity-45"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

      <div className="relative z-10 p-6 md:p-10">
        <div className="mb-5 flex items-center justify-between">
          <span className="label">
            {b.index} / {b.kicker}
          </span>
          <span className="label">{b.date}</span>
        </div>
        <h3
          id={`build-${b.id}`}
          className="display whitespace-pre-line text-[14vw] leading-[0.82] text-bone sm:text-[9vw] lg:text-[5vw]"
        >
          {b.title}
        </h3>
        <p className="mt-5 max-w-sm text-sm leading-relaxed text-dim">{b.body}</p>
      </div>
    </article>
  ));

  return (
    <section
      aria-labelledby="builds-heading"
      className="relative overflow-hidden bg-carbon"
    >
      <div className="mx-auto max-w-[1600px] px-5 pb-12 pt-24 md:px-8 md:pt-32">
        <SectionMark index="04" label="WHAT WE RUN" className="mb-10" />
        <h2
          id="builds-heading"
          className="display max-w-[14ch] text-[11vw] text-bone md:text-[6vw]"
        >
          THE SERIES
        </h2>
      </div>

      {pinned ? (
        <div ref={containerRef} className="h-screen overflow-hidden">
          <div
            ref={trackRef}
            className="flex h-full items-stretch gap-5 px-5 py-16 will-change-transform md:gap-8 md:px-8"
          >
            {panels}
          </div>
        </div>
      ) : (
        /* Fallback: an honest, swipeable overflow strip. */
        <div
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-16 md:px-8"
          style={{ scrollbarWidth: "none" }}
        >
          {panels.map((panel, i) => (
            <div key={i} className="h-[70vh] shrink-0 snap-start">
              {panel}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
