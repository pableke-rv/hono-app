
import fs from "fs"; //file system module
import path from "path"; //file and directory paths
import cp from "child_process"; //system calls
import jwt from "jsonwebtoken"; // JSON web token
import mimetypes from "../data/mime-types.json" assert { type: "json" };
import config from "../config.js"; // Configurations
import i18n from "../i18n/langs.js";

function Util() {
	const self = this; //self instance

	this.xhr = ctx => (ctx.req.header("x-requested-with") == "XMLHttpRequest"); // Is AJAX call
	this.loadMessages = ctx => { // Load messages from query
		const { ok, info, warn, err } = ctx.req.query();
		i18n.init(ctx.var.lang).setOk(ok).setInfo(info).setWarn(warn).setError(err);
		return self;
	}

    // Options: "-r" recursive, "-j": ignore directory info, "-": redirect to stdout
	//const zip = cp.spawn("zip", ["-rj", "-", "src/public/files/afe98b43839ed5f35684bbc308714e15.jpg", "src/public/files/32b80803a9369f0438bc1bb604b07cf5.jpg"]);
	this.zip = function(output, files) {
		const filepath = path.join(config.DIR_FILES, output);
		const zip = cp.spawn("zip", ["-rj", "-"].concat(files)); //nuevo zip
		zip.stdout.pipe(fs.createWriteStream(filepath)); //sobrescribe el fichero
		return filepath;
	}
	this.sendZip = function(res, filename, files) {
		const zip = cp.spawn("zip", ["-rj", "-"].concat(files));
		res.writeHead(200, {
			"Content-Type": mimetypes.zip,
			"Content-disposition": "attachment; filename=" + filename
		});
		zip.stdout.pipe(res);
	}

	this.sign = function(user) { // get token sync
		return jwt.sign(user, config.JWT_KEY, {
			expiresIn: config.JWT_EXPIRES
		});
	}
	this.verify = function(token) {
		return new Promise(function(resolve, reject) {
			jwt.verify(token, config.JWT_KEY, (err, user) => {
				err ? reject(err) : resolve(user);
			});
		});
	}
}

export default new Util();
