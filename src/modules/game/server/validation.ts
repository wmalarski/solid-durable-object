import * as v from "valibot";

export const getJoinSchema = () => {
  return v.object({
    color: v.pipe(v.string(), v.hexColor()),
    id: v.pipe(v.string()),
    name: v.pipe(v.string(), v.nonEmpty()),
  });
};

export const getCreateSchema = () => {
  return v.object({
    color: v.pipe(v.string(), v.hexColor()),
    name: v.pipe(v.string(), v.nonEmpty()),
  });
};
