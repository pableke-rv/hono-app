// @ts-nocheck 

import sqlite from "app/dao/sqlite/factory.js";

const MENUS = [
    { tipo: 1, enlace: "#1", nombre: "nombre 1", titulo: "titulo 1", orden: 21, mask: 1 },
    { tipo: 1, enlace: "#2", nombre: "nombre 2", titulo: "titulo 2", orden: 22, mask: 1 },
    { tipo: 1, enlace: "#3", nombre: "nombre 3", titulo: "titulo 3", orden: 23, mask: 1 }
];

sqlite.open();
export default {
    filterByParams: () => sqlite.menus.filterByParams(1, "inicio"),
    insertAll: () => sqlite.menus.insertAll(MENUS).then(sqlite.menus.deleteTest)
}
