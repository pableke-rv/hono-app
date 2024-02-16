
import { Context } from "hono";
import Index from "../pages/index";
import Maps from "../pages/maps";

export const index = (ctx: Context) => {
    return ctx.html(<Index/>);
}

export const maps = (ctx: Context) => {
    return ctx.html(<Maps/>);
}

export const test = (ctx: Context) => {
    return ctx.text("Hello Word!");
}
