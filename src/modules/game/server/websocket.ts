import type { AdapterInternal, Peer } from "crossws";
import crossws, { type CloudflareOptions } from "crossws/adapters/cloudflare";
import { getPlayerCookieFromRequest } from "~/modules/player/server/cookies";
import type {
  WebsocketChatSendMessage,
  WebsocketChatServerMessage,
} from "./types";

const PRESENCE_TOPIC = "presence";

type WebsocketTopic = typeof PRESENCE_TOPIC;

const getGameId = (url: string) => {
  const slices = url.split("/");
  const gameId = slices[slices.length - 2];
  return gameId;
};

const publishPresenceMessage = (
  peer: Peer<AdapterInternal>,
  topic: WebsocketTopic,
  message: WebsocketChatServerMessage,
) => {
  peer.publish(topic, message);
};

export const ws = crossws({
  getNamespace: (request) => getGameId(request.url),
  resolve(request) {
    const gameId = getGameId(request.url);
    const player = getPlayerCookieFromRequest(request);
    return {
      close(peer, details) {
        console.log("[crossws]", { details, gameId, peer, player });
      },
      message(peer, message) {
        console.log("[crossws]", { gameId, message, peer, player });
        const json = message.json<WebsocketChatSendMessage>();
        console.log("[message]", { gameId, json, peer });
        publishPresenceMessage(peer, PRESENCE_TOPIC, {
          kind: "update",
          updates: [
            {
              angle: 1,
              playerId: player?.id ?? peer.id,
              point: { x: 0, y: 0 },
            },
          ],
        });
      },
      open(peer) {
        peer.subscribe(PRESENCE_TOPIC);

        if (player) {
          publishPresenceMessage(peer, PRESENCE_TOPIC, {
            color: player.color,
            kind: "join",
            name: player.name,
            peerId: peer.id,
            playerId: player.id,
          });
        }
      },
    };
  },
  resolveDurableStub(request, env) {
    const gameId = request && getGameId(request.url);

    console.log("[resolveDurableStub]", { gameId, request });

    if (!gameId) {
      throw new Error("gameId not defined");
    }

    const typedEnv = env as Env;
    const binding = typedEnv.GameDurableObject;
    const instanceId = binding.idFromString(gameId);
    const stub = binding.get(instanceId);

    console.log("[resolveDurableStub]", { gameId, instanceId, stub });

    // biome-ignore lint/suspicious/noExplicitAny: needed
    return stub as any as ResolveDurableStub;
  },
});

type ResolveDurableStub = ReturnType<
  NonNullable<CloudflareOptions["resolveDurableStub"]>
>;
