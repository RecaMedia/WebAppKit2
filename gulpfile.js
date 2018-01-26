//**** EDIT THIS URL ****//
// Use this URL to point to the directory where your PHP/HTML files are being served locally.
var URL = "localhost/site";
//**** EDIT THIS URL ****//


//**** BUILD OPTION ****//
// By default, this is set for just creating basic HTML files. Change to true to set the default to PHP.
var usePHP = false;
//**** BUILD OPTION ****//


// Development File Structure
var MAIN_DIR = "site";
var AST_DIR = MAIN_DIR + "/assets";
var DEV_DIR = "development";
var DEV_TEMPLATES = DEV_DIR + "/jade/templates";
var DEV_TEMPLATES_JADE = DEV_TEMPLATES + "/**/*.jade";
var DEV_JADE = DEV_DIR + "/jade/**/*.jade";
var DEV_SASS = DEV_DIR + "/sass/**/*.scss";
var DEV_JS = DEV_DIR + "/js/**/*.js";
var DEV_JSX = DEV_DIR + "/jsx/**/*.jsx";
var DEV_JSX_APP = DEV_DIR + "/jsx/app.jsx";
var DEV_IMG = DEV_DIR + "/img/**/*.*";
var DEV_SVG = DEV_DIR + "/svgs/**/*.svg";

var PROD_CSS = MAIN_DIR + "/assets/css";
var PROD_IMG = MAIN_DIR + "/assets/img";
var PROD_JS = MAIN_DIR + "/assets/js";
var PROD_SVG = MAIN_DIR + "/assets/svgs";
var PROD_FONTS = MAIN_DIR + "/assets/fonts";

var WATCH_FILES = [PROD_CSS,PROD_JS,DEV_JADE];

var dev = false;


// Include gulp/gulp plugins
var gulp = require('gulp');
var notify = require('gulp-notify');
var browserSync = require('browser-sync').create();
var uglify = require('gulp-uglify');
var buffer = require('vinyl-buffer');


gulp.task('set-dev-node-env', function() {
	dev = true;
  return process.env.NODE_ENV = 'development';
});
gulp.task('set-prod-node-env', function() {
  return process.env.NODE_ENV = 'production';
});


// Sass Task
gulp.task('build-sass', function() {
	var sass = require('gulp-sass');
	var cssNano = require('gulp-cssnano');
	var bless = require('gulp-bless');

	var sassOptions = {
		errLogToConsole: true,
		linefeed: 'lf', // 'lf'/'crlf'/'cr'/'lfcr'
		outputStyle: 'expanded', // 'nested','expanded','compact','compressed'
		sourceComments: false
	};

	if (dev) {
		return gulp.src(DEV_SASS)
		.pipe(sass(sassOptions))
		.on("error", notify.onError({
			message: 'Error: <%= error.message %>'
		}))
		.pipe(browserSync.stream())
		.pipe(gulp.dest(PROD_CSS));
	} else {
		return gulp.src(DEV_SASS)
		.pipe(sass({
			errLogToConsole: true,
			outputStyle: 'compressed',
			sourceComments: false
			,includePaths: bourbon.includePaths
		}))
		.on("error", notify.onError({
			message: 'Error: <%= error.message %>'
		}))
		.pipe(cssNano())
		// in order for bless to work correctly it needs to strip out comments before it parses the CSS
		.pipe(bless({
			cacheBuster: true,
			cleanup: true,
			compress: true
		}))
		.pipe(gulp.dest(PROD_CSS));
	}
});


// Minify Images
gulp.task('build-images', function() {
	var imagemin = require('gulp-imagemin');
	var pngcrush = require('imagemin-pngcrush');
	var svgmin = require('gulp-svgmin');

	gulp.src(DEV_IMG)
		.pipe(imagemin({
				progressive: true,
				svgoPlugins: [{removeViewBox: false}],
				use: [pngcrush()]
		}))
		.pipe(gulp.dest(PROD_IMG));

	return gulp.src(DEV_SVG)
		.pipe(svgmin())
		.pipe(gulp.dest(PROD_IMG));
});


// React Task
gulp.task('build-react', function(cb) {
	var browserify = require('browserify');
	var babelify = require('babelify');
	var source = require('vinyl-source-stream');
	var envify = require('gulp-envify');
	var pump = require('pump');

	if (dev) {
		pump([
			browserify({
				entries: DEV_JSX_APP,
				extensions: ['.jsx'],
				debug: true
			}).transform('babelify', {presets: ['es2015', 'react']}).bundle()
			,source('app.js')
			,buffer()
			,browserSync.stream()
			,gulp.dest(PROD_JS)
		], cb);
	} else {
		pump([
			browserify({
				entries: DEV_JSX_APP,
				extensions: ['.jsx'],
				debug: true
			}).transform('babelify', {presets: ['es2015', 'react']}).bundle()
			,source('app.js')
			,buffer()
			,uglify()
			,browserSync.stream()
			,gulp.dest(PROD_JS)
		], cb);
	}
});


// Templates Render Function
gulp.task('build-templates', function() {
	if (usePHP) {
		var jade = require('gulp-jade-php');
	} else {
		var jade = require('gulp-jade');
	}

	return gulp.src(DEV_TEMPLATES_JADE)
		.pipe(jade({
			pretty: true
		}))
		.pipe(gulp.dest(MAIN_DIR));
});


// Templates Watch
gulp.task('watch', function() {
	if (usePHP) {
		browserSync.init({
			proxy: URL
		});
	} else {
		browserSync.init({
			server: "./" + MAIN_DIR
		});
	}

	gulp.watch(DEV_JADE, ['build-templates']);
	gulp.watch(DEV_JS, ['build-js']);
	gulp.watch(DEV_JSX, ['build-react']);
	gulp.watch(DEV_SASS, ['build-sass']);
	gulp.watch(WATCH_FILES, browserSync.reload);
});


// Templates Watch
gulp.task('setForPHP', function() {
	usePHP = true;
});


// Tasks
gulp.task('build', ['build-sass', 'build-images', 'build-react', 'build-templates']);
gulp.task('php', ['setForPHP', 'build', 'watch']);
gulp.task('dev', ['set-dev-node-env', 'build', 'watch']);
gulp.task('default', ['set-prod-node-env', 'build', 'watch']);