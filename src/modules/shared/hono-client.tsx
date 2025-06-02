import { hc } from "hono/client";
import {
  type Accessor,
  type Component,
  createContext,
  createMemo,
  type ParentProps,
  useContext,
} from "solid-js";
import type app from "~/api/route";

const hrefToApi = () => {
  if (typeof location === "undefined") {
    return "/";
  }

  const host = import.meta.env.DEV ? "localhost:8787" : location.host;
  return `${location.protocol}://${host}`;
};

const createHonoClientContext = () => {
  return hc<typeof app>(hrefToApi());
};

export type HonoClient = ReturnType<typeof createHonoClientContext>;

const HonoClientContext = createContext<Accessor<HonoClient>>(() => {
  throw new Error("HonoClientContext not defined");
});

export const HonoClientProvider: Component<ParentProps> = (props) => {
  const value = createMemo(() => createHonoClientContext());

  return (
    <HonoClientContext.Provider value={value}>
      {props.children}
    </HonoClientContext.Provider>
  );
};

export const useHonoClient = () => {
  return useContext(HonoClientContext);
};
