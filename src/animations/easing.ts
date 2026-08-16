/* Shared easing vocabulary. Every timing in the site comes from here so
   motion feels like one hand made it, not six. */

/* Expo-out. The house curve — fast departure, long settle. */
export const EASE = [0.16, 1, 0.3, 1] as const;

/* Slightly softer, for large masses (full-screen masks, panels). */
export const EASE_SOFT = [0.22, 1, 0.36, 1] as const;

/* Symmetrical, for things that leave and return (menu open/close). */
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;

/* GSAP string equivalents. */
export const GSAP_EASE = "expo.out";
export const GSAP_EASE_IN_OUT = "power3.inOut";

/* Spring used by every scroll-driven transform, including the camera rig.
   Low mass + high damping = it tracks scroll closely but never judders. */
export const SCROLL_SPRING = {
  stiffness: 90,
  damping: 26,
  mass: 0.4,
} as const;

/* A looser spring for the 3D camera specifically — the extra travel
   reads as camera weight rather than lag. */
export const CAMERA_SPRING = {
  stiffness: 60,
  damping: 22,
  mass: 0.6,
} as const;

export const DURATION = {
  fast: 0.4,
  base: 0.8,
  slow: 1.2,
  mask: 1.0,
} as const;
