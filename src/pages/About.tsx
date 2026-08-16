import { PageHeader } from "@/components/ui/PageHeader";
import { BrandStory } from "@/components/sections/BrandStory";
import { Metrics } from "@/components/sections/Metrics";
import { KultureDrop } from "@/components/sections/KultureDrop";
import { Social } from "@/components/sections/Social";

export default function About() {
  return (
    <>
      <PageHeader
        index="10"
        eyebrow="THE STORY"
        title="ABOUT"
        intro="A collective, not an agency. Started in 2023 with one camera and a group chat."
      />
      <BrandStory />
      <Metrics />
      <KultureDrop />
      <Social />
    </>
  );
}
