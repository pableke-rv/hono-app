import fs from "fs";
import gulp from "gulp";
import concat from "gulp-concat";
import uglify from "gulp-uglify";
import htmlmin from "gulp-htmlmin";
import cssnano from "gulp-cssnano";

const HTML_FILES = "src/views/**/*.html";
const HTML_XECO = "src/views/xeco/**/*";
const HTML_IRSE = "src/views/irse/**/*";

const JS_COMPONENTS = "src/public/js/components/**/*.js";
const JS_DATA = "src/public/js/data/**/*.js";
const JS_I18N = "src/public/js/i18n/**/*.js";
const JS_LIB = "src/public/js/lib/**/*.js";
const JS_MODEL = "src/public/js/model/**/*.js";
const JS_MODULES = "src/public/js/modules/**/*.js";
const JS_ROOT = "src/public/js/*.js";

const CSS_FILES = "src/public/css/**/*.css";
const TS_FILES = [ "src/**/*.ts", "src/**/*.tsx" ];
const JS_SRC = [ "src/*.js", "src/dao/**/*", "src/data/**/*", "src/i18n/**/*", "src/lib/**/*", "src/routes/**/*" ];
const JS_DIST = [ "dist", "dist/dao", "dist/data", "dist/i18n", "dist/lib", "dist/routes" ];
const SYM_LINKS = [
	"dist", "dist/controllers", "dist/dao", "dist/data", "dist/lib",
	"dist/public/js", "dist/public/js/i18n", "dist/public/js/model"
];

// Tasks to copy all ts / tsx
gulp.task("copy-ts", done => {
	gulp.src(TS_FILES).pipe(gulp.dest("dist")).on("end", done);
});

// Task to minify all views HTML
gulp.task("minify-html-views", done => {
	const options = {
		caseSensitive: true,
		sortClassName: true,
		collapseWhitespace: true,
		removeComments: true, //removeComments => remove CDATA
		removeRedundantAttributes: false //remove attr with default value
	};
	gulp.src(HTML_FILES).pipe(htmlmin(options)).pipe(gulp.dest("dist/views")).on("end", done);
});
gulp.task("minify-html-xeco", done => {
	const CV = "C:/CampusVirtualV2/workspaceGIT/campusvirtual/modules/cv-cm/src/main/resources/META-INF/resources/modules/xeco";
	gulp.src(HTML_XECO).pipe(gulp.dest(CV)).on("end", done); // deploy XHTML in Campus Virtual
});
gulp.task("minify-html-irse", done => {
	const CV = "C:/CampusVirtualV2/workspaceGIT/campusvirtual/modules/cv-irse/src/main/resources/META-INF/resources/modules/irse";
	gulp.src(HTML_IRSE).pipe(gulp.dest(CV)).on("end", done); // deploy XHTML in Campus Virtual
});
gulp.task("minify-html", gulp.series("minify-html-views", "minify-html-xeco", "minify-html-irse"));

// Tasks to minify all CSS
gulp.task("minify-css", done => {
	const CSS_DEST = "dist/public/css";
	const CV = "C:/CampusVirtualV2/workspaceGIT/campusvirtual/applications/uae/src/main/webapp/resources/css";
	fs.rmSync(CSS_DEST, { recursive: true, force: true }); // Remove previous unused files
	gulp.src(CSS_FILES).pipe(cssnano({ reduceIdents: false })).pipe(gulp.dest(CSS_DEST)).on("end", () => { // Minify single files
		gulp.src("dist/public/css/**/*.css").pipe(concat("styles-min.css")).pipe(gulp.dest(CSS_DEST)).on("end", () => {
			gulp.src("dist/public/css/styles-min.css").pipe(gulp.dest(CV)).on("end", done); // deploy JS in Campus Virtual
		});
	});
});

