import type { Component } from "solid-js";
import { useGameState } from "../contexts/game-state";

export const Cursors: Component = () => {
  const getGameState = useGameState();

  return (
    <div class="absolute top-0 left-0">
      <div class="flex border">
        <div class="border-r px-2 py-1">WebSocket Connections</div>
        <div class="px-2 py-1">
          {Object.entries(getGameState().store).length}
        </div>
      </div>
      <div class="flex border">
        <div class="border-r px-2 py-1">Messages</div>
        <pre>{JSON.stringify(getGameState().store, null, 2)}</pre>
      </div>
    </div>
  );
};
