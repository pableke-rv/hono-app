
export default {
	open: globalThis.void,
	close: function() {
		//db.close(console.error); // close the database connection
		console.log("> Supabase closed.");
	}
};
