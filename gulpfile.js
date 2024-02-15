import fs from "fs";
import gulp from "gulp";
import concat from "gulp-concat";
import uglify from "gulp-uglify";
import cssnano from "gulp-cssnano";

const CSS_FILES = "src/public/css/**/*.css";
const JS_FILES = "src/public/js/**/*.js";
const FILES = [ "src/**/*.ts", "src/**/*.tsx" ];

// Tasks to copy all ts / tsx
gulp.task("prepare-app", done => {
	gulp.src(FILES).pipe(gulp.dest("dist")).on("end", done);
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
	gulp.watch(CSS_FILES, gulp.series("minify-css"));
	gulp.watch(JS_FILES, gulp.series("minify-js"));
	// Other watchers ...
});

// Tasks to create symlink
gulp.task("symlink", done => {
	const SYM_DEST = "node_modules/app";
	gulp.src("dist").pipe(gulp.symlink(SYM_DEST));
	gulp.src("dist/public/js").pipe(gulp.symlink(SYM_DEST));
	gulp.src("dist/public/js/i18n").pipe(gulp.symlink(SYM_DEST));
	gulp.src("dist/public/js/model").pipe(gulp.symlink(SYM_DEST)).on("end", done);
});

gulp.task("default", gulp.series("prepare-app", "minify-css", "minify-js", "symlink", "watch"));
