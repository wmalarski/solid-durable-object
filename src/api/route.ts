import { Hono } from "hono";
import { gameRouter } from "~/modules/game/server/game-router";
import type { HonoContext } from "./types";

const app = new Hono<HonoContext>()
  .route("/api", gameRouter)
  .get("*", async (c) => c.env.ASSETS.fetch(c.req.raw));

export default app;

export { GameDurableObject } from "../modules/game/server/game-durable-object";
