import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  build: {
    target: "es2020",
    rollupOptions: {
      output: {
        manualChunks: {
          /* Eagerly used across the whole app, so preloading it is right. */
          motion: ["framer-motion", "gsap", "lenis"],

          /* three/fiber/drei are deliberately NOT listed here. Declaring
             them as a manual chunk makes Vite emit a <link
             rel="modulepreload"> for it in index.html, so the browser
             downloads ~342 KB gzipped on first paint even though the
             only importers are lazy. Left unlisted, Rollup keeps them in
             the dynamic-import graph and they are fetched on approach. */
        },
      },
    },
    /* The three+drei chunk lands at ~1.21 MB (~342 KB gzipped). That is
       the irreducible cost of the 3D layer, and it is documented in the
       README rather than hidden. The limit is set just above it so a
       genuine regression still trips the warning. */
    chunkSizeWarningLimit: 1300,
  },
});
