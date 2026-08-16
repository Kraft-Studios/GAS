/* Small shared helpers. Kept dependency-free on purpose. */

export function cn(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(" ");
}

export const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

/* Linear interpolation. */
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/* Maps v from one range to another, clamped at both ends. */
export function mapRange(
  v: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  if (inMax === inMin) return outMin;
  const t = clamp((v - inMin) / (inMax - inMin), 0, 1);
  return outMin + t * (outMax - outMin);
}

/* Smoothstep — used where a hard linear ramp reads mechanical. */
export const smoothstep = (t: number) => t * t * (3 - 2 * t);

/* Zero-padded section numbers: 1 -> "01". */
export const pad = (n: number, width = 2) => String(n).padStart(width, "0");

export function formatZAR(cents: number): string {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}
