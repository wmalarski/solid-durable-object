import type { RouteDefinition } from "@solidjs/router";
import { lazy, Show } from "solid-js";
import { getBoardConfigQuery } from "~/modules/board/server/services";
import { createIsMounted } from "~/utils/create-is-mounted";

const GameBoard = lazy(() =>
  import("~/modules/board/components/game-board").then((module) => ({
    default: module.GameBoard,
  })),
);

export const route = {
  load: async ({ params }) => {
    await getBoardConfigQuery({ gameId: params.gameId });
  },
} satisfies RouteDefinition;

export default function BoardRoute() {
  const isMounted = createIsMounted();

  return (
    <main>
      <Show when={isMounted()}>
        <GameBoard />
      </Show>
    </main>
  );
}
