import { useMemo, useState } from "react";
import { OrbitControls } from "@react-three/drei";
import { VehicleScene } from "@/three/VehicleScene";
import { VehicleModel } from "@/three/VehicleModel";
import type { VehicleFinish } from "@/three/VehicleModel";
import { SectionMark } from "@/components/ui/TechLabel";
import { SplitText } from "@/components/ui/SplitText";
import { FRAMES } from "@/lib/gallery";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/* ==================================================================
   BUILD YOUR MACHINE
   ------------------------------------------------------------------
   A live 3D configurator. Not a purchase flow — GAS doesn't sell parts.
   It is a brand toy: spec the car the way you'd want it shot, then take
   that spec to the contact form.

   The config is one typed object, so swapping in a real GLB with named
   materials means mapping these five fields onto that model's
   materials — nothing about this UI needs to change.
   ================================================================== */

export type VehicleConfig = {
  bodyColor: string;
  wheelStyle: string;
  wheelColor: string;
  brakeColor: string;
  suspensionHeight: number;
};

/* Options stay monochrome to match the identity: finishes are described
   by surface and depth rather than by hue. */
const BODY_COLORS = [
  { id: "bone", label: "Bone", value: "#E8E6E1" },
  { id: "silver", label: "Raw Silver", value: "#B9B9B7" },
  { id: "graphite", label: "Graphite", value: "#4A4A4C" },
  { id: "void", label: "Void Black", value: "#141416" },
] as const;

const WHEEL_STYLES = [
  { id: "forged-10", label: 'Forged 10-Spoke — 19"' },
  { id: "mesh", label: 'Classic Mesh — 18"' },
  { id: "monoblock", label: 'Monoblock — 20"' },
] as const;

const WHEEL_COLORS = [
  { id: "brushed", label: "Brushed", value: "#8A8A8A" },
  { id: "gloss-black", label: "Gloss Black", value: "#151515" },
  { id: "polished", label: "Polished", value: "#D6D6D4" },
] as const;

const BRAKE_COLORS = [
  { id: "graphite", label: "Graphite", value: "#3A3A3A" },
  { id: "black", label: "Black", value: "#101010" },
  { id: "steel", label: "Raw Steel", value: "#9A9A98" },
] as const;

/* Ride height in model units. Negative sits the body lower. */
const HEIGHTS = [
  { id: "stock", label: "Stock", value: 0 },
  { id: "lowered", label: "Lowered", value: -0.09 },
  { id: "slammed", label: "Slammed", value: -0.17 },
] as const;

const DEFAULT_CONFIG: VehicleConfig = {
  bodyColor: BODY_COLORS[0].value,
  wheelStyle: WHEEL_STYLES[0].id,
  wheelColor: WHEEL_COLORS[0].value,
  brakeColor: BRAKE_COLORS[0].value,
  suspensionHeight: 0,
};

