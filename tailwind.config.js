/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        /* Point at CSS custom properties, not literal hex, so the whole
           palette can flip between the dark (default) and light theme —
           see :root / [data-theme="light"] in styles/index.css. */
        void: "var(--color-void)",
        carbon: "var(--color-carbon)",
        surface: "var(--color-surface)",
        elevated: "var(--color-elevated)",
        line: "var(--color-line)",
        muted: "var(--color-muted)",
        dim: "var(--color-dim)",
        bone: "var(--color-bone)",
      },
      fontFamily: {
        /* Archivo carries a width axis, which is how the wide-tracked
           GAS wordmark gets matched at display sizes. */
        sans: ['"Archivo"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
      },
      letterSpacing: {
        brand: "0.42em", // the wordmark's tracking
        label: "0.28em", // technical labels
      },
      transitionTimingFunction: {
        expo: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      screens: {
        xs: "375px",
        "3xl": "1920px",
      },
    },
  },
  plugins: [],
};
