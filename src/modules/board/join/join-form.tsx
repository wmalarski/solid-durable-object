import { useSubmission } from "@solidjs/router";
import type { Component } from "solid-js";
import { Button } from "~/ui/button/button";
import { formContainerRecipe } from "~/ui/form-container/form-container.recipe";
import { useI18n } from "~/utils/i18n";
import { joinLobbyAction } from "../server/services";
import { JoinFields } from "./join-fields";

export const JoinForm: Component = () => {
  const { t } = useI18n();

  const submission = useSubmission(joinLobbyAction);

  return (
    <form
      action={joinLobbyAction}
      class={formContainerRecipe({ maxW: "md" })}
      method="post"
    >
      <JoinFields issues={submission.result} pending={submission.pending} />
      <Button
        color="primary"
        disabled={submission.pending}
        isLoading={submission.pending}
        type="submit"
      >
        {t("join.join")}
      </Button>
    </form>
  );
};
