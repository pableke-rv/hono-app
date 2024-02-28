
import { Context } from "hono";
import Index from "../pages/index";
import Maps from "../pages/maps";

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
