import { Graphics } from "pixi.js";
import { type Component, createEffect, createMemo, onCleanup } from "solid-js";
import { useGameState } from "../contexts/game-state";
import { usePixiContainer } from "./pixi-app";

type PlayerLineProps = {
  playerId: string;
};

export const PlayerLine: Component<PlayerLineProps> = (props) => {
  const game = useGameState();

  const container = usePixiContainer();

  const graphics = new Graphics();

  container.addChild(graphics);
  onCleanup(() => {
    container.removeChild(graphics);
  });

  const color = createMemo(() => {
    return game().store[props.playerId].color;
  });

  createEffect(() => {
    graphics.clear();
    graphics.circle(0, 0, 5).fill({ alpha: 1, color: color() });
  });

  createEffect(() => {
    const points = game().store[props.playerId].points;
    const position = points[points.length - 1];
    graphics.x = position.x;
    graphics.y = position.y;
  });

  return null;
};
