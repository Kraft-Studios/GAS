import { lazy } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { ServicesIndex } from "@/components/services/ServicesIndex";
import { ContactForm } from "@/components/sections/ContactForm";
import { LazySection } from "@/components/ui/LazySection";

const VehicleConfigurator = lazy(() =>
  import("@/three/VehicleConfigurator").then((m) => ({
    default: m.VehicleConfigurator,
  }))
);

export default function Services() {
  return (
    <>
      <PageHeader
        index="05"
        eyebrow="SERVICES"
        title="WHAT WE MAKE"
        intro="Film, photography, features, meets and garments. Bring us the car and tell us what it means to you."
      />
      <ServicesIndex />
      <LazySection label="LOADING CONFIGURATOR" minHeight="90vh">
        <VehicleConfigurator />
      </LazySection>
      <ContactForm />
    </>
  );
}
