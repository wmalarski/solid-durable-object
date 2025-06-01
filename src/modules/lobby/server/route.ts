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
    const ip = c.req.header("CF-Connecting-IP");

    const json = c.req.valid("json");

    console.log("[join]", { ip });

    if (!ip) {
      return c.text("Invalid IP value", 400);
    }

    const player: Player = { ...json, id: nanoid() };
    setPlayerCookie(c, player);

    const lobbyObjectId = c.env.LobbyDurableObject.idFromName("default");
    const lobbyObject = c.env.LobbyDurableObject.get(lobbyObjectId);
    const durableObjectId = await lobbyObject.joinLobby(ip);
    const gameId = await durableObjectId.toString();

    return c.json({ gameId, player });
  },
);
