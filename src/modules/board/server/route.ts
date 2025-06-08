import { vValidator } from "@hono/valibot-validator";
import { Hono } from "hono";
import * as v from "valibot";
import { getPlayerCookie } from "~/modules/player/server/cookies";
import type { HonoContext } from "~/modules/shared/hono-types";

const gameIdSchema = v.object({
  gameId: v.pipe(v.string(), v.length(64), v.nonEmpty()),
});

export const boardApi = new Hono<HonoContext>()
  .get("/ws/:gameId", vValidator("param", gameIdSchema), async (c) => {
    if (c.req.header("upgrade") !== "websocket") {
      return c.text("Expected Upgrade: websocket", 426);
    }

    const gameId = c.req.param("gameId");

    const boardObjectId = c.env.BoardDurableObject.idFromString(gameId);
    const stub = c.env.BoardDurableObject.get(boardObjectId);

    return stub.fetch(c.req.raw);
  })
  .get("/config/:gameId", vValidator("param", gameIdSchema), async (c) => {
    const player = getPlayerCookie(c);
    return c.json({ player });
  });
