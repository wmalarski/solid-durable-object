import { type Component, createEffect, createSignal, Show } from "solid-js";
import { JoinDialog } from "~/modules/game/join/join-dialog";
import { GameConfigProvider, useGameConfig } from "../contexts/game-config";
import { GameStateProvider } from "../contexts/game-state";
import { WebsocketConnectionProvider } from "../contexts/websocket-connection";
import { PixiStage } from "../pixi/pixi-stage";
import { Cursors } from "./cursors";
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
          <Cursors />
          <GameLoop />
        </GameStateProvider>
      </WebsocketConnectionProvider>
    </GameConfigProvider>
  );
};

const JoinDialogFallback: Component = () => {
  const gameConfig = useGameConfig();

  createEffect(() => {
    console.log("[JoinDialogFallback]", gameConfig());
  });

  return (
    <Show when={!gameConfig().config?.player}>
      <JoinDialog />
    </Show>
  );
};
