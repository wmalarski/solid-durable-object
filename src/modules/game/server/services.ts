import { action, query, redirect, revalidate } from "@solidjs/router";
import { decode } from "decode-formdata";
import * as v from "valibot";
import { makeHonoClient } from "~/api/client";
import { parseFormValidationError } from "~/utils/forms";
import { paths } from "~/utils/paths";
import { getCreateSchema, getJoinSchema } from "./validation";

export const joinGameAction = action(async (form: FormData) => {
  const parsed = await v.safeParseAsync(getJoinSchema(), decode(form));

  if (!parsed.success) {
    return parseFormValidationError(parsed.issues);
  }

  const honoClient = makeHonoClient();

  const result = await honoClient.api.join
    .$post({ json: parsed.output })
    .then((response) => response.json());

  throw revalidate(getGameConfigQuery.keyFor({ gameId: result.gameId }));
}, "joinGameAction");

export const createGameAction = action(async (form: FormData) => {
  const parsed = await v.safeParseAsync(getCreateSchema(), decode(form));

  if (!parsed.success) {
    return parseFormValidationError(parsed.issues);
  }

  const honoClient = makeHonoClient();

  const result = await honoClient.api.create
    .$post({ json: parsed.output })
    .then((response) => response.json());

  const gameId = result.gameId;

  throw redirect(paths.game(gameId), {
    revalidate: getGameConfigQuery.keyFor({ gameId }),
  });
}, "createGameAction");

type GetGameConfigQueryArgs = {
  gameId: string;
};

export const getGameConfigQuery = query(
  async ({ gameId }: GetGameConfigQueryArgs) => {
    const honoClient = makeHonoClient();

    const result = await honoClient.api[":gameId"].config
      .$get({ param: { gameId } })
      .then((response) => response.json());

    return result;
  },
  "getGameConfigQuery",
);

export type GetGameConfigResult = Awaited<
  ReturnType<typeof getGameConfigQuery>
>;
