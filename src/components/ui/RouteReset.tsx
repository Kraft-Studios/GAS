import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/* On navigation: jump to the top and rebuild every ScrollTrigger.
   Without the refresh, triggers keep the previous route's measurements
   and pinned sections fire at the wrong scroll positions. */
export function RouteReset() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);

    /* Deferred a frame so the new route has laid out before measuring. */
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return null;
}
