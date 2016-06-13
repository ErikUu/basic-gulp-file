'use strict';

var gulp        = require("gulp"),
    concat      = require("gulp-concat"),
    uglify      = require("gulp-uglify"),
    rename      = require("gulp-rename"),
    sass        = require("gulp-sass"),
    maps        = require("gulp-sourcemaps"),
    del         = require("del"),
    browserSync = require('browser-sync').create();

//Paths
var PATH_ASSETS   = "./app/assets",
    PATH_APP_ROOT = "./app";

//Concat and map scripts
gulp.task("concatScripts", function () {
    return gulp.src([PATH_ASSETS + "/js/test.js"])
        .pipe(maps.init())
        .pipe(concat("main.js"))
        .pipe(maps.write("/."))
        .pipe(gulp.dest(PATH_ASSETS + "/js"))
        .pipe(browserSync.stream());;
});

//Minify scripts
gulp.task("minifyScripts", ["concatScripts"], function () {
    return gulp.src(PATH_ASSETS + "/js/main.js")
        .pipe(uglify())
        .pipe(rename("main.min.js"))
        .pipe(gulp.dest(PATH_ASSETS + "/js"));
});

//Concat, compile and maps sass
gulp.task("compileSass", function () {
    return gulp.src(PATH_ASSETS + "/styles/main.scss")
        .pipe(maps.init())
        .pipe(sass())
        .pipe(maps.write("./"))
        .pipe(gulp.dest(PATH_ASSETS + "/styles"))
        .pipe(browserSync.stream());
});

//serves html/css/js
gulp.task("serve", function () {

    browserSync.init({
        server: "./app",
        notify: false
    });

    gulp.watch(PATH_ASSETS + "/styles/**/*.scss", ["compileSass"]);
    gulp.watch(PATH_ASSETS + "/js/**/*.js", ["concatScripts"]);
    gulp.watch(PATH_APP_ROOT + "/*.html").on('change', browserSync.reload);

});

//Remove dist folder and all compiled/minified files
gulp.task("clean", function () {
    del(["dist", PATH_ASSETS + "/styles/main.css*", PATH_ASSETS + "/js/main*.js*"]);
});

//Builds entire project and stores it in dist folder
gulp.task("build", ["minifyScripts", "compileSass"], function () {
    return gulp.src([ PATH_ASSETS + "/styles/main.css", PATH_ASSETS + "/js/main.min.js", PATH_APP_ROOT + "/*.html", "img/**"], { base: "./app" })
        .pipe(gulp.dest("dist"));
});

//Default task
gulp.task("default", ["clean"], function () {
    gulp.start("build");
});