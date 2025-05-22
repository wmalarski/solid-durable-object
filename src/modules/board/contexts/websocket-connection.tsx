import { For, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import { Button } from "~/ui/button/button";

// Custom types
type Message = {
  text: string;
  user: string;
  createdAt: string;
};

type WsContext = {
  ws: WebSocket | undefined;
  href: string;
  onMessage: (event: MessageEvent<string>) => void;
  log: (user: string, ...args: Array<string>) => void;
  clear: () => void;
  send: (data: string | ArrayBufferLike | Blob | ArrayBufferView) => void;
};

const APPLICATION_ID = "app";

// Top level helpers
const gravatarSuffix = Math.random().toString();
const gravatarHref = (user: string) =>
  `https://www.gravatar.com/avatar/${encodeURIComponent(user + gravatarSuffix)}?s=512&d=monsterid`;

const hrefToWs = (location: Location) =>
  `${location.protocol === "https:" ? "wss" : "ws"}://${location.host}/ws/`;

// WebSocket related
function wsConnect(ctx: WsContext) {
  if (ctx.ws) {
    ctx.log("ws", "Closing previous connection before reconnecting…");
    ctx.ws.close();
    ctx.ws = undefined;
    ctx.clear();
  }

  ctx.log("ws", "Connecting to", ctx.href, "…");
  const ws = new WebSocket(ctx.href);

  ws.addEventListener("message", ctx.onMessage);
  ws.addEventListener("open", () => {
    ctx.ws = ws;
    ctx.log("ws", "Connected!");
  });
}

export const WebsocketConnection = () => {
  // Message scrolling
  let messageList: HTMLDivElement | undefined;
  const scrollToEnd = () => {
    if (!messageList) return;

    messageList.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "start",
    });
  };
  const scroll = () => requestAnimationFrame(scrollToEnd);

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

  let wsContext: WsContext;
  const connect = () => wsConnect(wsContext);
  const ping = () => {
    if (!wsContext.ws) return;

    log("ws", "Sending ping");
    wsContext.send("ping");
  };

  onMount(() => {
    // Initialize once monted client side
    wsContext = {
      clear,
      href: hrefToWs(location),
      log,
      onMessage,
      send: (data) => wsContext.ws?.send(data),
      ws: undefined,
    };
    connect();
  });

  // Chatbox
  let chatMessage: HTMLInputElement | undefined;
  const send = () => {
    if (!chatMessage || !chatMessage.value || !wsContext.ws) return;

    console.log("sending message…");
    wsContext.send(chatMessage.value);
    chatMessage.value = "";
  };
  const sendMessage = (event: KeyboardEvent) => {
    if (event.key === "Enter") send();
  };

  return (
    <div class="absolute top-0 left-0">
      <div id="messages" ref={messageList}>
        <For each={messages}>
          {(message) => (
            <div class="c-message">
              <div>
                <p class="c-message__annotation">{message.user}</p>
                <div class="c-message__card">
                  <img alt="Avatar" src={gravatarHref(message.user)} />
                  <div>
                    <p>{message.text}</p>
                  </div>
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
          <Button onClick={connect}>Reconnect</Button>
          <Button onClick={clear}>Clear</Button>
        </div>
      </div>
    </div>
  );
};
