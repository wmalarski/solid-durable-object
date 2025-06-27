import { Graphics } from "pixi.js";
import { type Component, createEffect, onCleanup } from "solid-js";
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

  createEffect(() => {
    graphics.clear();
    graphics.circle(0, 0, 5).fill({ alpha: 1, color: 0xffffff });
  });

  createEffect(() => {
    const position = game().store[props.playerId];
    graphics.x = position.x;
    graphics.y = position.y;
  });

  return null;
};
