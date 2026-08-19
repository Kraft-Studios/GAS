import { GALLERY } from "@/lib/gallery";

/* ------------------------------------------------------------------
   THE ARCHIVE — every photo in src/gallery/, captioned.
   ------------------------------------------------------------------
   Powers the Pinterest-style masonry on the Builds page. GALLERY is an
   eager glob of the whole folder sorted by filename (see
   src/lib/gallery.ts), so index N here always corresponds to gas-{N+1}
   — that mapping is exact and stable as long as entries are appended
   here in the same order new gas-NNN files are added.

   Honesty split, matching how every other data file in this project
   handles unknowns:

   - gas-013 through gas-031 (indices 12-30) are individually confirmed
     — either matched to a real vehicle entry elsewhere on the site, or
     visually identified frame-by-frame while sourcing them. Real make,
     model and (where relevant) chassis.
   - gas-001 through gas-012 (indices 0-11) are the original Instagram
     grid pull. Real GAS photography, but no per-photo model ID was
     captured at the time — Instagram alt text doesn't name the car,
     and nothing here claims a specific model it hasn't verified. Tag
     is honest and generic rather than guessed.
   ------------------------------------------------------------------ */

export type ArchiveTag = "MEET" | "DETAIL" | "TRACK" | "NIGHT" | "SET";

export type ArchiveEntry = {
  src: string;
  /* Shown on hover/in the lightbox. Omit `model` for the unidentified
     archive frames rather than guess. */
  make?: string;
  model?: string;
  chassis?: string;
  caption: string;
  tag: ArchiveTag;
};

const CAPTIONED: Omit<ArchiveEntry, "src">[] = [
  // gas-001 .. gas-012 — original grid pull, unidentified per-photo
  { caption: "FROM THE ARCHIVE", tag: "MEET" },
  { caption: "FROM THE ARCHIVE", tag: "MEET" },
  { caption: "GOLDEN HOUR", tag: "MEET" },
  { caption: "FROM THE ARCHIVE", tag: "DETAIL" },
  { caption: "FROM THE ARCHIVE", tag: "MEET" },
  { caption: "LAST LIGHT", tag: "MEET" },
  { caption: "FROM THE ARCHIVE", tag: "DETAIL" },
  { caption: "SHOT BY THE COLLECTIVE", tag: "MEET" },
  { caption: "FROM THE ARCHIVE", tag: "MEET" },
  { caption: "FROM THE ARCHIVE", tag: "NIGHT" },
  { caption: "MADE FOR THE CULTURE", tag: "MEET" },
  { caption: "FROM THE ARCHIVE", tag: "DETAIL" },
  // gas-013 — M2 Competition (THE COLLECTION)
  { make: "BMW", model: "M2 Competition", chassis: "F87", caption: "THE LAST SMALL ONE", tag: "MEET" },
  // gas-014 — M3 Competition (THE COLLECTION)
  { make: "BMW", model: "M3 Competition", chassis: "G80", caption: "ARGUE WITH THE TIMES", tag: "MEET" },
  // gas-015 — M4 Competition, the real M4 photo (unused on its own card now)
  { make: "BMW", model: "M4 Competition", chassis: "G82", caption: "SOMETHING TO PROVE", tag: "NIGHT" },
  // gas-016 — M5 mid-drift, sparks
  { make: "BMW", model: "M5", chassis: "F90", caption: "NIGHT DRIFT", tag: "NIGHT" },
  // gas-017 — Porsche 997, gold wheels
  { make: "Porsche", model: "911 (997)", caption: "GOLD ON BLACK", tag: "MEET" },
  // gas-018 — F80 M3, wash day
  { make: "BMW", model: "M3", chassis: "F80", caption: "WASH DAY", tag: "DETAIL" },
  // gas-019 — M2 front-end detail
  { make: "BMW", model: "M2", caption: "FRONT END", tag: "DETAIL" },
  // gas-020 — G87 M2, white
  { make: "BMW", model: "M2", chassis: "G87", caption: "STOCK STANCE", tag: "MEET" },
  // gas-021 — M4 wheel + splitter
  { make: "BMW", model: "M4", caption: "WHEEL DETAIL", tag: "DETAIL" },
  // gas-022 — F80 M3, blue, side profile
  { make: "BMW", model: "M3", chassis: "F80", caption: "SIDE PROFILE", tag: "MEET" },
  // gas-023 — M2, rear + water spray
  { make: "BMW", model: "M2", caption: "RINSE", tag: "DETAIL" },
  // gas-024 — F80 M3, blue, three-quarter
  { make: "BMW", model: "M3", chassis: "F80", caption: "THREE-QUARTER", tag: "MEET" },
  // gas-025 — wet skidpan set
  { caption: "SKIDPAN", tag: "SET" },
  // gas-026 — M2s + Supra lineup
  { caption: "THE LINEUP", tag: "SET" },
  // gas-027 — meet set
  { caption: "TAKEOVER", tag: "SET" },
  // gas-028 — new M2, garage (also THE COLLECTION M4 card, see gallery.ts)
  { make: "BMW", model: "M2", caption: "GARAGE LIGHT", tag: "NIGHT" },
  // gas-029 — M5 CS detail collage
  { make: "BMW", model: "M5 CS", caption: "DETAIL WORK", tag: "DETAIL" },
  // gas-030 — Golf, GAS-branded
  { make: "Volkswagen", model: "Golf", caption: "DRIVER MEETS GARMENTS", tag: "MEET" },
  // gas-031 — meet shot, collective video poster
  { caption: "EVERY FRAME OURS", tag: "MEET" },
];

export const ARCHIVE: ArchiveEntry[] = GALLERY.map((src, i) => ({
  src,
  ...(CAPTIONED[i] ?? { caption: "FROM THE ARCHIVE", tag: "MEET" as const }),
}));
