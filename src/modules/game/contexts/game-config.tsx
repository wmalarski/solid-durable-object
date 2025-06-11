import { createAsync, useParams } from "@solidjs/router";
import {
  type Accessor,
  type Component,
  createContext,
  createEffect,
  createMemo,
  type ParentProps,
  Show,
  useContext,
} from "solid-js";
import type { GetGameConfigResult } from "../server/game-router";
import { getGameConfigQuery } from "../server/services";

const createGameConfig = (gameId: string, config?: GetGameConfigResult) => {
  return { config, gameId };
};

export type GameConfig = ReturnType<typeof createGameConfig>;

const GameConfigContext = createContext<Accessor<GameConfig>>(() => {
  throw new Error("GameConfigContext not defined");
});

export const GameConfigProvider: Component<ParentProps> = (props) => {
  const params = useParams();

  createEffect(() => {
    console.log("[GameConfigProvider]", params.gameId);
  });

  const config = createAsync(() =>
    getGameConfigQuery({ gameId: params.gameId }),
  );

  return (
    <Show fallback={<span>Fallback</span>} when={config()}>
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
