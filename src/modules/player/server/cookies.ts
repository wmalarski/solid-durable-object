import type { Context } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import * as v from "valibot";
import type { Player } from "./types";
import { getPlayerSchema } from "./validation";

const PLAYER_COOKIE_KEY = "sdo_player";

export const getPlayerCookie = (c: Context): Player | null => {
  const cookie = getCookie(c, PLAYER_COOKIE_KEY);
  if (!cookie) {
    return null;
  }

  try {
    const parsedJson = JSON.parse(cookie);
    const parsedPlayer = v.parse(getPlayerSchema(), parsedJson);
    return parsedPlayer;
  } catch {
    return null;
  }
};

export const setPlayerCookie = (c: Context, player: Player) => {
  setCookie(c, PLAYER_COOKIE_KEY, JSON.stringify(player), {
    httpOnly: true,
    maxAge: 1_000_000,
    sameSite: "Lax",
  });
};
