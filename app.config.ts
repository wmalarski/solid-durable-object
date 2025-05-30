import { defineConfig } from "@solidjs/start/config";
import tailwindcss from "@tailwindcss/vite";
import nitroCloudflareBindings from "nitro-cloudflare-dev";

export default defineConfig({
  server: {
    cloudflare: { deployConfig: true, nodeCompat: true },
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
  },
});
// .addRouter({
//   base: "/ws",
//   handler: "./src/ws.ts",
//   name: "ws",
//   plugins: () => [
//     config("cf-build", {
//       build: {
//         rollupOptions: {
//           external: ["@cloudflare/workers-types", "cloudflare:workers"],
//         },
//       },
//     }),
//   ],
//   target: "server",
//   type: "http",
// });
