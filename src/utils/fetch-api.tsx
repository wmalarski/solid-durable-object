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
};

export const fetchApi = async <T = unknown>({
  path,
  query,
}: FetchApiArgs): Promise<T> => {
  const params = makeSearchParams(query);

  const url = new URL(`${path}?${params}`, getApiHref());

  const response = await fetch(url);

  if (!response.ok) {
    // eslint-disable-next-line no-console
    console.error(url);
    throw new Error(response.statusText);
  }

  return response.json();
};
