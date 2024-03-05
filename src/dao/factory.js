
import sqlite from "./sqlite/factory.js";

export default {
	sqlite,

	open: function() {
		sqlite.open();
		console.log("> DAO Factory open.");
	},
	close: function() {
		sqlite.close();
		console.log("> DAO Factory closed.");
	}
};