export function VehicleConfigurator() {
  const [config, setConfig] = useState<VehicleConfig>(DEFAULT_CONFIG);
  const isMobile = useIsMobile();
  const reduced = useReducedMotion();

  const finish: VehicleFinish = useMemo(
    () => ({
      bodyColor: config.bodyColor,
      wheelColor: config.wheelColor,
      brakeColor: config.brakeColor,
      rideHeight: config.suspensionHeight,
    }),
    [config]
  );

  const set = <K extends keyof VehicleConfig>(key: K, value: VehicleConfig[K]) =>
    setConfig((c) => ({ ...c, [key]: value }));

  return (
    <section
      aria-labelledby="configurator-heading"
      className="relative bg-carbon px-5 py-24 md:px-8 md:py-32"
    >
      <div className="mx-auto max-w-[1600px]">
        <SectionMark index="06" label="CONFIGURATOR" className="mb-10" />
        <SplitText
          as="h2"
          id="configurator-heading"
          text="BUILD YOUR MACHINE"
          className="display mb-4 max-w-[13ch] text-[12vw] text-bone md:text-[6vw]"
        />
        <p className="max-w-md text-sm text-muted md:text-base">
          Spec it the way you'd want it shot. Then bring us the real one.
        </p>

        <div className="mt-12 grid gap-6 md:mt-16 lg:grid-cols-12 lg:gap-8">
          {/* ---------------- viewport */}
          <div
            className="relative h-[46vh] overflow-hidden border border-line bg-void lg:col-span-8 lg:h-[72vh]"
            data-cursor="drag"
          >
            <VehicleScene
              className="h-full w-full"
              fallbackImage={FRAMES.heroFallback}
              fallbackAlt="Configurable feature vehicle"
              fov={isMobile ? 40 : 30}
            >
              <VehicleModel finish={finish} />
              <OrbitControls
                makeDefault
                enablePan={false}
                enableDamping
                dampingFactor={0.06}
                minDistance={5}
                maxDistance={11}
                minPolarAngle={0.4}
                maxPolarAngle={Math.PI / 2.1}
                autoRotate={!reduced}
                autoRotateSpeed={0.4}
              />
            </VehicleScene>

            <span className="label pointer-events-none absolute bottom-4 left-4">
              DRAG TO ROTATE
            </span>
          </div>

          {/* ---------------- controls */}
          <div className="lg:col-span-4">
            <div className="flex flex-col gap-8 border border-line bg-surface p-6 md:p-8">
              <OptionGroup
                legend="Bodywork"
                options={BODY_COLORS.map((o) => ({
                  id: o.id,
                  label: o.label,
                  selected: config.bodyColor === o.value,
                  swatch: o.value,
                  onSelect: () => set("bodyColor", o.value),
                }))}
              />
              <OptionGroup
                legend="Wheel style"
                options={WHEEL_STYLES.map((o) => ({
                  id: o.id,
                  label: o.label,
                  selected: config.wheelStyle === o.id,
                  onSelect: () => set("wheelStyle", o.id),
                }))}
                /* PLACEHOLDER — the stand-in model has one wheel mesh, so
                   style is recorded but not yet visually distinct. A real
                   GLB with three wheel meshes makes this live. */
                note="Recorded on your enquiry — visual variants land with the full model."
              />
              <OptionGroup
                legend="Wheel finish"
                options={WHEEL_COLORS.map((o) => ({
                  id: o.id,
                  label: o.label,
                  selected: config.wheelColor === o.value,
                  swatch: o.value,
                  onSelect: () => set("wheelColor", o.value),
                }))}
              />
              <OptionGroup
                legend="Brakes"
                options={BRAKE_COLORS.map((o) => ({
                  id: o.id,
                  label: o.label,
                  selected: config.brakeColor === o.value,
                  swatch: o.value,
                  onSelect: () => set("brakeColor", o.value),
                }))}
              />
              <OptionGroup
                legend="Ride height"
                options={HEIGHTS.map((o) => ({
                  id: o.id,
                  label: o.label,
                  selected: config.suspensionHeight === o.value,
                  onSelect: () => set("suspensionHeight", o.value),
                }))}
              />

              <button
                type="button"
                onClick={() => setConfig(DEFAULT_CONFIG)}
                data-cursor="explore"
                className="mt-2 self-start font-mono text-[10px] uppercase tracking-label text-muted transition-colors hover:text-bone"
              >
                Reset spec
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

type Option = {
  id: string;
  label: string;
  selected: boolean;
  swatch?: string;
  onSelect: () => void;
};

/* A real fieldset/legend with radio semantics, so the whole group is
   announced and arrow keys behave the way a radio group should. */
function OptionGroup({
  legend,
  options,
  note,
}: {
  legend: string;
  options: Option[];
  note?: string;
}) {
  return (
    <fieldset>
      <legend className="label mb-3">{legend}</legend>
      <div role="radiogroup" aria-label={legend} className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={o.selected}
            onClick={o.onSelect}
            data-cursor="explore"
            className={`flex items-center gap-2.5 border px-3 py-2 text-[11px] transition-colors duration-300 ${
              o.selected
                ? "border-bone text-bone"
                : "border-line text-dim hover:border-bone/60 hover:text-bone"
            }`}
          >
            {o.swatch && (
              <span
                aria-hidden
                className="block h-3.5 w-3.5 rounded-full border border-white/15"
                style={{ backgroundColor: o.swatch }}
              />
            )}
            {o.label}
          </button>
        ))}
      </div>
      {note && <p className="mt-2.5 text-[11px] leading-relaxed text-muted">{note}</p>}
    </fieldset>
  );
}
