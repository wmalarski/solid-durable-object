import { Hono } from "hono";
import type { HonoContext } from "~/modules/shared/hono-types";

export const boardApi = new Hono<HonoContext>().get(
  "/ws/:gameId",
  async (c) => {
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
  },
);
