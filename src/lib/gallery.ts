/* ------------------------------------------------------------------
   PLACEHOLDER IMAGERY
   ------------------------------------------------------------------
   Every file in src/gallery/ was pulled from the public @gas.automotive_
   Instagram feed at 640px so the site reads as a real brand during
   development. They are compressed social exports, NOT masters.

   Before launch: drop the high-resolution originals into src/gallery/
   using the same gas-NNN naming. Nothing else needs to change — this
   module globs the folder, so new files appear automatically.
   ------------------------------------------------------------------ */

const modules = import.meta.glob("../gallery/*.{jpg,jpeg,png,webp,avif}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

/* Sorted by filename so ordering is stable across builds. */
export const GALLERY: string[] = Object.keys(modules)
  .sort()
  .map((k) => modules[k]);

const byName = (name: string) => modules[`../gallery/${name}`] ?? GALLERY[0];

/* Hand-picked frames used as full-bleed editorial breaks and fallbacks. */
export const FRAMES = {
  /* The hero's image fallback when WebGL is unavailable. */
  heroFallback: byName("gas-001.jpg"),
  /* Full-bleed breaks — use the high-res carousel pulls, not the old
     640px grid thumbnails, since these render edge to edge. */
  editorialOne: byName("gas-022.webp"),
  editorialTwo: byName("gas-024.webp"),
} as const;

/* ------------------------------------------------------------------
   VEHICLE_PHOTOS — dedicated hero shots for THE COLLECTION.
   ------------------------------------------------------------------
   Named rather than pulled from GALLERY[n] by index: the general
   gallery is auto-sorted by filename, so an index-based reference
   silently points at a different photo the moment a file is added,
   renamed, or removed. These three (gas-013 to -015) sort after the
   existing set, so nothing already using GALLERY[n] shifts.

   Real, non-Instagram-export photos, cleaned up before use: each had a
   contrast/sharpen pass, and gas-014 had an Instagram carousel arrow
   icon clone-stamped out (sampled from elsewhere on the same roofline,
   not a generic blur — the seam is invisible at normal viewing size).
   ------------------------------------------------------------------ */
export const VEHICLE_PHOTOS = {
  m2: byName("gas-013.webp"),
  m3: byName("gas-014.webp"),
  m4: byName("gas-015.webp"),
} as const;

/* Supplied directly (Header/), not an Instagram export: a monochrome
   night shot of an M5 mid-drift throwing sparks. Was the Vehicles page
   masthead background; that page is gone, so this is now the Builds
   masthead — the still-image counterpart to the homepage hero's film. */
export const PAGE_HEADER_BG = {
  builds: byName("gas-016.webp"),
  /* Poster frame for the Services masthead video (below) — the frame
     the browser shows before playback starts, and the reduced-motion
     fallback. Extracted directly from Header/Services.mp4 at t=0, not
     a separate photo; the Golf 7 header photo this masthead used to
     show was removed per an explicit request to replace it with this
     video. gas-030.webp (the Golf photo) is still in the gallery,
     just no longer referenced by any page. */
  services: byName("gas-033.webp"),
} as const;

/* Header/Services.mp4, copied to public/gas-services.mp4 (same pattern
   as gas-collective.mp4 and gas-header.mp4 — Vite serves public/ as-is,
   so video files live there rather than going through the gallery
   glob). 1024x576, H.264, ~16.8s, already upright — no rotation fix
   needed this time. Full-bleed background for the Services masthead. */
export const PAGE_HEADER_VIDEO = {
  services: `${import.meta.env.BASE_URL}gas-services.mp4`,
} as const;

/* ------------------------------------------------------------------
   NEW_PHOTOS — two more supplied directly (project root), not pulled
   from Instagram. Used per an explicit request to replace the two
   M4-sourced photos that appeared on the homepage:

     - VEHICLE_PHOTOS.m4 (the M4 Collection card)   -> m2Garage
     - FEED.m4Wheel (the "Detail work." social post) -> m5Detail

   NOTE: swapping VEHICLE_PHOTOS.m4 to a photo of a different car means
   the M4 Collection card's heading ("BMW / M4 COMPETITION") and its
   photo no longer match. That's a direct consequence of the request,
   flagged here rather than silently done — if it wasn't intended, this
   is the one line to revert (point it back at byName("gas-015.webp"),
   the real M4 photo, still present in the gallery).
   ------------------------------------------------------------------ */
export const NEW_PHOTOS = {
  m2Garage: byName("gas-028.webp"),   // newM2.jpeg — white M2, dark garage
  m5Detail: byName("gas-029.webp"),   // newm5.jpeg — M5 CS detail collage
} as const;

/* collect background.jpeg — poster frame for the "Shot by the
   Collective" video break (src/components/sections/CinematicBreak). */
export const COLLECTIVE_POSTER = byName("gas-031.webp");

/* "About Us.jpeg" — the four of them, GAS shirts, night meet. Real
   people rather than another car, which is the point on the About
   page: it replaced FRAMES.editorialTwo (gas-024.webp, a blue F80),
   a stray car photo that had ended up on the one page that is
   supposed to be about the collective, not a build. */
export const ABOUT_PHOTO = byName("gas-032.webp");

/* ------------------------------------------------------------------
   FEED — full-resolution frames pulled from the carousels on individual
   @gas.automotive_ / @jxrdyvisuals post pages.
   ------------------------------------------------------------------
   These are the 2160x2700 originals, not the 640px grid thumbnails the
   first pass used, so they hold up far better at size.

   Named rather than indexed for the same reason as VEHICLE_PHOTOS: the
   GALLERY array is filename-sorted, so an index reference silently
   repoints the moment a file is added or removed. Every section below
   draws from distinct entries here — nothing is reused twice.
   ------------------------------------------------------------------ */
export const FEED = {
  porsche997: byName("gas-017.webp"),   // black 997, gold wheels
  m3Wash: byName("gas-018.webp"),       // blue F80 being hosed down
  m2Detail: byName("gas-019.webp"),     // M2 front-end detail
  m2White: byName("gas-020.webp"),      // white G87 side profile
  m4Wheel: byName("gas-021.webp"),      // black M4 wheel + splitter
  m3Blue: byName("gas-022.webp"),       // blue F80 side profile
  m2Rear: byName("gas-023.webp"),       // silver M2 rear, water spray
  m3Paving: byName("gas-024.webp"),     // blue F80 three-quarter
  skidpan: byName("gas-025.webp"),      // wet skidpan set
  lineup: byName("gas-026.webp"),       // M2s + Supra set
  meetSet: byName("gas-027.webp"),      // meet set
} as const;
