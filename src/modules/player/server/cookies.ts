import type { Context } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import * as v from "valibot";
import { parseCookies } from "vinxi/http";
import type { Player } from "./types";
import { getPlayerSchema } from "./validation";

const PLAYER_COOKIE_KEY = "sdo_player";

const parsePlayerCookie = (cookie?: string | null): Player | null => {
  console.log("[parsePlayerCookie]", { cookie });
  if (!cookie) {
    return null;
  }

  try {
    console.log("[parsePlayerCookie]", { cookie });
    const parsedJson = JSON.parse(cookie);
    console.log("[parsePlayerCookie]", { parsedJson });
    const parsedPlayer = v.parse(getPlayerSchema(), parsedJson);
    console.log("[parsePlayerCookie]", { parsedPlayer });
    return parsedPlayer;
  } catch {
    return null;
  }
};

export const getPlayerCookieFromRequest = (request: Request): Player | null => {
  const cookie = request.headers.get("Cookie");
  parseCookies();
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
