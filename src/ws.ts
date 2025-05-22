import { eventHandler } from "vinxi/http";

export default eventHandler({
  handler() {},
  websocket: {
    async close(peer, details) {
      console.log("close", peer.id, peer, details);
    },
    async error(peer, error) {
      console.log("error", peer.id, peer, error);
    },
    async message(peer, msg) {
      const message = msg.text();
      console.log("msg", peer.id, peer, msg, message);
    },
    async open(peer) {
      console.log("open", peer.id, peer);
    },
  },
});
