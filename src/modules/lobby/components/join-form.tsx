import { useNavigate } from "@solidjs/router";
import { decode } from "decode-formdata";
import { type Component, type ComponentProps, createSignal } from "solid-js";
import * as v from "valibot";
import { useHonoClient } from "~/modules/shared/hono-client";
import { useI18n } from "~/modules/shared/i18n";
import { Button } from "~/ui/button/button";
import { formContainerRecipe } from "~/ui/form-container/form-container.recipe";
import { type FormIssues, parseFormValidationError } from "~/utils/forms";
import { paths } from "~/utils/paths";
import { getJoinSchema } from "../server/validation";
import { JoinFields } from "./join-fields";

export const JoinForm: Component = () => {
  const { t } = useI18n();

  const navigate = useNavigate();

  const [isPending, setIsPending] = createSignal(false);
  const [formIssues, setFormIssues] = createSignal<FormIssues>();

  const honoClient = useHonoClient();

  const onSubmit: ComponentProps<"form">["onSubmit"] = async (event) => {
    event.preventDefault();

    setIsPending(true);

    const formData = new FormData(event.currentTarget);
    const parsed = v.safeParse(getJoinSchema(), decode(formData));

    if (!parsed.success) {
      setFormIssues(parseFormValidationError(parsed.issues));
      return;
    }

    const response = await honoClient()
      .api.lobby.join.$post({ json: parsed.output })
      .then((response) => response.json());

    navigate(paths.game(response.gameId));

    setIsPending(false);
  };

  return (
    <form class={formContainerRecipe()} onSubmit={onSubmit}>
      <JoinFields issues={formIssues()} pending={isPending()} />
      <Button
        color="primary"
        disabled={isPending()}
        isLoading={isPending()}
        type="submit"
      >
        {t("lobby.join.join")}
      </Button>
    </form>
  );
};
