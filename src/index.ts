
import { serve } from "@hono/node-server";
import app from "./app"

const port = +(process.env.PORT || 3000);
serve({ port, fetch: app.fetch });
console.log(`Server is running on http://localhost:${port}`);
