import { type Component, createSignal, Show } from "solid-js";
import { GameConfigProvider } from "../contexts/game-config";
import { GameStateProvider } from "../contexts/game-state";
import { WebsocketConnectionProvider } from "../contexts/websocket-connection";
import { PixiStage } from "../pixi/pixi-stage";
import { GameChat } from "./game-chat";
import { GameLoop } from "./game-loop";

export const GameBoard: Component = () => {
  const [canvas, setCanvas] = createSignal<HTMLCanvasElement>();

  return (
    <GameConfigProvider>
      <WebsocketConnectionProvider>
        <GameStateProvider>
          <canvas class="size-full bg-base-100" ref={setCanvas} />
          <Show when={canvas()}>
            {(canvas) => <PixiStage canvas={canvas()} />}
          </Show>
          <GameChat />
          <GameLoop />
        </GameStateProvider>
      </WebsocketConnectionProvider>
    </GameConfigProvider>
  );
};
