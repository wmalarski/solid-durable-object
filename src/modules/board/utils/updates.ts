import type { PlayerDirection, PlayerState } from "./types";

const PLAYER_VELOCITY = 1;
const PLAYER_ANGLE_VELOCITY = 0.1;

export const getUpdatedPlayerPosition = ({ angle, position }: PlayerState) => {
  return {
    x: position.x + Math.cos(angle) * PLAYER_VELOCITY,
    y: position.y + Math.sin(angle) * PLAYER_VELOCITY,
  };
};

export const getUpdatedPlayerAngle = (
  { angle }: PlayerState,
  direction: PlayerDirection,
) => {
  switch (direction) {
    case "LEFT":
      return angle - PLAYER_ANGLE_VELOCITY;
    case "RIGHT":
      return angle + PLAYER_ANGLE_VELOCITY;
    case "NONE":
      return angle;
  }
};
