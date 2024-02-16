
import { Hono } from "hono";
import * as api from "../controllers/api";

const routes = new Hono();

routes.get("/maps", api.maps).get("/mapas", api.maps);

export default routes;
