// @ts-nocheck

import { Context, Next } from "hono";

import { admin } from "./admin";
import { Index, IndexTabs } from "../layouts/Index";
import { Maps, MapsTab0 } from "../layouts/Maps";
import { Email } from "../layouts/Email";

import sqlite from "../dao/sqlite/factory.js";
import menu from "../public/js/components/Menu.js";
import i18n from "../i18n/langs.js";
import util from "../lib/util.js";

export const lang = (ctx: Context, next: Next) => {
    const lang = ctx.req.param("lang");
    const session = ctx.get("session");
    if (lang != session.get("lang")) // has language changed?
        session.set("lang", i18n.getLanguage(lang/* + "," + ctx.req.header("Accept-Language")*/));
    //ctx.set("lang", session.get("lang"));
    return next();
}
export const init = (ctx: Context, next: Next) => {
    const session = ctx.get("session");
    if (!session.get("lang"))
        session.set("lang", i18n.getLanguage(ctx.req.header("Accept-Language")));
    ctx.set("lang", session.get("lang")); // current lang
    return next();
}
/*export const langByQuery = (ctx: Context, next: Next) => {
    const lang = ctx.req.query("lang");
    const session = ctx.get("session");
    if (lang || !session.get("lang")) // has language changed?
        session.set("lang", i18n.getLanguage(lang + "," + ctx.req.header("Accept-Language")));
    ctx.set("lang", session.get("lang"));
    return next();
}*/

export const index = (ctx: Context) => {
    i18n.init(ctx.get("lang"));
    return util.xhr(ctx) ? ctx.html(<IndexTabs/>) : ctx.html(<Index/>);
}

export const setLang = async (ctx: Context) => {
    const session = ctx.get("session");
    const user = session.get("user");
    if (!user)
        return ctx.html(<Index/>);
    const lang = ctx.get("lang");
    return await sqlite.menus.getMenus(user.id, lang).then(menus => {
        session.set("menu", menu.html(menus));
        return admin(ctx);
    });
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
