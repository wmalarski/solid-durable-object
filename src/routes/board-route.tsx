import type { RoutePreloadFuncArgs } from "@solidjs/router";
import { type Component, createResource, lazy } from "solid-js";
import { useHonoClient } from "~/modules/shared/hono-client";

const GameBoard = lazy(() =>
  import("~/modules/board/components/game-board").then((module) => ({
    default: module.GameBoard,
  })),
);

export const preloadPlayer = ({ params }: RoutePreloadFuncArgs) => {
  const honoClient = useHonoClient();

  const [user] = createResource(
    () => params.gameId,
    async (gameId) => {
      const result = await honoClient()
        .api.board.config[":gameId"].$get({ param: { gameId } })
        .then((response) => response.json());

      return result;
    },
  );
  return user;
};

export const BoardRoute: Component = () => {
  return (
    <main>
      <GameBoard />
    </main>
  );
};
