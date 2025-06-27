import {
  type Accessor,
  type Component,
  createContext,
  createMemo,
  type ParentProps,
  useContext,
} from "solid-js";
import { createStore } from "solid-js/store";
import type { PlayerState, TeamArea } from "../utils/types";
import { createOnDirectionChange } from "../utils/use-current-direction";
import { usePlayer } from "./game-config";
import { useWebsocketSender } from "./websocket-connection";

type GameStateStore = {
  teams: TeamArea[];
  player: PlayerState;
};

type CreateGameStateContextArgs = {
  initialState: GameStateStore;
};

const createGameStateContext = ({
  initialState,
}: CreateGameStateContextArgs) => {
  const wsSender = useWebsocketSender();

  const getPlayer = usePlayer();

  createOnDirectionChange((direction) => {
    const player = getPlayer();
    if (player) {
      console.log("[createOnDirectionChange]", { direction, player });
      wsSender({ direction, id: player.id, type: "change-direction" });
    }
  });

  const state = createMemo(() => {
    const [store, setStore] = createStore(initialState);
    return { setStore, store };
  });

  return {
    get store() {
      return state().store;
    },
  };
};

const GameStateContext = createContext<
  Accessor<ReturnType<typeof createGameStateContext>>
>(() => {
  throw new Error("GameStateContext is not defined");
});

export const GameStateProvider: Component<ParentProps> = (props) => {
  const value = createMemo(() =>
    createGameStateContext({
      initialState: {
        player: {
          angle: 0,
          position: {
            x: 100,
            y: 100,
          },
        },
        teams: [],
      },
    }),
  );

  return (
    <GameStateContext.Provider value={value}>
      {props.children}
    </GameStateContext.Provider>
  );
};

export const useGameState = () => {
  return useContext(GameStateContext);
};
