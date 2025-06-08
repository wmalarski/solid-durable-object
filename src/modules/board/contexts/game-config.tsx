import { createAsync, useParams } from "@solidjs/router";
import {
  type Accessor,
  type Component,
  createContext,
  createMemo,
  type ParentProps,
  Show,
  useContext,
} from "solid-js";
import {
  type GetBoardConfigReturn,
  getBoardConfigQuery,
} from "../server/services";

const createGameConfig = (
  gameId: string,
  boardConfig?: GetBoardConfigReturn,
) => {
  return { boardConfig, gameId };
};

export type GameConfig = ReturnType<typeof createGameConfig>;

const GameConfigContext = createContext<Accessor<GameConfig>>(() => {
  throw new Error("GameConfigContext not defined");
});

export const GameConfigProvider: Component<ParentProps> = (props) => {
  const params = useParams();

  const boardConfig = createAsync(() =>
    getBoardConfigQuery({ gameId: params.gameId }),
  );

  return (
    <Show fallback={<span>Fallback</span>} when={boardConfig()}>
      {(config) => {
        const value = createMemo(() =>
          createGameConfig(params.gameId, config()),
        );
        return (
          <GameConfigContext.Provider value={value}>
            {props.children}
          </GameConfigContext.Provider>
        );
      }}
    </Show>
  );
};

export const useGameConfig = () => {
  return useContext(GameConfigContext);
};
