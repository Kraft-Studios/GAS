import { NEW_PHOTOS, VEHICLE_PHOTOS } from "@/lib/gallery";

/* ------------------------------------------------------------------
   THE COLLECTION — machines GAS has put on film.
   ------------------------------------------------------------------
   GAS is a media collective, not a dealership. These are features, not
   listings: cars belonging to the community that GAS has shot.

   In sequence by model, M2 through M5. The `spec` figures are
   manufacturer-published figures for each model and are accurate as
   stated — the M4 Competition (RWD) shares its S58 drivetrain with the
   M3 Competition (RWD), so identical power/torque/0-100/top-speed
   figures between those two entries is correct, not a copy-paste
   mistake. `owner` and `feature` fields are PLACEHOLDER — replace with
   the real owners and shoot dates before launch. See PLACEHOLDERS.md.
   ------------------------------------------------------------------ */

export type Spec = {
  label: string;
  value: string;
  unit: string;
};

export type Vehicle = {
  slug: string;
  index: string;
  make: string;
  model: string;
  chassis: string;
  year: string;
  /* PLACEHOLDER — real owner handles pending. */
  owner: string;
  /* PLACEHOLDER — real shoot date pending. */
  feature: string;
  headline: string;
  body: string;
  image: string;
  specs: Spec[];
};

export const VEHICLES: Vehicle[] = [
  {
    slug: "m2-competition",
    index: "01",
    make: "BMW",
    model: "M2 Competition",
    chassis: "F87",
    year: "2019",
    owner: "Owner TBC",
    feature: "GAS DRIVE 01",
    headline: "THE LAST SMALL ONE",
    body: "Short wheelbase, long bonnet, an S55 that never asked permission. The M2 Competition is the last time BMW built something this compact and this angry: and it is still the car the meet forms a circle around.",
    /* NEW_PHOTOS.m2Garage (newM2.jpeg) — this was, for one round, on the
       M4 card by mistake. It is a real M2 photo, so this is its correct
       home. VEHICLE_PHOTOS.m2 (the original M2 photo this replaced) is
       unused here now but still lives in the gallery/archive. */
    image: NEW_PHOTOS.m2Garage,
    specs: [
      { label: "Power", value: "302", unit: "kW" },
      { label: "Torque", value: "550", unit: "Nm" },
      { label: "0–100", value: "4.2", unit: "s" },
      { label: "Top speed", value: "280", unit: "km/h" },
    ],
  },
  {
    slug: "m3-competition",
    index: "02",
    make: "BMW",
    model: "M3 Competition",
    chassis: "G80",
    year: "2023",
    owner: "Owner TBC",
    feature: "TAKEOVER",
    headline: "ARGUE WITH THE TIMES",
    body: "Everyone has an opinion about the face. Nobody has an opinion about the numbers. Shot at last light against a warehouse wall, because that is where this car actually lives.",
    image: VEHICLE_PHOTOS.m3,
    specs: [
      { label: "Power", value: "375", unit: "kW" },
      { label: "Torque", value: "650", unit: "Nm" },
      { label: "0–100", value: "3.9", unit: "s" },
      { label: "Top speed", value: "290", unit: "km/h" },
    ],
  },
  {
    slug: "m4-competition",
    index: "03",
    make: "BMW",
    model: "M4 Competition",
    chassis: "G82",
    year: "2022",
    owner: "Owner TBC",
    feature: "GAS DRIVE 02",
    headline: "THE ONE WITH SOMETHING TO PROVE",
    body: "Same S58 heart as the M3, wrapped in two doors and a grille everyone still has an opinion about. Shot in the paddock between runs: this one spends more time at the track than in front of a camera.",
    /* Reverted: this briefly showed NEW_PHOTOS.m2Garage (a real M2
       photo, wrong car). Back to the actual M4 Competition photo. */
    image: VEHICLE_PHOTOS.m4,
    specs: [
      { label: "Power", value: "375", unit: "kW" },
      { label: "Torque", value: "650", unit: "Nm" },
      { label: "0–100", value: "3.9", unit: "s" },
      { label: "Top speed", value: "290", unit: "km/h" },
    ],
  },
  {
    slug: "m5-competition",
    index: "04",
    make: "BMW",
    model: "M5 Competition",
    chassis: "F90",
    year: "2021",
    owner: "Owner TBC",
    feature: "COLD START",
    headline: "QUIET UNTIL IT ISN'T",
    body: "Four doors, a boot, and enough torque to rearrange your understanding of a sedan. The COLD START series exists because this is the sound people came for.",
    /* Was FEED.m3Wash — a blue M3 photo, the wrong car entirely; that
       was a placeholder left in by mistake, not a deliberate choice.
       NEW_PHOTOS.m5Detail (newm5.jpeg) is the real fix: an M5 CS detail
       collage, badge visible, on GAS's own plate. */
    image: NEW_PHOTOS.m5Detail,
    specs: [
      { label: "Power", value: "460", unit: "kW" },
      { label: "Torque", value: "750", unit: "Nm" },
      { label: "0–100", value: "3.3", unit: "s" },
      { label: "Top speed", value: "305", unit: "km/h" },
    ],
  },
];
