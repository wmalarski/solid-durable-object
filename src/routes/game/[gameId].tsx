import type { RouteDefinition } from "@solidjs/router";
import { lazy, Show } from "solid-js";
import { getBoardConfig } from "~/modules/board/utils/services";
import { useHonoClient } from "~/modules/shared/hono-client";
import { createIsMounted } from "~/utils/create-is-mounted";

const GameBoard = lazy(() =>
  import("~/modules/board/components/game-board").then((module) => ({
    default: module.GameBoard,
  })),
);

export const route = {
  load: async ({ params }) => {
    const honoClient = useHonoClient();
    await getBoardConfig({
      gameId: params.gameId,
      honoClient: honoClient(),
    });
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
