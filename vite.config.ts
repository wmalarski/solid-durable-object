import devServer from "@hono/vite-dev-server";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv } from "vite";
import { createHtmlPlugin } from "vite-plugin-html";
import solid from "vite-plugin-solid";

process.env = { ...process.env, ...loadEnv("production", process.cwd(), "") };

export default defineConfig({
  build: {
    rollupOptions: {
      external: ["@cloudflare/workers-types", "cloudflare:workers"],
    },
  },
  plugins: [
    solid(),
    tailwindcss(),
    createHtmlPlugin({
      minify: true,
    }),
    devServer({
      entry: "./api/route.ts",
      // include: [/^\/api/],
    }),
  ],
});
/*
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

*/
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
