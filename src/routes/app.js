
import admin from "./admin";
import login from "./login";
import index from "./index";

index.route("/", login);
index.route("/", admin);

export default index;
