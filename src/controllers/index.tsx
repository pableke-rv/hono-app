
import { Context } from "hono";
import Index from "../layouts/Index";
import Maps from "../layouts/Maps";
import Email from "../layouts/Email";

export const index = (ctx: Context) => {
    return ctx.html(<Index i18n={ctx.get("lang")}/>);
}

export const auth = (ctx: Context) => {
    return ctx.redirect("/");
}
export const login = (ctx: Context) => {
    ctx.get("session").set("userId", 123456);
    return ctx.redirect("/");
}
export const logout = (ctx: Context) => {
    ctx.get("session").deleteSession();
    return ctx.redirect("/");
}

export const maps = (ctx: Context) => {
    return ctx.html(<Maps i18n={ctx.get("lang")}/>);
}

export const test = (ctx: Context) => {
    return ctx.text("Hello Word!");
}
export const email = (ctx: Context) => {
    return ctx.html(<Email/>);
}
