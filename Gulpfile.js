import gulp from "gulp";
import autoprefixer from "gulp-autoprefixer";
import babel from "gulp-babel";
import cached from "gulp-cached";
import concat from "gulp-concat";
import less from "gulp-less";
import nodemon from "gulp-nodemon";
import gulpSrcMaps from "gulp-sourcemaps";

const { init, write } = gulpSrcMaps;

export const css = function () {
  return gulp
    .src("less/**/*.less")
    .pipe(init())
    .pipe(less())
    .pipe(autoprefixer())
    .pipe(concat("style.css"))
    .pipe(write("."))
    .pipe(gulp.dest("dist/public/stylesheets/"));
};

export const js = function () {
  return gulp
    .src(["src/**/*"])
    .pipe(cached("babel"))
    .pipe(init())
    .pipe(babel())
    .pipe(write(".", { includeContent: false, sourceRoot: "/src" }))
    .pipe(gulp.dest("dist"));
};

export const copyToPublic = function () {
  return gulp.src("public/**/*").pipe(gulp.dest("dist/public"));
};

export const bower = function () {
  return gulp
    .src(
      [
        "node_modules/requirejs/bin/r.js",
        "node_modules/purecss/build/pure-min.css",
        "node_modules/font-awesome/css/font-awesome.min.css",
        "node_modules/font-awesome/fonts/*",
        "node_modules/knockout/build/output/knockout-latest.js",
        "node_modules/decojs/Dist/*",
      ],
      { base: "node_modules" }
    )
    .pipe(gulp.dest("dist/public/bower_components"));
};

export const build = gulp.series(css, js, copyToPublic, bower);

export const devServer = gulp.series(build, function () {
  nodemon({
    script: "dist/server.js",
    ext: "js jsx",
    env: { NODE_ENV: "development" },
    watch: ["dist/"],
    execMap: {
      js: "node --inspect",
    },
    delay: 6,
  });
});

export const watch = gulp.series(build, devServer, function () {
  gulp.watch("less/**/*.less", css);
  gulp.watch("public/**/*", copyToPublic);
  gulp.watch("src/**/*", js);
});

export default build;
