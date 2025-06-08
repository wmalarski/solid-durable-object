import type { Context } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import * as v from "valibot";
import type { Player } from "./types";
import { getPlayerSchema } from "./validation";

const PLAYER_COOKIE_KEY = "sdo_player";

const parsePlayerCookie = (cookie?: string | null): Player | null => {
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

export const getPlayerCookieFromRequest = (request: Request): Player | null => {
  const cookie = request.headers.get(PLAYER_COOKIE_KEY);
  return parsePlayerCookie(cookie);
};

export const getPlayerCookie = (c: Context): Player | null => {
  const cookie = getCookie(c, PLAYER_COOKIE_KEY);
  return parsePlayerCookie(cookie);
};

export const setPlayerCookie = (c: Context, player: Player) => {
  setCookie(c, PLAYER_COOKIE_KEY, JSON.stringify(player), {
    httpOnly: true,
    maxAge: 1_000_000,
    sameSite: "Lax",
  });
};
