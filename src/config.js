
import url from "url"; // Url handler
import path from "path"; //file and directory paths
import env from "dotenv"; // Environment

env.config(); // Initialize process.env

const SRC = url.fileURLToPath(new URL(".", import.meta.url));
const FILES = url.fileURLToPath(new URL("./public/files", import.meta.url));

export default {
	SERVER_HOST: "localhost",
	PORT: +(process.env.PORT || 3000),
	ADMIN_EMAIL: "pableke@gmail.com",

	DIR_SRC: SRC,
	DIR_FILES: FILES,
	DIR_UPLOADS: path.join(FILES, "uploads"),
	DIR_THUMBS: path.join(FILES, "thumbs"),

	SESSION_KEY: process.env.SESSION_KEY || "EI1*cMijUIFg4^Q6uvmgB#D8lD&3iat1Axg%x@gj9OsgjN^bV1CO2R5q",

	SQLITE_PATH: path.join(SRC, "data/db.sqlite")
};
