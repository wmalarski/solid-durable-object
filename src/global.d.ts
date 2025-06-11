/// <reference types="@solidjs/start/env" />
/// <reference types="vite-plugin-pwa/solid" />
/// <reference types="vite-plugin-pwa/info" />
import "h3";

declare module "h3" {
  interface H3EventContext {
    cloudflare: {
      env: Env;
      ctx: ExecutionContext;
    };
  }
}
