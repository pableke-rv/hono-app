// @ts-nocheck 

import { serve } from "@hono/node-server"; // http server
import dao from "./dao/factory.js"; // DAO connections
import config from "./config.js"; // Configurations
import app from "./app";

const OPTIONS = { port: config.PORT, fetch: app.fetch };
const server = serve(OPTIONS, ({ port }) => {
    console.log(`> Server is running on http://localhost:${port}`);
    dao.open(); // Oppen all connections
});

process.on("SIGINT", param => {
    dao.close(); // Close all db connections
    server.close(console.error); // Close http server
    console.log(`> ${param}: Ctrl-C was pressed! => server closed.`);
});
