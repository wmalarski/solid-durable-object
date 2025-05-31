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
  ],
  server: {
    proxy: {
      "/api": {
        rewrite: (path: string) => path.replace(/^\/api/, "/api"),
      },
    },
  },
});

/*

export default defineConfig(async ({ mode }) => {
  if (mode === 'client') {
    return {
      plugins: [
        viteReact(),
        TanStackRouterVite({ routesDirectory: 'app/routes', generatedRouteTree: "app/routeTree.gen.ts" })],
      resolve,
      server: {
        proxy: {
          '/api': {
            target: 'http://localhost:3000',
            changeOrigin: true,
            rewrite: (path: string) => path.replace(/^\/api/, '/api'),
          }
        },
      },
    }
  } else {
    const isDev = process.env.NODE_ENV === 'development';
    let devServerPlugin;
    if (isDev) {
      const { env, dispose } = await getPlatformProxy();
      devServerPlugin = devServer({
        entry: 'app/api/index.tsx',
        adapter: {
          env,
          onServerClose: dispose
        },
      });
    }

    return {
      plugins: [
        pages({
          entry: ['app/api/index.tsx'],
        }),
        devServerPlugin,
      ],
      resolve,
      server: {
        port: 3000,
      },
    }
  }
})

*/

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
