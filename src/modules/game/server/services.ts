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
import { getJoinSchema } from "./validation";

export const joinGameAction = action(async (form: FormData) => {
  const parsed = await v.safeParseAsync(getJoinSchema(), decode(form));

  if (!parsed.success) {
    return parseFormValidationError(parsed.issues);
  }

  const path = `/game/${parsed.output.gameId}/join`;
  await fetchApi<JoinGameResult>({ path });

  throw revalidate(getGameConfigQuery.key);
}, "joinGameAction");

export const createGameAction = action(async (form: FormData) => {
  const parsed = await v.safeParseAsync(getJoinSchema(), decode(form));

  if (!parsed.success) {
    return parseFormValidationError(parsed.issues);
  }

  const path = "/game/create";
  const response = await fetchApi<CreateGameResult>({ path });

  throw redirect(paths.game(response.gameId), {
    revalidate: getGameConfigQuery.key,
  });
}, "createGameAction");

type GetGameConfigQueryArgs = {
  gameId: string;
};

export const getGameConfigQuery = query(
  async ({ gameId }: GetGameConfigQueryArgs) => {
    const path = `/game/${gameId}/config`;
    return fetchApi<GetGameConfigResult>({ path });
  },
  "getGameConfigQuery",
);
