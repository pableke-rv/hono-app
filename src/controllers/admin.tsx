
import { Context } from "hono";
import { Admin } from "../layouts/Admin";
import util from "../lib/util.js";

export const admin = (ctx: Context) => {
    util.loadMessages(ctx);
    const user = ctx.var.session.get("user");
    const menus = ctx.var.session.get("menus");
    return ctx.html(<Admin user={user} menus={menus}/>);
}
