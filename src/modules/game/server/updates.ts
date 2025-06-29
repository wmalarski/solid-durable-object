import type { Player } from "~/modules/player/server/types";
import { movePoint } from "~/utils/math";
import { PLAYER_ANGLE_VELOCITY } from "../utils/constants";
import type { PlayerState, PlayerUpdate } from "../utils/types";

const getUpdatedPlayerPosition = ({ angle, position }: PlayerState) => {
  return movePoint({ angle, point: position, velocity: PLAYER_ANGLE_VELOCITY });
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
    const newPosition = getUpdatedPlayerPosition(session);
    const angle = getUpdatedPlayerAngle(session);
    update.push({ playerId: session.playerId, point: newPosition });

    session.angle = angle;
    session.position = newPosition;
    session.points.push(newPosition);
  });

  return update;
};

export const getPlayerInitialState = (player: Player): PlayerState => {
  return {
    angle: Math.random() * Math.PI * 2,
    color: player.color,
    direction: "NONE",
    name: player.name,
    playerId: player.id,
    points: [],
    position: { x: -1, y: -1 },
  };
};
