import { action, query, redirect } from "@solidjs/router";
import { decode } from "decode-formdata";
import * as v from "valibot";
import { parseFormValidationError } from "~/utils/forms";
import { makeHonoClient } from "~/utils/hono-client";
import { paths } from "~/utils/paths";
import { getJoinSchema } from "./validation";

export const joinLobbyAction = action(async (form: FormData) => {
  const parsed = await v.safeParseAsync(getJoinSchema(), decode(form));

  if (!parsed.success) {
    return parseFormValidationError(parsed.issues);
  }

  const honoClient = makeHonoClient();

  const response = await honoClient.api.game.join
    .$post({ json: parsed.output })
    .then((response) => response.json());

  throw redirect(paths.game(response.gameId));
}, "joinLobbyAction");

type GetGameConfigQueryArgs = {
  gameId: string;
};

export const getGameConfigQuery = query(
  async ({ gameId }: GetGameConfigQueryArgs) => {
    const honoClient = makeHonoClient();

    const result = await honoClient.api.game.config[":gameId"]
      .$get({ param: { gameId } })
      .then((response) => response.json());

    return result;
  },
  "getGameConfigQuery",
);

export type GetGameConfigReturn = Awaited<
  ReturnType<typeof getGameConfigQuery>
>;
