
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
//const result = await supabase.file.filter(session.get("user").id);
//console.log('Log:', result.data, result.error);
    return ctx.html(<Admin msgs={msgs} user={session.get("user")} menu={session.get("menu")}/>);
}

export const viewProfile = async (ctx: ContextMsgs) => {
    const session = ctx.get("session");
    const user = session.get("user");
    return ctx.xhr() ? ctx.html(<ProfileActiveTab user={user}/>)
                    : ctx.html(<Profile msgs={ctx.getMsgs()} user={user} menu={session.get("menu")}/>);
}

export const saveProfile = async (ctx: ContextMsgs) => {
    const user = ctx.get("session").get("user");
    return await ctx.req.formData().then(fd => { // FormData object
        //return util.uploadAll(user.id, fd.getAll("logo"));
        return util.upload(user.id, fd.get("logo"));
    }).then(info => {
        // TODO: store file in supabase
        console.log(info);
        return ctx.text("saveOk");
    })/*.then(result => { // Multifile
        // TODO: store file in supabase
        ctx.text("saveOk");
    })*/;
}
