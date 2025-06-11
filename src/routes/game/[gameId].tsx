import type { RouteDefinition } from "@solidjs/router";
import { lazy, Show } from "solid-js";
import { getGameConfigQuery } from "~/modules/game/server/services";
import { createIsMounted } from "~/utils/create-is-mounted";

const GameBoard = lazy(() =>
  import("~/modules/game/components/game-board").then((module) => ({
    default: module.GameBoard,
  })),
);

export const route = {
  load: async ({ params }) => {
    console.log("[load]", params.gameId);
    await getGameConfigQuery({ gameId: params.gameId });
  },
} satisfies RouteDefinition;

export default function GameRoute() {
  const isMounted = createIsMounted();

  return (
    <main>
      <Show when={isMounted()}>
        <GameBoard />
      </Show>
    </main>
  );
}
