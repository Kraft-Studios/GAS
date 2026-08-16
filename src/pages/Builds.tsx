import { PageHeader } from "@/components/ui/PageHeader";
import { HorizontalBuilds } from "@/components/sections/HorizontalBuilds";
import { Gallery } from "@/components/gallery/Gallery";

export default function Builds() {
  return (
    <>
      <PageHeader
        index="03"
        eyebrow="WHAT WE RUN"
        title="BUILDS"
        intro="COLD START, TAKEOVER, GAS DRIVE and the people who keep showing up. These are the formats the whole thing runs on."
      />
      <HorizontalBuilds />
      <Gallery />
    </>
  );
}
