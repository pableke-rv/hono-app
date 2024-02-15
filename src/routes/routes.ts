
import { Hono } from "hono";

// @ts-ignore
import { index } from "../controllers/index.tsx";

const routes = new Hono();

routes.get("/", index).get("/index", index);

export default routes;
