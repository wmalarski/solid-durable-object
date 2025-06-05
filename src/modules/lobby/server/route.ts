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

    const lobbyObjectId = c.env.LobbyDurableObject.idFromName("default");
    const lobbyObject = c.env.LobbyDurableObject.get(lobbyObjectId);

    console.log("[join]", { lobbyObject, lobbyObjectId, player });

    const gameId = await lobbyObject.joinLobby(player.id);

    console.log("[join]", { gameId, lobbyObject, lobbyObjectId, player });

    return c.json({ gameId, player });
  },
);
