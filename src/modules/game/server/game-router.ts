import { vValidator } from "@hono/valibot-validator";
import { Hono } from "hono";
import { nanoid } from "nanoid";
import type { HonoContext } from "~/api/types";
import {
  getPlayerCookie,
  setPlayerCookie,
} from "~/modules/player/server/cookies";
import type { Player } from "~/modules/player/server/types";
import { getCreateSchema, getGameIdSchema, getJoinSchema } from "./validation";

export const gameRouter = new Hono<HonoContext>()
  .get(
    "/:gameId/ws",
    vValidator("param", getGameIdSchema()),
    async (context) => {
      if (context.req.header("upgrade") !== "websocket") {
        return context.text("Expected Upgrade: websocket", 426);
      }

      const gameId = context.req.param("gameId");
      const gameObjectId = context.env.GameDurableObject.idFromString(gameId);
      const stub = context.env.GameDurableObject.get(gameObjectId);

      return stub.fetch(context.req.raw);
    },
  )
  .get(
    "/:gameId/config",
    vValidator("param", getGameIdSchema()),
    async (context) => {
      const player = getPlayerCookie(context);
      return context.json({ player });
    },
  )
  .post("/join", vValidator("json", getJoinSchema()), async (context) => {
    const { gameId, ...json } = context.req.valid("json");
    const player: Player = { ...json, id: nanoid() };

    const gameDurableObject = context.env.GameDurableObject;
    const gameObjectId = gameDurableObject.idFromString(gameId);

    if (!gameObjectId) {
      throw context.notFound();
    }

    setPlayerCookie(context, player);

    return context.json({ gameId });
  })
  .post("/create", vValidator("json", getCreateSchema()), async (context) => {
    const json = context.req.valid("json");
    const player: Player = { ...json, id: nanoid() };

    const gameDurableObject = context.env.GameDurableObject;
    const gameObjectId = gameDurableObject.newUniqueId();
    const newGameId = gameObjectId.toString();

    setPlayerCookie(context, player);

    return context.json({ gameId: newGameId });
  });
