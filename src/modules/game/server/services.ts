import { action, query, redirect } from "@solidjs/router";
import { decode } from "decode-formdata";
import * as v from "valibot";
import { fetchApi } from "~/utils/fetch-api";
import { parseFormValidationError } from "~/utils/forms";
import { paths } from "~/utils/paths";
import type { GetGameConfigResult, JoinGameResult } from "./route";
import { getCreateSchema, getJoinSchema } from "./validation";

export const joinGameAction = action(async (form: FormData) => {
  const parsed = await v.safeParseAsync(getJoinSchema(), decode(form));

  if (!parsed.success) {
    return parseFormValidationError(parsed.issues);
  }

  const response = await fetchApi<JoinGameResult>({
    path: `/game/${parsed.output.id}/join`,
  });

  throw redirect(paths.game(response.gameId), {
    revalidate: getGameConfigQuery.key,
  });
}, "joinGameAction");

export const createGameAction = action(async (form: FormData) => {
  const parsed = await v.safeParseAsync(getCreateSchema(), decode(form));

  if (!parsed.success) {
    return parseFormValidationError(parsed.issues);
  }

  const response = await fetchApi<JoinGameResult>({
    path: "/game/join",
  });

  throw redirect(paths.game(response.gameId), {
    revalidate: getGameConfigQuery.key,
  });
}, "createGameAction");

type GetGameConfigQueryArgs = {
  gameId: string;
};

export const getGameConfigQuery = query(
  async ({ gameId }: GetGameConfigQueryArgs) => {
    const result = await fetchApi<GetGameConfigResult>({
      path: `/game/config/${gameId}`,
    });

    // const result = await honoClient.api.game.config[":gameId"]
    //   .$get({ param: { gameId } })
    //   .then((response) => response.json());

    return result;
  },
  "getGameConfigQuery",
);

export type GetGameConfigReturn = Awaited<
  ReturnType<typeof getGameConfigQuery>
>;
