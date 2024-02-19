
import { describe, it, test } from "node:test";
import assert from "node:assert";
import app from "../src/app";

describe("Example", () => {
    it("GET /test", async () => {
        const res = await app.request("/test");
        assert.equal(res.status, 200);
        assert.equal(await res.text(), "Hello Word!");
    });
});

test.skip("Skipping tests", () => {
    assert.notEqual(1, 2)
});
