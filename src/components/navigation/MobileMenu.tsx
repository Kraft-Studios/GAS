import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { NAV_LINKS, GAS, COORDS } from "@/lib/constants";
import { EASE, EASE_SOFT } from "@/animations/easing";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { lockScroll, unlockScroll } from "@/lib/scrollLock";

/* ==================================================================
   Full-screen menu — used at every breakpoint, not just mobile.
   ------------------------------------------------------------------
   Accessibility work that a decorative overlay usually skips:
     - focus moves into the panel on open and returns to the trigger
       on close
     - Tab is trapped inside while it is open
     - Escape closes it
     - background scroll is locked
   ================================================================== */

export function MobileMenu({ onClose }: { onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;

    const scrollY = window.scrollY;
    lockScroll();

    /* Focus the first link once the panel exists. */
    const raf = requestAnimationFrame(() => {
      panelRef.current?.querySelector<HTMLElement>("a,button")?.focus();
    });

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;

      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables?.length) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKeyDown);
      unlockScroll();
      window.scrollTo(0, scrollY);
      previouslyFocused?.focus?.();
    };
  }, [onClose]);

  return (
    <motion.div
      ref={panelRef}
      id="gas-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      className="fixed inset-0 z-[94] flex flex-col justify-between bg-void px-5 pb-8 pt-24 md:px-8 md:pt-28"
      initial={reduced ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
      animate={reduced ? { opacity: 1 } : { clipPath: "inset(0 0 0% 0)" }}
      exit={reduced ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
      transition={{ duration: 0.75, ease: EASE_SOFT }}
    >
      <nav aria-label="Menu">
        <ul>
          {NAV_LINKS.map((item, i) => (
            <li key={item.to} className="border-b border-line/60">
              <motion.div
                initial={reduced ? false : { y: 60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  delay: reduced ? 0 : 0.25 + i * 0.06,
                  duration: 0.8,
                  ease: EASE,
                }}
              >
                <Link
                  to={item.to}
                  onClick={onClose}
                  data-cursor="open"
                  className="group flex items-baseline gap-5 py-4 md:gap-8 md:py-6"
                >
                  <span className="label w-6 shrink-0 group-hover:text-bone">
                    {item.index}
                  </span>
                  <span className="display text-[13vw] text-bone/80 transition-all duration-500 ease-expo group-hover:translate-x-3 group-hover:text-bone md:text-[7vw]">
                    {item.label}
                  </span>
                </Link>
              </motion.div>
            </li>
          ))}
        </ul>
      </nav>

      <motion.div
        className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: reduced ? 0 : 0.7, duration: 0.8 }}
      >
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {[
            { href: GAS.instagram, label: "Instagram" },
            { href: GAS.youtube, label: "YouTube" },
            { href: GAS.shop, label: "Shop" },
          ].map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              data-cursor="open"
              className="font-mono text-[10px] uppercase tracking-label text-dim transition-colors hover:text-bone"
            >
              {s.label} ↗
            </a>
          ))}
        </div>
        <span className="label">{COORDS}</span>
      </motion.div>
    </motion.div>
  );
}
