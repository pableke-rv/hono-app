import fs from "fs";
import gulp from "gulp";
import concat from "gulp-concat";
import uglify from "gulp-uglify";
import htmlmin from "gulp-htmlmin";
import cssnano from "gulp-cssnano";

const HTML_PATH = "src/**/*.html";
const CSS_FILES = "src/public/css/**/*.css";
const JS_FILES = "src/public/js/**/*.js";
const FILES = [ "src/**/*.ts", "src/**/*.tsx" ];

// Tasks to copy all ts / tsx
gulp.task("prepare-app", done => {
	gulp.src(FILES).pipe(gulp.dest("dist")).on("end", done);
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
	gulp.src(HTML_PATH).pipe(htmlmin(options)).pipe(gulp.dest("dist")).on("end", done);
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
	fs.rmSync(JS_DEST, { recursive: true, force: true }); // Remove previous unused files
	gulp.src(JS_FILES).pipe(uglify()).pipe(gulp.dest(JS_DEST)).on("end", done);
});

gulp.task("watch", () => {
	gulp.watch(FILES, gulp.series("prepare-app"));
	gulp.watch(HTML_PATH, gulp.series("minify-html", "minify-css"));
	gulp.watch(JS_FILES, gulp.series("minify-js"));
	// Other watchers ...
});

// Tasks to create static output
gulp.task("static", done => {
	const SYM_DEST = "node_modules/app";
	gulp.src("dist").pipe(gulp.symlink(SYM_DEST));
	gulp.src("dist/public/js").pipe(gulp.symlink(SYM_DEST));
	gulp.src("dist/public/js/i18n").pipe(gulp.symlink(SYM_DEST));
	gulp.src("dist/public/js/model").pipe(gulp.symlink(SYM_DEST));

	gulp.src("src/data/**/*").pipe(gulp.dest("dist/data"));
	gulp.src("src/public/img/**/*").pipe(gulp.dest("dist/public/img")).on("end", done);
});

gulp.task("default", gulp.series("prepare-app", "minify-html", "minify-css", "minify-js", "static", "watch"));
