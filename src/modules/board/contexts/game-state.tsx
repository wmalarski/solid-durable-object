import {
  type Accessor,
  type Component,
  createContext,
  createMemo,
  type ParentProps,
  useContext,
} from "solid-js";
import { createStore, produce } from "solid-js/store";
import type { PlayerState, TeamArea } from "../utils/types";
import {
  getUpdatedPlayerAngle,
  getUpdatedPlayerPosition,
} from "../utils/updates";
import { useCurrentDirection } from "../utils/use-current-direction";

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
  const direction = useCurrentDirection();

  const state = createMemo(() => {
    const [store, setStore] = createStore(initialState);
    return { setStore, store };
  });

  const movePlayer = () => {
    state().setStore(
      produce((state) => {
        const untrackedDirection = direction();
        const { x, y } = getUpdatedPlayerPosition(state.player);
        const angle = getUpdatedPlayerAngle(state.player, untrackedDirection);

        state.player.position.x = x;
        state.player.position.y = y;
        state.player.angle = angle;

        console.log({ angle, x, y });
      }),
    );
  };

  return {
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
