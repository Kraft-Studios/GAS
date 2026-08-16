import { Suspense, type ReactNode } from "react";

/* ==================================================================
   Suspense boundary for the code-split 3D sections.
   ------------------------------------------------------------------
   The placeholder reserves roughly the height the real section will
   occupy. Without that, the page jumps as each chunk lands and every
   ScrollTrigger measurement below it goes stale.
   ================================================================== */

export function LazySection({
  children,
  minHeight = "70vh",
  label,
}: {
  children: ReactNode;
  minHeight?: string;
  label: string;
}) {
  return (
    <Suspense
      fallback={
        <div
          style={{ minHeight }}
          className="flex items-center justify-center bg-carbon"
          role="status"
          aria-live="polite"
        >
          <span className="label">{label}</span>
        </div>
      }
    >
      {children}
    </Suspense>
  );
}
