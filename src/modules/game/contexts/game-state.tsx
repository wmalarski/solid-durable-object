import {
  type Accessor,
  type Component,
  createContext,
  createMemo,
  type ParentProps,
  useContext,
} from "solid-js";
import { createStore, produce } from "solid-js/store";
import type { Session, WsMessage } from "../server/game-durable-object";
import { createOnDirectionChange } from "../utils/use-current-direction";
import { usePlayer } from "./game-config";
import {
  useOnWebsocketEvent,
  useWebsocketSender,
} from "./websocket-connection";

const createGameStateContext = () => {
  const wsSender = useWebsocketSender();

  const [cursors, setCursors] = createStore<Record<string, Session>>({});

  const getPlayer = usePlayer();

  useOnWebsocketEvent("open", () => {
    wsSender({ type: "get-cursors" });
  });

  useOnWebsocketEvent("close", () => {
    setCursors({});
  });

  createOnDirectionChange((direction) => {
    const player = getPlayer();
    if (player) {
      console.log("[createOnDirectionChange]", { direction, player });
      wsSender({ direction, id: player.id, type: "change-direction" });
    }
  });

  useOnWebsocketEvent("message", (message) => {
    const messageData: WsMessage = JSON.parse(message.data);
    switch (messageData.type) {
      case "quit":
        setCursors(
          produce((prev) => {
            if (messageData.id in prev) {
              delete prev[messageData.id];
            }
          }),
        );
        break;
      case "join":
        setCursors(
          produce((prev) => {
            if (!(messageData.id in prev)) {
              prev[messageData.id] = {
                angle: 0,
                direction: "NONE",
                id: messageData.id,
                x: -1,
                y: -1,
              };
            }
          }),
        );
        break;
      case "change-direction": {
        setCursors(
          produce((prev) => {
            const session = prev[messageData.id];
            if (session) {
              session.direction = messageData.direction;
            } else {
              prev[messageData.id] = {
                angle: 0,
                x: -1,
                y: -1,
                ...messageData,
              };
            }
          }),
        );
        break;
      }
      case "get-cursors-response":
        setCursors(
          Object.fromEntries(
            messageData.sessions.map((session) => [session.id, session]),
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
