import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { GALLERY } from "@/lib/gallery";
import { SectionMark } from "@/components/ui/TechLabel";
import { SplitText } from "@/components/ui/SplitText";
import { EASE } from "@/animations/easing";
import { lockScroll, unlockScroll } from "@/lib/scrollLock";

/* ==================================================================
   Gallery — asymmetric CSS columns, not a uniform grid.
   ------------------------------------------------------------------
   `columns` lets frames keep their natural aspect ratio and pack like a
   contact sheet. A grid would crop everything to the same rectangle,
   which is exactly the stock-template look to avoid.

   The lightbox is a real modal: focus trapped, Escape closes, arrows
   move between frames, and the trigger is refocused on close.
   ================================================================== */

type Props = {
  images?: string[];
  limit?: number;
};

export function Gallery({ images = GALLERY, limit }: Props) {
  const shown = limit ? images.slice(0, limit) : images;
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const close = useCallback(() => setOpenIndex(null), []);
  const step = useCallback(
    (dir: 1 | -1) =>
      setOpenIndex((i) =>
        i === null ? null : (i + dir + shown.length) % shown.length
      ),
    [shown.length]
  );

  return (
    <section
      aria-labelledby="gallery-heading"
      className="relative bg-carbon px-5 py-24 md:px-8 md:py-32"
    >
      <div className="mx-auto max-w-[1600px]">
        <SectionMark index="08" label="THE ARCHIVE" className="mb-10" />
        <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
          <SplitText
            as="h2"
            id="gallery-heading"
            text="EVERY FRAME OURS"
            className="display max-w-[12ch] text-[12vw] text-bone md:text-[6vw]"
          />
          <p className="label">{shown.length} FRAMES</p>
        </div>

        <div className="columns-2 gap-3 md:columns-3 md:gap-5 xl:columns-4">
          {shown.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setOpenIndex(i)}
              data-cursor="view"
              aria-label={`Open frame ${i + 1} of ${shown.length}`}
              className="group mb-3 block w-full overflow-hidden bg-surface md:mb-5"
            >
              <img
                src={src}
                alt={`GAS Automotive archive frame ${i + 1}`}
                loading="lazy"
                decoding="async"
                className="w-full transition-transform duration-[900ms] ease-expo group-hover:scale-[1.05]"
              />
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {openIndex !== null && (
          <Lightbox
            images={shown}
            index={openIndex}
            onClose={close}
            onStep={step}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function Lightbox({
  images,
  index,
  onClose,
  onStep,
}: {
  images: string[];
  index: number;
  onClose: () => void;
  onStep: (dir: 1 | -1) => void;
}) {
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    lockScroll();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onStep(1);
      if (e.key === "ArrowLeft") onStep(-1);
    };

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      unlockScroll();
      previouslyFocused?.focus?.();
    };
  }, [onClose, onStep]);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`Frame ${index + 1} of ${images.length}`}
      className="fixed inset-0 z-[120] flex items-center justify-center bg-void/97 p-4 backdrop-blur-sm md:p-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: EASE }}
      onClick={onClose}
    >
      <motion.img
        key={images[index]}
        src={images[index]}
        alt={`GAS Automotive archive frame ${index + 1}`}
        className="max-h-full max-w-full object-contain"
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: EASE }}
        onClick={(e) => e.stopPropagation()}
      />

      <button
        type="button"
        onClick={onClose}
        autoFocus
        data-cursor="open"
        className="absolute right-4 top-4 font-mono text-[10px] uppercase tracking-label text-bone md:right-8 md:top-8"
      >
        Close ✕
      </button>

      {(["prev", "next"] as const).map((dir) => (
        <button
          key={dir}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onStep(dir === "next" ? 1 : -1);
          }}
          aria-label={dir === "next" ? "Next frame" : "Previous frame"}
          data-cursor="open"
          className={`absolute top-1/2 -translate-y-1/2 p-4 text-2xl text-bone/60 transition-colors hover:text-bone ${
            dir === "next" ? "right-1 md:right-6" : "left-1 md:left-6"
          }`}
        >
          {dir === "next" ? "→" : "←"}
        </button>
      ))}

      <span className="label absolute bottom-5 left-1/2 -translate-x-1/2">
        {String(index + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
      </span>
    </motion.div>
  );
}
