import {
  createError,
  createRouter,
  defineEventHandler,
  defineWebSocketHandler,
} from "h3";
import { useSafeValidatedBody, useValidatedBody } from "h3-valibot";
import { nanoid } from "nanoid";
import {
  getPlayerCookie,
  setPlayerCookie,
} from "~/modules/player/server/cookies";
import type { Player } from "~/modules/player/server/types";
import type { InferEventResult } from "~/utils/h3-helpers";
import { getCreateSchema, getJoinSchema } from "./validation";

// const upgradeWebsocketHandler = defineWebSocketHandler(async (event: H3Event) => {
//   const params = await useValidatedParams(event, getGameIdSchema());

//   if (event.headers.get("upgrade") !== "websocket") {
//     throw createError({
//       message: "Expected Upgrade: websocket",
//       status: 426,
//     });
//   }

//   const gameDurableObject = event.context.cloudflare.env.GameDurableObject;
//   const gameObjectId = gameDurableObject.idFromString(params.gameId);
//   const stub = gameDurableObject.get(gameObjectId);
//   const request = getWebRequest(event);

//   const response = await stub.fetch(request);

//   console.log("[upgradeWebsocketHandler]", response);

//   return response;
// });

const upgradeWebsocketHandler = defineWebSocketHandler({
  close(peer) {
    console.log("[upgradeWebsocketHandler]:close");
    peer.publish("chat", { message: `${peer} left!`, user: "server" });
  },
  message(peer, message) {
    console.log("[upgradeWebsocketHandler]:message");
    if (message.text().includes("ping")) {
      peer.send({ message: "pong", user: "server" });
    } else {
      const msg = {
        message: message.toString(),
        user: peer.toString(),
      };
      peer.send(msg); // echo
      peer.publish("chat", msg);
    }
  },
  open(peer) {
    console.log("[upgradeWebsocketHandler]:open");
    peer.send({ message: `Welcome ${peer}!`, user: "server" });
    peer.publish("chat", { message: `${peer} joined!`, user: "server" });
    peer.subscribe("chat");
  },
});

const getGameConfigHandler = defineEventHandler((event) => {
  const player = getPlayerCookie(event);

  console.log("[getGameConfigHandler]", { player });

  return { player };
});

export type GetGameConfigResult = InferEventResult<typeof getGameConfigHandler>;

const joinGameHandler = defineEventHandler(async (event) => {
  const body = await useSafeValidatedBody(event, getJoinSchema());

  console.log("[joinGameHandler]", body);

  if (!body.success) {
    throw createError({});
  }

  const player: Player = { ...body.output, id: nanoid() };

  const gameDurableObject = event.context.cloudflare.env.GameDurableObject;
  const gameObjectId = gameDurableObject.idFromString(body.output.gameId);

  if (!gameObjectId) {
    throw createError({
      message: "Room not found",
      status: 404,
    });
  }

  setPlayerCookie(event, player);

  return { gameId: body.output.gameId };
});

export type JoinGameResult = InferEventResult<typeof joinGameHandler>;

const createGameHandler = defineEventHandler(async (event) => {
  const json = await useValidatedBody(event, getCreateSchema());
  const player: Player = { ...json, id: nanoid() };

  const gameDurableObject = event.context.cloudflare.env.GameDurableObject;
  const gameObjectId = gameDurableObject.newUniqueId();
  const newGameId = gameObjectId.toString();

  setPlayerCookie(event, player);

  return { gameId: newGameId };
});

export type CreateGameResult = InferEventResult<typeof createGameHandler>;

export const gameRouter = createRouter()
  .use("/:gameId/ws", upgradeWebsocketHandler)
  .get("/:gameId/config", getGameConfigHandler)
  .post("/join", joinGameHandler)
  .post("/create", createGameHandler);
