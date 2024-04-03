// @ts-nocheck

import { Context } from "hono";
import { Admin, Profile, ProfileActiveTab } from "../layouts/Admin";

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
    return util.xhr(ctx) ? ctx.html(<ProfileActiveTab user={session.get("user")}/>)
                        : ctx.html(<Profile user={session.get("user")} menu={session.get("menu")}/>);
}

export const saveProfile = async (ctx: Context) => {
    const user = ctx.get("session").get("user");
    const fd = await ctx.req.formData(); // Read FormData object

    //const files = fd.getAll("logo");
    //return await util.uploadAll(user.id, files).then(() => ctx.text("saveOk"));

    const file = fd.get("logo"); // TODO: store file in supabase
    return await util.upload(user.id, file).then(info => {console.log(info); return ctx.text("saveOk");});
}
