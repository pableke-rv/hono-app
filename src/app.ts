
import { Context } from "hono";
import { serveStatic } from "@hono/node-server/serve-static";
import app from "./routes/app";

app.use("/public/*", serveStatic({ root: "./dist/" }));
app.onError((err, ctx: Context) => {
    console.error(err);
    return ctx.text("Custom Error Message", 500);
});
app.notFound((ctx: Context) => {
    return ctx.text("Custom 404 Message", 404);
});

export default app;
