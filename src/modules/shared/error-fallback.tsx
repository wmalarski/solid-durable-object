import { onMount } from "solid-js";
import { Button } from "~/ui/button/button";
import { Card, CardBody } from "~/ui/card/card";
import { cardTitleRecipe } from "~/ui/card/card.recipe";
import { XCircleIcon } from "~/ui/icons/x-circle-icon";
import { Link } from "~/ui/link/link";
import { paths } from "~/utils/paths";
import { useI18n } from "../../utils/i18n";

export const ErrorFallback = (error: unknown, reset: VoidFunction) => {
  const { t } = useI18n();

  onMount(() => {
    console.error("ERROR", error);
  });

  return (
    <div class="flex w-full justify-center pt-10">
      <Card class="w-full max-w-md" variant="bordered">
        <CardBody class="items-center">
          <XCircleIcon class="size-10 text-error" />
          <header class="flex items-center justify-between gap-2 text-error">
            <h2 class={cardTitleRecipe()}>{t("error.title")}</h2>
          </header>
          <span class="text-center">
            {/* biome-ignore lint/suspicious/noExplicitAny: error */}
            {t("error.description", { message: (error as any)?.message })}
          </span>
          <Button onClick={reset}>{t("error.reload")}</Button>
          <Link href={paths.home}>{t("error.home")}</Link>
        </CardBody>
      </Card>
    </div>
  );
};
