import devServer from "@hono/vite-dev-server";
import cloudflareAdapter from "@hono/vite-dev-server/cloudflare";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import { createHtmlPlugin } from "vite-plugin-html";
import solid from "vite-plugin-solid";
import tsconfigPaths from "vite-tsconfig-paths";

//
// process.env = { ...process.env, ...loadEnv("production", process.cwd(), "") };

export default defineConfig({
  build: {
    rollupOptions: {
      external: ["@cloudflare/workers-types", "cloudflare:workers"],
    },
  },
  plugins: [
    tsconfigPaths(),
    solid(),
    tailwindcss(),
    createHtmlPlugin({ minify: true }),
    devServer({
      adapter: cloudflareAdapter,
      entry: "./src/api/route.ts",
      exclude: [/^(?!\/api)\/.*/],
    }),
    // include: [/^\/api/],
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
