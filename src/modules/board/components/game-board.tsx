import {
  type Component,
  createEffect,
  createSignal,
  onCleanup,
  Show,
} from "solid-js";
import { GameStateProvider, useGameState } from "../contexts/game-state";
import { PixiStage } from "../pixi/pixi-stage";

export const GameBoard: Component = () => {
  return (
    <GameStateProvider>
      <ClientBoard />
      <GameLoop />
    </GameStateProvider>
  );
};

const ClientBoard: Component = () => {
  const [canvas, setCanvas] = createSignal<HTMLCanvasElement>();

  return (
    <>
      <canvas class="size-full bg-base-100" ref={setCanvas} />
      <Show when={canvas()}>{(canvas) => <PixiStage canvas={canvas()} />}</Show>
    </>
  );
};

const GAME_INTERVAL = 2000;

const GameLoop: Component = () => {
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
