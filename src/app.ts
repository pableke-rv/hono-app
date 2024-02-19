// @ts-nocheck 

import { Context } from "hono";
import { sessionMiddleware, CookieStore } from "hono-sessions";
import { serveStatic } from "@hono/node-server/serve-static";
import dotenv from "dotenv";
import app from "./routes/app";

dotenv.config();  // Load environment variables from .env file
const session = {
    store: new CookieStore(),
    encryptionKey: process.env.SESSION_KEY,
    expireAfterSeconds: 900,
    cookieOptions: { path: "/", httpOnly: true }
};

app.use("/public/*", serveStatic({ root: "./dist/" }));
app.use("*", sessionMiddleware(session));

app.onError((err, ctx: Context) => {
    console.error(err);
    return ctx.text("Custom Error Message", 500);
});
app.notFound((ctx: Context) => {
    return ctx.text("Custom 404 Message", 404);
});

export default app;
