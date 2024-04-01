// @ts-nocheck

import { Context } from "hono";
import { Admin, AdminTabs } from "../layouts/Admin";

import i18n from "../i18n/langs.js";
import util from "../lib/util.js";

export const admin = (ctx: Context) => {
    const session = ctx.get("session");
    return ctx.html(<Admin user={session.get("user")} menu={session.get("menu")}/>);
}

export const welcome = (ctx: Context) => {
    i18n.setOk("msgLoginOk");
    return admin(ctx);
}

export const viewProfile = (ctx: Context) => {
    const session = ctx.get("session");
    return ctx.html(<AdminTabs user={session.get("user")} profile="active"/>);
}

export const saveProfile = async (ctx: Context) => {
    const fd = await ctx.req.formData(); // Read FormData object
    //const files = fd.getAll("logo");
    //return await util.uploadAll(files).then(() => ctx.text("saveOk"));
    const file = fd.get("logo");
    return await util.upload(file).then(() => ctx.text("saveOk"));
}
