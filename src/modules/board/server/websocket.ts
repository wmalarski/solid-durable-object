import crossws from "crossws/adapters/cloudflare";
import type { WebsocketChatSendMessage } from "./types";

const CHAT_CHANNEL = "chat";

export const ws = crossws({
  bindingName: "BoardDurableObject",
  getNamespace(request) {
    const slices = request.url.split("/");
    const last = slices[slices.length - 1];
    return last;
  },
  hooks: {
    close(peer, _details) {
      console.log("close-peer.context", peer.context);
    },
    message: (peer, message) => {
      const json = message.json<WebsocketChatSendMessage>();
      peer.publish(CHAT_CHANNEL, { message: json.content, user: peer.id });
    },
    open(peer) {
      console.log(
        "open-peer.context",
        peer,
        peer.namespace,
        peer.peers,
        peer.id,
        peer.request,
      );

      peer.subscribe(CHAT_CHANNEL);
      peer.publish(CHAT_CHANNEL, {
        message: `${peer} joined!`,
        user: "server",
      });
    },
  },
});
