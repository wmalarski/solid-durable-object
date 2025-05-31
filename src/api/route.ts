import { Hono } from "hono";

type HonoContext = {
  Bindings: Env;
};

const api = new Hono<HonoContext>();

api.get("/hello", (c) => {
  return c.json({
    message: "Hello Next.js!",
  });
});

api.get("/ws", async (c) => {
  if (c.req.header("upgrade") !== "websocket") {
    return c.text("Expected Upgrade: websocket", 426);
  }

  const id = c.env.BoardDurableObject.idFromName("default");
  const stub = c.env.BoardDurableObject.get(id);

  return stub.fetch(c.req.raw);
});

const app = new Hono<HonoContext>();

app.route("/api", api);
app.get("*", async (c) => c.env.ASSETS.fetch(c.req.raw));

export { BoardDurableObject } from "../modules/board/server/board-durable-object";
export { LobbyDurableObject } from "../modules/lobby/server/lobby-durable-object";

export default app;
