
import { Hono } from "hono";
import * as ctrl from "../controllers/index";

const routes = new Hono();

routes.get("/", ctrl.index).get("/index", ctrl.index).get("/home", ctrl.index).get("/inicio", ctrl.index)
        .get("/maps", ctrl.maps).get("/test", ctrl.test).get("/email", ctrl.email);

export default routes;
