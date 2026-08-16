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
  editorialOne: byName("gas-008.jpg"),
  editorialTwo: byName("gas-011.jpg"),
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
