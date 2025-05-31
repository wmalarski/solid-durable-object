import { useParams } from "@solidjs/router";
import {
  type Accessor,
  type Component,
  createContext,
  createMemo,
  type ParentProps,
  useContext,
} from "solid-js";

const createGameConfig = (gameId: string) => {
  return { gameId };
};

const GameConfigContext = createContext<
  Accessor<ReturnType<typeof createGameConfig>>
>(() => {
  throw new Error("GameConfigContext not defined");
});

export const GameConfigProvider: Component<ParentProps> = (props) => {
  const params = useParams();
  const value = createMemo(() => createGameConfig(params.gameId));

  return (
    <GameConfigContext.Provider value={value}>
      {props.children}
    </GameConfigContext.Provider>
  );
};

export const useGameConfig = () => {
  return useContext(GameConfigContext);
};
