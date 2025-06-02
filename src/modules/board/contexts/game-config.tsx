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
import { useHonoClient } from "~/modules/shared/hono-client";
import { type GetBoardConfigReturn, getBoardConfig } from "../utils/services";

const createGameConfig = (
  gameId: string,
  boardConfig?: GetBoardConfigReturn,
) => {
  return { boardConfig, gameId };
};

const GameConfigContext = createContext<
  Accessor<ReturnType<typeof createGameConfig>>
>(() => {
  throw new Error("GameConfigContext not defined");
});

export const GameConfigProvider: Component<ParentProps> = (props) => {
  const params = useParams();
  const honoClient = useHonoClient();

  const boardConfig = createAsync(() =>
    getBoardConfig({ gameId: params.gameId, honoClient: honoClient() }),
  );

  return (
    <Show when={boardConfig()}>
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
