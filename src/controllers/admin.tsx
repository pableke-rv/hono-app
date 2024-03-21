
import { Context } from "hono";
import { Admin } from "../layouts/Admin";
import util from "../lib/util.js";

export const admin = (ctx: Context) => {
    util.loadMessages(ctx);
    const session = ctx.get("session");
    return ctx.html(<Admin user={session.get("user")} menus={session.get("menus")}/>);
}
