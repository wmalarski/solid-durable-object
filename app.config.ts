import { defineConfig } from "@solidjs/start/config";
import tailwindcss from "@tailwindcss/vite";
import nitroCloudflareBindings from "nitro-cloudflare-dev";

export default defineConfig({
  server: {
    cloudflare: { nodeCompat: true },
    experimental: { websocket: true },
    externals: {
      external: ["@cloudflare/workers-types", "cloudflare:workers"],
    },
    modules: [nitroCloudflareBindings],
    preset: "cloudflare_durable",
  },
  vite: {
    build: {
      rollupOptions: {
        external: ["@cloudflare/workers-types", "cloudflare:workers"],
      },
    },
    plugins: [tailwindcss()],
    resolve: {
      external: ["@cloudflare/workers-types", "cloudflare:workers"],
    },
    ssr: {
      external: ["@cloudflare/workers-types", "cloudflare:workers"],
    },
  },
}).addRouter({
  base: "/ws",
  handler: "./src/ws.ts",
  name: "ws",
  target: "server",
  type: "http",
});
