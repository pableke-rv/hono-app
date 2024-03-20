// @ts-nocheck

import { Context, Next } from "hono";
import { Index, IndexTabs } from "../layouts/Index";
import { Maps, MapsTab0 } from "../layouts/Maps";
import { Email } from "../layouts/Email";

import i18n from "../i18n/langs.js";
import Menu from "../components/Menu";
import util from "../lib/util.js";

export const lang = (ctx: Context, next: Next) => {
    const lang = ctx.req.param("lang");
    const session = ctx.get("session");
    if (lang != session.get("lang")) // has language changed?
        session.set("lang", i18n.getLanguage(lang + "," + ctx.req.header("Accept-Language")));
    //ctx.set("lang", session.get("lang"));
    next();
}
export const init = (ctx: Context, next: Next) => {
    const session = ctx.get("session");
    if (!session.get("lang"))
        session.set("lang", i18n.getLanguage(ctx.req.header("Accept-Language")));
    ctx.set("lang", session.get("lang")); // current lang
    next();
}
/*export const langByQuery = (ctx: Context, next: Next) => {
    const lang = ctx.req.query("lang");
    const session = ctx.get("session");
    if (lang || !session.get("lang")) // has language changed?
        session.set("lang", i18n.getLanguage(lang + "," + ctx.req.header("Accept-Language")));
    ctx.set("lang", session.get("lang"));
    next();
}*/

export const index = (ctx: Context) => {
    i18n.init(ctx.get("lang"));
    return util.xhr(ctx) ? ctx.html(<IndexTabs/>) : ctx.html(<Index/>);
}

export const menus = (ctx: Context) => {
    i18n.init(ctx.get("lang"));
    return ctx.html(<Menu/>);
}

export const maps = (ctx: Context) => {
    i18n.init(ctx.get("lang"));
    return util.xhr(ctx) ? ctx.html(<MapsTab0/>) : ctx.html(<Maps/>);
}

export const test = (ctx: Context) => {
    return ctx.text("Hello Word!");
}
export const email = (ctx: Context) => {
    i18n.init(ctx.get("lang"));
    return ctx.html(<Email/>);
}
