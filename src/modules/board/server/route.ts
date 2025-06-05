import { vValidator } from "@hono/valibot-validator";
import { Hono } from "hono";
import * as v from "valibot";
import { getPlayerCookie } from "~/modules/player/server/cookies";
import type { HonoContext } from "~/modules/shared/hono-types";

const gameIdSchema = v.object({ gameId: v.pipe(v.string(), v.nonEmpty()) });

export const boardApi = new Hono<HonoContext>()
  .get("/ws/:gameId", vValidator("param", gameIdSchema), async (c) => {
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
  .get("/config/:gameId", vValidator("param", gameIdSchema), async (c) => {
    const player = getPlayerCookie(c);
    return c.json({ player });
  });
