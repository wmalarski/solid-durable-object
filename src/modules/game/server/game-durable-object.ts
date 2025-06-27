import { DurableObject } from "cloudflare:workers";
import { getPlayerCookieFromRequest } from "~/modules/player/server/cookies";
import type { PlayerDirection } from "../utils/types";

export type WsMessage =
  | { type: "quit"; id: string }
  | { type: "join"; id: string }
  | { type: "get-cursors" }
  | { type: "get-cursors-response"; sessions: Session[] }
  | { type: "change-direction"; id: string; direction: PlayerDirection };

export type Session = {
  id: string;
  x: number;
  y: number;
  direction: PlayerDirection;
  angle: number;
};

export class GameDurableObject extends DurableObject<Env> {
  sessions: Map<WebSocket, Session>;

  constructor(state: DurableObjectState, env: Env) {
    super(state, env);

    this.sessions = new Map();
    this.ctx.getWebSockets().forEach((ws) => {
      const meta = ws.deserializeAttachment();
      this.sessions.set(ws, { ...meta });
    });
  }

  broadcast(message: WsMessage, self?: string) {
    this.ctx.getWebSockets().forEach((ws) => {
      const { id } = ws.deserializeAttachment();
      if (id !== self) ws.send(JSON.stringify(message));
    });
  }

  fetch(request: Request) {
    const webSocketPair = new WebSocketPair();
    const [client, server] = Object.values(webSocketPair);
    this.ctx.acceptWebSocket(server);

    const player = getPlayerCookieFromRequest(request);

    if (!player?.id) {
      return new Response("Missing id", { status: 400 });
    }

    const sessionInitialData: Session = {
      angle: 0,
      direction: "NONE",
      id: player.id,
      x: -1,
      y: -1,
    };
    server.serializeAttachment(sessionInitialData);
    this.sessions.set(server, sessionInitialData);
    this.broadcast({ id: player.id, type: "join" }, player.id);

    return new Response(null, { status: 101, webSocket: client });
  }

  closeSessions() {
    this.ctx.getWebSockets().forEach((ws) => ws.close());
  }

  async webSocketMessage(ws: WebSocket, message: string) {
    if (typeof message !== "string") return;

    const parsedMsg: WsMessage = JSON.parse(message);
    const session = this.sessions.get(ws);

    if (!session) return;

    switch (parsedMsg.type) {
      // case "move":
      //   session.x = parsedMsg.x;
      //   session.y = parsedMsg.y;
      //   ws.serializeAttachment(session);
      //   this.broadcast(parsedMsg, session.id);
      //   break;

      case "get-cursors": {
        const sessions: Session[] = [];
        this.sessions.forEach((session) => sessions.push(session));
        const wsMessage: WsMessage = { sessions, type: "get-cursors-response" };
        ws.send(JSON.stringify(wsMessage));
        break;
      }

      case "change-direction": {
        // const untrackedDirection = direction();
        // const { x, y } = getUpdatedPlayerPosition(state.player);
        // const angle = getUpdatedPlayerAngle(state.player, untrackedDirection);

        // state.player.position.x = x;
        // state.player.position.y = y;
        // state.player.angle = angle;

        session.direction = parsedMsg.direction;
        ws.serializeAttachment(session);

        console.log("[parsedMsg]", { parsedMsg, session });

        this.broadcast(parsedMsg, session.id);
        break;
      }

      default:
        break;
    }
  }

  webSocketClose(client: WebSocket) {
    const id = this.sessions.get(client)?.id;
    id && this.broadcast({ id, type: "quit" });
    this.sessions.delete(client);
    client.close();
  }
}
