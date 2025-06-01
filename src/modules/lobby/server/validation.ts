import * as v from "valibot";

export const getJoinValidator = () => {
  return v.object({
    color: v.pipe(v.string(), v.hexColor()),
    name: v.pipe(v.string(), v.nonEmpty()),
  });
};
