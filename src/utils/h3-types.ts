import type { EventHandler } from "h3";

// biome-ignore lint/suspicious/noExplicitAny: needed
export type InferEventResult<Handler extends EventHandler<any, any>> =
  // biome-ignore lint/suspicious/noExplicitAny: needed
  Handler extends EventHandler<any, infer Result> ? Result : never;
