import { Hono } from "hono";
import { $DurableObject } from "../modules/board/durable/durable";

const app = new Hono<{ Bindings: Env }>();

app.get("/hello", (c) => {
  // console.log("c.env", c.env, c.event);
  return c.json({
    message: "Hello Next.js!",
  });
});

app.get("*", async (c) => c.env.ASSETS.fetch(c.req.raw));

export { $DurableObject };

export default app;
