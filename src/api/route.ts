import {
  createApp,
  createError,
  createRouter,
  defineEventHandler,
  toWebHandler,
  useBase,
} from "h3";
import { gameRouter } from "~/modules/game/server/route";

export const app = createApp();

const router = createRouter()
  .use("/api/game/**", useBase("/api/game/", gameRouter.handler))
  .get(
    "**",
    defineEventHandler((event) => {
      const request = event.web?.request;

      if (!request) {
        throw createError({ message: "Invalid request", status: 400 });
      }

      return event.context.cloudflare.env.ASSETS.fetch(request);
    }),
  );

app.use(router);

export { GameDurableObject } from "../modules/game/server/game-durable-object";

const handler = toWebHandler(app);

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    return handler(request, { cloudflare: { ctx, env } });
  },
};
