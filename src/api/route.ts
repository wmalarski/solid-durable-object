import { Hono } from "hono";
import { $DurableObject } from "../modules/board/durable/durable";

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

  const id = c.env.$DurableObject.idFromName("default");
  const stub = c.env.$DurableObject.get(id);

  return stub.fetch(c.req.raw);
});

const app = new Hono<HonoContext>();

app.route("/api", api);
app.get("*", async (c) => c.env.ASSETS.fetch(c.req.raw));

export { $DurableObject };

export default app;
