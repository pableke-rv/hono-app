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
    it("Filter by data", async () => {
        const menus = await sqlite.filter({ tipo: 1 });
        assert.equal(menus.length, 18);
        const actions = await sqlite.filter({ tipo: 2 });
        assert.equal(actions.length, 2);
    });

    it("Filter menu by term", async () => {
        const menu = await sqlite.getById(2);
        const data = await sqlite.filterMenu("inicio");
        assert.equal(menu.nombre, data[0].nombre);
        assert.equal(data[0].nombre, "Inicio");
        assert.equal(menu.tipo, data[0].tipo);
        assert.equal(data.length, 1);
    });

    it("Multi insert values", () => {
        sqlite.insertAll().then(changes => {
            assert.equal(changes, 3);
        });
    });
});
