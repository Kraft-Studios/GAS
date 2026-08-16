import { GALLERY } from "@/lib/gallery";
import { GAS } from "@/lib/constants";

/* ------------------------------------------------------------------
   FOLLOW THE MACHINE
   ------------------------------------------------------------------
   Shaped to match the Instagram Basic Display / Graph API media object
   so a real feed can be dropped in without touching the component.

   The site never scrapes Instagram from the browser — that breaks in
   production and violates their terms. Point VITE_SOCIAL_FEED_URL at a
   server-side endpoint that returns SocialPost[] and `fetchFeed` will
   use it; otherwise the local placeholder set renders.
   ------------------------------------------------------------------ */

export type SocialPost = {
  id: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url: string;
  permalink: string;
  caption: string;
};

/* PLACEHOLDER — captions written for layout, images are real feed exports. */
export const PLACEHOLDER_FEED: SocialPost[] = [
  { id: "p1", media_type: "CAROUSEL_ALBUM", caption: "GAS DRIVE 02 — the whole convoy, one frame.", permalink: GAS.instagram, media_url: GALLERY[0] ?? "" },
  { id: "p2", media_type: "VIDEO", caption: "COLD START — S55, no filter on the audio.", permalink: GAS.instagram, media_url: GALLERY[1] ?? "" },
  { id: "p3", media_type: "IMAGE", caption: "Last light, last frame.", permalink: GAS.instagram, media_url: GALLERY[2] ?? "" },
  { id: "p4", media_type: "CAROUSEL_ALBUM", caption: "TAKEOVER — thanks to everyone who pulled up.", permalink: GAS.instagram, media_url: GALLERY[3] ?? "" },
  { id: "p5", media_type: "IMAGE", caption: "Four doors. No apology.", permalink: GAS.instagram, media_url: GALLERY[4] ?? "" },
  { id: "p6", media_type: "VIDEO", caption: "Rolling shot from the drive.", permalink: GAS.instagram, media_url: GALLERY[5] ?? "" },
  { id: "p7", media_type: "IMAGE", caption: "Detail work.", permalink: GAS.instagram, media_url: GALLERY[6] ?? "" },
  { id: "p8", media_type: "IMAGE", caption: "Warehouse wall, golden hour, done.", permalink: GAS.instagram, media_url: GALLERY[7] ?? "" },
];

export async function fetchFeed(): Promise<SocialPost[]> {
  const url = import.meta.env.VITE_SOCIAL_FEED_URL as string | undefined;
  if (!url) return PLACEHOLDER_FEED;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Feed responded ${res.status}`);
    const data = (await res.json()) as { data?: SocialPost[] } | SocialPost[];
    const posts = Array.isArray(data) ? data : (data.data ?? []);
    return posts.length ? posts : PLACEHOLDER_FEED;
  } catch {
    /* A dead feed must never take the section down with it. */
    return PLACEHOLDER_FEED;
  }
}
