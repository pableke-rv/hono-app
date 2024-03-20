
import { Context, Next } from "hono";
import { getCookie, setCookie } from "hono/cookie";

import { Login, Form } from "../layouts/Login";
import sqlite from "../dao/sqlite/factory.js";
import menu from "app/js/components/Menu.js";
import i18n from "../i18n/langs.js";
import util from "../lib/util.js";

function logged(ctx: Context) {
console.log("logged:", ctx.var.xhr);
    i18n.init(ctx.var.lang).setOk("login ok!");
    return util.xhr(ctx) ? ctx.text("login ok!") : ctx.html(<Form/>);
}
function logerr(err: string, ctx: Context) {
console.log("logerr:", ctx.var.xhr, err);
    i18n.init(ctx.var.lang).setError(err);
    return util.xhr(ctx) ? ctx.text(err, 500) : ctx.html(<Login/>, 500); // Go error
}
function redir(err: string, ctx: Context) { // Go login error
    return util.xhr(ctx) ? ctx.text(err, 500) : ctx.redirect("/login?err=" + err);
}

// Check if user is logged
export const auth = (ctx: Context, next: Next) => {
    const session = ctx.get("session");
    if (!session.get("user"))
        return redir("msgAuthFail", ctx);
    if (!session.sessionValid())
        return redir("msgExpired", ctx);
    next();
}
export const login = (ctx: Context) => {
    return util.loadMessages(ctx).xhr(ctx) ? ctx.html(<Form/>) : ctx.html(<Login/>);
}
export const signin = async (ctx: Context) => {
    const session = ctx.get("session");
    const lang = session.get("lang");
    return await ctx.req.parseBody().then(body => {
        i18n.init(lang).isLogin("login", body.login, "errLogin");
        //i18n.isLogin("pass", body.pass, "errPass");
        if (i18n.isError())
            throw new Error("msgAuthFail");
        return sqlite.usuarios.login(body.login, body.pass);
    }).then(user => {
        session.set("user", user);
        return sqlite.menus.getMenus(user.id, lang);
    }).then(menus => {
        session.set("menu", menu.html(menus));
        return ctx.text(i18n.get("msgLoginOk"));
    }).catch(err => {
        i18n.setException(lang, err);
        return ctx.json(i18n.getMsgs(), 500);
    });
}
export const logout = (ctx: Context) => {
    const session = ctx.get("session");
    //session.deleteSession();
    session.set("user", null);
    session.set("menu", null);
    i18n.init(session.get("lang")).setOk("msgLogout");
    return ctx.html(<Login/>);
}

export const sign = async (ctx: Context, next: Next) => {
    return await ctx.req.parseBody().then(body => {
        return sqlite.usuarios.login(body.login, body.pass);
    }).then(user => {
        setCookie(ctx, "token", util.sign({ id: user.id }));
        //ctx.get("session").set("user", user);
        return logged(ctx);
    }).catch(err => {
        return logerr("" + err, ctx);
    });
}
export const verify = async (ctx: Context, next: Next) => {
    const token = getCookie(ctx, "token");
    return await util.verify(token).then(user => next())
                    .catch(err => logerr("" + err, ctx));
}
