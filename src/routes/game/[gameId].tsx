import type { RouteDefinition } from "@solidjs/router";
import { lazy, Show } from "solid-js";
import { isServer } from "solid-js/web";
import { getGameConfigQuery } from "~/modules/game/server/services";
import { createIsMounted } from "~/utils/create-is-mounted";

const GameBoard = lazy(() =>
  import("~/modules/game/components/game-board").then((module) => ({
    default: module.GameBoard,
  })),
);

export const route = {
  load: async ({ params }) => {
    if (!isServer) {
      await getGameConfigQuery({ gameId: params.gameId });
    }
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
