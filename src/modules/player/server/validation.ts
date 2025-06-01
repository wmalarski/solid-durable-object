import * as v from "valibot";

export const getPlayerSchema = () => {
  return v.object({
    color: v.pipe(v.string(), v.hexColor()),
    id: v.pipe(v.string()),
    name: v.pipe(v.string(), v.nonEmpty()),
  });
};
