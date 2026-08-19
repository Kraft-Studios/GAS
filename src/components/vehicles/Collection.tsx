import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { VEHICLES, type Vehicle } from "@/data/vehicles";
import { SectionMark } from "@/components/ui/TechLabel";
import { SplitText } from "@/components/ui/SplitText";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/* ==================================================================
   THE COLLECTION
   ------------------------------------------------------------------
   Editorial entries, not product cards. Each vehicle gets a full
   viewport-height band: oversized model name, a parallaxing frame, and
   the spec strip along the bottom. Alternating sides so the eye moves
   down the page in a zig-zag rather than a column.
   ================================================================== */

export function Collection() {
  return (
    <section
      aria-labelledby="collection-heading"
      className="relative bg-carbon px-5 py-24 md:px-8 md:py-32"
    >
      <div className="mx-auto max-w-[1600px]">
        <SectionMark index="02" label="THE COLLECTION" className="mb-10" />
        <SplitText
          as="h2"
          id="collection-heading"
          text="MACHINES WE'VE PUT ON FILM"
          className="display mb-4 max-w-[16ch] text-[11vw] text-bone md:text-[6vw]"
        />
        <p className="max-w-md text-sm text-muted md:text-base">
          Every one of these belongs to someone in the community. None of
          them are for sale.
        </p>
      </div>

      <div className="mt-20 md:mt-32">
        {VEHICLES.map((v, i) => (
          <VehicleEntry key={v.slug} vehicle={v} flipped={i % 2 === 1} />
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function VehicleEntry({
  vehicle,
  flipped,
}: {
  vehicle: Vehicle;
  flipped: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  /* The frame drifts slower than the page — classic parallax, kept
     subtle enough that it reads as depth rather than as an effect. */
  const imageY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  /* The oversized model name drifts the other way. */
  const nameX = useTransform(
    scrollYProgress,
    [0, 1],
    flipped ? ["6%", "-6%"] : ["-6%", "6%"]
  );

  return (
    <article
      ref={ref}
      className="relative mx-auto mb-24 max-w-[1600px] md:mb-40"
      aria-labelledby={`vehicle-${vehicle.slug}`}
    >
      <div
        className={`grid items-center gap-8 md:grid-cols-12 md:gap-12 ${
          flipped ? "md:[direction:rtl]" : ""
        }`}
      >
        {/* ---------------- frame */}
        {/* min-w-0: grid items default to min-width:auto, so the
            oversized display type below would otherwise force the track
            wider than the viewport. */}
        <div className="min-w-0 md:col-span-7 md:[direction:ltr]">
          <div className="theme-pin-dark relative aspect-[4/5] overflow-hidden bg-surface sm:aspect-[3/2]">
            <motion.img
              src={vehicle.image}
              alt={`${vehicle.make} ${vehicle.model}: shot by GAS Automotive`}
              loading="lazy"
              decoding="async"
              style={reduced ? undefined : { y: imageY }}
              className="absolute inset-0 h-[120%] w-full -translate-y-[10%] object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* chassis code, bottom-left of the frame */}
            <span className="label absolute bottom-4 left-4 text-bone/80">
              {vehicle.chassis}: {vehicle.year}
            </span>
          </div>
        </div>

        {/* ---------------- copy */}
        <div className="min-w-0 md:col-span-5 md:[direction:ltr]">
          <span className="label mb-4 block">
            {vehicle.index} / {vehicle.feature}
          </span>

          <motion.p
            style={reduced ? undefined : { x: nameX }}
            className="display mb-2 text-[10.5vw] leading-[0.82] text-bone md:text-[4.6vw]"
          >
            {vehicle.make}
            <br />
            <span className="text-bone/50">{vehicle.model}</span>
          </motion.p>

          <h3
            id={`vehicle-${vehicle.slug}`}
            className="mb-4 mt-6 font-mono text-xs uppercase tracking-label text-bone"
          >
            {vehicle.headline}
          </h3>
          <p className="max-w-md text-sm leading-relaxed text-dim">
            {vehicle.body}
          </p>

          {/* ---------------- spec strip */}
          <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-line pt-6 sm:grid-cols-4">
            {vehicle.specs.map((s) => (
              <div key={s.label}>
                <dt className="label mb-1.5">{s.label}</dt>
                <dd className="font-mono text-lg text-bone md:text-xl">
                  {s.value}
                  <span className="ml-1 text-xs text-muted">{s.unit}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </article>
  );
}
