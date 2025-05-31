import { DurableObject } from "cloudflare:workers";
import { ws } from "./websocket";

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
