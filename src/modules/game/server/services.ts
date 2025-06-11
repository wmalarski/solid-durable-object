import { action, query, redirect, revalidate } from "@solidjs/router";
import { decode } from "decode-formdata";
import * as v from "valibot";
import { fetchApi } from "~/utils/fetch-api";
import { parseFormValidationError } from "~/utils/forms";
import { paths } from "~/utils/paths";
import type {
  CreateGameResult,
  GetGameConfigResult,
  JoinGameResult,
} from "./game-router";
import { getCreateSchema, getJoinSchema } from "./validation";

export const joinGameAction = action(async (form: FormData) => {
  const parsed = await v.safeParseAsync(getJoinSchema(), decode(form));

  if (!parsed.success) {
    return parseFormValidationError(parsed.issues);
  }

  const gameId = parsed.output.gameId;
  await fetchApi<JoinGameResult>({
    options: { body: JSON.stringify(parsed.output), method: "post" },
    path: `/game/${gameId}/join`,
  });

  throw revalidate(getGameConfigQuery.keyFor({ gameId }));
}, "joinGameAction");

export const createGameAction = action(async (form: FormData) => {
  const parsed = await v.safeParseAsync(getCreateSchema(), decode(form));

  if (!parsed.success) {
    return parseFormValidationError(parsed.issues);
  }

  const path = "/game/create";

  console.log("[createGameAction]", { parsed, path });

  const response = await fetchApi<CreateGameResult>({
    options: { body: JSON.stringify(parsed.output), method: "post" },
    path: "/game/create",
  });
  const gameId = response.gameId;

  console.log("[createGameAction]", gameId);

  throw redirect(paths.game(gameId), {
    revalidate: getGameConfigQuery.keyFor({ gameId }),
  });
}, "createGameAction");

type GetGameConfigQueryArgs = {
  gameId: string;
};

export const getGameConfigQuery = query(
  async ({ gameId }: GetGameConfigQueryArgs) => {
    const path = `/game/${gameId}/config`;
    console.log("[getGameConfigQuery]", { gameId, path });
    return fetchApi<GetGameConfigResult>({ path });
  },
  "getGameConfigQuery",
);
