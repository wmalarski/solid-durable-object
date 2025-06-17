import type { AdapterInternal, Peer } from "crossws";
import crossws, { type CloudflareOptions } from "crossws/adapters/cloudflare";
import { getPlayerCookieFromRequest } from "~/modules/player/server/cookies";
import type { WebsocketChatServerMessage } from "./types";

const PRESENCE_TOPIC = "presence";

type WebsocketTopic = typeof PRESENCE_TOPIC;

const getGameId = (request: Request) => {
  const slices = request.url.split("/");
  const last = slices[slices.length - 1];
  return last;
};

const publishPresenceMessage = (
  peer: Peer<AdapterInternal>,
  topic: WebsocketTopic,
  message: WebsocketChatServerMessage,
) => {
  peer.publish(topic, message);
};

export const ws = crossws({
  // getNamespace: (request) => getGameId(request),
  resolve(request) {
    return {
      close(peer, details) {
        console.log("[crossws]", { details, peer, request });
      },
      message(peer, message) {
        console.log("[crossws]", { message, peer, request });
        // const json = message.json<WebsocketChatSendMessage>();
        // console.log("[message]", { game, json, peer, player: peer.context });
        // peer.publish(PRESENCE_TOPIC, { message: json.content, user: peer.id });
      },
      open(peer) {
        console.log("[crossws]", { peer, request });
        // peer.context

        // console.log(
        //   "open-peer.context",
        //   peer,
        //   peer.namespace,
        //   peer.peers,
        //   peer.id,
        //   peer.request,
        // );

        peer.subscribe(PRESENCE_TOPIC);

        const context = peer.context;

        console.log("[open]", { context, peer, request });

        // if (player) {
        //   publishPresenceMessage(peer, PRESENCE_TOPIC, {
        //     color: player.color,
        //     kind: "join",
        //     name: player.name,
        //     playerId: player.id,
        //   });
        // }

        // peer.publish(PRESENCE_TOPIC, {
        //   message: `${peer} joined!`,
        //   user: "server",
        // });
      },
      upgrade(request) {
        const player = getPlayerCookieFromRequest(request);
        console.log("[upgrade]", player, request);
        return { ...request, context: { player } };
      },
    };
  },
  resolveDurableStub(request, env) {
    const gameId = request?.url.split("/").at(-2);

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
