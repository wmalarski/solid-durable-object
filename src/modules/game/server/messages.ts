import type {
  PlayerDirection,
  PlayerState,
  PlayerUpdate,
} from "../utils/types";

export type WsClientMessage =
  | { type: "get-state" }
  | { type: "change-direction"; playerId: string; direction: PlayerDirection };

export type WsServerMessage =
  | { type: "quit"; playerId: string }
  | { type: "join"; playerId: string }
  | { type: "get-state-response"; players: PlayerState[] }
  | { type: "get-state-update"; update: PlayerUpdate[] };
