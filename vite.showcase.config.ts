import { svelte } from "@sveltejs/vite-plugin-svelte";
import { defineConfig } from "vite";

const base = process.env.SHOWCASE_BASE_PATH ?? "/";

export default defineConfig({
  plugins: [svelte()],
  root: "showcase",
  base,
  build: {
    outDir: "../showcase-dist",
    emptyOutDir: true
  }
});
