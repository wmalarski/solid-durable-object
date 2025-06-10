import { type Component, createEffect, createSignal, Show } from "solid-js";
import { JoinDialog } from "~/modules/game/join/join-dialog";
import { GameConfigProvider, useGameConfig } from "../contexts/game-config";
import { GameStateProvider } from "../contexts/game-state";
import { WebsocketConnectionProvider } from "../contexts/websocket-connection";
import { PixiStage } from "../pixi/pixi-stage";
import { GameChat } from "./game-chat";
import { GameLoop } from "./game-loop";

export const GameBoard: Component = () => {
  const [canvas, setCanvas] = createSignal<HTMLCanvasElement>();

  return (
    <GameConfigProvider>
      <JoinDialogFallback />
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

const JoinDialogFallback: Component = () => {
  const gameConfig = useGameConfig();

  createEffect(() => {
    console.log("gameConfig().config?.player", gameConfig().config?.player);
  });

  return (
    <Show when={!gameConfig().config?.player}>
      <JoinDialog />
    </Show>
  );
};
