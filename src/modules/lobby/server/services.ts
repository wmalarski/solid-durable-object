import { action, redirect } from "@solidjs/router";
import { decode } from "decode-formdata";
import * as v from "valibot";
import { useHonoClient } from "~/modules/shared/hono-client";
import { parseFormValidationError } from "~/utils/forms";
import { paths } from "~/utils/paths";
import { getJoinSchema } from "./validation";

export const joinLobbyAction = action(async (form: FormData) => {
  console.log("joinLobbyAction");

  const parsed = await v.safeParseAsync(getJoinSchema(), decode(form));
  console.log("joinLobbyAction", parsed);

  if (!parsed.success) {
    return parseFormValidationError(parsed.issues);
  }

  console.log("joinLobbyAction", parsed.output);

  const honoClient = useHonoClient();

  try {
    console.log("joinLobbyAction", honoClient());
  } catch (error) {
    console.log(error);
  }

  const response = await honoClient()
    .api.lobby.join.$post({ json: parsed.output })
    .then((response) => response.json());

  throw redirect(paths.game(response.gameId));
}, "joinLobbyAction");
