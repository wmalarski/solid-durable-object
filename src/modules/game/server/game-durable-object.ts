import { DurableObject } from "cloudflare:workers";
import { getPlayerCookieFromRequest } from "~/modules/player/server/cookies";
import { GAME_INTERVAL } from "../utils/constants";
import type { PlayerState } from "../utils/types";
import type { WsClientMessage, WsServerMessage } from "./messages";
import { getPlayerInitialState, getPlayerUpdate } from "./updates";

export class GameDurableObject extends DurableObject<Env> {
  players: Map<WebSocket, PlayerState>;

  constructor(state: DurableObjectState, env: Env) {
    super(state, env);

    this.players = new Map();
    this.ctx.getWebSockets().forEach((ws) => {
      const meta = ws.deserializeAttachment();
      this.players.set(ws, { ...meta });
    });

    this.setupPing();
  }

  setupPing() {
    setInterval(() => {
      const update = getPlayerUpdate(this.players);
      this.broadcast({ type: "get-state-update", update });
    }, GAME_INTERVAL);
  }

  broadcast(message: WsServerMessage, self?: string) {
    this.ctx.getWebSockets().forEach((ws) => {
      const { id } = ws.deserializeAttachment();
      if (id !== self) {
        this.send(message, ws);
      }
    });
  }

  send(message: WsServerMessage, ws: WebSocket) {
    ws.send(JSON.stringify(message));
  }

  fetch(request: Request) {
    const webSocketPair = new WebSocketPair();
    const [client, server] = Object.values(webSocketPair);
    this.ctx.acceptWebSocket(server);

    const player = getPlayerCookieFromRequest(request);

    if (!player?.id) {
      return new Response("Missing id", { status: 400 });
    }

    const playerInitialData = getPlayerInitialState(player);
    server.serializeAttachment(playerInitialData);
    this.players.set(server, playerInitialData);
    this.broadcast({ player: playerInitialData, type: "join" }, player.id);

    return new Response(null, { status: 101, webSocket: client });
  }

  closeSessions() {
    this.ctx.getWebSockets().forEach((ws) => ws.close());
  }

  async webSocketMessage(ws: WebSocket, message: string) {
    if (typeof message !== "string") return;

    const parsedMsg: WsClientMessage = JSON.parse(message);
    const session = this.players.get(ws);

    if (!session) return;

    switch (parsedMsg.type) {
      case "get-state": {
        const players: PlayerState[] = [];
        this.players.forEach((session) => players.push(session));
        this.send({ players, type: "get-state-response" }, ws);
        break;
      }

      case "change-direction": {
        session.direction = parsedMsg.direction;
        ws.serializeAttachment(session);
        break;
      }

      default:
        break;
    }
  }

  webSocketClose(client: WebSocket) {
    const playerId = this.players.get(client)?.playerId;
    playerId && this.broadcast({ playerId, type: "quit" });
    this.players.delete(client);
    client.close();
  }
}
