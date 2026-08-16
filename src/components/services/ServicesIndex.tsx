import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SERVICES } from "@/data/services";
import { SectionMark } from "@/components/ui/TechLabel";
import { SplitText } from "@/components/ui/SplitText";
import { EASE } from "@/animations/easing";
import { useHasPointer } from "@/hooks/useMediaQuery";

/* ==================================================================
   WHAT WE MAKE
   ------------------------------------------------------------------
   An index of rows, not a grid of cards. Hovering a row swaps the
   full-bleed background behind the whole section and pushes the row's
   type sideways — so the section itself changes state, rather than one
   little card lighting up.

   Touch devices get an expand-on-tap accordion instead. Hover-only
   disclosure would make the body copy unreachable on a phone.
   ================================================================== */

export function ServicesIndex() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const hasPointer = useHasPointer();

  const active = activeIndex !== null ? SERVICES[activeIndex] : null;

  return (
    <section
      aria-labelledby="services-heading"
      className="relative overflow-hidden bg-void px-5 py-24 md:px-8 md:py-32"
    >
      {/* ---------------- reactive background */}
      <AnimatePresence>
        {hasPointer && active && (
          <motion.div
            key={active.slug}
            aria-hidden
            className="pointer-events-none absolute inset-0"
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <img
              src={active.media[0]}
              alt=""
              className="h-full w-full object-cover opacity-25"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-void via-void/70 to-void" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative mx-auto max-w-[1600px]">
        <SectionMark index="05" label="SERVICES" className="mb-10" />
        <SplitText
          as="h2"
          id="services-heading"
          text="WHAT WE MAKE"
          className="display mb-16 max-w-[12ch] text-[13vw] text-bone md:mb-24 md:text-[7vw]"
        />

        <ul className="border-t border-line">
          {SERVICES.map((s, i) => {
            const isOpen = hasPointer ? activeIndex === i : openIndex === i;

            return (
              <li key={s.slug} className="border-b border-line">
                <div
                  onMouseEnter={hasPointer ? () => setActiveIndex(i) : undefined}
                  onMouseLeave={hasPointer ? () => setActiveIndex(null) : undefined}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setOpenIndex((cur) => (cur === i ? null : i))
                    }
                    aria-expanded={isOpen}
                    aria-controls={`service-panel-${s.slug}`}
                    data-cursor="explore"
                    className="group flex w-full items-baseline gap-4 py-7 text-left md:gap-10 md:py-10"
                  >
                    <span className="label w-7 shrink-0">{s.index}</span>

                    <span className="flex-1">
                      <span
                        className={`display block text-[9vw] leading-none transition-all duration-700 ease-expo md:text-[4.4vw] ${
                          isOpen
                            ? "translate-x-2 text-bone md:translate-x-4"
                            : "text-bone/45"
                        }`}
                      >
                        {s.title}
                      </span>
                      <span className="mt-2 block font-mono text-[10px] uppercase tracking-label text-muted">
                        {s.accent}
                      </span>
                    </span>

                    <span
                      aria-hidden
                      className={`shrink-0 text-lg text-muted transition-transform duration-500 ease-expo ${
                        isOpen ? "rotate-45 text-bone" : ""
                      }`}
                    >
                      +
                    </span>
                  </button>

                  <motion.div
                    id={`service-panel-${s.slug}`}
                    initial={false}
                    animate={{
                      height: isOpen ? "auto" : 0,
                      opacity: isOpen ? 1 : 0,
                    }}
                    transition={{ duration: 0.55, ease: EASE }}
                    className="overflow-hidden"
                  >
                    <div className="pb-9 pl-0 md:pl-[4.4rem]">
                      <p className="max-w-xl text-sm leading-relaxed text-dim md:text-base">
                        {s.body}
                      </p>
                      <div className="mt-6 flex gap-3 overflow-x-auto pb-1">
                        {s.media.map((src, j) => (
                          <img
                            key={`${s.slug}-${j}`}
                            src={src}
                            alt=""
                            loading="lazy"
                            decoding="async"
                            className="h-24 w-36 shrink-0 object-cover md:h-32 md:w-48"
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
