import { useSubmission } from "@solidjs/router";
import type { Component } from "solid-js";
import { Button } from "~/ui/button/button";
import { formContainerRecipe } from "~/ui/form-container/form-container.recipe";
import { useI18n } from "~/utils/i18n";
import { createGameAction } from "../server/services";
import { JoinFields } from "./join-fields";

export const JoinForm: Component = () => {
  const { t } = useI18n();

  const submission = useSubmission(createGameAction);

  return (
    <form
      action={createGameAction}
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
