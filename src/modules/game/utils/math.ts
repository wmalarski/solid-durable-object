export type Point2D = {
  x: number;
  y: number;
};

type MovePointArgs = {
  point: Point2D;
  angle: number;
  velocity: number;
};

export const movePoint = ({
  angle,
  point,
  velocity,
}: MovePointArgs): Point2D => {
  return {
    x: point.x + Math.cos(angle) * velocity,
    y: point.y + Math.sin(angle) * velocity,
  };
};

export const randomFromRange = (minValue: number, maxValue: number) => {
  return (maxValue - minValue) * Math.random() + minValue;
};

export const randomAngle = () => {
  return randomFromRange(0, 2 * Math.PI);
};
