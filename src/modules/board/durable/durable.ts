import { DurableObject } from "cloudflare:workers";
import crossws from "crossws/adapters/cloudflare";

export const ws = crossws({
  bindingName: "$DurableObject",
  hooks: {
    message: console.log,
    open(peer) {
      console.log("crossws-open");
      peer.subscribe("chat");
      peer.publish("chat", { message: `${peer} joined!`, user: "server" });
    },
  },
  instanceName: "crossws",
});

export class $DurableObject extends DurableObject {
  constructor(state: DurableObjectState, env: unknown) {
    super(state, env);
    console.log("DurableObject-constructor");
    ws.handleDurableInit(this, state, env);
  }

  fetch(request: Request) {
    console.log("DurableObject-fetch");
    return ws.handleDurableUpgrade(this, request);
  }

  webSocketMessage(client: WebSocket, message: string) {
    console.log("DurableObject-webSocketMessage");
    return ws.handleDurableMessage(this, client, message);
  }

  // biome-ignore lint/suspicious/noExplicitAny: ws type
  webSocketPublish(topic: string, message: unknown, opts: any) {
    console.log("DurableObject-webSocketPublish");
    return ws.handleDurablePublish(this, topic, message, opts);
  }

  webSocketClose(
    client: WebSocket,
    code: number,
    reason: string,
    wasClean: boolean,
  ) {
    console.log("DurableObject-webSocketClose");
    return ws.handleDurableClose(this, client, code, reason, wasClean);
  }
}
