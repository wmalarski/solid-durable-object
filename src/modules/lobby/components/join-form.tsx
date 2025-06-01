import { decode } from "decode-formdata";
import { type Component, type ComponentProps, createSignal } from "solid-js";
import * as v from "valibot";
import { useHonoClient } from "~/modules/shared/hono-client";
import { useI18n } from "~/modules/shared/i18n";
import { Button } from "~/ui/button/button";
import { formContainerRecipe } from "~/ui/form-container/form-container.recipe";
import { JoinFields } from "./join-fields";

export const JoinForm: Component = () => {
  const { t } = useI18n();

  const [isPending, setIsPending] = createSignal(false);

  const honoClient = useHonoClient();

  const onSubmit: ComponentProps<"form">["onSubmit"] = (event) => {
    event.preventDefault();

    setIsPending(true);

    const formData = new FormData(event.currentTarget);
    const parsed = v.safeParse(
      v.object({
        color: v.pipe(v.string(), v.hexColor()),
        name: v.pipe(v.string(), v.nonEmpty()),
      }),
      decode(formData),
    );

    honoClient().api.join.$post();

    setIsPending(false);
  };

  return (
    <form class={formContainerRecipe()} onSubmit={onSubmit}>
      <JoinFields pending={isPending()} />
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
