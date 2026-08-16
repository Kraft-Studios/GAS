import { lazy } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Collection } from "@/components/vehicles/Collection";
import { LazySection } from "@/components/ui/LazySection";

const DiscoverMachine = lazy(() =>
  import("@/components/vehicles/DiscoverMachine").then((m) => ({
    default: m.DiscoverMachine,
  }))
);

export default function Vehicles() {
  return (
    <>
      <PageHeader
        index="02"
        eyebrow="THE COLLECTION"
        title="VEHICLES"
        intro="Machines belonging to the community, put on film properly. None of them are for sale — that isn't what we do."
      />
      <Collection />
      <LazySection label="LOADING SCENE" minHeight="90vh">
        <DiscoverMachine />
      </LazySection>
    </>
  );
}
