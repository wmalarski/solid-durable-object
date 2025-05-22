import { createWS } from "@solid-primitives/websocket";
import {
  type Component,
  createContext,
  For,
  onCleanup,
  type ParentProps,
  useContext,
} from "solid-js";
import { createStore } from "solid-js/store";
import { Button } from "~/ui/button/button";

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

// Custom types
type Message = {
  text: string;
  user: string;
  createdAt: string;
};

const APPLICATION_ID = "app";

const hrefToWs = (location: Location) =>
  `${location.protocol === "https:" ? "wss" : "ws"}://${location.host}/ws/`;

export const WebsocketConnection = () => {
  const ws = useWebsocketConnection();

  // Store of messages to be displayed; adding and clearing
  const [messages, setMessages] = createStore<Array<Message>>([]);

  const log = (user: string, ...args: Array<string>) => {
    console.log("[ws]", user, ...args);
    const message = {
      createdAt: new Date().toLocaleString(),
      text: args.join(" "),
      user,
    };
    const index = messages.length;
    setMessages(index, message);
    scroll();
  };

  const clear = () => {
    setMessages([]);
    log(APPLICATION_ID, "previous messages cleared");
  };

  // Websocket message handler & support
  const onMessage = (event: MessageEvent<string>) => {
    const { user, message } = event.data.startsWith("{")
      ? (JSON.parse(event.data) as { user: string; message: unknown })
      : { message: event.data, user: APPLICATION_ID };

    log(user, typeof message === "string" ? message : JSON.stringify(message));
  };

  const abortController = new AbortController();
  ws.addEventListener("message", onMessage, {
    signal: abortController.signal,
  });
  onCleanup(() => {
    abortController.abort();
  });

  const ping = () => {
    log("ws", "Sending ping");
    ws.send("ping");
  };

  // Chatbox
  let chatMessage: HTMLInputElement | undefined;
  const send = () => {
    if (!chatMessage || !chatMessage.value) return;

    console.log("sending message…");

    ws.send(chatMessage.value);

    chatMessage.value = "";
  };
  const sendMessage = (event: KeyboardEvent) => {
    if (event.key === "Enter") send();
  };

  return (
    <div class="absolute top-0 left-0">
      <div id="messages">
        <For each={messages}>
          {(message) => (
            <div class="c-message">
              <div>
                <p class="c-message__annotation">{message.user}</p>
                <div class="c-message__card">
                  <p>{message.text}</p>
                </div>
                <p class="c-message__annotation">{message.createdAt}</p>
              </div>
            </div>
          )}
        </For>
      </div>
      <div class="c-chatbox">
        <div class="c-chatbox__message">
          <input
            onKeyDown={sendMessage}
            placeholder="Type your message…"
            ref={chatMessage}
            type="text"
          />
        </div>
        <div class="c-chatbox__menu">
          <Button onClick={send}>Send</Button>
          <Button onClick={ping}>Ping</Button>
          <Button onClick={clear}>Clear</Button>
        </div>
      </div>
    </div>
  );
};
