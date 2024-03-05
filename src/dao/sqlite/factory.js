
import sqlite from "sqlite3"; //Database
import config from "app/dist/config.js"; // Configurations

import Menus from "./menus.js"; //Users DAO
import Usuarios from "./usuarios.js"; //Users DAO

// Database connection
const db = new sqlite.Database(config.SQLITE_PATH, sqlite.OPEN_READWRITE, err => {
	globalThis.log(err, "> Sqlite " + config.SQLITE_PATH + " open.");
});

// Add actions as promises
db.list = (sql, params) => {
	return new Promise((resolve, reject) => {
		db.all(sql, params, (err, data) => err ? reject(err) : resolve(data));
	});
}
db.find = (sql, params) => {
	return new Promise((resolve, reject) => {
		db.get(sql, params, (err, data) => err ? reject(err) : resolve(data));
	});
}
db.insert = function(sql, params) {
	return new Promise((resolve, reject) => { // Important! declare function to use this!!
		db.run(sql, params, err => err ? reject(err) : resolve(db.lastID)); // get the last insert id
	});
}
function fnUpdate(sql, params) {
	return new Promise((resolve, reject) => { // Important! declare function to use this!!
		db.run(sql, params, err => err ? reject(err) : resolve(db.changes));
	});
}
db.delete = db.update = fnUpdate;

const menus = new Menus(db);
const usuarios = new Usuarios(db);

export default {
	menus, usuarios, 

	open: function() {
	},
	close: function() {
		db.close(console.error); // close the database connection
		console.log("> Sqlite " + config.SQLITE_PATH + " closed.");
	}
};
