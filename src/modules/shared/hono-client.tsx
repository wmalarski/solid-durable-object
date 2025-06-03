import { hc } from "hono/client";
import type app from "~/api/route";

const hrefToApi = () => {
  if (typeof location === "undefined") {
    return "/";
  }

  const host = import.meta.env.DEV ? "localhost:3000" : location.host;

  const result = `${location.protocol}//${host}`;

  console.log({ host, p: location.protocol, result });

  return result;
};

export const makeHonoClient = () => {
  return hc<typeof app>(hrefToApi());
};

export type HonoClient = ReturnType<typeof makeHonoClient>;
