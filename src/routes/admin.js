
import { Hono } from "hono";
import { auth } from "../controllers/login";
import * as ctrl from "../controllers/admin";

const routes = new Hono();

routes.get("/admin", auth, ctrl.admin)

export default routes;
