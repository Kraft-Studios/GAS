import { SplitText } from "@/components/ui/SplitText";
import { SectionMark } from "@/components/ui/TechLabel";
import { Reveal } from "@/components/ui/Reveal";
import { GAS } from "@/lib/constants";

/* The first thing after the hero: state plainly who this is. */
export function Statement() {
  return (
    <section
      aria-labelledby="statement-heading"
      className="relative bg-carbon px-5 py-24 md:px-8 md:py-40"
    >
      <div className="mx-auto max-w-[1600px]">
        <SectionMark index="01" label="WHO WE ARE" className="mb-12 md:mb-20" />

        <SplitText
          as="h2"
          id="statement-heading"
          text="WE DON'T SELL CARS. WE FILM THE PEOPLE WHO LOVE THEM."
          className="display max-w-[18ch] text-[10vw] text-bone md:text-[6.4vw]"
          stagger={0.05}
        />

        <div className="mt-14 grid gap-10 md:mt-24 md:grid-cols-12">
          <div className="md:col-span-5 md:col-start-7">
            <p className="text-base leading-relaxed text-dim md:text-lg">
              {GAS.fullName} started in {GAS.founded} with one camera and a
              group chat. It is now a collective — film, photography,
              features and the drives that bring everyone together.
            </p>
            <Reveal delay={0.1}>
              <p className="mt-6 text-base leading-relaxed text-dim md:text-lg">
                Bring your car. We will make it look like what it means to
                you.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
