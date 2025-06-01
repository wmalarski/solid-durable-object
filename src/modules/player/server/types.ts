import type * as v from "valibot";
import type { getPlayerSchema } from "./validation";

export type Player = v.InferOutput<ReturnType<typeof getPlayerSchema>>;
