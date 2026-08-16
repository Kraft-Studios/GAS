import { useMemo } from "react";
import { useIsMobile } from "./useMediaQuery";
import { useReducedMotion } from "./useReducedMotion";

export type PerfTier = "high" | "medium" | "low";

export type PerfProfile = {
  tier: PerfTier;
  /* Renderer settings, read directly by <VehicleScene>. */
  dpr: [number, number];
  shadows: boolean;
  antialias: boolean;
  /* Scene complexity. */
  particleCount: number;
  envResolution: number;
  /* When false, skip the scroll-driven camera entirely and show a still. */
  animate3D: boolean;
};

/* Device capability is guessed once at mount from hardware hints. These
   are advisory, not reliable — so the tiers only ever reduce work, never
   gate content. Everything remains reachable at the "low" tier. */
export function useDevicePerformance(): PerfProfile {
  const isMobile = useIsMobile();
  const reduced = useReducedMotion();

  return useMemo(() => {
    const cores =
      typeof navigator !== "undefined" ? (navigator.hardwareConcurrency ?? 4) : 4;

    /* deviceMemory is Chromium-only; absent elsewhere, so default generously. */
    const memory =
      typeof navigator !== "undefined"
        ? ((navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8)
        : 8;

    let tier: PerfTier = "high";
    if (isMobile || cores <= 4 || memory <= 4) tier = "medium";
    if (cores <= 2 || memory <= 2) tier = "low";
    if (reduced) tier = "low";

    const profiles: Record<PerfTier, PerfProfile> = {
      high: {
        tier: "high",
        dpr: [1, 2],
        shadows: true,
        antialias: true,
        particleCount: 240,
        envResolution: 256,
        animate3D: true,
      },
      medium: {
        tier: "medium",
        dpr: [1, 1.5],
        shadows: false,
        antialias: true,
        particleCount: 90,
        envResolution: 128,
        animate3D: true,
      },
      low: {
        tier: "low",
        dpr: [1, 1],
        shadows: false,
        antialias: false,
        particleCount: 0,
        envResolution: 64,
        animate3D: !reduced,
      },
    };

    return profiles[tier];
  }, [isMobile, reduced]);
}
