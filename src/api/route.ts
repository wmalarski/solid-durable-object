import { createApp, createRouter, defineEventHandler, toWebHandler } from "h3";

export const app = createApp();

const router = createRouter();
app.use(router);

router.get(
  "*",
  defineEventHandler((event) => {
    console.log("event", event);
    return { message: "⚡️ Tadaa!" };
  }),
);

// type HonoContext = {
//   Bindings: Env;
// };

// const api = new Hono<HonoContext>().route("/game", gameRoute);

// const appHono = new Hono<HonoContext>()
//   .route("/api", api)
//   .get("*", async (c) => c.env.ASSETS.fetch(c.req.raw));

export { GameDurableObject } from "../modules/game/server/game-durable-object";

// export default appHono;

const handler = toWebHandler(app);

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    return handler(request, { cloudflare: { ctx, env } });
  },
};
