import { type Component, createSignal, Show } from "solid-js";
import { PixiStage } from "~/modules/pixi/pixi-stage";
import { GameStateProvider } from "../contexts/game-state";

export const GameBoard: Component = () => {
  return (
    <GameStateProvider>
      <ClientBoard />
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
