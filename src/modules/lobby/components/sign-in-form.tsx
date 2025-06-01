import { useSubmission } from "@solidjs/router";
import type { Component } from "solid-js";
import { useI18n } from "~/modules/common/contexts/i18n";
import { paths } from "~/modules/common/utils/paths";
import { Button } from "~/ui/button/button";
import { formContainerRecipe } from "~/ui/form-container/form-container.recipe";
import { Link } from "~/ui/link/link";
import { signInServerAction } from "../server";
import { AuthFields } from "./join-fields";

export const SignInForm: Component = () => {
  const { t } = useI18n();

  const submission = useSubmission(signInServerAction);

  return (
    <form
      action={signInServerAction}
      class={formContainerRecipe()}
      method="post"
    >
      <AuthFields
        pending={submission.pending}
        result={submission.result}
        title={t("auth.signIn")}
      />
      <Button
        color="primary"
        disabled={submission.pending}
        isLoading={submission.pending}
        type="submit"
      >
        {t("auth.signIn")}
      </Button>
      <div class="flex justify-center">
        <Link class="text-xs" href={paths.signUp}>
          {t("auth.signUp")}
        </Link>
      </div>
    </form>
  );
};
