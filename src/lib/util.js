
import path from "path"; //file and directory paths
import cp from "child_process"; //system calls
import jwt from "jsonwebtoken"; // JSON web token
import config from "../config.js"; // Configurations

function Util() {
	//const self = this; //self instance

    // Options: "-r" recursive, "-j": ignore directory info, "-": redirect to stdout
	//const zip = cp.spawn("zip", ["-rj", "-", "src/public/files/afe98b43839ed5f35684bbc308714e15.jpg", "src/public/files/32b80803a9369f0438bc1bb604b07cf5.jpg"]);
	this.compress = function(output, files) {
		const filepath = path.join(config.DIR_FILES, output);
		const zip = cp.spawn("zip", ["-rj", "-"].concat(files)); //nuevo zip
		zip.stdout.pipe(fs.createWriteStream(filepath)); //sobrescribe el fichero
		return filepath;
	}
	this.zip = function(res, filename, files) {
		const zip = cp.spawn("zip", ["-rj", "-"].concat(files));
		res.writeHead(200, {
			"Content-Type": "application/zip",
			"Content-disposition": "attachment; filename=" + filename
		});
		zip.stdout.pipe(res);
	}

	this.sign = function(user) { // get token
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
