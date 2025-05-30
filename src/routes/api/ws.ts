import type { APIEvent } from "@solidjs/start/server";
import { ws } from "~/modules/board/durable/durable";

// const ws = crossws({
//   bindingName: "$DurableObject",
//   hooks: {
//     message: console.log,
//     open(peer) {
//       peer.subscribe("chat");
//       peer.publish("chat", { message: `${peer} joined!`, user: "server" });
//     },
//   },
//   instanceName: "crossws",
// });

export const GET = async ({ nativeEvent }: APIEvent) => {
  if (nativeEvent.headers.get("upgrade") === "websocket") {
    console.log("[ws] handler");
    console.log("[ws] json", nativeEvent.toJSON());
    const context = nativeEvent.context.cloudflare;
    const response = await ws.handleUpgrade(
      context.request,
      context.env,
      context.context,
    );
    console.log("[ws] response", response);
    return response;
  }

  return new Response(
    `<script>new WebSocket("ws://localhost:3000").addEventListener("open", (e) => e.target.send("Hello from client!"));</script>`,
    { headers: { "content-type": "text/html" } },
  );
};

// export class $DurableObject extends DurableObject {
//   constructor(state: DurableObjectState, env: unknown) {
//     super(state, env);
//     ws.handleDurableInit(this, state, env);
//   }

//   fetch(request: Request) {
//     return ws.handleDurableUpgrade(this, request);
//   }

//   webSocketMessage(client: WebSocket, message: string) {
//     return ws.handleDurableMessage(this, client, message);
//   }

//   // biome-ignore lint/suspicious/noExplicitAny: ws type
//   webSocketPublish(topic: string, message: unknown, opts: any) {
//     return ws.handleDurablePublish(this, topic, message, opts);
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
