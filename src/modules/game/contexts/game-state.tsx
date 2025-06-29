import {
  type Accessor,
  type Component,
  createContext,
  createMemo,
  type ParentProps,
  useContext,
} from "solid-js";
import { createStore, produce } from "solid-js/store";
import type { WsServerMessage } from "../server/messages";
import { createOnDirectionChange } from "../utils/use-current-direction";
import { usePlayer } from "./game-config";
import {
  useOnWebsocketEvent,
  useWebsocketSender,
} from "./websocket-connection";

const createGameStateContext = () => {
  const wsSender = useWebsocketSender();

  const [cursors, setCursors] = createStore<Record<string, ClientSession>>({});

  const getPlayer = usePlayer();

  useOnWebsocketEvent("open", () => {
    wsSender({ type: "get-state" });
  });

  useOnWebsocketEvent("close", () => {
    setCursors({});
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

  useOnWebsocketEvent("message", (message) => {
    const messageData: WsServerMessage = JSON.parse(message.data);
    switch (messageData.type) {
      case "quit":
        setCursors(
          produce((prev) => {
            if (messageData.playerId in prev) {
              delete prev[messageData.playerId];
            }
          }),
        );
        break;
      case "join":
        setCursors(
          produce((prev) => {
            if (!(messageData.playerId in prev)) {
              prev[messageData.playerId] = {
                id: messageData.playerId,
                x: -1,
                y: -1,
              };
            }
          }),
        );
        break;
      case "get-state-response":
        setCursors(
          Object.fromEntries(
            messageData.players.map((session) => [session.playerId, session]),
          ),
        );
        break;
      default:
        break;
    }
  });

  return { store: cursors };
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
