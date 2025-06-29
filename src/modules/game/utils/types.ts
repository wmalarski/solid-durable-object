import type { Point2D } from "~/modules/game/utils/math";

export type PlayerState = {
  playerId: string;
  direction: PlayerDirection;
  angle: number;
  points: Point2D[];
  name: string;
  color: string;
};

export type PlayerUpdate = {
  playerId: string;
  point: Point2D;
};

export type PlayerDirection = "LEFT" | "RIGHT" | "NONE";
