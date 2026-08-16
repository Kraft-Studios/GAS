import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { OrbitControls } from "@react-three/drei";
import { VehicleScene } from "@/three/VehicleScene";
import { VehicleModel } from "@/three/VehicleModel";
import { HOTSPOTS } from "@/data/vehicles";
import { VehicleHotspots } from "@/three/Hotspots";
import { HotspotCamera } from "@/three/HotspotCamera";
import { SectionMark } from "@/components/ui/TechLabel";
import { SplitText } from "@/components/ui/SplitText";
import { FRAMES } from "@/lib/gallery";
import { EASE } from "@/animations/easing";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/* ==================================================================
   DISCOVER THE MACHINE
   ------------------------------------------------------------------
   Free exploration, in contrast to the hero's locked camera move.
   Drag to rotate, scroll/pinch to zoom, tap a hotspot to fly the camera
   there and read the spec.

   Note the interaction split: OrbitControls owns the camera while the
   user is driving it, and HotspotCamera takes over when a hotspot is
   selected. They are never both active — two things writing to
   camera.position in the same frame is the classic R3F fight.
   ================================================================== */

export function DiscoverMachine() {
  const [active, setActive] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const reduced = useReducedMotion();

  const hotspot = HOTSPOTS.find((h) => h.id === active) ?? null;

  return (
    <section
      aria-labelledby="discover-heading"
      className="relative bg-void px-5 py-24 md:px-8 md:py-32"
    >
      <div className="mx-auto max-w-[1600px]">
        <SectionMark index="03" label="INTERACTIVE" className="mb-10" />
        <SplitText
          as="h2"
          id="discover-heading"
          text="DISCOVER THE MACHINE"
          className="display mb-4 max-w-[14ch] text-[12vw] text-bone md:text-[6vw]"
        />
        <p className="max-w-md text-sm text-muted md:text-base">
          {isMobile ? "Drag to rotate. Tap a marker." : "Drag to rotate. Scroll to zoom. Click a marker."}
        </p>

        <div className="relative mt-12 md:mt-16">
          <div
            className="relative h-[60vh] w-full overflow-hidden border border-line bg-carbon md:h-[75vh]"
            data-cursor="drag"
          >
            <VehicleScene
              className="h-full w-full"
              fallbackImage={FRAMES.heroFallback}
              fallbackAlt="A feature car shot by GAS Automotive"
              fov={isMobile ? 40 : 32}
            >
              <VehicleModel />

              <VehicleHotspots
                hotspots={HOTSPOTS}
                activeId={active}
                onSelect={setActive}
              />

              {hotspot ? (
                <HotspotCamera
                  position={hotspot.camera}
                  lookAt={hotspot.position}
                />
              ) : (
                <OrbitControls
                  makeDefault
                  enablePan={false}
                  enableDamping
                  dampingFactor={0.06}
                  minDistance={4}
                  maxDistance={12}
                  /* Stop the camera dropping below the ground plane. */
                  minPolarAngle={0.35}
                  maxPolarAngle={Math.PI / 2.05}
                  autoRotate={!reduced}
                  autoRotateSpeed={0.35}
                />
              )}
            </VehicleScene>

            {/* ---------------- spec panel */}
            <AnimatePresence mode="wait">
              {hotspot && (
                <motion.div
                  key={hotspot.id}
                  role="status"
                  aria-live="polite"
                  className="absolute bottom-4 left-4 right-4 border border-line bg-void/90 p-5 backdrop-blur-md sm:right-auto sm:max-w-sm md:bottom-8 md:left-8 md:p-7"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  transition={{ duration: 0.5, ease: EASE }}
                >
                  <p className="display mb-3 text-xl text-bone md:text-2xl">
                    {hotspot.title}
                  </p>
                  <p className="label leading-relaxed text-dim">{hotspot.spec}</p>
                  <button
                    type="button"
                    onClick={() => setActive(null)}
                    data-cursor="open"
                    className="mt-5 font-mono text-[10px] uppercase tracking-label text-muted transition-colors hover:text-bone"
                  >
                    ← Back to free view
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ---------------- hotspot index, also the keyboard route in */}
          <ul className="mt-6 flex flex-wrap gap-2">
            {HOTSPOTS.map((h) => (
              <li key={h.id}>
                <button
                  type="button"
                  onClick={() => setActive(active === h.id ? null : h.id)}
                  aria-pressed={active === h.id}
                  data-cursor="explore"
                  className={`border px-4 py-2.5 font-mono text-[10px] uppercase tracking-label transition-colors duration-300 ${
                    active === h.id
                      ? "border-bone bg-bone text-black"
                      : "border-line text-dim hover:border-bone hover:text-bone"
                  }`}
                >
                  {h.title}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
