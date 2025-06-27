import type { Component } from "solid-js";
import { createStore, produce } from "solid-js/store";
import { useGameConfig } from "../contexts/game-config";
import {
  useOnWebsocketEvent,
  useWebsocketSender,
} from "../contexts/websocket-connection";
import type { Session, WsMessage } from "../server/game-durable-object";

export const Cursors: Component = () => {
  const [cursors, setCursors] = createStore<Record<string, Session>>({});

  const config = useGameConfig();

  const sendMessage = useWebsocketSender();

  useOnWebsocketEvent("open", () => {
    sendMessage({ type: "get-cursors" });
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
      // case "move":
      //   setCursors(
      //     produce((prev) => {
      //       const session = prev[messageData.id];
      //       if (session) {
      //         session.x = messageData.x;
      //         session.y = messageData.y;
      //       } else {
      //         prev[messageData.id] = messageData;
      //       }
      //     }),
      //   );
      //   break;
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

  return (
    <div class="absolute top-0 left-0">
      <div class="flex border">
        <div class="border-r px-2 py-1">WebSocket Connections</div>
        <div class="px-2 py-1"> {Object.entries(cursors).length} </div>
      </div>
      <div class="flex border">
        <div class="border-r px-2 py-1">Messages</div>
        <pre>{JSON.stringify(cursors, null, 2)}</pre>
      </div>
    </div>
  );
};
