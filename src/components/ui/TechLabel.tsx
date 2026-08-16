import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ==================================================================
   The technical chrome — section numbers, coordinates, spec captions.
   Used sparingly: it is seasoning, not the meal. If every block on the
   page has one of these it stops meaning anything.
   ================================================================== */

export function TechLabel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <span className={cn("label", className)}>{children}</span>;
}

/* A numbered section marker with a rule, e.g. "02 — THE COLLECTION". */
export function SectionMark({
  index,
  label,
  className = "",
}: {
  index: string;
  label: string;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-4", className)}>
      <span className="label text-bone/70">{index}</span>
      <span aria-hidden className="h-px w-10 bg-line" />
      <span className="label">{label}</span>
    </div>
  );
}
