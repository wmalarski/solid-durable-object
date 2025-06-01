import { vValidator } from "@hono/valibot-validator";
import { Hono } from "hono";
import { getJoinValidator } from "~/modules/lobby/server/validation";

type HonoContext = {
  Bindings: Env;
};

const api = new Hono<HonoContext>()
  .get("/ws/:gameId", async (c) => {
    if (c.req.header("upgrade") !== "websocket") {
      return c.text("Expected Upgrade: websocket", 426);
    }

    const gameId = c.req.param("gameId");

    const lobbyObjectId = c.env.LobbyDurableObject.idFromName("default");
    const lobbyObject = c.env.LobbyDurableObject.get(lobbyObjectId);
    const boardObjectId = c.env.BoardDurableObject.idFromName(gameId);

    const hasLobby = lobbyObject.hasLobby(boardObjectId);

    if (!hasLobby) {
      return c.text("Invalid gameId value", 400);
    }

    const stub = c.env.BoardDurableObject.get(boardObjectId);

    return stub.fetch(c.req.raw);
  })
  .post("/join", vValidator("json", getJoinValidator()), async (c) => {
    const ip = c.req.header("CF-Connecting-IP");

    console.log("[join]", { ip });

    if (!ip) {
      return c.text("Invalid IP value", 400);
    }

    const lobbyObjectId = c.env.LobbyDurableObject.idFromName("default");
    const lobbyObject = c.env.LobbyDurableObject.get(lobbyObjectId);
    const durableObjectId = await lobbyObject.joinLobby(ip);
    const gameId = await durableObjectId.toString();

    return c.json({ gameId });
  });

const app = new Hono<HonoContext>()
  .route("/api", api)
  .get("*", async (c) => c.env.ASSETS.fetch(c.req.raw));

export { BoardDurableObject } from "../modules/board/server/board-durable-object";
export { LobbyDurableObject } from "../modules/lobby/server/lobby-durable-object";

export default app;
