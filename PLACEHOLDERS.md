# Placeholders — what to swap before launch

Everything below is either invented, estimated, or borrowed. Everything
*not* listed here was taken from real GAS sources and can be trusted.

---

## 0. RESOLVED — the Ferrari entry, replaced with a real M4

The Ferrari placeholder card from the previous pass is gone. The
`kb_the_master` (private profile) and unidentified-Ferrari sourcing
problems noted below are moot now — the request changed to using real
photos dropped directly into the project instead.

`src/data/vehicles.ts` now runs BMW-only, in model sequence:
M2 → M3 → M4 → M5.

**M2, M3 and M4 all have real, dedicated photos** — supplied as
`M2comp.PNG`, `M3Comp.PNG`, `M4comp.PNG` at the project root, processed
and saved to `src/gallery/gas-013.webp` through `gas-015.webp`, referenced
by name via `VEHICLE_PHOTOS` in `src/lib/gallery.ts` (not by fragile
`GALLERY[n]` index). Processing applied to each:

- **Re-cropped at the source.** The M2 and M4 originals are portrait
  screenshots (729×825 and 673×790) with a large dead-space margin above
  the car — a dark garage ceiling on M2, empty night sky on M4. The
  Collection frame displays at a landscape `3:2` on larger screens, and
  `object-cover` on a portrait source in a landscape frame crops
  symmetrically from the centre — which was keeping most of that dead
  space and cutting the car off at the wheels. Fixed by cropping the
  source down to where the car actually is (M2 to 729×675, M4 to
  673×550) before export, so there's no empty margin left for the
  browser's crop to prefer over the car.
- `M3Comp.PNG` had a visible Instagram carousel "next" arrow icon over
  the car's roofline. Removed by clone-stamping a patch from further
  along the same roofline (not a generic blur-over) and feathering the
  seam — confirmed invisible at normal viewing size, only detectable
  under close zoom.
