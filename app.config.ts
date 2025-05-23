import { defineConfig } from "@solidjs/start/config";
import tailwindcss from "@tailwindcss/vite";
import nitroCloudflareBindings from "nitro-cloudflare-dev";

export default defineConfig({
  server: {
    cloudflare: {
      deployConfig: true,
      nodeCompat: true,
      wrangler: {
        assets: {
          binding: "ASSETS",
          directory: "./.output/public",
          not_found_handling: "single-page-application",
        },
        compatibility_date: "2025-05-21",
        durable_objects: {
          bindings: [{ class_name: "$DurableObject", name: "$DurableObject" }],
        },
        observability: {
          enabled: true,
        },
      },
    },
    experimental: { websocket: true },
    modules: [nitroCloudflareBindings],
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
