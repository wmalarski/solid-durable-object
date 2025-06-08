import type { Point2D } from "../utils/types";

export type WebsocketMessage = {
  text: string;
  user: string;
  createdAt: string;
};

export type WebsocketChatSendMessage = {
  content: string;
};

export type JoinWsServerMessage = {
  kind: "join";
  playerId: string;
  name: string;
  color: string;
};

export type LeaveWsServerMessage = {
  kind: "leave";
  user: string;
};

export type UpdateWsServerMessage = {
  kind: "update";
  updates: PlayerUpdate[];
};

export type WebsocketChatServerMessage =
  | JoinWsServerMessage
  | LeaveWsServerMessage
  | UpdateWsServerMessage;

export type PlayerUpdate = {
  playerId: string;
  point: Point2D;
  angle: number;
};

export type PlayerPosition = {
  playerId: string;
  point: Point2D;
  angle: number;
  path: Point2D[];
};

export type LobbyData = {
  id: DurableObjectId;
  userIps: string[];
};
