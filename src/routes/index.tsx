import { lazy, Show } from "solid-js";
import { createIsMounted } from "~/utils/create-is-mounted";

const GameBoard = lazy(() =>
  import("~/modules/board/components/game-board").then((module) => ({
    default: module.GameBoard,
  })),
);

export default function HomePage() {
  const isMounted = createIsMounted();

  return (
    <main>
      <Show when={isMounted()}>
        <GameBoard />
      </Show>
    </main>
  );
}
