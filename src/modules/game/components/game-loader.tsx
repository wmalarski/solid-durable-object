import type { Component } from "solid-js";
import { Loading } from "~/ui/loading/loading";
import { useI18n } from "~/utils/i18n";

export const GameLoader: Component = () => {
  const { t } = useI18n();

  return (
    <div class="flex size-full h-screen flex-col items-center justify-center gap-2 bg-base-100">
      <Loading size="lg" />
      {t("game.loading")}
    </div>
  );
};
