import { createWS } from "@solid-primitives/websocket";
import {
  type Accessor,
  type Component,
  createContext,
  createEffect,
  createMemo,
  onCleanup,
  type ParentProps,
  useContext,
} from "solid-js";
import { makeHonoClient } from "~/api/client";
import type { WsClientMessage } from "../server/messages";
import { type GameConfig, useGameConfig } from "./game-config";

const hrefToWs = (gameId: string) => {
  const route = makeHonoClient().api[":gameId"].ws.$url({ param: { gameId } });
  const host = import.meta.env.DEV ? "localhost:8787" : route.host;
  const result = `${route.protocol === "https:" ? "wss" : "ws"}://${host}${route.pathname}`;
  return result;
};

const createWebsocketConnectionContext = (config: GameConfig) => {
  return config.config?.player ? createWS(hrefToWs(config.gameId)) : null;
};

const WebsocketConnectionContext = createContext<
  Accessor<ReturnType<typeof createWebsocketConnectionContext>>
>(() => {
  throw new Error("WebsocketConnectionContext not defined");
});

export const WebsocketConnectionProvider: Component<ParentProps> = (props) => {
  const gameConfig = useGameConfig();

  const ws = createMemo(() => createWebsocketConnectionContext(gameConfig()));

  return (
    <WebsocketConnectionContext.Provider value={ws}>
      {props.children}
    </WebsocketConnectionContext.Provider>
  );
};

export const useWebsocketConnection = () => {
  return useContext(WebsocketConnectionContext);
};

export const useOnWebsocketEvent = <K extends keyof WebSocketEventMap>(
  type: K,
  listener: (this: WebSocket, event: WebSocketEventMap[K]) => void,
) => {
  const ws = useWebsocketConnection();

  createEffect(() => {
    const websocket = ws();
    const abortController = new AbortController();
    const signal = abortController.signal;

    websocket?.addEventListener(type, listener, { signal });
    onCleanup(() => abortController.abort());
  });
};

export const useWebsocketSender = () => {
  const ws = useWebsocketConnection();

  const onMessage = (message: WsClientMessage) => {
    const websocket = ws();
    if (websocket?.readyState === WebSocket.OPEN) {
      websocket.send(JSON.stringify(message));
    }
  };

  return onMessage;
};
