# Placeholders — what to swap before launch

Everything below is either invented, estimated, or borrowed. Everything
*not* listed here was taken from real GAS sources and can be trusted.

---

## -2. This round: corrected a mismatch, fixed a dead video path, fixed a systemic crop bug

**M2/M4/M5 Collection cards, corrected.** The previous round put the new
M2 photo on the M4 card by mistake, and had left the M5 card pointing at
a leftover placeholder (`FEED.m3Wash` — a blue M3 photo, wrong car
entirely). Fixed:

- M2 card → `NEW_PHOTOS.m2Garage` (`newM2.jpeg`) — a real M2 photo, moved
  to its correct card.
- M4 card → `VEHICLE_PHOTOS.m4` (`gas-015.webp`) — the real M4
  Competition photo, restored.
- M5 card → `NEW_PHOTOS.m5Detail` (`newm5.jpeg`, the M5 CS detail
  collage) — this was also on a "Detail work." social post; that post
  was pointed at `FEED.m4Wheel` instead so the same photo does not
  appear twice on the homepage.
- `VEHICLE_PHOTOS.m2` (the original M2 photo the new one replaced) is
  now unused but still in the gallery/archive.

**The "SHOT BY THE COLLECTIVE" video was never actually playing.** Not a
sourcing problem — the file was correctly wired, rotated, and encoded.
The bug was in `CinematicBreak.tsx`: an earlier version tried to make
desktop playback scroll-scrubbed (autoplay/loop switched off to make
room for it) but never actually implemented the scrub — nothing ever
set `video.currentTime`. The video sat on frame one, forever, on every
desktop viewport, which is indistinguishable from a still image. Fixed
by removing the incomplete scrub path entirely; it now just autoplays
and loops, confirmed live (`paused: false`, `currentTime` advancing).

**Systemic crop bug in `PageHeader`'s background image, fixed at the
component level.** `PageHeader` is short and very wide (min-height
68–78vh against the full viewport width — an aspect around 2:1 on an
ordinary laptop, wider on ultrawide). Every background supplied so far
has been a portrait phone photo. `object-cover` on a portrait source
inside a 2:1+ frame crops to roughly the middle 40% of the image height.
Measured directly against the Golf 7 photo: that band kept only the VW
badge and taillights, and **cropped away both the windshield "GAS" decal
and the numberplate "GAS" branding entirely** — confirmed by rendering
the exact crop the browser produces before touching any code.

The processed image itself was never the problem — `gas-030.webp` holds
both text elements crisp and legible at full resolution. The fix is in
`PageHeader.tsx`, not the image: two stacked layers, a blurred
scaled-up copy filling the frame for atmosphere, and the real photo on
top at `object-contain` — guaranteed never cropped, on any viewport
width, from now on. This is a shared component, so it also improves the
Vehicles page's M5 masthead, which had the identical crop risk (just
less noticeable, since a car mid-drift tolerates a centre-crop better
than two widely-separated text elements do).

**Not resolved — needs your input, not a guess:** the Golf 7 header was
described as being on the "Builds" page. It is actually on the
**Services** page (`src/pages/Services.tsx`) — Builds has no background
image at all, plain masthead. This isn't a typo I could silently
correct in either direction: moving it to Builds would remove it from
Services, and I don't know which one was intended, or whether both
were. Left both pages exactly as they were structurally; only the image
processing and the `PageHeader` crop fix apply to wherever it ends up.

---

## -1. Two image swaps, a re-encoded video, a Golf header, and the Builds redesign

**M4 Collection card -> new M2 photo.** Per explicit request. `NEW_PHOTOS.m2Garage`
(`newM2.jpeg` -> `gas-028.webp`) now sits on the card headed "BMW / M4
COMPETITION" -- the heading and the photo no longer match the same car.
Flagged clearly in code (`src/lib/gallery.ts`, the `NEW_PHOTOS` comment)
and here: if that mismatch was not intended, point
`src/data/vehicles.ts`'s M4 entry back at `VEHICLE_PHOTOS.m4`
(`gas-015.webp`, the real M4 Competition photo -- still in the gallery,
just unused right now).

**"Detail work." social post -> new M5 CS collage.** `NEW_PHOTOS.m5Detail`
(`newm5.jpeg` -> `gas-029.webp`). This one is a clean fit, not a
mismatch -- the photo is a macro/detail collage (badge, stitching,
spoiler, mirror) and the post's caption already said "Detail work."

**"SHOT BY THE COLLECTIVE" background -> spinning m4s.mp4, re-encoded.**
The supplied file was genuinely stored on its side -- confirmed two
ways: raw OpenCV frame reads showed the car sideways, and so did a real
`<video>` element in the actual browser, which rules out a rotation
metadata flag (browsers honor those; this file has none, or has one
that is not being read the same way anywhere). A CSS `transform: rotate()`
hack was considered and rejected -- reproducing `object-cover`'s
give-any-container-the-right-crop behavior through a manual rotate+scale
is fragile across the breakpoint range this project tests, whereas a
correctly-oriented source file makes the existing `object-cover` pattern
just work, same as every other video on the site.

Fixed properly: no local ffmpeg existed, so a static Windows build was
fetched (`BtbN/FFmpeg-Builds`, the GPL variant -- the LGPL one ships
without libx264, which is the encoder actually needed). Rotated with
`-vf transpose=2` (90 deg counter-clockwise -- verified against a test
frame before committing to it) and re-encoded to H.264/yuv420p/faststart,
matching how `gas-header.mp4` (the homepage hero) is already encoded.
Result: `public/gas-collective.mp4`, 1024x576, 6.1 MB, upright, confirmed
playing in the actual browser before this was called done.

