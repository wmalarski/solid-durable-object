import { DurableObject } from "cloudflare:workers";
import type { APIEvent } from "@solidjs/start/server";
import crossws from "crossws/adapters/cloudflare";

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

export const GET = ({ nativeEvent }: APIEvent) => {
  console.log("[ws] handler", nativeEvent);
  const context = nativeEvent.context.cloudflare;
  return ws.handleUpgrade(context.request, context.env, context.context);
};

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
