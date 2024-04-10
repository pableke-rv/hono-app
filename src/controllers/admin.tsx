
import { ContextMsgs } from "../types/hono";
import { Admin, Profile, ProfileActiveTab } from "../layouts/Admin";

import supabase from "../dao/supabase/factory.js";
import util from "../lib/util.js";

export const admin = (ctx: ContextMsgs) => {
    const session = ctx.get("session");
    return ctx.html(<Admin msgs={ctx.getMsgs()} user={session.get("user")} menu={session.get("menu")}/>);
}

export const welcome = async (ctx: ContextMsgs) => {
    const session = ctx.get("session");
    const msgs = ctx.getMsgs().setOk("msgLoginOk");
    return ctx.html(<Admin msgs={msgs} user={session.get("user")} menu={session.get("menu")}/>);
}

export const viewProfile = async (ctx: ContextMsgs) => {
    const session = ctx.get("session");
    const user = session.get("user");
    return ctx.xhr() ? ctx.html(<ProfileActiveTab user={user}/>)
                    : ctx.html(<Profile msgs={ctx.getMsgs()} user={user} menu={session.get("menu")}/>);
}

export const saveProfile = async (ctx: ContextMsgs) => {
    try {
        const user = ctx.get("session").get("user");
        const fd = await ctx.req.formData(); // FormData object
        //const files = await util.uploadAll(user.id, fd.getAll("logo"));
        const file = await util.upload(user.id, fd.get("logo"));
        file.fk = 1;
        delete file.format;
        const { data, error } = await supabase.file.insert(file);
        console.log('Log:', file, data, error); // <-- info log for debug
        return error ? util.unload(file.path).error(ctx, error) : ctx.text("saveOk");
    } catch (err) {
        return util.error(ctx, err);
    }
}
