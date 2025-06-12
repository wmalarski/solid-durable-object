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

// type VSchema<TInput, TOutput, TIssue extends v.BaseIssue<unknown>> =
//   | v.BaseSchema<TInput, TOutput, TIssue>
//   | v.BaseSchemaAsync<TInput, TOutput, TIssue>;

// export const useValidatedJson = async <
//   TInput,
//   TOutput,
//   TIssue extends v.BaseIssue<unknown>,
// >(
//   event: H3Event,
//   schema: VSchema<TInput, TOutput, TIssue>,
//   config?: v.Config<v.InferIssue<VSchema<TInput, TOutput, TIssue>>>,
// ): Promise<TOutput> => {
//   const body = readBody();
//   const parsed = await v.safeParseAsync(schema, body, config);

//   if (!parsed.success) {
//     throw createError({ message: "Invalid arguments", status: 400 });
//   }

//   return parsed.output;
// };
