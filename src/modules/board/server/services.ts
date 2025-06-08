import { action, query, redirect } from "@solidjs/router";
import { decode } from "decode-formdata";
import * as v from "valibot";
import { makeHonoClient } from "~/modules/shared/hono-client";
import { parseFormValidationError } from "~/utils/forms";
import { paths } from "~/utils/paths";
import { getJoinSchema } from "../../board/server/validation";

export const joinLobbyAction = action(async (form: FormData) => {
  const parsed = await v.safeParseAsync(getJoinSchema(), decode(form));

  if (!parsed.success) {
    return parseFormValidationError(parsed.issues);
  }

  const honoClient = makeHonoClient();

  const response = await honoClient.api.board.join
    .$post({ json: parsed.output })
    .then((response) => response.json());

  throw redirect(paths.game(response.gameId));
}, "joinLobbyAction");

type GetBoardConfigQueryArgs = {
  gameId: string;
};

export const getBoardConfigQuery = query(
  async ({ gameId }: GetBoardConfigQueryArgs) => {
    const honoClient = makeHonoClient();

    const result = await honoClient.api.board.config[":gameId"]
      .$get({ param: { gameId } })
      .then((response) => response.json());

    return result;
  },
  "getBoardConfig",
);

export type GetBoardConfigReturn = Awaited<
  ReturnType<typeof getBoardConfigQuery>
>;
