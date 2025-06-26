import { hc } from "hono/client";
import type app from "~/api/route";

const devEndpoint = "localhost:3000";

const hrefToApi = () => {
  if (typeof location === "undefined") {
    return `http://${devEndpoint}`;
  }

  const host = import.meta.env.DEV ? devEndpoint : location.host;

  const result = `${location.protocol}//${host}`;

  return result;
};

export const makeHonoClient = () => {
  return hc<typeof app>(hrefToApi());
};
