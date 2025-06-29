import {
  type Accessor,
  type Component,
  createContext,
  createMemo,
  type ParentProps,
  useContext,
} from "solid-js";
import { createStore, produce } from "solid-js/store";
import type { PlayerState } from "../utils/types";
import { createOnDirectionChange } from "../utils/use-current-direction";
import { usePlayer } from "./game-config";
import {
  useOnWebsocketEvent,
  useOnWebsocketMessage,
  useWebsocketSender,
} from "./websocket-connection";

const createGameStateContext = () => {
  const wsSender = useWebsocketSender();

  const [store, setStore] = createStore<Record<string, PlayerState>>({});

  const getPlayer = usePlayer();

  useOnWebsocketEvent("open", () => {
    wsSender({ type: "get-state" });
  });

  useOnWebsocketEvent("close", () => {
    setStore({});
  });

  createOnDirectionChange((direction) => {
    const player = getPlayer();
    if (player) {
      wsSender({
        direction,
        playerId: player.id,
        type: "change-direction",
      });
    }
  });

  useOnWebsocketMessage((message) => {
    switch (message.type) {
      case "quit":
        setStore(
          produce((prev) => {
            if (message.playerId in prev) {
              delete prev[message.playerId];
            }
          }),
        );
        break;
      case "join":
        setStore(
          produce((prev) => {
            if (!(message.player.playerId in prev)) {
              prev[message.player.playerId] = message.player;
            }
          }),
        );
        break;
      case "get-state-response": {
        setStore(
          Object.fromEntries(
            message.players.map((session) => [session.playerId, session]),
          ),
        );
        break;
      }
      case "get-state-update": {
        setStore(
          produce((prev) => {
            message.update.forEach((update) => {
              prev[update.playerId].points.push(update.point);
            });
          }),
        );
        break;
      }
      default:
        break;
    }
  });

  return { store };
};

const GameStateContext = createContext<
  Accessor<ReturnType<typeof createGameStateContext>>
>(() => {
  throw new Error("GameStateContext is not defined");
});

export const GameStateProvider: Component<ParentProps> = (props) => {
  const value = createMemo(() => createGameStateContext());

  return (
    <GameStateContext.Provider value={value}>
      {props.children}
    </GameStateContext.Provider>
  );
};

export const useGameState = () => {
  return useContext(GameStateContext);
};
