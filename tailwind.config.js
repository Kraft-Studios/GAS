/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        void: "#000000",
        carbon: "#080808",
        surface: "#101010",
        elevated: "#181818",
        line: "#242424",
        muted: "#5C5C5C",
        dim: "#8A8A8A",
        bone: "#F2F0EB",
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
