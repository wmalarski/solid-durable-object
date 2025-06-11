import * as v from "valibot";

export const getGameIdSchema = () => {
  return v.object({
    gameId: v.pipe(v.string(), v.length(64), v.nonEmpty()),
  });
};

export const getCreateSchema = () => {
  return v.object({
    color: v.pipe(v.string(), v.hexColor()),
    name: v.pipe(v.string(), v.nonEmpty()),
  });
};

export const getJoinSchema = () => {
  return v.intersect([getCreateSchema(), getGameIdSchema()]);
};
