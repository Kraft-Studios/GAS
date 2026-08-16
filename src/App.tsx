import { Suspense, lazy } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Navigation } from "@/components/navigation/Navigation";
import { Footer } from "@/components/sections/Footer";
import { PageTransition } from "@/components/ui/PageTransition";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { RouteReset } from "@/components/ui/RouteReset";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { useLenis } from "@/hooks/useLenis";
import Home from "@/pages/Home";

/* Secondary routes are split out — the homepage carries the 3D bundle
   and shouldn't wait on pages nobody has asked for yet. */
const Vehicles = lazy(() => import("@/pages/Vehicles"));
const Builds = lazy(() => import("@/pages/Builds"));
const Services = lazy(() => import("@/pages/Services"));
const About = lazy(() => import("@/pages/About"));
const Contact = lazy(() => import("@/pages/Contact"));
const NotFound = lazy(() => import("@/pages/NotFound"));

export default function App() {
  const location = useLocation();
  useLenis();

  return (
    <div className="min-h-screen bg-carbon text-[#C9C7C2]">
      {/* Keyboard users get out of the nav without tabbing the whole menu. */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:bg-bone focus:px-4 focus:py-2 focus:text-sm focus:text-black"
      >
        Skip to content
      </a>

      <LoadingScreen />
      <RouteReset />
      <CustomCursor />
      <ScrollProgress />
      <Navigation />

      <main id="main">
        {/* mode="wait" so the outgoing page has cleared before the next
            one mounts — two 3D canvases alive at once is a stutter. */}
        <AnimatePresence mode="wait" initial={false}>
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={
                <PageTransition>
                  <Home />
                </PageTransition>
              }
            />
            {(
              [
                ["/vehicles", Vehicles],
                ["/builds", Builds],
                ["/services", Services],
                ["/about", About],
                ["/contact", Contact],
                ["*", NotFound],
              ] as const
            ).map(([path, Component]) => (
              <Route
                key={path}
                path={path}
                element={
                  <PageTransition>
                    <Suspense fallback={<RouteFallback />}>
                      <Component />
                    </Suspense>
                  </PageTransition>
                }
              />
            ))}
          </Routes>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}

function RouteFallback() {
  return (
    <div
      className="flex min-h-screen items-center justify-center bg-carbon"
      role="status"
      aria-live="polite"
    >
      <span className="label">LOADING</span>
    </div>
  );
}
