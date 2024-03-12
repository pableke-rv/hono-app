
import { Context } from "hono";
import { Index, IndexTabs } from "../layouts/Index";
import { Maps, MapsTab0 } from "../layouts/Maps";
import Email from "../layouts/Email";

import i18n from "../i18n/langs.js";

export const index = (ctx: Context) => {
    i18n.init(ctx.get("lang"));
    return ctx.get("xhr") ? ctx.html(<IndexTabs/>) : ctx.html(<Index/>);
}

export const maps = (ctx: Context) => {
    i18n.init(ctx.get("lang"));
    return ctx.get("xhr") ? ctx.html(<MapsTab0/>) : ctx.html(<Maps/>);
}

export const test = (ctx: Context) => {
    return ctx.text("Hello Word!");
}
export const email = (ctx: Context) => {
    i18n.init(ctx.get("lang"));
    return ctx.html(<Email/>);
}
