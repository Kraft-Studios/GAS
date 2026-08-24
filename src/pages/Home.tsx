import { Hero } from "@/components/hero/Hero";
import { Statement } from "@/components/sections/Statement";
import { Collection } from "@/components/vehicles/Collection";
import { HorizontalBuilds } from "@/components/sections/HorizontalBuilds";
import { ServicesIndex } from "@/components/services/ServicesIndex";
import { Metrics } from "@/components/sections/Metrics";
import { CinematicBreak } from "@/components/sections/CinematicBreak";
import { Gallery } from "@/components/gallery/Gallery";
import { KultureDrop } from "@/components/sections/KultureDrop";
import { Social } from "@/components/sections/Social";
import { BrandStory } from "@/components/sections/BrandStory";
import { ContactForm } from "@/components/sections/ContactForm";
import { COLLECTIVE_POSTER } from "@/lib/gallery";

/* One continuous move: film hero -> statement -> collection -> a
   full-bleed breath -> the series -> services -> numbers -> archive ->
   merch -> social -> story -> contact. Sections alternate carbon/void
   so the page reads as chapters rather than one long scroll. */
export default function Home() {
  return (
    <>
      <Hero />
      <Statement />
      <Collection />

      <CinematicBreak
        image={COLLECTIVE_POSTER}
        video={`${import.meta.env.BASE_URL}gas-collective.mp4`}
        caption="EVERY FRAME OURS"
        statement="SHOT BY GAS"
      />

      <HorizontalBuilds />
      <ServicesIndex />
      <Metrics />
      <Gallery limit={12} />
      <KultureDrop />
      <Social />
      <BrandStory />
      <ContactForm />
    </>
  );
}
