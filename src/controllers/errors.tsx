
import { Context } from "hono";
import { Error404, Error500 } from "../layouts/Errors";
import i18n from "../i18n/langs.js";
import util from "../lib/util.js";

export const error404 = (ctx: Context) => {
    const msg = "Error 404: Resource not found";
    if (util.xhr(ctx))
        return ctx.text(msg, 404); // AJAX call
    i18n.init(ctx.get("lang")).setError(msg);
    return ctx.html(<Error404/>);
}

export const error500 = (err: Error, ctx: Context) => {
    console.error(err); // log error
    if (util.xhr(ctx))
        return ctx.text("" + err, 500); // AJAX call
    i18n.init(ctx.get("lang")).setError("" + err);
    return ctx.html(<Error500/>);
}
