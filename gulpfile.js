"use strict";

var gulp = require("gulp");
var sass = require("gulp-sass");
var plumber = require("gulp-plumber");
var autoprefixer = require("autoprefixer");
var postcss = require("gulp-postcss");
var posthtml = require("gulp-posthtml");
var include = require("posthtml-include");
var minify = require("gulp-csso");
var uglify = require("gulp-uglify");
var htmlmin = require("gulp-htmlmin");
var rename = require("gulp-rename");
var svgstore = require("gulp-svgstore");
var server = require("browser-sync").create();
var run = require("run-sequence");
var del = require("del");

gulp.task("style", function() {
  gulp.src("sass/style.scss")
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest("build/css"))
    .pipe(minify())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});

gulp.task("js", function() {
  gulp.src("js/*.js")
    .pipe(uglify())
    .pipe(rename({
      suffix: ".min"
    }))
    .pipe(gulp.dest("build/js"));
});

gulp.task("html", function() {
  return gulp.src("*.html")
  .pipe(posthtml([
    include()
  ]))
  .pipe(htmlmin({collapseWhitespace: true}))
  .pipe(gulp.dest("build"));
});

gulp.task("sprite", function() {
  return gulp.src("images/icon-*.svg")
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("images"));
});

gulp.task("serve", function() {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("sass/**/*.{scss,sass}", ["style"]);
  gulp.watch("*.html", ["html"]);
});

gulp.task("build", function(done) {
  run(
    "clean",
    "copy",
    "style",
    "js",
    "html",
    done
  );
});

gulp.task("copy", function() {
  return gulp.src([
    "fonts/**/*.{woff,woff2}",
    "images/**",
    "js/**",
    "audio/**",
    "*.{ico,xml,png,svg}"
  ], {
    base: "."
  })
  .pipe(gulp.dest("build"));
});

gulp.task("clean", function() {
  return del("build");
});
