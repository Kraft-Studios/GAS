import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { METRICS } from "@/data/services";
import { SectionMark } from "@/components/ui/TechLabel";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { smoothstep } from "@/lib/utils";

/* ==================================================================
   The numbers. Community, not horsepower — GAS is measured in people
   and footage, so counting laps or torque here would be a lie.

   Each figure is a counter inside a radial that fills to a fixed
   proportion. The radial is decorative; the number is the content, and
   it is present in the DOM at final value for assistive tech from the
   first render.
   ================================================================== */

export function Metrics() {
  return (
    <section
      aria-labelledby="metrics-heading"
      className="relative border-y border-line bg-void px-5 py-24 md:px-8 md:py-32"
    >
      <div className="mx-auto max-w-[1600px]">
        <SectionMark index="07" label="BY THE NUMBERS" className="mb-10" />
        <h2
          id="metrics-heading"
          className="display mb-16 max-w-[16ch] text-[11vw] text-bone md:mb-24 md:text-[5.6vw]"
        >
          WHAT WE'VE BUILT SO FAR
        </h2>

        <dl className="grid grid-cols-2 gap-x-6 gap-y-14 lg:grid-cols-4">
          {METRICS.map((m, i) => (
            <Counter key={m.label} {...m} delay={i * 120} />
          ))}
        </dl>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function Counter({
  label,
  value,
  suffix,
  real,
  delay,
}: {
  label: string;
  value: number;
  suffix: string;
  real: boolean;
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(reduced ? value : 0);

  useEffect(() => {
    if (!inView || reduced) return;

    let frame = 0;
    let start: number | null = null;
    const duration = 1600;

    const tick = (now: number) => {
      if (start === null) start = now + delay;
      const elapsed = now - start;

      if (elapsed < 0) {
        frame = requestAnimationFrame(tick);
        return;
      }

      const t = Math.min(elapsed / duration, 1);
      setDisplay(Math.round(value * smoothstep(t)));

      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, reduced, value, delay]);

  /* Radial geometry. */
  const R = 46;
  const CIRC = 2 * Math.PI * R;
  const progress = value === 0 ? 0 : display / value;

  return (
    <div ref={ref} className="flex flex-col items-start gap-5">
      <div className="relative h-24 w-24 md:h-28 md:w-28">
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90" aria-hidden>
          <circle cx="50" cy="50" r={R} fill="none" stroke="var(--color-line)" strokeWidth="1" />
          <circle
            cx="50"
            cy="50"
            r={R}
            fill="none"
            stroke="var(--color-bone)"
            strokeWidth="1"
            strokeDasharray={CIRC}
            strokeDashoffset={CIRC * (1 - progress)}
            style={{ transition: reduced ? "none" : "stroke-dashoffset 120ms linear" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          {/* The live counter is aria-hidden; <dd> below carries the value. */}
          <span aria-hidden className="font-mono text-xl text-bone md:text-2xl">
            {display.toLocaleString("en-ZA")}
            {suffix}
          </span>
        </div>
      </div>

      <div>
        <dt className="label mb-1">{label}</dt>
        <dd className="font-mono text-sm text-bone">
          {value.toLocaleString("en-ZA")}
          {suffix}
        </dd>
        {!real && (
          /* Honest about which figures still need confirming. */
          <p className="mt-1 font-mono text-[9px] uppercase tracking-label text-muted/60">
            Estimate
          </p>
        )}
      </div>
    </div>
  );
}
