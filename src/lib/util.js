
import fs from "fs"; //file system module
import path from "path"; //file and directory paths
import cp from "child_process"; //system calls
import sharp from "sharp"; // Image handler
import jwt from "jsonwebtoken"; // JSON web token
import mimetypes from "../data/mime-types.json" assert { type: "json" };
import sb from "#client/components/StringBox.js";
import config from "../config.js"; // Configurations
import i18n from "../i18n/langs.js";

function Util() {
	const self = this; //self instance

	this.xhr = ctx => (ctx.req.header("x-requested-with") == "XMLHttpRequest"); // Is AJAX call
	this.msg = (ctx, msg) => ctx.text(i18n.get(msg)); // Send single message
	this.msgs = ctx => ctx.json(i18n.getMsgs()); // Send messages status = ok (200)
	this.error = (ctx, msg) => ctx.text(i18n.get(msg), 500); // Send error message
	this.errors = ctx => ctx.json(i18n.getMsgs(), 500); // Send errors
	this.loadQueryMessages = ctx => { // Load messages from query
		const { ok, info, warn, err } = ctx.req.query();
		i18n.init(ctx.var.lang).setOk(ok).setInfo(info).setWarn(warn).setError(err);
		return self;
	}

	this.upload = (user, file, index) => { // Upload single file
		return file.arrayBuffer().then(buffer => {
			const output = Object.copy({ userId: user }, file, [ "size", "type", "name" ]); // Initialize results
			if ((file.size < 1) || !file.name)
				return output; // Not selected file
			output.path = "" + user + sb.randString(3) + Date.now() + sb.randString(3) + (index || 0) + sb.lower(path.extname(file.name));
			const filepath = path.join(config.DIR_UPLOADS, output.path);
			fs.writeFileSync(filepath, Buffer.from(buffer)); // If error => throw
			if (file.type.startsWith("image/")) { // If image => try to resize it
				const filethumb = path.join(config.DIR_THUMBS, output.path);
				const fnThen = info => { output.format = info.format; return output; }
				const fnError = err => { fs.unlink(filepath); throw err; };
				return sharp(buffer).resize(320, 240).toFile(filethumb).then(fnThen).catch(fnError);
			}
			return output;
		});
	}
	this.uploadAll = (user, files) => Promise.all(files.map((file, i) => self.upload(user, file, i)));
	this.unload = name => { // Remove all file copies
		fs.unlink(path.join(config.DIR_THUMBS, name));
		fs.unlink(path.join(config.DIR_UPLOADS, name));
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
