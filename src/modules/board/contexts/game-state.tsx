import {
  type Accessor,
  type Component,
  createContext,
  createMemo,
  type ParentProps,
  useContext,
} from "solid-js";
import { createStore, produce } from "solid-js/store";
import type { PlayerDirection, PlayerState, TeamArea } from "../utils/types";
import {
  getUpdatedPlayerAngle,
  getUpdatedPlayerPosition,
} from "../utils/updates";

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
  const state = createMemo(() => {
    const [store, setStore] = createStore(initialState);
    return { setStore, store };
  });

  const movePlayer = () => {
    state().setStore(
      produce((state) => {
        const { x, y } = getUpdatedPlayerPosition(state.player);
        state.player.position.x = x;
        state.player.position.y = y;
      }),
    );
  };

  const changePlayerAngle = (direction: PlayerDirection) => {
    state().setStore(
      produce((state) => {
        const angle = getUpdatedPlayerAngle(state.player, direction);
        state.player.angle = angle;
      }),
    );
  };

  return {
    changePlayerAngle,
    movePlayer,
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
