
import { Context } from "hono";
import Index from "../pages/index";
import Maps from "../pages/maps";

export const index = (ctx: Context) => {
    return ctx.html(<Index {...ctx.get("lang")}/>);
}

export const auth = (ctx: Context) => {
    return ctx.html(<Index/>);
}
export const login = (ctx: Context) => {
    ctx.get("session").set("userId", 123456);
    console.log("login");
    return ctx.redirect("/");
}
export const logout = (ctx: Context) => {
    console.log("logout");
    ctx.get("session").deleteSession();
    return ctx.redirect("/");
}

export const maps = (ctx: Context) => {
    return ctx.html(<Maps/>);
}

export const test = (ctx: Context) => {
    return ctx.text("Hello Word!");
}
