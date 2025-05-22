import { defineConfig } from "@solidjs/start/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  server: {
    // cloudflare: {
    //   wrangler: {
    //     durable_objects: []
    //     name: "solid-durable-object",
    //   },
    // },
    compatibilityDate: "2025-05-21",
    experimental: { websocket: true },
    preset: "cloudflare_durable",
  },
  vite: {
    plugins: [tailwindcss()],
  },
}).addRouter({
  base: "/ws",
  handler: "./src/ws.ts",
  name: "ws",
  target: "server",
  type: "http",
});
