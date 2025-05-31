import { type Component, lazy } from "solid-js";

const GameBoard = lazy(() =>
  import("~/modules/board/components/game-board").then((module) => ({
    default: module.GameBoard,
  })),
);

export const BoardRoute: Component = () => {
  return (
    <main>
      <GameBoard />
    </main>
  );
};
