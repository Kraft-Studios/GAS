import { useMemo } from "react";
import { useIsMobile } from "./useMediaQuery";
import { useReducedMotion } from "./useReducedMotion";

export type PerfTier = "high" | "medium" | "low";

export type PerfProfile = {
  tier: PerfTier;
};

/* Device capability is guessed once at mount from hardware hints. These
   are advisory, not reliable — so the tier only ever reduces work, never
   gates content. Currently drives one call site: the hero falls back to
   a still frame instead of the background video at the "low" tier. */
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

    return { tier };
  }, [isMobile, reduced]);
}
