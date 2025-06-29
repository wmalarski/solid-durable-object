import type { Player } from "~/modules/player/server/types";
import { PLAYER_ANGLE_VELOCITY } from "../utils/constants";
import { movePoint, randomAngle, randomFromRange } from "../utils/math";
import type { PlayerState, PlayerUpdate } from "../utils/types";

const getUpdatedPlayerPosition = ({ angle, points }: PlayerState) => {
  const point = points[points.length - 1];
  return movePoint({ angle, point, velocity: PLAYER_ANGLE_VELOCITY });
};

const getUpdatedPlayerAngle = ({ angle, direction }: PlayerState) => {
  switch (direction) {
    case "LEFT":
      return angle - PLAYER_ANGLE_VELOCITY;
    case "RIGHT":
      return angle + PLAYER_ANGLE_VELOCITY;
    case "NONE":
      return angle;
  }
};

export const getPlayerUpdate = (sessions: Map<WebSocket, PlayerState>) => {
  const update: PlayerUpdate[] = [];

  sessions.forEach((session) => {
    const point = getUpdatedPlayerPosition(session);
    const angle = getUpdatedPlayerAngle(session);
    update.push({ playerId: session.playerId, point });

    session.angle = angle;
    session.points.push(point);
  });

  return update;
};

export const getPlayerInitialState = (player: Player): PlayerState => {
  return {
    angle: randomAngle(),
    color: player.color,
    direction: "NONE",
    name: player.name,
    playerId: player.id,
    points: [{ x: randomFromRange(50, 200), y: randomFromRange(50, 200) }],
  };
};
