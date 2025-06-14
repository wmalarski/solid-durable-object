import { createWS } from "@solid-primitives/websocket";
import {
  type Accessor,
  type Component,
  createContext,
  createMemo,
  type ParentProps,
  useContext,
} from "solid-js";
import { type GameConfig, useGameConfig } from "./game-config";

const hrefToWs = (location: Location, gameId: string) => {
  const host = import.meta.env.DEV ? "localhost:8787" : location.host;
  return `${location.protocol === "https:" ? "wss" : "ws"}://${host}/api/game/${gameId}/ws`;
};

const createWebsocketConnectionContext = (config: GameConfig) => {
  return config.config?.player
    ? createWS(hrefToWs(location, config.gameId))
    : null;
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
