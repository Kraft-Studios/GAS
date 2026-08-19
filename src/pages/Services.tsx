import { PageHeader } from "@/components/ui/PageHeader";
import { PAGE_HEADER_BG, PAGE_HEADER_VIDEO } from "@/lib/gallery";
import { ServicesIndex } from "@/components/services/ServicesIndex";
import { ContactForm } from "@/components/sections/ContactForm";

export default function Services() {
  return (
    <>
      <PageHeader
        index="05"
        eyebrow="SERVICES"
        title="WHAT WE MAKE"
        intro="Film, photography, features, meets and garments. Bring us the car and tell us what it means to you."
        background={PAGE_HEADER_BG.services}
        backgroundVideo={PAGE_HEADER_VIDEO.services}
        backgroundAlt="Sparks off a rear wheel at a night meet"
      />
      <ServicesIndex />
      <ContactForm />
    </>
  );
}
