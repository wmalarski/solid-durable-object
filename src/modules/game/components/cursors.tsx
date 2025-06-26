import { type Component, createEffect, createSignal } from "solid-js";
import { createStore, produce } from "solid-js/store";
import { Button } from "~/ui/button/button";
import { useGameConfig } from "../contexts/game-config";
import {
  useOnWebsocketEvent,
  useWebsocketConnection,
} from "../contexts/websocket-connection";
import type { Session, WsMessage } from "../server/game-durable-object";

const INTERVAL = 55;

export const Cursors: Component = () => {
  const [cursors, setCursors] = createStore<Record<string, Session>>({});

  const [lastSentTimestamp, setLastSentTimestamp] = createSignal(0);

  const config = useGameConfig();
  const ws = useWebsocketConnection();

  // const [messageState, dispatchMessage] = useReducer(messageReducer, {
  //   in: "",
  //   out: "",
  // });

  //   const [highlightedIn, highlightIn] = useHighlight();
  //   const [highlightedOut, highlightOut] = useHighlight();

  useOnWebsocketEvent("open", function () {
    //   highlightOut();
    // dispatchMessage({ message: "get-cursors", type: "out" });
    const message: WsMessage = { type: "get-cursors" };
    this.send(JSON.stringify(message));
  });

  useOnWebsocketEvent("message", (message) => {
    const messageData: WsMessage = JSON.parse(message.data);
    // highlightIn();
    // dispatchMessage({ message: messageData.type, type: "in" });
    switch (messageData.type) {
      case "quit":
        setCursors(
          produce((prev) => {
            if (messageData.id in prev) {
              delete prev[messageData.id];
            }
          }),
        );
        break;
      case "join":
        setCursors(
          produce((prev) => {
            if (!(messageData.id in prev)) {
              prev[messageData.id] = { id: messageData.id, x: -1, y: -1 };
            }
          }),
        );
        break;
      case "move":
        setCursors(
          produce((prev) => {
            const session = prev[messageData.id];
            if (session) {
              session.x = messageData.x;
              session.y = messageData.y;
            } else {
              prev[messageData.id] = messageData;
            }
          }),
        );
        break;
      case "get-cursors-response":
        setCursors(
          Object.fromEntries(
            messageData.sessions.map((session) => [session.id, session]),
          ),
        );
        break;
      default:
        break;
    }
  });

  useOnWebsocketEvent("close", () => {
    setCursors({});
  });

  createEffect(() => {
    const abortController = new AbortController();
    const websocket = ws();
    const game = config();
    const playerId = game.config?.player?.id;

    if (!playerId) {
      return;
    }

    document.addEventListener(
      "mousemove",
      (ev) => {
        const x = ev.pageX / window.innerWidth;
        const y = ev.pageY / window.innerHeight;
        const now = Date.now();

        if (
          now - lastSentTimestamp() > INTERVAL &&
          websocket?.readyState === WebSocket.OPEN
        ) {
          const message: WsMessage = { id: playerId, type: "move", x, y };

          console.log("[message]", { message });

          websocket.send(JSON.stringify(message));
          setLastSentTimestamp(now);
          // highlightOut();
          // dispatchMessage({ message: "move", type: "out" });
        }
      },
      { signal: abortController.signal },
    );
    return () => abortController.abort();
  });

  function sendMessage() {
    // highlightOut();
    // dispatchMessage({ message: "message", type: "out" });
    const websocket = ws();
    websocket?.send(
      JSON.stringify({ data: "Ping", type: "message" } satisfies WsMessage),
    );
  }

  // const otherCursors = createMemo(() => {
  //   return Object.values(cursors).filter(
  //     ({ id, x, y }) => id !== props.id && x !== -1 && y !== -1,
  //   );
  // });

  return (
    <>
      <div class="flex border">
        <div class="border-r px-2 py-1">WebSocket Connections</div>
        <div class="px-2 py-1"> {Object.entries(cursors).length} </div>
      </div>
      <div class="flex border">
        <div class="border-r px-2 py-1">Messages</div>
        <pre>{JSON.stringify(cursors, null, 2)}</pre>
      </div>
      <div class="flex gap-2">
        <Button onClick={sendMessage}>ws message</Button>
      </div>
      {/* <div>
        <For each={otherCursors()}>
          {(session) => (
            <SvgCursor
              point={[
                session.x * window.innerWidth,
                session.y * window.innerHeight,
              ]}
            />
          )}
        </For>
      </div> */}
    </>
  );
};

// function SvgCursor({ point }: { point: number[] }) {
//   const refSvg = useRef<SVGSVGElement>(null);

//   const animateCursor = useCallback((point: number[]) => {
//     refSvg.current?.style.setProperty(
//       "transform",
//       `translate(${point[0]}px, ${point[1]}px)`,
//     );
//   }, []);

//   const onPointMove = usePerfectCursor(animateCursor);
//   useLayoutEffect(() => onPointMove(point), [onPointMove, point]);
//   const [randomColor] = useState(
//     `#${Math.floor(Math.random() * 16777215)
//       .toString(16)
//       .padStart(6, "0")}`,
//   );
//   return (
//     <svg
//       class={"-top-[12px] -left-[12px] pointer-events-none absolute"}
//       height="32"
//       ref={refSvg}
//       viewBox="0 0 32 32"
//       width="32"
//       xmlns="http://www.w3.org/2000/svg"
//     >
//       <defs>
//         <filter height="180%" id="shadow" width="180%" x="-40%" y="-40%">
//           <feDropShadow dx="1" dy="1" floodOpacity="0.5" stdDeviation="1.2" />
//         </filter>
//       </defs>
//       <g fill="none" filter="url(#shadow)" transform="rotate(0 16 16)">
//         <path
//           d="M12 24.4219V8.4069L23.591 20.0259H16.81l-.411.124z"
//           fill="white"
//         />
//         <path
//           d="M21.0845 25.0962L17.4795 26.6312L12.7975 15.5422L16.4835 13.9892z"
//           fill="white"
//         />
//         <path
//           d="M19.751 24.4155L17.907 25.1895L14.807 17.8155L16.648 17.04z"
//           fill={randomColor}
//         />
//         <path
//           d="M13 10.814V22.002L15.969 19.136l.428-.139h4.768z"
//           fill={randomColor}
//         />
//       </g>
//     </svg>
//   );
// }

// function usePerfectCursor(cb: (point: number[]) => void, point?: number[]) {
//   const [pc] = useState(() => new PerfectCursor(cb));

//   useLayoutEffect(() => {
//     if (point) pc.addPoint(point);
//     return () => pc.dispose();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [pc]);

//   useLayoutEffect(() => {
//     PerfectCursor.MAX_INTERVAL = 58;
//   }, []);

//   const onPointChange = useCallback(
//     (point: number[]) => pc.addPoint(point),
//     [pc],
//   );

//   return onPointChange;
// }
