import { DurableObject } from "cloudflare:workers";
import crossws from "crossws/adapters/cloudflare";
import { eventHandler } from "vinxi/http";

const ws = crossws({
  bindingName: "$DurableObject",
  hooks: {
    message: console.log,
    open(peer) {
      peer.subscribe("chat");
      peer.publish("chat", { message: `${peer} joined!`, user: "server" });
    },
  },
  instanceName: "crossws",
});

// const userFromId = (id: string) => id.slice(-6);

// // Don't want to send binary Blob to the client
// const toPayload = (from: string, message: string) =>
//   JSON.stringify({ message: message, user: from });

// const CHANNEL_NAME = "chat";
// const SERVER_ID = "server";

export default eventHandler({
  handler(event) {
    console.log("[ws] handler", event);
    const context = event.context.cloudflare;
    // if (request.headers.get("upgrade") === "websocket") {
    return ws.handleUpgrade(context.request, context.env, context.context);
    // }
    // return new Response(
    //   `<script>new WebSocket("ws://localhost:3000").addEventListener("open", (e) => e.target.send("Hello from client!"));</script>`,
    //   { headers: { "content-type": "text/html" } },
    // );
  },
  // websocket: {
  //   async close(peer, details) {
  //     const user = userFromId(peer.id);
  //     console.log("[ws] close", user, details);

  //     peer.unsubscribe(CHANNEL_NAME);
  //     peer.publish(
  //       CHANNEL_NAME,
  //       toPayload(SERVER_ID, `${user} has left the chat!`),
  //     );
  //   },

  //   async error(peer, error) {
  //     console.log("[ws] error", userFromId(peer.id), error);
  //   },

  //   async message(peer, message) {
  //     const user = userFromId(peer.id);
  //     console.log("[ws] message", user, message);

  //     const content = message.text();
  //     if (content.includes("ping")) {
  //       peer.send("pong");
  //       return;
  //     }

  //     const payload = toPayload(peer.id, content);
  //     // The server re-broadcasts incoming messages to everyone …
  //     peer.publish(CHANNEL_NAME, payload);
  //     // … but the source
  //     peer.send(payload);
  //   },
  //   async open(peer) {
  //     console.log("[ws] open", peer);

  //     const user = userFromId(peer.id);
  //     peer.send(toPayload(SERVER_ID, `Welcome ${user}`));

  //     // Join new client to the "chat" channel
  //     peer.subscribe(CHANNEL_NAME);
  //     // Notify every other connected client
  //     peer.publish(CHANNEL_NAME, toPayload(SERVER_ID, `${user} joined!`));
  //   },
  // },
});

export class $DurableObject extends DurableObject {
  constructor(state: DurableObjectState, env: unknown) {
    super(state, env);
    ws.handleDurableInit(this, state, env);
  }

  fetch(request: Request) {
    return ws.handleDurableUpgrade(this, request);
  }

  webSocketMessage(client: WebSocket, message: string) {
    return ws.handleDurableMessage(this, client, message);
  }

  // biome-ignore lint/suspicious/noExplicitAny: ws type
  webSocketPublish(topic: string, message: unknown, opts: any) {
    return ws.handleDurablePublish(this, topic, message, opts);
  }

  webSocketClose(
    client: WebSocket,
    code: number,
    reason: string,
    wasClean: boolean,
  ) {
    return ws.handleDurableClose(this, client, code, reason, wasClean);
  }
}

// export class $DurableObject implements DurableObject {
//   fetch(request) {
//     // return ws.handleDurableUpgrade(this, request);
//   }
//   webSocketMessage(client, message) {
//     // return ws.handleDurableMessage(this, client, message);
//   }
//   webSocketClose(client, code, reason, wasClean) {
//     // return ws.handleDurableClose(this, client, code, reason, wasClean);
//   }
// }

// export class $DurableObject extends DurableObject {
//   fetch(request: Request) {
//     return ws.handleDurableUpgrade(this, request);
//   }
//   webSocketMessage(client: WebSocket, message: string | ArrayBuffer) {
//     return ws.handleDurableMessage(this, client, message);
//   }
//   webSocketClose(
//     client: WebSocket,
//     code: number,
//     reason: string,
//     wasClean: boolean,
//   ) {
//     return ws.handleDurableClose(this, client, code, reason, wasClean);
//   }
// }
