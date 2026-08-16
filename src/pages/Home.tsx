import { lazy } from "react";
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
import { LazySection } from "@/components/ui/LazySection";
import { FRAMES } from "@/lib/gallery";

/* The hero is film, so nothing above the fold needs Three.js. Splitting
   the two 3D sections out keeps the ~342 KB (gzipped) three chunk off
   the initial load entirely — it now arrives only once the reader is
   scrolling toward a section that actually uses it. */
const DiscoverMachine = lazy(() =>
  import("@/components/vehicles/DiscoverMachine").then((m) => ({
    default: m.DiscoverMachine,
  }))
);
const VehicleConfigurator = lazy(() =>
  import("@/three/VehicleConfigurator").then((m) => ({
    default: m.VehicleConfigurator,
  }))
);

/* One continuous move: film hero -> statement -> collection -> a
   full-bleed breath -> hands-on 3D -> the series -> services ->
   configurator -> numbers -> archive -> merch -> social -> story ->
   contact. Sections alternate carbon/void so the page reads as
   chapters rather than one long scroll. */
export default function Home() {
  return (
    <>
      <Hero />
      <Statement />
      <Collection />

      <CinematicBreak
        image={FRAMES.editorialOne}
        caption="EVERY FRAME OURS"
        statement="SHOT BY THE COLLECTIVE"
      />

      <LazySection label="LOADING SCENE" minHeight="90vh">
        <DiscoverMachine />
      </LazySection>

      <HorizontalBuilds />
      <ServicesIndex />

      <LazySection label="LOADING CONFIGURATOR" minHeight="90vh">
        <VehicleConfigurator />
      </LazySection>

      <Metrics />
      <Gallery limit={12} />
      <KultureDrop />
      <Social />
      <BrandStory />
      <ContactForm />
    </>
  );
}
