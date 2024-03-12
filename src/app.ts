// @ts-nocheck

import { Hono, Context, Next } from "hono";
import { sessionMiddleware, CookieStore } from "hono-sessions";
import { serveStatic } from "@hono/node-server/serve-static";
import { error404, error500 } from "./controllers/errors"; // Error handlers

import config from "./config.js"; // Configurations
import i18n from "./i18n/langs.js"; // Languages
import routes from "./routes/app.js"; // Routes

const app = new Hono(); // Application instance
const mwStatic = serveStatic({ root: "./dist/" }); // Stastic middleware
app.use("/public/*", mwStatic).use("/views/*", mwStatic); // Static paths
app.use("*", sessionMiddleware({ // Session configration
    store: new CookieStore(), // interface for getting and setting cookies
    encryptionKey: config.SESSION_KEY, // Required for CookieStore
    expireAfterSeconds: 900, // Expire session after 15 minutes of inactivity
    cookieOptions: { path: "/", httpOnly: true }
}));
app.use("*", (ctx: Context, next: Next) => {
    const lang = ctx.req.query("lang");
    const session = ctx.get("session");
    if (lang || !session.get("lang")) // has language changed?
        session.set("lang", i18n.getLanguage(lang + "," + ctx.req.header("Accept-Language")));
    ctx.set("xhr", ctx.req.header("x-requested-with") == "XMLHttpRequest"); // Is AJAX call
    ctx.set("lang", session.get("lang"));
    next();
});

app.route("/", routes);
app.notFound(error404);
app.onError(error500);

export default app;
