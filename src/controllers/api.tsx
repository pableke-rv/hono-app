
import { Context } from "hono";
import { Tab0 } from "../layouts/Maps";

export const maps = (ctx: Context) => {
    return ctx.html(<Tab0/>);
}
