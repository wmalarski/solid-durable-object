import { createError, type EventHandler, type H3Event } from "h3";

// biome-ignore lint/suspicious/noExplicitAny: needed
export type InferEventResult<Handler extends EventHandler<any, any>> =
  // biome-ignore lint/suspicious/noExplicitAny: needed
  Handler extends EventHandler<any, infer Result> ? Result : never;

export const getWebRequest = (event: H3Event) => {
  const request = event.web?.request;

  if (!request) {
    throw createError({ message: "Invalid request", status: 400 });
  }

  return request;
};
