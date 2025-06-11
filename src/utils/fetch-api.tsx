import { makeSearchParams } from "./make-search-params";

const devEndpoint = "localhost:3000";

export const getApiHref = () => {
  if (typeof location === "undefined") {
    return `http://${devEndpoint}`;
  }

  const host = import.meta.env.DEV ? devEndpoint : location.host;

  const result = `${location.protocol}//${host}/api`;

  return result;
};

type FetchApiArgs = {
  path: string;
  query?: Record<string, unknown>;
  options?: RequestInit;
};

export const fetchApi = async <T = unknown>({
  path,
  query,
  options,
}: FetchApiArgs): Promise<T> => {
  const params = makeSearchParams(query);

  const url = new URL(`/api/${path}?${params}`, getApiHref());

  const response = await fetch(url, options);

  if (!response.ok) {
    // eslint-disable-next-line no-console
    console.error("[error]", url);
    throw new Error(response.statusText);
  }

  try {
    const json = await response.json<T>();
    return json;
  } catch (error) {
    console.error("[error]", { error, path, url });
    console.log("-----");
    console.log(response.body);
    console.log("=====");
    throw new Error("invalid");
  }
};
