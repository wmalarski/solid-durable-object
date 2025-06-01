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

const hrefToApi = (location: Location) => {
  const host = import.meta.env.DEV ? "localhost:8787" : location.host;
  return `${location.protocol}://${host}`;
};

const createHonoClientContext = () => {
  return hc<typeof app>(hrefToApi(location));
};

const HonoClientContext = createContext<
  Accessor<ReturnType<typeof createHonoClientContext>>
>(() => {
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
