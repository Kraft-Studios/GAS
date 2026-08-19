# GAS Automotive

A cinematic digital showroom for **GAS** (`@gas.automotive_`) — a South
African car culture collective. Film, photography, features, driver meets
and garments.

> ITS GAS ITS JUST KULTURE ⛽ — EST. 2023

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc -b && vite build
npm run preview
```

Read **[PLACEHOLDERS.md](./PLACEHOLDERS.md)** before launching. It lists
every invented value and exactly how to replace it.

---

## Brand

Sourced from the real Instagram profile and shop account, not invented:

| | |
|---|---|
| Wordmark | `GAS` — white on pure black, wide-tracked geometric grotesque |
| Palette | **Strictly monochrome.** Black → bone. No accent colour. |
| Pillars | MEMBERS · COLD START · TAKEOVER · GAS DRIVE 1 & 2 |
| Merch | GAS KULTURE — `shopgaskulture.co.za`, live March 2026 |
| Founder | `@ntsikamoyo_` |

The palette carries no colour on purpose: the identity is black and white,
and the photography supplies every warm tone on the page. Tokens live in
`src/lib/constants.ts` (`BRAND`) and are mirrored into
`tailwind.config.js`. `BRAND.accent` exists as a role slot and currently
resolves to bone — set it in one place to introduce a brand colour.

Type: **Archivo** (variable, `wdth` axis drives the wordmark's width) and
**JetBrains Mono** for technical labels.

---

## Stack

React 19 · Vite 7 · TypeScript · Tailwind 3 · Three.js + React Three Fiber
9 + Drei 10 · GSAP ScrollTrigger · Framer Motion · Lenis · React Router 7

**One tool per job**, deliberately:

- **Framer Motion** — anything tied to React's mount/unmount lifecycle:
  page transitions, menus, reveals, scroll-linked transforms.
- **GSAP ScrollTrigger** — the pinned horizontal builds section. Pinning
  and scrubbing is what it is better at, and nothing else uses it.
- **Lenis** — owns scrolling, and drives ScrollTrigger's ticker directly
  so pinned sections never drift a frame behind the content.

---

## The hero

Real GAS footage (`public/gas-header.mp4`), autoplaying on its own at
**0.6× speed** (`PLAYBACK_RATE` in `Hero.tsx`) — slower and calmer than
the source clip. Scroll drives a separate push/zoom over the top; it does
not drive playback.

| | |
|---|---|
| Track | 160vh, `sticky top-0 h-screen` |
| Push | scale `1 → 1.8` across progress `0 → 0.55`, spring 90/26/0.4 |

The clip fades to black over its final ~1.5s, so a plain `loop` would
black the hero out once per cycle and snap back. Instead a `timeupdate`
listener restarts playback just before the fade begins
(`LOOP_TAIL_TRIM`), so the loop point is invisible.

`playbackRate` is a property, not an attribute — it can't be set through
JSX and resets on every new source load, so it's applied imperatively in
an effect on `loadedmetadata`.

Low-power devices and reduced-motion users get the poster still instead of
a 5.7 MB video, and a failed load falls back to the same still.

The hero carries no wordmark — the nav does. Its `<h1>` is the tagline
that is actually on screen rather than a hidden one.

> An earlier pass made the video scroll-scrubbed (car only moves while
> scrolling). That was reverted — it's simple autoplay again, just slower.

## The 3D system

```tsx
<VehicleScene>          // canvas + fallback chain + perf profile
  <SceneEnvironment />  // Lightformers — no CDN HDRI
  <Lighting />
  <CameraRig />         // scroll -> camera keyframes
  <VehicleModel />      // GLB if present, procedural stand-in otherwise
