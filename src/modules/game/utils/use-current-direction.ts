import { createEventListenerMap } from "@solid-primitives/event-listener";
import { createSignal } from "solid-js";
import type { PlayerDirection } from "./types";

const INTERVAL = 55;

export const createOnDirectionChange = (
  onDirectionChange: (direction: PlayerDirection) => void,
) => {
  const [lastSentTimestamp, setLastSentTimestamp] = createSignal(0);
  const [currentDirection, setCurrentDirection] =
    createSignal<PlayerDirection>();

  const onThrottledChange = (direction: PlayerDirection) => {
    const now = Date.now();

    if (now - lastSentTimestamp() <= INTERVAL) {
      return;
    }

    setLastSentTimestamp(now);

    if (direction === currentDirection()) {
      return;
    }

    setCurrentDirection(direction);
    onDirectionChange(direction);
  };

  createEventListenerMap(document, {
    keydown: (event) => {
      if (event.key === "ArrowLeft") {
        onThrottledChange("LEFT");
      }
      if (event.key === "ArrowRight") {
        onThrottledChange("RIGHT");
      }
    },
    keyup: () => {
      onThrottledChange("NONE");
    },
  });
};
