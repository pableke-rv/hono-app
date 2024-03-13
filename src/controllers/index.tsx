// @ts-nocheck

import { Context, Next } from "hono";
import { Index, IndexTabs } from "../layouts/Index";
import { Maps, MapsTab0 } from "../layouts/Maps";
import Email from "../layouts/Email";

import i18n from "../i18n/langs.js";
import Menu from "../components/Menu";

export const lang = (ctx: Context, next: Next) => {
    const lang = ctx.req.param("lang");
    const session = ctx.get("session");
    if (lang != session.get("lang")) // has language changed?
        session.set("lang", i18n.getLanguage(lang + "," + ctx.req.header("Accept-Language")));
    //ctx.set("lang", session.get("lang"));
    next();
}
export const init = (ctx: Context, next: Next) => {
    ctx.set("xhr", ctx.req.header("x-requested-with") == "XMLHttpRequest"); // Is AJAX call
    ctx.set("lang", ctx.get("session").get("lang") || i18n.getLanguage(ctx.req.header("Accept-Language"))); // current lang
    next();
}
/*export const langByQuery = (ctx: Context, next: Next) => {
    const lang = ctx.req.query("lang");
    const session = ctx.get("session");
    if (lang || !session.get("lang")) // has language changed?
        session.set("lang", i18n.getLanguage(lang + "," + ctx.req.header("Accept-Language")));
    ctx.set("xhr", ctx.req.header("x-requested-with") == "XMLHttpRequest"); // Is AJAX call
    ctx.set("lang", session.get("lang"));
    next();
}*/

export const index = (ctx: Context) => {
    i18n.init(ctx.get("lang"));
    return ctx.get("xhr") ? ctx.html(<IndexTabs/>) : ctx.html(<Index/>);
}

export const menus = (ctx: Context) => {
    i18n.init(ctx.get("lang"));
    return ctx.html(<Menu/>);
}

export const maps = (ctx: Context) => {
    i18n.init(ctx.get("lang"));
    return ctx.get("xhr") ? ctx.html(<MapsTab0/>) : ctx.html(<Maps/>);
}

export const test = (ctx: Context) => {
    return ctx.text("Hello Word!");
}
export const email = (ctx: Context) => {
    i18n.init(ctx.get("lang"));
    return ctx.html(<Email/>);
}