// Tasks to minify all JS
gulp.task("minify-js-components", done => {
	const JS_DEST = "dist/public/js/components";
	const CV = "C:/CampusVirtualV2/workspaceGIT/campusvirtual/applications/uae/src/main/webapp/resources/js/components";
	fs.rmSync(JS_DEST, { recursive: true, force: true }); // Remove previous unused files
	gulp.src(JS_COMPONENTS).pipe(uglify()).pipe(gulp.dest(JS_DEST)).on("end", () => {
		gulp.src("dist/public/js/components/**/*.js").pipe(gulp.dest(CV)).on("end", done); // deploy JS in Campus Virtual
	});
});
gulp.task("minify-js-data", done => {
	const JS_DEST = "dist/public/js/data";
	const CV = "C:/CampusVirtualV2/workspaceGIT/campusvirtual/applications/uae/src/main/webapp/resources/js/data";
	fs.rmSync(JS_DEST, { recursive: true, force: true }); // Remove previous unused files
	gulp.src(JS_DATA).pipe(uglify()).pipe(gulp.dest(JS_DEST)).on("end", () => {
		gulp.src("dist/public/js/data/**/*.js").pipe(gulp.dest(CV)).on("end", done); // deploy JS in Campus Virtual
	});
});
gulp.task("minify-js-i18n", done => {
	const JS_DEST = "dist/public/js/i18n";
	const CV = "C:/CampusVirtualV2/workspaceGIT/campusvirtual/applications/uae/src/main/webapp/resources/js/i18n";
	fs.rmSync(JS_DEST, { recursive: true, force: true }); // Remove previous unused files
	gulp.src(JS_I18N).pipe(uglify()).pipe(gulp.dest(JS_DEST)).on("end", () => {
		gulp.src("dist/public/js/i18n/**/*.js").pipe(gulp.dest(CV)).on("end", done); // deploy JS in Campus Virtual
	});
});
gulp.task("minify-js-lib", done => {
	const JS_DEST = "dist/public/js/lib";
	fs.rmSync(JS_DEST, { recursive: true, force: true }); // Remove previous unused files
	gulp.src(JS_LIB).pipe(uglify()).pipe(gulp.dest(JS_DEST)).on("end", () => {
		const CV = "C:/CampusVirtualV2/workspaceGIT/campusvirtual/applications/uae/src/main/webapp/resources/js/lib";
		gulp.src("dist/public/js/lib/uae/**/*.js").pipe(concat("uae-min.js")).pipe(gulp.dest("dist/public/js/lib")).on("end", () => {
			gulp.src("dist/public/js/lib/uae-min.js").pipe(gulp.dest(CV)).on("end", done); // deploy JS in Campus Virtual
		});
	});
});
gulp.task("minify-js-model", done => {
	const JS_DEST = "dist/public/js/model";
	const CV = "C:/CampusVirtualV2/workspaceGIT/campusvirtual/applications/uae/src/main/webapp/resources/js/model";
	fs.rmSync(JS_DEST, { recursive: true, force: true }); // Remove previous unused files
	gulp.src(JS_MODEL).pipe(uglify()).pipe(gulp.dest(JS_DEST)).on("end", () => {
		gulp.src("dist/public/js/model/**/*.js").pipe(gulp.dest(CV)).on("end", done); // deploy JS in Campus Virtual
	});
});
gulp.task("minify-js-modules", done => {
	const JS_DEST = "dist/public/js/modules";
	const CV = "C:/CampusVirtualV2/workspaceGIT/campusvirtual/applications/uae/src/main/webapp/resources/js/modules";
	fs.rmSync(JS_DEST, { recursive: true, force: true }); // Remove previous unused files
	gulp.src(JS_MODULES).pipe(uglify()).pipe(gulp.dest(JS_DEST)).on("end", () => {
		gulp.src("dist/public/js/modules/**/*.js").pipe(gulp.dest(CV)).on("end", done); // deploy JS in Campus Virtual
	});
});
gulp.task("minify-js-root", done => { // root js's
	gulp.src(JS_ROOT).pipe(uglify()).pipe(gulp.dest("dist/public/js")).on("end", done);
});
gulp.task("minify-js", gulp.series("minify-js-components", "minify-js-data", "minify-js-i18n", "minify-js-lib", "minify-js-model", "minify-js-modules", "minify-js-root"));

// Tasks to create js modules
gulp.task("modules", done => {
	JS_SRC.forEach((mod, i) => gulp.src(mod).pipe(gulp.dest(JS_DIST[i])));
	setTimeout(done, 100);
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
	// Gulp views minifies
	gulp.watch(HTML_FILES, gulp.series("minify-html-views"));
	gulp.watch(HTML_XECO, gulp.series("minify-html-xeco"));
	gulp.watch(HTML_IRSE, gulp.series("minify-html-irse"));

	// Gulp JS minifies
	gulp.watch(JS_COMPONENTS, gulp.series("minify-js-components"));
	gulp.watch(JS_DATA, gulp.series("minify-js-data"));
	gulp.watch(JS_I18N, gulp.series("minify-js-i18n"));
	gulp.watch(JS_LIB, gulp.series("minify-js-lib"));
	gulp.watch(JS_MODEL, gulp.series("minify-js-model"));
	gulp.watch(JS_MODULES, gulp.series("minify-js-modules"));
	gulp.watch(JS_ROOT, gulp.series("minify-js-root"));

	gulp.watch(CSS_FILES, gulp.series("minify-css"));
	gulp.watch(TS_FILES, gulp.series("copy-ts"));
	gulp.watch(JS_SRC, gulp.series("modules"));
	// Other watchers ...
});

gulp.task("default", gulp.series("copy-ts", "minify-html", "minify-css", "minify-js", "modules", "static", "watch"));
