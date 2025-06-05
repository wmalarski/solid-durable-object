import { action, redirect } from "@solidjs/router";
import { decode } from "decode-formdata";
import * as v from "valibot";
import { makeHonoClient } from "~/modules/shared/hono-client";
import { parseFormValidationError } from "~/utils/forms";
import { paths } from "~/utils/paths";
import { getJoinSchema } from "./validation";

export const joinLobbyAction = action(async (form: FormData) => {
  const parsed = await v.safeParseAsync(getJoinSchema(), decode(form));

  if (!parsed.success) {
    return parseFormValidationError(parsed.issues);
  }

  const honoClient = makeHonoClient();

  const response = await honoClient.api.lobby.join
    .$post({ json: parsed.output })
    .then((response) => response.json());

  throw redirect(paths.game(response.gameId));
}, "joinLobbyAction");
