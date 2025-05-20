import { type Component, createEffect, onCleanup } from "solid-js";
import { useGameState } from "../contexts/game-state";

const GAME_INTERVAL = 2000;

export const GameLoop: Component = () => {
  const game = useGameState();

  createEffect(() => {
    const gameState = game();
    const interval = setInterval(() => {
      gameState.movePlayer();
    }, GAME_INTERVAL);

    onCleanup(() => {
      clearInterval(interval);
    });
  });

  return null;
};
