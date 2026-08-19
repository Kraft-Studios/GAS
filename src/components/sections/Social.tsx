import { useEffect, useState } from "react";
import { fetchFeed, PLACEHOLDER_FEED, type SocialPost } from "@/data/social";
import { GAS } from "@/lib/constants";
import { SectionMark } from "@/components/ui/TechLabel";
import { SplitText } from "@/components/ui/SplitText";

/* ==================================================================
   FOLLOW THE MACHINE
   ------------------------------------------------------------------
   Renders whatever fetchFeed returns — a real cached feed if
   VITE_SOCIAL_FEED_URL is configured, the local placeholder set
   otherwise. The component doesn't know or care which it got, so
   connecting the real API is a server-side job, not a rewrite here.
   ================================================================== */

export function Social() {
  const [posts, setPosts] = useState<SocialPost[]>(PLACEHOLDER_FEED);

  useEffect(() => {
    let cancelled = false;
    fetchFeed().then((data) => {
      if (!cancelled) setPosts(data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section
      aria-labelledby="social-heading"
      className="theme-pin-dark relative bg-void px-5 py-24 md:px-8 md:py-32"
    >
      <div className="mx-auto max-w-[1600px]">
        <SectionMark index="09" label="SOCIAL" className="mb-10" />

        <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
          <SplitText
            as="h2"
            id="social-heading"
            text="FOLLOW THE MACHINE"
            className="display max-w-[13ch] text-[12vw] text-bone md:text-[6vw]"
          />
          <a
            href={GAS.instagram}
            target="_blank"
            rel="noreferrer"
            data-cursor="open"
            className="font-mono text-[10px] uppercase tracking-label text-dim transition-colors hover:text-bone"
          >
            {GAS.instagramHandle} ↗
          </a>
        </div>

        <ul className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
          {posts.slice(0, 8).map((post) => (
            <li key={post.id}>
              <a
                href={post.permalink}
                target="_blank"
                rel="noreferrer"
                data-cursor="view"
                className="group relative block aspect-square overflow-hidden bg-surface"
              >
                <img
                  src={post.media_url}
                  alt={post.caption}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-[900ms] ease-expo group-hover:scale-105"
                />
                <span className="pointer-events-none absolute inset-0 bg-void/0 transition-colors duration-500 group-hover:bg-void/55" />

                {/* caption surfaces on hover; always present for AT */}
                <span className="pointer-events-none absolute inset-0 flex items-end p-3 opacity-0 transition-opacity duration-500 group-hover:opacity-100 md:p-4">
                  <span className="font-mono text-[10px] leading-relaxed text-bone">
                    {post.caption}
                  </span>
                </span>

                {post.media_type === "VIDEO" && (
                  <span
                    aria-label="Video"
                    className="absolute right-3 top-3 font-mono text-[9px] tracking-label text-bone"
                  >
                    ▶
                  </span>
                )}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
