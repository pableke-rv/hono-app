// @ts-nocheck 

import { Hono, Context, Next } from "hono";
import { sessionMiddleware, CookieStore } from "hono-sessions";
import { serveStatic } from "@hono/node-server/serve-static";

import config from "./config.js"; // Configurations
import i18n from "./i18n/langs"; // Languages
import routes from "./routes/app"; // Routes

const app = new Hono(); // Application instance
app.use("/public/*", serveStatic({ root: "./dist/" }));
app.use("*", sessionMiddleware({ // Session configration
    store: new CookieStore(), // interface for getting and setting cookies
    encryptionKey: config.SESSION_KEY, // Required for CookieStore
    expireAfterSeconds: 900, // Expire session after 15 minutes of inactivity
    cookieOptions: { path: "/", httpOnly: true }
}));
app.get("*", (ctx: Context, next: Next) => {
    //const { id, commentId } = ctx.req.param();
    //const { q, limit, offset } = ctx.req.query();
    const lang = ctx.req.query("lang");
    const session = ctx.get("session");
    if (lang || !session.get("lang")) // has language changed?
        session.set("lang", lang || i18n.getLanguage(ctx.req.header("Accept-Language")));
    ctx.set("lang", i18n.setLang(session.get("lang")).getLang());
    next();
});

app.route("/", routes);
app.onError((err, ctx: Context) => {
    console.error(err);
    //if (ctx.req.header("x-requested-with") == "XMLHttpRequest") // is AJAX
    return ctx.text("Custom Error Message", 500);
});
app.notFound((ctx: Context) => {
    return ctx.text("Custom 404 Message", 404);
});

export default app;
