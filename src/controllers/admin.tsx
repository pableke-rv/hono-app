
import sharp from "sharp";
import { Context } from "hono";
import { Admin, AdminTabs } from "../layouts/Admin";
import util from "../lib/util.js";

export const admin = (ctx: Context) => {
    util.loadMessages(ctx);
    const session = ctx.get("session");
    return ctx.html(<Admin user={session.get("user")} menu={session.get("menu")}/>);
}

export const viewProfile = (ctx: Context) => {
    const session = ctx.get("session");
    return ctx.html(<AdminTabs user={session.get("user")} profile="active"/>);
}

export const saveProfile = async (ctx: Context) => {
    const body = await ctx.req.parseBody();
    console.log('Log:', body, body["logo"]);
    /*sharp(body.logo)
        .resize(320, 240)
        .toFile('output.webp', (err, info) => {});*/
    return ctx.text("saveOk");
}
