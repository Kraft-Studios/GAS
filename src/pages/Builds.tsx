import { PageHeader } from "@/components/ui/PageHeader";
import { BuildsArchive } from "@/components/builds/BuildsArchive";
import { PAGE_HEADER_BG } from "@/lib/gallery";

export default function Builds() {
  return (
    <>
      <PageHeader
        index="03"
        eyebrow="THE ARCHIVE"
        title="BUILDS"
        intro="Every car we have shot, in one wall: none of them for sale, all of them belonging to someone in the community. Hover a frame for what it is, tap it on a phone, or filter by type and just scroll."
        background={PAGE_HEADER_BG.builds}
        backgroundAlt="An M5 mid-drift at night, sparks off the rear wheel"
      />
      <BuildsArchive />
    </>
  );
}
