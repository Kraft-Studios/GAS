/* ==================================================================
   GAS AUTOMOTIVE — design tokens
   ------------------------------------------------------------------
   Palette is NOT placeholder. It is derived from real brand sources:

   - The Instagram avatar (@gas.automotive_) is a pure-black square
     with the GAS wordmark in white. Black + white IS the identity.
   - The feed is golden-hour documentary photography — deep shadow,
     bright highlight. The images carry all the colour; the interface
     deliberately carries none.

   Per direction, the system is strictly monochrome. `accent` exists as
   a role so a brand colour can be introduced later in one edit, but it
   currently resolves to bone — nothing renders chromatically.
   ================================================================== */

export const BRAND = {
  /* grounds — darkest to lightest */
  void: "#000000", // the logo ground. Used for true-black cinematic moments.
  carbon: "#080808", // page background
  surface: "#101010", // raised panels
  elevated: "#181818", // cards, hover states
  line: "#242424", // hairline rules and borders

  /* type — dimmest to brightest */
  muted: "#5C5C5C", // de-emphasised technical labels
  dim: "#8A8A8A", // secondary body copy
  text: "#C9C7C2", // body copy
  bone: "#F2F0EB", // headlines — warm off-white, softer than #FFF at display sizes
  white: "#FFFFFF", // the wordmark only

  /* role slot — swap this one value to introduce a brand colour */
  accent: "#F2F0EB",
} as const;

/* Real brand facts, sourced from @gas.automotive_ and @shopgaskulture. */
export const GAS = {
  name: "GAS",
  fullName: "GAS Automotive",
  registered: "GAS ®",
  founded: 2023,
  country: "South Africa",
  countryCode: "ZA",

  /* Both taglines are theirs, verbatim. */
  tagline: "ITS GAS ITS JUST KULTURE",
  manifesto: "BURN TIRES NOT YOUR SOUL",

  instagram: "https://www.instagram.com/gas.automotive_/",
  instagramHandle: "@gas.automotive_",
  youtube: "https://youtube.com/@gas.automotive",
  youtubeHandle: "@gas.automotive",
  shop: "https://shopgaskulture.co.za",
  shopHandle: "@shopgaskulture",
  founder: "@ntsikamoyo_",

  /* PLACEHOLDER — no public email or phone was listed on any GAS profile.
     Swap these for real details before launch. See PLACEHOLDERS.md. */
  email: "hello@gasautomotive.co.za",
  phone: "+27 00 000 0000",
} as const;

/* Approximate coordinates for Johannesburg, used as a technical detail
   in the footer and section chrome. Swap if GAS is based elsewhere. */
export const COORDS = "26.2041° S / 28.0473° E";

export const NAV_LINKS = [
  { to: "/", label: "Home", index: "01" },
  { to: "/vehicles", label: "Vehicles", index: "02" },
  { to: "/builds", label: "Builds", index: "03" },
  { to: "/services", label: "Services", index: "04" },
  { to: "/about", label: "About", index: "05" },
  { to: "/contact", label: "Contact", index: "06" },
] as const;

/* Path the hero looks for first. Drop a real model here and the
   procedural stand-in is replaced with zero code changes. */
export const HERO_MODEL_PATH = "/models/gas-hero-car.glb";