**Services page header -> Golf 7 photo.** `PAGE_HEADER_BG.services`
(`Header/Golf 7.jpeg` -> `gas-030.webp`), using the same `PageHeader`
`background` prop the Vehicles page masthead already added -- no new
component needed.

**Builds page -> Pinterest-style masonry.** Full rewrite of that route
only; the Home page's own horizontal-scroll "WHAT WE RUN" section and
its own smaller `<Gallery>` were left untouched -- the request named
"the Builds page" specifically. New files: `src/data/archive.ts` (every
photo in `src/gallery/`, captioned) and
`src/components/builds/BuildsArchive.tsx` (masonry + tag filter +
hover-reveal info + lightbox).

Per "pull all the pictures from the Instagram page": all 31 files
currently in `src/gallery/` are included, which covers every photo
sourced from Instagram across this project (27 of the 31 -- the
directly-supplied M5 drift shot, Golf 7, and the two new photos this
round make up the other 4). Re-scraping Instagram again for this
specific request was not attempted -- the profile grid is login-walled
now (see the note on this further down), and the existing set already
represents everything reachable from it.

Per-photo identification is split honestly, matching how this project
already handles unknowns elsewhere: **19 of 31** photos carry a real,
confirmed make/model (everything from `gas-013` on, individually
identified while sourcing them across this and the previous session).
The original 12-photo Instagram grid pull (`gas-001` .. `gas-012`) never
had per-photo model IDs captured -- Instagram alt text does not name the
car -- so those show an honest generic caption rather than a guessed
model. Nothing in the archive claims an identification that was not
actually verified.

**Not used this round:** `m5 comp.mp4` (352x624, 11.6s, low resolution --
sitting at the project root, untouched, available if a use comes up) and
`Capture.PNG`/`M2comp.PNG`/`M3Comp.PNG`/`M4comp.PNG` (already-processed
originals from earlier rounds, all still safe to delete).

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
- **Real super-resolution, not just upscaling.** All three were run
  through **EDSR ×4** (a pretrained super-resolution network, via
  OpenCV's `dnn_superres` — `Saafke/EDSR_Tensorflow`), then downsampled
  to a **2000px** long edge with Lanczos and given a light
  autocontrast/sharpen pass.

  EDSR replaced an earlier ESPCN pass. ESPCN is ~100 KB of weights and
  runs in seconds; EDSR is ~38 MB and took 2–6 minutes per image, run
  **tiled with feathered joins** because a whole-image pass exhausts
  memory (a full-frame attempt took 486s for one image). The quality
  difference is clearly visible — headlight internals, badges and the
  M3's number plate are legible at EDSR where ESPCN left them mushy.

  2000px is deliberate, not arbitrary: the Collection frame is
  `col-span-7` of a `max-w-[1600px]` grid, so it renders at ~933 CSS px,
  i.e. ~1867px at 2× DPR. Beyond 2000px is wasted bytes with no visible
  gain.

- **The Instagram arrow removal had to be redone, and the ORDER matters.**
  `M3Comp.PNG` had a carousel "next" arrow icon sitting directly on the
  boundary between the dark glasshouse and the white bodywork.

  First attempt removed it at source resolution and *then* upscaled —
  wrong way round. EDSR faithfully sharpened the clone-stamp seam along
  with the photo, turning a previously invisible blend into a hard
  rectangular step in the roofline.

  Correct order is upscale first, repair second, so any residual
  imperfection is pushed below the final pixel grid on downscale.
  Generic inpainting (`cv2.INPAINT_TELEA` and `INPAINT_NS`) was tried at
  4× and both smeared badly — diffusion fills cannot reconstruct a
  straight high-contrast edge. What worked: a **slope-aligned clone** —
  measure the roofline's gradient from 51 clean columns beside the arrow
  (slope ≈ 0.082 px/px), then offset the donor by `(dx, slope·dx)` so the
  edge lines up exactly, with a feathered circular alpha so there is no
  rectangular seam. A purely horizontal donor shift is what produced the
  step in the first attempt.

- M3 is encoded at WebP q88 rather than q93 (the other two). It is the
  most detailed frame and was 453 KB at q93; q88 brings it to 307 KB for
  a mean difference of 1.3/255 — imperceptible. M2/M4 were left at q93
  because re-encoding an existing WebP would add a second generation of
  loss for ~100 KB, which is not a good trade.

**M5 now has its own photo too** — `Header/Drifting m5.jpeg`, a
monochrome night shot of the car mid-drift throwing sparks, processed to
`src/gallery/gas-016.webp` and referenced as `VEHICLE_PHOTOS.m5`. It suits
the strictly monochrome identity better than anything else in the set.

**A second harvest added 11 more frames** (`gas-017` … `gas-027`) at
`FEED.*` in `src/lib/gallery.ts`. These came from the carousels on
individual post permalinks rather than the profile grid, and are the
**2160×2700 originals** — not the 640px grid thumbnails the first pass
used. They bring genuinely different subjects into the set: a black
Porsche 997 on gold wheels, a blue F80 M3 mid-wash, an M2 front-end
detail, a white G87 M2, a black M4 wheel, an M2 rear under spray, plus
three multi-car sets.

Note on sourcing: the **profile grid is now login-walled** to anonymous
visitors (it was not earlier — the first pass's scraping likely tripped
Instagram's throttling). Individual post pages still render publicly, so
that is the route that works; `curl` only receives the JS shell, so it
has to be the live DOM. No login was used or attempted.

Every section is now internally duplicate-free — verified
programmatically: builds 4/4, social 8/8, vehicles 4/4, services 15/15
unique. Some assets appear in two different sections (34 slots against 27
images makes that unavoidable), but the repeats are pushed into the small
hover thumbnails where they are least visible.

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
