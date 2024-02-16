
import { testClient } from "hono/testing";
import app from "../src/app";

const test = testClient(app);

test("GET /test", async () => {
    const res = await app.request("/test");
    expect(res.status).toBe(200);
    expect(await res.text()).toEqual("Hello Word!");
});
