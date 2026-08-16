import { useSyncExternalStore } from "react";

/* useSyncExternalStore avoids the hydration flash and the extra render
   that a useState+useEffect implementation costs on every mount. */
export function useMediaQuery(query: string): boolean {
  const subscribe = (onChange: () => void) => {
    const mql = window.matchMedia(query);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  };

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false // server / pre-paint default
  );
}

export const useIsMobile = () => useMediaQuery("(max-width: 767px)");
export const useIsTablet = () => useMediaQuery("(max-width: 1023px)");

/* Fine pointer + hover is the only configuration where a custom cursor
   and hover-driven sections make sense. */
export const useHasPointer = () =>
  useMediaQuery("(hover: hover) and (pointer: fine)");
