import { createError, createRouter, defineEventHandler } from "h3";
import {
  useSafeValidatedBody,
  useValidatedBody,
  useValidatedParams,
} from "h3-valibot";
import { nanoid } from "nanoid";
import {
  getPlayerCookie,
  setPlayerCookie,
} from "~/modules/player/server/cookies";
import type { Player } from "~/modules/player/server/types";
import { getWebRequest, type InferEventResult } from "~/utils/h3-helpers";
import { getCreateSchema, getGameIdSchema } from "./validation";

const upgradeWebsocketHandler = defineEventHandler(async (event) => {
  const params = await useValidatedParams(event, getGameIdSchema());

  if (event.headers.get("upgrade") !== "websocket") {
    throw createError({
      message: "Expected Upgrade: websocket",
      status: 426,
    });
  }

  const gameDurableObject = event.context.cloudflare.env.GameDurableObject;
  const gameObjectId = gameDurableObject.idFromString(params.gameId);
  const stub = gameDurableObject.get(gameObjectId);
  const request = getWebRequest(event);

  return stub.fetch(request);
});

const getGameConfigHandler = defineEventHandler((event) => {
  const player = getPlayerCookie(event);
  return { player };
});

export type GetGameConfigResult = InferEventResult<typeof getGameConfigHandler>;

const joinGameHandler = defineEventHandler(async (event) => {
  const params = await useValidatedParams(event, getGameIdSchema());
  const body = await useValidatedBody(event, getCreateSchema());
  const player: Player = { ...body, id: nanoid() };

  const gameDurableObject = event.context.cloudflare.env.GameDurableObject;
  const gameObjectId = gameDurableObject.idFromString(params.gameId);

  if (!gameObjectId) {
    throw createError({
      message: "Room not found",
      status: 404,
    });
  }

  setPlayerCookie(event, player);

  return { gameId: params.gameId };
});

export type JoinGameResult = InferEventResult<typeof joinGameHandler>;

const createGameHandler = defineEventHandler(async (event) => {
  console.log("[createGameHandler]");

  const json = await useSafeValidatedBody(event, getCreateSchema());

  console.log("[createGameHandler]", json);

  if (!json.success) {
    throw createError({});
  }

  const player: Player = { ...json.output, id: nanoid() };

  console.log("[createGameHandler]", player);

  const gameDurableObject = event.context.cloudflare.env.GameDurableObject;
  const gameObjectId = gameDurableObject.newUniqueId();
  const newGameId = gameObjectId.toString();

  console.log("[createGameHandler]", { gameObjectId, newGameId });

  setPlayerCookie(event, player);

  return { gameId: newGameId };
});

export type CreateGameResult = InferEventResult<typeof createGameHandler>;

export const gameRouter = createRouter()
  .get("/:gameId/ws", upgradeWebsocketHandler)
  .get("/:gameId/config", getGameConfigHandler)
  .post("/:gameId/join", joinGameHandler)
  .post("/create", createGameHandler);
