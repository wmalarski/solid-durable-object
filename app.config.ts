import { defineConfig } from "@solidjs/start/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  server: {
    devProxy: { "/api": { target: "http://localhost:8787/api" } },
    preset: "static",
  },
  solid: {
    ssr: false,
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