- **Real super-resolution, not just upscaling.** All three were run
  through ESPCN ×4 (a pretrained single-image super-resolution network,
  via OpenCV's `dnn_superres` — `fannymonori/TF-ESPCN`), then downsampled
  to a 1400px long edge with Lanczos. Upscale-then-downsample through a
  real SR model recovers plausibly sharper edges than a plain resize can;
  a direct Lanczos-only pass was tried first and was visibly softer in a
  side-by-side crop (compared on the M2 headlight/badge detail — the SR
  pass held a crisp edge, the plain resize read as slightly smeared).
  A light autocontrast/sharpen pass followed, gentler than the first
  attempt at this — that one was too heavy on already-compressed
  screenshot material and read as harsh rather than clean.

**M5 was left untouched** — it still uses `GALLERY[4]`, one of the
original 640px Instagram exports. It's still the weakest image of the
four; drop a dedicated photo for it the same way if one becomes available
(see §1 below for exactly how the gallery module picks up new files).

The original PNGs (plus `Capture.PNG`, the Ferrari reference from the
previous pass, no longer used anywhere) are still sitting at the project
root — untouched in case they're wanted again, safe to delete otherwise.

---

## 1. Imagery — `src/gallery/`

**What's there:** 12 frames (`gas-001.jpg` … `gas-012.jpg`) pulled from the
public `@gas.automotive_` Instagram feed at 640px.

**Why it matters:** these are compressed social exports, not masters. They
look acceptable in a grid and soft in the lightbox and full-bleed breaks.

**How to swap:** drop the high-resolution originals into `src/gallery/`
using the same `gas-NNN` naming and delete the old ones.
`src/lib/gallery.ts` globs the folder, so nothing else changes.

Prefer `.webp` or `.avif` — the glob already accepts both.

The three hand-picked frames are mapped in `src/lib/gallery.ts` under
`FRAMES` (hero fallback + two editorial breaks). Re-point those if the
numbering changes.

---

## 2. Logo — `public/gas-logo.jpg`

The Instagram avatar at 150×150. Fine as a favicon, too small for
anything else. **Replace with a vector wordmark** (`public/gas-logo.svg`)
and update the `<link rel="icon">` and `og:image` in `index.html`.

The site does not render this file anywhere in the layout — the wordmark
is set in type (Archivo, `wdth 125`, `0.42em` tracking) via the
`.wordmark` class in `src/styles/index.css`. If the real logo has custom
letterforms, that class is the one place to swap in an SVG.

---

## 3. Contact details — `src/lib/constants.ts`

```ts
email: "hello@gasautomotive.co.za",   // INVENTED
phone: "+27 00 000 0000",             // INVENTED
```

No email or phone number is published on any GAS profile. **These are
guesses and will bounce.** They appear in the footer and the contact
section.

`COORDS` in the same file is set to Johannesburg — confirm the real base.

---

## 4. Vehicle entries — `src/data/vehicles.ts`

| Field | Status |
|---|---|
| `make` / `model` / `chassis` | Real models, chosen to match the cars visible in the feed |
| `specs` | **Accurate** — manufacturer-published figures for each model |
| `owner` | **PLACEHOLDER** — every entry reads "Owner TBC" |
| `feature` | **PLACEHOLDER** — series names are real, the pairing is invented |
| `headline` / `body` | Written for this site, not quoted from GAS |

The spec figures are safe to keep. The owner attributions must be
replaced or removed — attributing a stranger's car to the wrong person is
worse than leaving it blank.

---

## 5. Metrics — `src/data/services.ts`

```ts
{ label: "Followers",     value: 4600, real: true  }  // read from the profile
{ label: "Cars filmed",   value: 180,  real: false }  // ESTIMATE
{ label: "Drives hosted", value: 12,   real: false }  // ESTIMATE
{ label: "Years running", value: …,    real: true  }  // derived from 2023
```

Anything with `real: false` renders a small "Estimate" caption under the
figure. Set the true number and flip the flag to remove the caption.

---

## 6. Video

**The hero video is real and is NOT a placeholder.**
`public/gas-header.mp4` is your `Header/m4-garage-gas-fixed-v3.mp4`
(1344×768, 10.1s, silent) copied into `public/` so Vite serves it.

The original is still in `Header/` — that folder is not part of the
build and can be deleted once you're happy. If you replace the footage,
overwrite `public/gas-header.mp4` and keep the filename, or update
`HERO_VIDEO` in `src/components/hero/Hero.tsx`.

Worth knowing: at 5.7 MB it is the single largest asset on the site.
Encoding a ~1080p H.264 at a lower bitrate, plus a WebM/AV1 source, would
cut it substantially. Low-power devices and reduced-motion users are
already served the poster still instead.

**The cinematic break mid-page still has no video** and runs its
still-image treatment (scale + parallax + mask). To give it film too:

```tsx
<CinematicBreak
  image={FRAMES.editorialOne}
  video="/gas-reel.mp4"     // <- add this
  caption="EVERY FRAME OURS"
  statement="SHOT BY THE COLLECTIVE"
/>
```

---

## 7. 3D model — none ships

The hero is film. The exploration scene and the configurator render a
**procedural stand-in** — a stylised coupe built from primitives in
`src/three/VehicleModel.tsx`. It exists so the camera rig, lighting,
hotspots and configurator are genuinely live and testable.

**To swap in a real car:** put a `.glb` at

```
public/models/gas-hero-car.glb
```

`VehicleModel` runs a `HEAD` probe against that path on mount. The moment
a real file answers, it loads instead of the stand-in — **no code change
required**.

Model requirements:
- Y-up, facing **+Z**, roughly 4.5 units long
- Origin at the centre of the wheelbase, wheels resting on `y = -0.48`
  (exported as `GROUND_Y`)
- Draco-compressed if over ~5 MB

If your model's scale or orientation differs, adjust the `scale` prop and
the keyframes in `src/three/CameraRig.tsx` rather than re-exporting.

**Hotspot positions** in `src/data/vehicles.ts` are tuned to the stand-in
geometry and will need re-tuning against a real model.

---

## 8. Configurator wheel styles

`wheelStyle` in `src/three/VehicleConfigurator.tsx` records a choice but
has no visual effect — the stand-in has one wheel mesh. The UI says so
in a note under the control. Three named wheel meshes in a real GLB make
it live.

---

## 9. Social feed — `src/data/social.ts`

Renders a local placeholder set. The site **never scrapes Instagram from
the browser** — that breaks in production and violates their terms.

To connect a real feed, stand up a server-side endpoint that returns
`SocialPost[]` (the shape matches Instagram's Graph API media object) and
set:

```
VITE_SOCIAL_FEED_URL=https://your-api/instagram
```

A failed fetch silently falls back to the placeholders, so a dead feed
never takes the section down.

---

## 10. Contact backend

`src/lib/api.ts` posts to `${VITE_API_URL}/enquiries` when configured,
and otherwise resolves locally after 900ms so the loading/success states
are exercisable. Validation is real either way.

Set `VITE_API_URL` in `.env` to deliver for real.
