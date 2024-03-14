
import { Context, Next } from "hono";
import { getCookie, setCookie } from "hono/cookie";

import { Login, Form } from "../layouts/Login";
import sqlite from "../dao/sqlite/factory.js";
import i18n from "../i18n/langs.js";
import util from "../lib/util.js";

function logged(ctx: Context) {
console.log('logged:', ctx.var.xhr);
    i18n.init(ctx.var.lang).setOk("login ok!");
    return ctx.get("xhr") ? ctx.text("login ok!") : ctx.html(<Form/>);
}
function logerr(err: string, ctx: Context) {
console.log('logerr:', ctx.var.xhr, err);
    i18n.init(ctx.var.lang).setError(err);
    return ctx.get("xhr") ? ctx.text(err, 500) : ctx.html(<Login/>, 500); // Go error
}
function redir(err: string, ctx: Context) { // Go login error
    return ctx.get("xhr") ? ctx.text(err, 500) : ctx.redirect("/login?err=" + err);
}

export const auth = (ctx: Context, next: Next) => { // Check if user is logged
    return ctx.get("session").get("user") ? next() : redir("msgAuthFail", ctx);
}
export const login = (ctx: Context) => {
    const { ok, info, warn, err } = ctx.req.query();
    i18n.init(ctx.get("lang")).setOk(ok).setInfo(info).setWarn(warn).setError(err);
    return ctx.get("xhr") ? ctx.html(<Form/>) : ctx.html(<Login/>);
}
export const signin = async (ctx: Context, next: Next) => {
    try {
        const { login, pass } = await ctx.req.parseBody();
console.log('Log:', login, pass);
        if (!login || !pass)
            throw new Error("Acceso no autorizado");
        const user = await sqlite.usuarios.login(login, pass);
        if (!user)
            throw new Error("Usuario no encontrado en el sistema");
console.log('Log:', user);
        ctx.get("session").set("user", user);
        return logged(ctx);
    } catch(ex) {
        return logerr("" + ex, ctx);
    }
console.log("fin");
    //await next(); // pass control to the next middleware
   /*return await ctx.req.parseBody().then(body => {
        return sqlite.usuarios.login(body.login, body.pass);
    }).then(user => {
        ctx.get("session").set("user", user);
        return logged(ctx);
    }).catch(err => {
        return logerr("" + err, ctx);
    });*/
    //return new Response(ctx.res.body);
}
export const logout = (ctx: Context) => {
    ctx.get("session").deleteSession();
    i18n.init(ctx.get("lang")).setOk("msgLogout");
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
