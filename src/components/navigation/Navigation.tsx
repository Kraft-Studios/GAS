import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { NAV_LINKS, GAS } from "@/lib/constants";
import { EASE, EASE_SOFT } from "@/animations/easing";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { MobileMenu } from "./MobileMenu";

/* ==================================================================
   Navigation
   ------------------------------------------------------------------
   Logo left, links centre-right, menu control right.

   Colour adapts per section: any element carrying data-nav="light"
   reports itself via IntersectionObserver as it passes under the bar,
   and the bar inverts. That is cheaper and far more reliable than
   sampling pixels from the canvas, and it works over the 3D hero too.
   ================================================================== */

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [onLight, setOnLight] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const reduced = useReducedMotion();

  /* Condense the bar once the user has left the top of the page. */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Watch for light sections crossing the bar's own band. */
  useEffect(() => {
    const lights = document.querySelectorAll('[data-nav="light"]');
    if (!lights.length) {
      setOnLight(false);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        /* The bar occupies the top ~80px; a section counts as "under"
           the bar when it intersects that band. */
        const anyUnder = entries.some((e) => e.isIntersecting);
        setOnLight(anyUnder);
      },
      { rootMargin: "-0px 0px -100% 0px", threshold: 0 }
    );

    lights.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  /* Close the menu on navigation. */
  useEffect(() => setMenuOpen(false), [pathname]);

  const fg = onLight ? "text-black" : "text-bone";

  return (
    <>
      <motion.header
        className={`fixed inset-x-0 top-0 z-[95] transition-colors duration-500 ${
          scrolled && !menuOpen
            ? onLight
              ? "bg-bone/85 backdrop-blur-md"
              : "bg-carbon/70 backdrop-blur-md"
            : "bg-transparent"
        }`}
        initial={reduced ? false : { y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: EASE, delay: reduced ? 0 : 0.2 }}
      >
        <nav
          aria-label="Primary"
          className="mx-auto flex h-16 max-w-[1800px] items-center justify-between px-5 md:h-20 md:px-8"
        >
          {/* ---------------- wordmark */}
          <Link
            to="/"
            data-cursor="open"
            aria-label={`${GAS.fullName} — home`}
            className={`wordmark text-sm transition-colors duration-500 md:text-base ${
              menuOpen ? "text-bone" : fg
            }`}
          >
            {GAS.name}
          </Link>

          {/* ---------------- desktop links */}
          <ul className="hidden items-center gap-8 lg:flex xl:gap-11">
            {NAV_LINKS.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === "/"}
                  data-cursor="open"
                  className={({ isActive }) =>
                    `nav-link group relative block transition-colors duration-300 ${
                      onLight
                        ? isActive
                          ? "text-black"
                          : "text-black/60 hover:text-black"
                        : isActive
                          ? "text-bone"
                          : "text-bone/65 hover:text-bone"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {item.label}
                      {/* underline grows from the left on hover/active */}
                      <span
                        aria-hidden
                        className={`absolute -bottom-1.5 left-0 h-px origin-left transition-transform duration-500 ease-expo ${
                          onLight ? "bg-black" : "bg-bone"
                        } ${
                          isActive
                            ? "w-full scale-x-100"
                            : "w-full scale-x-0 group-hover:scale-x-100"
                        }`}
                      />
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* ---------------- menu control
               Icon only. With the visible label gone, aria-label is now
               the button's entire accessible name — without it this is
               an unlabelled button to a screen reader. */}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="gas-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            data-cursor={menuOpen ? "open" : "explore"}
            className="flex items-center p-1"
          >
            <span className="relative flex h-4 w-7 flex-col justify-between">
              {[0, 1].map((i) => (
                <motion.span
                  key={i}
                  className={`block h-px w-full origin-center transition-colors duration-500 ${
                    menuOpen ? "bg-bone" : onLight ? "bg-black" : "bg-bone"
                  }`}
                  animate={
                    menuOpen
                      ? { rotate: i === 0 ? 45 : -45, y: i === 0 ? 7.5 : -7.5 }
                      : { rotate: 0, y: 0 }
                  }
                  transition={{ duration: 0.5, ease: EASE_SOFT }}
                />
              ))}
            </span>
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {menuOpen && <MobileMenu onClose={() => setMenuOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
