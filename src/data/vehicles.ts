import { GALLERY, VEHICLE_PHOTOS } from "@/lib/gallery";

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
    body: "Short wheelbase, long bonnet, an S55 that never asked permission. The M2 Competition is the last time BMW built something this compact and this angry — and it is still the car the meet forms a circle around.",
    image: VEHICLE_PHOTOS.m2,
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
    body: "Same S58 heart as the M3, wrapped in two doors and a grille everyone still has an opinion about. Shot in the paddock between runs — this one spends more time at the track than in front of a camera.",
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
    image: GALLERY[4] ?? "",
    specs: [
      { label: "Power", value: "460", unit: "kW" },
      { label: "Torque", value: "750", unit: "Nm" },
      { label: "0–100", value: "3.3", unit: "s" },
      { label: "Top speed", value: "305", unit: "km/h" },
    ],
  },
];

/* Hotspots for the interactive exploration scene. Positions are in the
   model's local space — they travel with whatever GLB is loaded. */
export type Hotspot = {
  id: string;
  title: string;
  spec: string;
  /* [x, y, z] in model space. */
  position: [number, number, number];
  /* Where the camera parks when this hotspot is opened. */
  camera: [number, number, number];
};

export const HOTSPOTS: Hotspot[] = [
  {
    id: "front",
    title: "FRONT SPLITTER",
    spec: "CARBON — HAND-LAID — TRACK PROFILE",
    position: [0, -0.2, 2.55],
    camera: [1.9, 0.45, 4.9],
  },
  {
    id: "wheels",
    title: "FORGED WHEELS",
    spec: '19" — LIGHTWEIGHT ALLOY — PRECISION MACHINED',
    position: [1.06, -0.02, 1.45],
    camera: [3.4, 0.15, 2.5],
  },
  {
    id: "brakes",
    title: "BRAKE PACKAGE",
    spec: "6-PISTON — 380MM — TWO-PIECE FLOATING",
    position: [1.06, -0.02, -1.45],
    camera: [3.3, 0.0, -2.2],
  },
  {
    id: "exhaust",
    title: "TITANIUM EXHAUST",
    spec: "VALVED — QUAD EXIT — 4.1KG SAVED",
    position: [0.52, -0.28, -2.5],
    camera: [1.7, 0.25, -4.9],
  },
  {
    id: "interior",
    title: "INTERIOR",
    spec: "FIXED-BACK SHELLS — ALCANTARA — HALF CAGE",
    position: [0, 0.62, -0.3],
    camera: [2.6, 1.7, 1.9],
  },
];
