import { useCurrentlyHeldKey } from "@solid-primitives/keyboard";
import { createMemo } from "solid-js";
import type { PlayerDirection } from "./types";

export const useCurrentDirection = () => {
  const key = useCurrentlyHeldKey();
  return createMemo(() => getDirectionFromKey(key()));
};

const keyDirectionMap = new Map<string, PlayerDirection>([
  ["ARROWLEFT", "LEFT"],
  ["ARROWRIGHT", "RIGHT"],
]);

const getDirectionFromKey = (key: string | null): PlayerDirection => {
  return key ? (keyDirectionMap.get(key) ?? "NONE") : "NONE";
};
