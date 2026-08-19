import { FEED, GALLERY } from "@/lib/gallery";

/* ------------------------------------------------------------------
   WHAT WE MAKE
   ------------------------------------------------------------------
   Built from the real content pillars on the GAS Instagram — the story
   highlights are literally MEMBERS, COLD START, TAKEOVER and GAS DRIVE.
   These are the things GAS actually produces.
   ------------------------------------------------------------------ */

export type Service = {
  slug: string;
  index: string;
  title: string;
  accent: string;
  short: string;
  body: string;
  /* Frames shown behind the row on hover. */
  media: string[];
};

export const SERVICES: Service[] = [
  {
    slug: "film",
    index: "01",
    title: "FILM",
    accent: "Cinematic automotive video",
    short: "Rolling shots, static features, cold starts. Cut for the screen it will actually be watched on.",
    body: "Every car has one angle that explains it, and it is rarely the three-quarter. We shoot until we find it. Full production: treatment, shoot, grade, sound, delivered in vertical and wide so it works on the feed and on the channel.",
    media: [GALLERY[4], GALLERY[5], GALLERY[2]].filter(Boolean),
  },
  {
    slug: "photography",
    index: "02",
    title: "PHOTOGRAPHY",
    accent: "Stills that hold up printed",
    short: "Golden hour, available light, no plastic retouching. The car as it is, on the day.",
    body: "We do not shoot cars in studios. We shoot them where they get driven: warehouse yards, hillsides, the last twenty minutes of usable light. You get a full edited set, licensed for your own use, at resolution that survives a print.",
    media: [GALLERY[6], GALLERY[7], GALLERY[3]].filter(Boolean),
  },
  {
    slug: "features",
    index: "03",
    title: "FEATURES",
    accent: "The story behind the build",
    short: "Long-form on the owner, the work, the reason. Published to the channel.",
    body: "A spec sheet tells you what was fitted. A feature tells you why somebody spent four years and every spare rand doing it. This is the format the channel was built for: sit-down, walkaround, drive.",
    media: [GALLERY[8], GALLERY[9], GALLERY[10]].filter(Boolean),
  },
  {
    slug: "meets",
    index: "04",
    title: "MEETS",
    accent: "GAS DRIVE · TAKEOVER",
    short: "We organise the drive, run the takeover, and document all of it.",
    body: "GAS DRIVE and TAKEOVER are ours. Route planned, marshalled, filmed end to end, and everyone who came leaves with frames of their own car. Brands can put their name on one: talk to us.",
    media: [GALLERY[11], FEED.lineup, FEED.meetSet].filter(Boolean),
  },
  {
    slug: "garments",
    index: "05",
    title: "GARMENTS",
    accent: "GAS KULTURE",
    short: "Driver meets garments. The shop goes live March 2026.",
    body: "GAS KULTURE is the wearable half of the brand: cut for people who actually stand around cars in the cold at 6am, not for a lookbook. Heavyweight, boxy, monochrome. Launching at shopgaskulture.co.za.",
    media: [FEED.m2White, FEED.m2Rear, FEED.skidpan].filter(Boolean),
  },
];

/* Scroll-animated counters. These are the community numbers, not
   horsepower — GAS is measured in people and footage.

   PLACEHOLDER except `followers`, which is the real figure read from the
   @gas.automotive_ profile. Confirm the rest before launch. */
export const METRICS = [
  { label: "Followers", value: 4600, suffix: "+", real: true },
  { label: "Cars filmed", value: 180, suffix: "+", real: false },
  { label: "Drives hosted", value: 12, suffix: "", real: false },
  { label: "Years running", value: new Date().getFullYear() - 2023, suffix: "", real: true },
];
