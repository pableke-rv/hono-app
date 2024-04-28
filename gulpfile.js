import fs from "fs";
import gulp from "gulp";
import concat from "gulp-concat";
import uglify from "gulp-uglify";
import htmlmin from "gulp-htmlmin";
import cssnano from "gulp-cssnano";

const HTML_PATH = "src/views/**/*";
const CSS_FILES = "src/public/css/**/*.css";
const JS_FILES = "src/public/js/**/*.js";
const TS_FILES = [ "src/**/*.ts", "src/**/*.tsx" ];
const JS_MODULES = [ "src/*.js", "src/dao/**/*", "src/data/**/*", "src/i18n/**/*", "src/lib/**/*", "src/routes/**/*" ];
const SYM_LINKS = [
	"dist", "dist/controllers", "dist/dao", "dist/data", "dist/lib",
	"dist/public/js", "dist/public/js/i18n", "dist/public/js/model"
];

// Tasks to copy all ts / tsx
gulp.task("copy-ts", done => {
	gulp.src(TS_FILES).pipe(gulp.dest("dist")).on("end", done);
});

// Task to minify all views (HTML"s and EJS"s)
gulp.task("minify-html", done => {
	const options = {
		caseSensitive: true,
		sortClassName: true,
		collapseWhitespace: true,
		removeComments: true, //removeComments => remove CDATA
		removeRedundantAttributes: false //remove attr with default value
	};
	const CV = "C:/CampusVirtualV2/workspaceGIT/campusvirtual/modules/cv-cm/src/main/resources/META-INF/resources/modules/xeco";
	gulp.src(HTML_PATH).pipe(htmlmin(options)).pipe(gulp.dest("dist/views"));
	gulp.src("src/views/xeco/**/*").pipe(gulp.dest(CV)).on("end", done);
});

// Tasks to minify CSS"s
gulp.task("minify-css", done => {
	const CSS_DEST = "dist/public/css";
	fs.rmSync(CSS_DEST, { recursive: true, force: true }); // Remove previous unused files
	gulp.src(CSS_FILES).pipe(cssnano()).pipe(gulp.dest(CSS_DEST)).on("end", () => { // Minify single files
		gulp.src("dist/public/css/**/*.css").pipe(concat("styles-min.css")).pipe(gulp.dest(CSS_DEST)).on("end", done);
	});
});

// Tasks to minify JS"s
gulp.task("minify-js", done => {
	const JS_DEST = "dist/public/js";
	const CV = "C:/CampusVirtualV2/workspaceGIT/campusvirtual/applications/uae/src/main/webapp/resources/js";
	fs.rmSync(JS_DEST, { recursive: true, force: true }); // Remove previous unused files
	gulp.src(JS_FILES).pipe(uglify()).pipe(gulp.dest(JS_DEST)).on("end", () => {
		gulp.src("dist/public/js/**/*.js").pipe(gulp.dest(CV)).on("end", done); // deply JS in Campus Virtual
	});
});

// Tasks to create js modules
gulp.task("modules", done => {
	gulp.src(JS_MODULES[0]).pipe(gulp.dest("dist"));
	gulp.src(JS_MODULES[1]).pipe(gulp.dest("dist/dao"));
	gulp.src(JS_MODULES[2]).pipe(gulp.dest("dist/data"));
	gulp.src(JS_MODULES[3]).pipe(gulp.dest("dist/i18n"));
	gulp.src(JS_MODULES[4]).pipe(gulp.dest("dist/lib"));
	gulp.src(JS_MODULES[5]).pipe(gulp.dest("dist/routes")).on("end", done);
});

// Tasks to create static data
gulp.task("static", done => {
	gulp.src("dist/public").pipe(gulp.symlink("dist/views")); // static server links
	gulp.src(SYM_LINKS).pipe(gulp.symlink("node_modules/app")); // dynamic links

	gulp.src("src/public/img/**/*").pipe(gulp.dest("dist/public/img"));
	gulp.src("src/public/files/**/*").pipe(gulp.dest("dist/public/files")).on("end", done);
});

// Task to build dist when deployment on server
gulp.task("deploy", gulp.series("modules", "minify-html", "minify-css", "copy-ts", "minify-js"));

gulp.task("watch", () => {
	gulp.watch(HTML_PATH, gulp.series("minify-html"));
	gulp.watch(CSS_FILES, gulp.series("minify-css"));
	gulp.watch(TS_FILES, gulp.series("copy-ts"));
	gulp.watch(JS_MODULES, gulp.series("modules"));
	gulp.watch(JS_FILES, gulp.series("minify-js"));
	// Other watchers ...
});

gulp.task("default", gulp.series("copy-ts", "minify-html", "minify-css", "minify-js", "modules", "static", "watch"));
