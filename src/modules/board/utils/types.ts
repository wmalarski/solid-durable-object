export type Point2D = {
  x: number;
  y: number;
};

export type PlayerLine = {
  userId: string;
  points: Point2D;
};

export type TeamArea = {
  teamId: string;
  points: Point2D[];
  userLines: PlayerLine[];
};

export type PlayerState = {
  position: Point2D;
  angle: number;
};

export type PlayerDirection = "LEFT" | "RIGHT" | "NONE";
