import { GAS } from "@/lib/constants";
import { SectionMark } from "@/components/ui/TechLabel";
import { SplitText } from "@/components/ui/SplitText";
import { Reveal } from "@/components/ui/Reveal";

/* ==================================================================
   GAS KULTURE — the merch arm.
   ------------------------------------------------------------------
   Real: the shop exists (@shopgaskulture / shopgaskulture.co.za) and
   its own bio states "WE GO LIVE IN MARCH 2026".

   PLACEHOLDER: no product imagery or pricing has been published yet,
   so this is a teaser, not a storefront. When product shots exist,
   this becomes a proper drop section. See PLACEHOLDERS.md.
   ================================================================== */

export function KultureDrop() {
  return (
    <section
      aria-labelledby="kulture-heading"
      className="relative overflow-hidden border-y border-line bg-carbon px-5 py-24 md:px-8 md:py-32"
    >
      <div className="mx-auto max-w-[1600px]">
        <SectionMark index="12" label="GAS KULTURE" className="mb-10" />

        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <SplitText
              as="h2"
              id="kulture-heading"
              text="DRIVER MEETS GARMENTS"
              className="display mb-8 max-w-[13ch] text-[12vw] text-bone md:text-[6vw]"
            />
            <p className="max-w-lg text-base leading-relaxed text-dim md:text-lg">
              Cut for people who stand around cars at six in the morning,
              not for a lookbook. Heavyweight, boxy, monochrome: the same
              rules as everything else we make.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-6">
              <a
                href={GAS.shop}
                target="_blank"
                rel="noreferrer"
                data-cursor="open"
                className="group relative overflow-hidden border border-bone px-10 py-4 font-mono text-[10px] uppercase tracking-label text-bone transition-colors duration-500 hover:text-void"
              >
                <span
                  aria-hidden
                  className="absolute inset-0 origin-bottom scale-y-0 bg-bone transition-transform duration-500 ease-expo group-hover:scale-y-100"
                />
                <span className="relative">Visit the shop ↗</span>
              </a>
              <span className="label">{GAS.shopHandle}</span>
            </div>
          </div>

          {/* ---- launch marker */}
          <div className="lg:col-span-4 lg:col-start-9">
            <Reveal>
              <div className="border border-line p-8 md:p-10">
                <p className="label mb-4">LAUNCH</p>
                <p className="display text-[14vw] leading-none text-bone md:text-[4.4vw]">
                  MAR
                  <br />
                  2026
                </p>
                <p className="mt-6 text-sm leading-relaxed text-dim">
                  First drop. Limited run, no restock: the way it should
                  be.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
