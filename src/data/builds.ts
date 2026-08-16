import { GALLERY } from "@/lib/gallery";

/* ------------------------------------------------------------------
   Panels for the horizontal-scroll section. Vertical scroll drives
   these sideways via GSAP ScrollTrigger.

   Named after the real GAS story highlights.
   ------------------------------------------------------------------ */

export type Build = {
  id: string;
  index: string;
  kicker: string;
  title: string;
  body: string;
  image: string;
  /* PLACEHOLDER — real dates pending. */
  date: string;
};

export const BUILDS: Build[] = [
  {
    id: "cold-start",
    index: "01",
    kicker: "SERIES",
    title: "COLD\nSTART",
    body: "Six in the morning, single microphone, no music over the top. The first turn of the key is the whole video. It is the most watched thing we make and it took the least equipment.",
    image: GALLERY[4] ?? "",
    date: "ONGOING",
  },
  {
    id: "takeover",
    index: "02",
    kicker: "EVENT",
    title: "TAKE\nOVER",
    body: "One location, one evening, however many cars fit. No entry fee, no trophies, no judging. Park it, open it, talk to somebody about theirs.",
    image: GALLERY[7] ?? "",
    date: "QUARTERLY",
  },
  {
    id: "gas-drive",
    index: "03",
    kicker: "EVENT",
    title: "GAS\nDRIVE",
    body: "A route, a convoy and three camera cars. Two editions run so far. The point is the road between the stops, which is the part nobody films properly.",
    image: GALLERY[10] ?? "",
    date: "01 & 02",
  },
  {
    id: "members",
    index: "04",
    kicker: "COMMUNITY",
    title: "MEM\nBERS",
    body: "The people whose cars keep showing up. Not a paid tier and not a club with rules — just the names we call first when something is being planned.",
    image: GALLERY[0] ?? "",
    date: "BY INVITE",
  },
];
