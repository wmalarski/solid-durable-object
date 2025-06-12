import { parse } from "cookie-es";
import { getCookie, type H3Event, setCookie } from "h3";
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
  const cookie = request.headers.get("Cookie");
  const playerCookie = cookie ? parse(cookie)[PLAYER_COOKIE_KEY] : null;
  return parsePlayerCookie(playerCookie);
};

export const getPlayerCookie = (event: H3Event): Player | null => {
  const cookie = getCookie(event, PLAYER_COOKIE_KEY);
  return parsePlayerCookie(cookie);
};

export const setPlayerCookie = (event: H3Event, player: Player) => {
  setCookie(event, PLAYER_COOKIE_KEY, JSON.stringify(player), {
    httpOnly: true,
    maxAge: 1_000_000,
    sameSite: "lax",
  });
};
