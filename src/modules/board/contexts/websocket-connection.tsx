import { createWS } from "@solid-primitives/websocket";
import {
  type Component,
  createContext,
  type ParentProps,
  useContext,
} from "solid-js";

const hrefToWs = (location: Location) => {
  const host = import.meta.env.DEV ? "localhost:8787" : location.host;
  console.log("import.meta.env", import.meta.env.DEV);
  return `${location.protocol === "https:" ? "wss" : "ws"}://${host}/api/ws`;
};

const createWebsocketConnectionContext = () => {
  return createWS(hrefToWs(location));
};

const WebsocketConnectionContext = createContext<ReturnType<
  typeof createWebsocketConnectionContext
> | null>(null);

export const WebsocketConnectionProvider: Component<ParentProps> = (props) => {
  const ws = createWebsocketConnectionContext();

  return (
    <WebsocketConnectionContext.Provider value={ws}>
      {props.children}
    </WebsocketConnectionContext.Provider>
  );
};

export const useWebsocketConnection = () => {
  const context = useContext(WebsocketConnectionContext);

  if (!context) {
    throw new Error("WebsocketConnectionContext is not defined");
  }

  return context;
};
