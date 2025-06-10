import { createError, createRouter, defineEventHandler } from "h3";
import { useValidatedBody, useValidatedParams } from "h3-valibot";
import { nanoid } from "nanoid";
import * as v from "valibot";
import {
  getPlayerCookie,
  setPlayerCookie,
} from "~/modules/player/server/cookies";
import type { Player } from "~/modules/player/server/types";
import { getJoinSchema } from "./validation";

const gameIdSchema = v.object({
  gameId: v.pipe(v.string(), v.length(64), v.nonEmpty()),
});

export const gameRouter = createRouter()
  .get(
    "/ws/:gameId",
    defineEventHandler(async (event) => {
      const params = await useValidatedParams(event, gameIdSchema);

      if (event.headers.get("upgrade") !== "websocket") {
        throw createError({
          message: "Expected Upgrade: websocket",
          status: 426,
        });
      }

      const gameId = params.gameId;
      const gameObjectId = event.context.GameDurableObject.idFromString(gameId);
      const stub = event.context.GameDurableObject.get(gameObjectId);

      return stub.fetch(event.node.req);
    }),
  )
  .get("/config/:gameId", (event) => {
    const player = getPlayerCookie(event);
    return { player };
  })
  .post("/join", async (event) => {
    const json = await useValidatedBody(event, getJoinSchema());
    const player: Player = { ...json, id: nanoid() };

    setPlayerCookie(event, player);

    const gameObjectId = event.context.env.GameDurableObject.newUniqueId();
    const newGameId = gameObjectId.toString();

    console.log("[join]", { newGameId, player });

    return { gameId: newGameId };
  });

// export const gameRoute = new Hono<HonoContext>()
//   .get("/ws/:gameId", vValidator("param", gameIdSchema), async (c) => {
//     if (c.req.header("upgrade") !== "websocket") {
//       return c.text("Expected Upgrade: websocket", 426);
//     }

//     const gameId = c.req.param("gameId");

//     const gameObjectId = c.env.GameDurableObject.idFromString(gameId);
//     const stub = c.env.GameDurableObject.get(gameObjectId);

//     return stub.fetch(c.req.raw);
//   })
//   .get("/config/:gameId", vValidator("param", gameIdSchema), async (c) => {
//     const player = getPlayerCookie(c);
//     return c.json({ player });
//   })
//   .post("/join", vValidator("json", getJoinSchema()), async (c) => {
//     const json = c.req.valid("json");
//     const player: Player = { ...json, id: nanoid() };

//     setPlayerCookie(c, player);

//     const gameObjectId = c.env.GameDurableObject.newUniqueId();
//     const newGameId = gameObjectId.toString();

//     console.log("[join]", { newGameId, player });

//     return c.json({ gameId: newGameId });
//   });
