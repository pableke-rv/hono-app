
import { Hono } from "hono";
import * as ctrl from "../controllers/index";

const routes = new Hono();

routes.get("/", ctrl.index).get("/index", ctrl.index).get("/home", ctrl.index).get("/inicio", ctrl.index)
    .get("/login", ctrl.login).get("/signin", ctrl.login).get("/logout", ctrl.logout).get("/signout", ctrl.logout)
    .get("/maps", ctrl.maps).get("/mapas", ctrl.maps)
    .get("/test", ctrl.test);

export default routes;
