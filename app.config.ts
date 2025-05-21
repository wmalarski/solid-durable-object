import { defineConfig } from "@solidjs/start/config";
import tailwindcss from "@tailwindcss/vite";
import { assetsIgnorePlugin } from "./src/build/assets-ignore-plugin";

export default defineConfig({
  server: {
    compatibilityDate: "2025-05-21",
    preset: "cloudflare_module",
  },
  vite: {
    plugins: [tailwindcss(), assetsIgnorePlugin()],
  },
});
