import {
  createApp,
  createRouter,
  defineEventHandler,
  toWebHandler,
  useBase,
} from "h3";
import { gameRouter } from "~/modules/game/server/game-router";
import { getWebRequest } from "~/utils/h3-helpers";

export const app = createApp();

const apiRouter = createRouter().use(
  "/game/**",
  useBase("/game", gameRouter.handler),
);

const router = createRouter()
  .use("/api/**", useBase("/api", apiRouter.handler))
  .get(
    "**",
    defineEventHandler((event) =>
      event.context.cloudflare.env.ASSETS.fetch(getWebRequest(event)),
    ),
  );

app.use(router);

export { GameDurableObject } from "../modules/game/server/game-durable-object";

const handler = toWebHandler(app);

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    return handler(request, { cloudflare: { ctx, env } });
  },
};
