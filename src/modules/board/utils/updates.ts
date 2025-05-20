import { PLAYER_ANGLE_VELOCITY, PLAYER_VELOCITY } from "./constants";
import type { PlayerDirection, PlayerState } from "./types";

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
