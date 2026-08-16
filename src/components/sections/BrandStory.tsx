import { SectionMark } from "@/components/ui/TechLabel";
import { SplitText } from "@/components/ui/SplitText";
import { Reveal } from "@/components/ui/Reveal";
import { GAS } from "@/lib/constants";
import { FRAMES } from "@/lib/gallery";

/* Short, confident, non-corporate. Three paragraphs, no mission
   statement, no "we are passionate about". */
export function BrandStory() {
  return (
    <section
      aria-labelledby="story-heading"
      className="relative bg-carbon px-5 py-24 md:px-8 md:py-32"
    >
      <div className="mx-auto grid max-w-[1600px] gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <div className="relative aspect-[3/4] overflow-hidden bg-surface">
            <img
              src={FRAMES.editorialTwo}
              alt="A GAS Automotive shoot at last light"
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <SectionMark index="10" label="THE STORY" className="mb-10" />
          <SplitText
            as="h2"
            id="story-heading"
            text="STARTED WITH ONE CAMERA."
            className="display mb-10 max-w-[14ch] text-[10vw] text-bone md:text-[4.6vw]"
          />

          <div className="flex flex-col gap-6 text-base leading-relaxed text-dim md:text-lg">
            <p>
              In {GAS.founded} a few of us kept ending up in the same car
              parks. Somebody had a camera. The footage was better than the
              cars deserved, and people started asking who shot it.
            </p>
            <Reveal delay={0.08}>
              <p>
                That is the whole origin story. No investor, no studio, no
                plan beyond making the next one better than the last. What
                grew out of it is a collective — a channel, an archive, and
                a set of drives that people plan their month around.
              </p>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="text-bone">
                We are not here to sell you a car. We are here so that the
                one you already have gets remembered properly.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.24}>
            <div className="mt-12 flex flex-wrap gap-x-12 gap-y-6 border-t border-line pt-8">
              <div>
                <p className="label mb-1.5">FOUNDED</p>
                <p className="font-mono text-lg text-bone">{GAS.founded}</p>
              </div>
              <div>
                <p className="label mb-1.5">BASED</p>
                <p className="font-mono text-lg text-bone">{GAS.country}</p>
              </div>
              <div>
                <p className="label mb-1.5">FOUNDER</p>
                <p className="font-mono text-lg text-bone">{GAS.founder}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
