/* ==================================================================
   Refcounted scroll lock.
   ------------------------------------------------------------------
   Several things lock scrolling — the loading screen, the hero intro,
   the menu, the lightbox — and they overlap. If each one sets and
   clears document.body.style.overflow directly, whichever unmounts
   first unlocks the page while another is still open.

   Counting locks instead means the page only unlocks when the last
   holder releases.
   ================================================================== */

let count = 0;
let previousOverflow = "";

export function lockScroll() {
  if (typeof document === "undefined") return;

  if (count === 0) {
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
  }
  count += 1;
}

export function unlockScroll() {
  if (typeof document === "undefined") return;

  count = Math.max(0, count - 1);
  if (count === 0) {
    document.body.style.overflow = previousOverflow;
  }
}
