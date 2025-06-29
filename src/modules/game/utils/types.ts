import type { Point2D } from "~/utils/math";

export type PlayerState = {
  playerId: string;
  position: Point2D;
  direction: PlayerDirection;
  angle: number;
  points: Point2D[];
};

export type PlayerUpdate = {
  playerId: string;
  point: Point2D;
};

export type PlayerDirection = "LEFT" | "RIGHT" | "NONE";
