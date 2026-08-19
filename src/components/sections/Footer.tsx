import { Link } from "react-router-dom";
import { GAS, NAV_LINKS, COORDS } from "@/lib/constants";
import { SplitText } from "@/components/ui/SplitText";

/* ==================================================================
   Cinematic footer — the last full-bleed moment, not a sitemap dump.
   ================================================================== */

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="theme-pin-dark relative grain overflow-hidden border-t border-line bg-void">
      {/* oversized wordmark, cropped by the viewport edge */}
      <div className="px-5 pb-10 pt-20 md:px-8 md:pt-28">
        <SplitText
          as="p"
          text={GAS.tagline}
          by="word"
          className="display max-w-[14ch] text-[13vw] text-bone md:text-[8vw]"
        />
      </div>

      <div className="grid gap-10 border-t border-line px-5 py-12 md:grid-cols-12 md:px-8">
        {/* ---- contact */}
        <div className="md:col-span-5">
          <p className="label mb-5">GET IN TOUCH</p>
          <a
            href={`mailto:${GAS.email}`}
            data-cursor="open"
            className="block text-lg text-bone transition-opacity hover:opacity-60 md:text-2xl"
          >
            {GAS.email}
          </a>
          {/* PLACEHOLDER — no public number was listed. See PLACEHOLDERS.md */}
          <p className="mt-2 text-sm text-muted">{GAS.phone}</p>
          <p className="label mt-6">{COORDS}</p>
        </div>

        {/* ---- sitemap */}
        <nav aria-label="Footer" className="md:col-span-3">
          <p className="label mb-5">INDEX</p>
          <ul className="space-y-2">
            {NAV_LINKS.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  data-cursor="open"
                  className="text-sm text-dim transition-colors hover:text-bone"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* ---- elsewhere */}
        <div className="md:col-span-4">
          <p className="label mb-5">ELSEWHERE</p>
          <ul className="space-y-2">
            {[
              { href: GAS.instagram, label: "Instagram", handle: GAS.instagramHandle },
              { href: GAS.youtube, label: "YouTube", handle: GAS.youtubeHandle },
              { href: GAS.shop, label: "GAS Kulture", handle: GAS.shopHandle },
            ].map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="open"
                  aria-label={`${GAS.fullName} on ${s.label}`}
                  className="group flex items-baseline justify-between gap-4 text-sm text-dim transition-colors hover:text-bone"
                >
                  <span>{s.label}</span>
                  <span className="font-mono text-[10px] text-muted transition-colors group-hover:text-bone">
                    {s.handle} ↗
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-line px-5 py-6 sm:flex-row sm:items-center sm:justify-between md:px-8">
        <p className="label">
          © {year} {GAS.registered}: ALL RIGHTS RESERVED
        </p>
        <p className="label">
          EST. {GAS.founded}: {GAS.country.toUpperCase()}
        </p>
      </div>
    </footer>
  );
}
