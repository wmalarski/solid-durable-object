import type { AdapterInternal, Peer } from "crossws";
import crossws from "crossws/adapters/cloudflare";
import { getPlayerCookieFromRequest } from "~/modules/player/server/cookies";
import type { Player } from "~/modules/player/server/types";
import type {
  WebsocketChatSendMessage,
  WebsocketChatServerMessage,
} from "./types";

const PRESENCE_TOPIC = "presence";

type WebsocketTopic = typeof PRESENCE_TOPIC;

const getBoardId = (request: Request) => {
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
  bindingName: "BoardDurableObject",
  getNamespace: getBoardId,
  hooks: {
    close(peer, _details) {
      console.log("close-peer.context", peer.context);
    },
    message(peer, message) {
      const json = message.json<WebsocketChatSendMessage>();

      console.log("[message]", { json, peer, player: peer.context });

      peer.publish(PRESENCE_TOPIC, { message: json.content, user: peer.id });
    },
    open(peer) {
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

      const player = peer.context.player as Player;

      console.log("[open]", { player });

      if (player) {
        publishPresenceMessage(peer, PRESENCE_TOPIC, {
          color: player.color,
          kind: "join",
          name: player.name,
          playerId: player.id,
        });
      }

      peer.publish(PRESENCE_TOPIC, {
        message: `${peer} joined!`,
        user: "server",
      });
    },
    upgrade(request) {
      const player = getPlayerCookieFromRequest(request);
      console.log("[upgrade]", { player });
      return { ...request, context: { player } };
    },
  },
});
