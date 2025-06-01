import { vValidator } from "@hono/valibot-validator";
import { Hono } from "hono";
import { getJoinValidator } from "~/modules/lobby/server/validation";
import type { HonoContext } from "~/modules/shared/hono-types";

export const lobbyApi = new Hono<HonoContext>().post(
  "/join",
  vValidator("json", getJoinValidator()),
  async (c) => {
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
  },
);
