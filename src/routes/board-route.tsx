import type { RoutePreloadFuncArgs } from "@solidjs/router";
import { type Component, lazy } from "solid-js";
import { getBoardConfig } from "~/modules/board/utils/services";
import { useHonoClient } from "~/modules/shared/hono-client";

const GameBoard = lazy(() =>
  import("~/modules/board/components/game-board").then((module) => ({
    default: module.GameBoard,
  })),
);

export const preloadPlayer = async ({ params }: RoutePreloadFuncArgs) => {
  const honoClient = useHonoClient();

  await getBoardConfig({
    gameId: params.gameId,
    honoClient: honoClient(),
  });
};

export const BoardRoute: Component = () => {
  return (
    <main>
      <GameBoard />
    </main>
  );
};
