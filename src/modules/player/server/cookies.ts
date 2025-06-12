import { getCookie, type H3Event, setCookie } from "h3";
import * as v from "valibot";
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
  return parsePlayerCookie(cookie);
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
