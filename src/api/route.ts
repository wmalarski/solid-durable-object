import { Hono } from "hono";
import { gameRoute } from "~/modules/game/server/route";

type HonoContext = {
  Bindings: Env;
};

const api = new Hono<HonoContext>().route("/game", gameRoute);

const app = new Hono<HonoContext>()
  .route("/api", api)
  .get("*", async (c) => c.env.ASSETS.fetch(c.req.raw));

export { GameDurableObject } from "../modules/game/server/game-durable-object";

export default app;
