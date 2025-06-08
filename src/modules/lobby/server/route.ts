import { vValidator } from "@hono/valibot-validator";
import { Hono } from "hono";
import { nanoid } from "nanoid";
import { getJoinSchema } from "~/modules/lobby/server/validation";
import { setPlayerCookie } from "~/modules/player/server/cookies";
import type { Player } from "~/modules/player/server/types";
import type { HonoContext } from "~/modules/shared/hono-types";

export const lobbyApi = new Hono<HonoContext>().post(
  "/join",
  vValidator("json", getJoinSchema()),
  async (c) => {
    const json = c.req.valid("json");
    const player: Player = { ...json, id: nanoid() };

    setPlayerCookie(c, player);

    const boardObjectId = c.env.BoardDurableObject.newUniqueId();
    const newGameId = boardObjectId.toString();

    console.log("[join]", { newGameId, player });

    return c.json({ gameId: newGameId });
  },
);
