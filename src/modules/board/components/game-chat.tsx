import { type Component, type ComponentProps, For, onCleanup } from "solid-js";
import { createStore } from "solid-js/store";
import { Button } from "~/ui/button/button";
import { useWebsocketConnection } from "../contexts/websocket-connection";
import type {
  WebsocketChatSendMessage,
  WebsocketChatServerMessage,
  WebsocketMessage,
} from "../durable/types";

const APPLICATION_ID = "app";

export const GameChat: Component = () => {
  const ws = useWebsocketConnection();

  // Store of messages to be displayed; adding and clearing
  const [messages, setMessages] = createStore<Array<WebsocketMessage>>([]);

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
      ? (JSON.parse(event.data) as WebsocketChatServerMessage)
      : { message: event.data, user: APPLICATION_ID };

    log(user, typeof message === "string" ? message : JSON.stringify(message));
  };

  const abortController = new AbortController();
  ws.addEventListener("message", onMessage, { signal: abortController.signal });
  onCleanup(() => abortController.abort());

  const ping = () => {
    log("ws", "Sending ping");
    ws.send("ping");
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
        <GameChatbox />
        <div class="c-chatbox__menu">
          <Button onClick={ping}>Ping</Button>
          <Button onClick={clear}>Clear</Button>
        </div>
      </div>
    </div>
  );
};

const GameChatbox: Component = () => {
  const ws = useWebsocketConnection();

  const onSubmit: ComponentProps<"form">["onSubmit"] = (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const value = formData.get("text") as string;

    const message: WebsocketChatSendMessage = { content: value };
    ws.send(JSON.stringify(message));

    event.currentTarget.reset();
  };

  return (
    <form class="c-chatbox__message" onSubmit={onSubmit}>
      <input name="text" placeholder="Type your message…" type="text" />
      <Button>Send</Button>
    </form>
  );
};
