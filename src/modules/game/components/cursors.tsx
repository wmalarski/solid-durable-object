import {
  type Component,
  createEffect,
  createMemo,
  createSignal,
} from "solid-js";
import { createStore, produce } from "solid-js/store";
import { useGameConfig } from "../contexts/game-config";
import {
  useOnWebsocketEvent,
  useWebsocketConnection,
} from "../contexts/websocket-connection";
import type { Session, WsMessage } from "../server/game-durable-object";

const INTERVAL = 55;

export const Cursors: Component = () => {
  const [cursors, setCursors] = createStore<Record<string, Session>>({});

  const [lastSentTimestamp, setLastSentTimestamp] = createSignal(0);

  const config = useGameConfig();
  const ws = useWebsocketConnection();

  useOnWebsocketEvent("open", function () {
    const message: WsMessage = { type: "get-cursors" };
    this.send(JSON.stringify(message));
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
              prev[messageData.id] = { id: messageData.id, x: -1, y: -1 };
            }
          }),
        );
        break;
      case "move":
        setCursors(
          produce((prev) => {
            const session = prev[messageData.id];
            if (session) {
              session.x = messageData.x;
              session.y = messageData.y;
            } else {
              prev[messageData.id] = messageData;
            }
          }),
        );
        break;
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

  useOnWebsocketEvent("close", () => {
    setCursors({});
  });

  createEffect(() => {
    const abortController = new AbortController();
    const websocket = ws();
    const game = config();
    const playerId = game.config?.player?.id;

    if (!playerId) {
      return;
    }

    document.addEventListener(
      "mousemove",
      (ev) => {
        const x = ev.pageX / window.innerWidth;
        const y = ev.pageY / window.innerHeight;
        const now = Date.now();

        if (
          now - lastSentTimestamp() > INTERVAL &&
          websocket?.readyState === WebSocket.OPEN
        ) {
          const message: WsMessage = { id: playerId, type: "move", x, y };
          websocket.send(JSON.stringify(message));
          setLastSentTimestamp(now);
        }
      },
      { signal: abortController.signal },
    );
    return () => abortController.abort();
  });

  const otherCursors = createMemo(() => {
    const playerId = config().config?.player?.id;
    return Object.values(cursors).filter(
      ({ id, x, y }) => id !== playerId && x !== -1 && y !== -1,
    );
  });

  return (
    <>
      <div class="flex border">
        <div class="border-r px-2 py-1">WebSocket Connections</div>
        <div class="px-2 py-1"> {Object.entries(cursors).length} </div>
      </div>
      <div class="flex border">
        <div class="border-r px-2 py-1">Messages</div>
        <pre>{JSON.stringify(otherCursors(), null, 2)}</pre>
      </div>
    </>
  );
};
