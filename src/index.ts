
import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";

// @ts-ignore
import routes from "./routes/routes.ts";

const app = new Hono();

app.use("/public/*", serveStatic({ root: "./dist/" }));
app.route("/", routes);

app.onError((err, ctx) => {
  console.error(err);
  return ctx.text("Custom Error Message", 500);
});
app.notFound(ctx => {
  return ctx.text("Custom 404 Message", 404);
});

const port = +(process.env.PORT || 3000);
console.log(`Server is running on http://localhost:${port}`);

serve({ port, fetch: app.fetch });
