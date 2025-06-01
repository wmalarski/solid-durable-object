import { Hono } from "hono";
import { boardApi } from "~/modules/board/server/route";
import { lobbyApi } from "~/modules/lobby/server/route";

type HonoContext = {
  Bindings: Env;
};

const api = new Hono<HonoContext>()
  .route("/board", boardApi)
  .route("/lobby", lobbyApi);

const app = new Hono<HonoContext>()
  .route("/api", api)
  .get("*", async (c) => c.env.ASSETS.fetch(c.req.raw));

export { BoardDurableObject } from "../modules/board/server/board-durable-object";
export { LobbyDurableObject } from "../modules/lobby/server/lobby-durable-object";

export default app;
