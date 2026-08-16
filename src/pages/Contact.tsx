import { PageHeader } from "@/components/ui/PageHeader";
import { ContactForm } from "@/components/sections/ContactForm";

export default function Contact() {
  return (
    <>
      <PageHeader
        index="11"
        eyebrow="CONTACT"
        title="BRING US THE CAR"
        intro="Shoots, features, drives, partnerships. We read everything."
      />
      <ContactForm />
    </>
  );
}
