import crossws from "crossws/adapters/cloudflare";
import type { WebsocketChatSendMessage } from "./types";

const CHAT_CHANNEL = "chat";

export const ws = crossws({
  bindingName: "BoardDurableObject",
  hooks: {
    message: (peer, message) => {
      const json = message.json<WebsocketChatSendMessage>();
      peer.publish(CHAT_CHANNEL, { message: json.content, user: peer.id });
    },
    open(peer) {
      peer.subscribe(CHAT_CHANNEL);
      peer.publish(CHAT_CHANNEL, {
        message: `${peer} joined!`,
        user: "server",
      });
    },
  },
});