</VehicleScene>
```

Swapping the vehicle is one file drop — see PLACEHOLDERS.md §7.

**The fallback chain is enforced, not hoped for.** `VehicleScene` walks
it in order: WebGL available → Canvas; scene throws → ErrorBoundary swaps
in a still; no WebGL → still; image missing → gradient. There is no path
where a dead canvas renders.

**Camera motion.** Scroll keyframes are interpolated with smoothstep,
then critically damped per-frame with `THREE.MathUtils.damp` — which is
framerate-independent, so a 60Hz laptop and a 144Hz monitor behave
identically. That damping is what reads as camera weight.

---

## Performance

- The one remaining 3D scene (the configurator) **defers creating its
  WebGL context until first approached**, and **suspends its render loop
  when off-screen** (`frameloop="never"`). Browsers cap contexts around
  16 and each costs GPU memory whether it draws or not — the guard stays
  in `VehicleScene` so adding scenes back is safe by default.
- `useDevicePerformance` picks a tier from `hardwareConcurrency` /
  `deviceMemory` / viewport and scales DPR, shadows, antialiasing and
  environment resolution. Tiers only ever reduce work — **all content
  stays reachable at the lowest tier**.
- The environment map is built from Drei `Lightformer`s rather than a
  CDN HDRI: no network dependency, nothing to block first paint.
- **Three is off the initial load entirely.** The hero is film, so
  nothing above the fold needs it. The configurator is `React.lazy`, and
  the Three chunk (~1.0 MB, ~282 KB gzipped) is fetched only once the
  reader scrolls toward it.

  Note the subtlety: listing `three` in `manualChunks` *undoes* this.
  Vite emits a `<link rel="modulepreload">` for every declared manual
  chunk, so the browser downloads it on first paint even when the only
  importers are dynamic. It is deliberately left unlisted — see the
  comment in `vite.config.ts`.

- The loading screen tracks fonts, the hero poster and video metadata —
  **not** three.js. Wiring it to Drei's `useProgress` would pull all of
  Three back into the initial bundle just to display a number.

Initial JS is ~189 KB gzipped (app + motion). The hero video, at 5.7 MB,
is now the largest single asset on the page.

---

## Accessibility

- One `<h1>` per page, `<section>`s labelled via `aria-labelledby`.
- Skip link; focus visible everywhere and never removed.
- Menu and lightbox are real modals: focus trapped, focus restored on
  close, Escape closes, background scroll locked.
- Scroll locking is **refcounted** (`src/lib/scrollLock.ts`) so
  overlapping overlays can't unlock the page out from under each other.
- Form: real labels, `aria-invalid` + `aria-describedby` on errors, live
  region for submit state, focus moved to the first invalid field.
- `prefers-reduced-motion` switches components to **separate static
  branches**, not degraded animated ones. The hero becomes a still
  composition; the pinned horizontal section becomes a native swipe strip.

---

## Mobile

Treated as a distinct composition, not a narrow desktop:

- Custom cursor disabled on touch (`hover: hover and pointer: fine`).
- Hover-only disclosure is replaced by tap-to-expand in the services
  index, so body copy is never unreachable.
- The pinned horizontal section becomes a snap-scrolling swipe strip —
  ScrollTrigger pinning fights native touch momentum.
- Wider camera FOV and a smaller vehicle scale so the car frames properly
  in portrait.
- Video scroll-scrubbing is desktop-only; mobile Safari can't seek
  smoothly.

---

## Structure

```
src/
  components/{navigation,hero,vehicles,services,gallery,sections,ui}/
  three/{VehicleScene,VehicleModel,CameraRig,Environment,
         VehicleConfigurator}.tsx
  animations/{easing,scroll}.ts
  data/{vehicles,services,builds,social}.ts
  hooks/{useLenis,useMediaQuery,useReducedMotion,useDevicePerformance}.ts
  lib/{constants,utils,gallery,api,scrollLock}.ts
  pages/{Home,Vehicles,Builds,Services,About,Contact,NotFound}.tsx
  styles/index.css
```

Data is kept out of components: copy, specs and section content all live
in `src/data/`.

---

## Routing

`HashRouter`, so a plain `dist/` drop works on any static host with no
rewrite rules. Swap to `BrowserRouter` in `src/main.tsx` once the host is
configured to serve `index.html` for unknown paths.
