import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ARCHIVE, type ArchiveEntry, type ArchiveTag } from "@/data/archive";
import { SectionMark } from "@/components/ui/TechLabel";
import { SplitText } from "@/components/ui/SplitText";
import { EASE } from "@/animations/easing";
import { lockScroll, unlockScroll } from "@/lib/scrollLock";
import { useHasPointer } from "@/hooks/useMediaQuery";

/* ==================================================================
   BuildsArchive — the Pinterest-inspired wall for the Builds page.
   ------------------------------------------------------------------
   Every photo in src/gallery/ (see src/data/archive.ts), in a CSS
   `columns` masonry — natural aspect ratios, not a cropped grid.

   Hovering a card reveals its car info as a bottom-gradient overlay,
   the same interaction language as a Pinterest pin. On touch there is
   no hover to rely on, so the info sits permanently under each photo
   instead of behind a gesture nobody would find (`useHasPointer` makes
   the same call the custom cursor and ServicesIndex already do).
   Clicking any card opens a lightbox carrying the same info.

   Filtering by tag (MEET / DETAIL / TRACK / NIGHT / SET) does not
   remove content from the DOM — buttons just get aria-pressed, and
   filtered-out cards get `hidden`, so screen-reader and keyboard
   navigation never has to reason about a shifting card count.
   ================================================================== */

const TAGS: { value: ArchiveTag | "ALL"; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "MEET", label: "Meet" },
  { value: "DETAIL", label: "Detail" },
  { value: "TRACK", label: "Track" },
  { value: "NIGHT", label: "Night" },
  { value: "SET", label: "Sets" },
];

function label(entry: ArchiveEntry): string {
  return entry.make && entry.model ? `${entry.make} ${entry.model}` : entry.caption;
}

export function BuildsArchive() {
  const hasPointer = useHasPointer();
  const [filter, setFilter] = useState<ArchiveTag | "ALL">("ALL");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const visible = useMemo(
    () => (filter === "ALL" ? ARCHIVE : ARCHIVE.filter((e) => e.tag === filter)),
    [filter]
  );

  const close = useCallback(() => setOpenIndex(null), []);
  const step = useCallback(
    (dir: 1 | -1) =>
      setOpenIndex((i) =>
        i === null ? null : (i + dir + visible.length) % visible.length
      ),
    [visible.length]
  );

  return (
    <section
      aria-labelledby="archive-heading"
      className="relative bg-carbon px-5 py-24 md:px-8 md:py-32"
    >
      <div className="mx-auto max-w-[1600px]">
        <SectionMark index="08" label="THE ARCHIVE" className="mb-10" />
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <SplitText
            as="h2"
            id="archive-heading"
            text="EVERY FRAME OURS"
            className="display max-w-[12ch] text-[12vw] text-bone md:text-[6vw]"
          />
          <p className="label">{ARCHIVE.length} FRAMES</p>
        </div>

        {/* ---------------- tag filter */}
        <div
          role="group"
          aria-label="Filter by type"
          className="mb-10 flex flex-wrap gap-2"
        >
          {TAGS.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setFilter(t.value)}
              aria-pressed={filter === t.value}
              data-cursor="explore"
              className={`border px-4 py-2 font-mono text-[10px] uppercase tracking-label transition-colors duration-300 ${
                filter === t.value
                  ? "border-bone bg-bone text-void"
                  : "border-line text-dim hover:border-bone hover:text-bone"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ---------------- masonry wall */}
        <div className="theme-pin-dark columns-2 gap-3 sm:columns-3 md:gap-4 lg:columns-4">
          {ARCHIVE.map((entry) => {
            const shown = filter === "ALL" || entry.tag === filter;
            return (
              <PinCard
                key={entry.src}
                entry={entry}
                hidden={!shown}
                hasPointer={hasPointer}
                onOpen={() => setOpenIndex(visible.indexOf(entry))}
              />
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {openIndex !== null && (
          <ArchiveLightbox
            entries={visible}
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

function PinCard({
  entry,
  hidden,
  hasPointer,
  onOpen,
}: {
  entry: ArchiveEntry;
  hidden: boolean;
  hasPointer: boolean;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      hidden={hidden}
      onClick={onOpen}
      data-cursor="view"
      aria-label={`Open: ${label(entry)}`}
      className="group relative mb-3 block w-full overflow-hidden bg-surface md:mb-4"
    >
      <img
        src={entry.src}
        alt={label(entry)}
        loading="lazy"
        decoding="async"
        className="w-full transition-transform duration-[900ms] ease-expo group-hover:scale-[1.05]"
      />

      {/* info overlay — hover-revealed on pointer devices, always-on for touch */}
      <div
        className={`pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-3 transition-opacity duration-300 md:p-4 ${
          hasPointer
            ? "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
            : "opacity-100"
        }`}
      >
        {entry.make && entry.model ? (
          <>
            <p className="text-left text-sm font-bold text-bone">
              {entry.make} {entry.model}
            </p>
            <p className="label mt-0.5 text-left text-bone/60">
              {entry.chassis ? `${entry.chassis}: ` : ""}
              {entry.caption}
            </p>
          </>
        ) : (
          <p className="label text-left text-bone/80">{entry.caption}</p>
        )}
      </div>
    </button>
  );
}

/* ------------------------------------------------------------------ */

function ArchiveLightbox({
  entries,
  index,
  onClose,
  onStep,
}: {
  entries: ArchiveEntry[];
  index: number;
  onClose: () => void;
  onStep: (dir: 1 | -1) => void;
}) {
  const entry = entries[index];

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
      aria-label={label(entry)}
      className="theme-pin-dark fixed inset-0 z-[120] flex items-center justify-center bg-void/97 p-4 backdrop-blur-sm md:p-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: EASE }}
      onClick={onClose}
    >
      <motion.img
        key={entry.src}
        src={entry.src}
        alt={label(entry)}
        className="max-h-[80vh] max-w-full object-contain"
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: EASE }}
        onClick={(e) => e.stopPropagation()}
      />

      {/* info panel — the same data the hover overlay shows, always
          visible here since there is no hover state in a lightbox */}
      <div
        className="pointer-events-none absolute bottom-16 left-1/2 -translate-x-1/2 text-center md:bottom-20"
        onClick={(e) => e.stopPropagation()}
      >
        {entry.make && entry.model ? (
          <>
            <p className="display text-xl text-bone md:text-2xl">
              {entry.make} {entry.model}
            </p>
            <p className="label mt-2">
              {entry.chassis ? `${entry.chassis}: ` : ""}
              {entry.caption}
            </p>
          </>
        ) : (
          <p className="label">{entry.caption}</p>
        )}
      </div>

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

      <span className="label absolute top-4 left-1/2 -translate-x-1/2">
        {String(index + 1).padStart(2, "0")} / {String(entries.length).padStart(2, "0")}
      </span>
    </motion.div>
  );
}
