// @ts-nocheck

import { Hono } from "hono";
import { serveStatic } from "@hono/node-server/serve-static";
import { sessionMiddleware, CookieStore } from "hono-sessions";

import { lang, init } from "./controllers/index"; // Init. language
import { error404, error500 } from "./controllers/errors"; // Error handlers

import config from "./config.js"; // Configurations
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

/*app.use("*", langByQuery);*/
const LANG_ROUTE = "/:lang{[a-z]{2}(\-[A-Z]{2})?}";
app.get(LANG_ROUTE, lang).get(LANG_ROUTE + "/*", lang);
app.use("*", init); // Always load language info

app.route("/", routes);
app.route(LANG_ROUTE, routes);

app.notFound(error404);
app.onError(error500);

export default app;
