import { vValidator } from "@hono/valibot-validator";
import { Hono } from "hono";
import { nanoid } from "nanoid";
import * as v from "valibot";
import {
  getPlayerCookie,
  setPlayerCookie,
} from "~/modules/player/server/cookies";
import type { Player } from "~/modules/player/server/types";
import type { HonoContext } from "~/utils/hono-types";
import { getJoinSchema } from "./validation";

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
  })
  .post("/join", vValidator("json", getJoinSchema()), async (c) => {
    const json = c.req.valid("json");
    const player: Player = { ...json, id: nanoid() };

    setPlayerCookie(c, player);

    const boardObjectId = c.env.BoardDurableObject.newUniqueId();
    const newGameId = boardObjectId.toString();

    console.log("[join]", { newGameId, player });

    return c.json({ gameId: newGameId });
  });
