// @ts-nocheck 

import { describe, it, test } from "node:test";
import assert from "node:assert";

import app from "./app";
import sqlite from "./sqlite";

describe("Request example", () => {
    it("GET /test", async () => {
        const res = await app.test();
        assert.equal(res.status, 200);
        assert.equal(await res.text(), "Hello Word!");
    });
});

test.skip("Skipping tests", () => {
    assert.notEqual(1, 2)
});

describe("Sqlite DB tests", () => {
    it("Filter by params", async () => {
        const data = await sqlite.filterByParams();
        assert.equal(data.length, 1);
        assert.equal(data[0].tipo, 1);
        assert.equal(data[0].nombre, "Inicio");
    });

    it("Multi insert values", () => {
        sqlite.insertAll().then(results => {
            console.log("test", results);
            assert.equal(results.changes, 3);
        });
    });
});
