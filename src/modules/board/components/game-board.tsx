import { type Component, createSignal, Show } from "solid-js";
import { PixiStage } from "~/modules/pixi/pixi-stage";

export const GameBoard: Component = () => {
  return <ClientBoard />;
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
