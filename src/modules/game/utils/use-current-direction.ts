import { createEventListenerMap } from "@solid-primitives/event-listener";
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

export const createOnDirectionChange = (
  onDirectionChange: (direction: PlayerDirection) => void,
) => {
  createEventListenerMap(document, {
    keydown: (event) => {
      if (event.key === "ARROWLEFT") {
        onDirectionChange("LEFT");
      }
      if (event.key === "ARROWRIGHR") {
        onDirectionChange("RIGHT");
      }
    },
    keyup: () => {
      onDirectionChange("NONE");
    },
  });
};
