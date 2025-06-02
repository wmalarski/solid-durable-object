import { defineConfig } from "@solidjs/start/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  server: {
    devProxy: {},
    preset: "static",
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
