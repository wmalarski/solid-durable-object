import { type Component, For } from "solid-js";
import { useGameState } from "../contexts/game-state";
import { BoardThemeProvider } from "./board-theme";
import { GraphBoard } from "./graph-board";
import { PixiAppProvider } from "./pixi-app";
import { PlayerLine } from "./player-line";

type PixiStageProps = {
  canvas: HTMLCanvasElement;
};

export const PixiStage: Component<PixiStageProps> = (props) => {
  const getGameState = useGameState();

  return (
    <BoardThemeProvider>
      <PixiAppProvider canvas={props.canvas}>
        <GraphBoard />
        <For each={Object.keys(getGameState().store)}>
          {(playerId) => <PlayerLine playerId={playerId} />}
        </For>
      </PixiAppProvider>
    </BoardThemeProvider>
  );
};
