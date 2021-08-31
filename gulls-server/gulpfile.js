const gulp = require("gulp");
const watch = require("gulp-watch");
const babel = require("gulp-babel");
const plumber = require("gulp-plumber");
const rollup = require("gulp-rollup");
const replace = require("@rollup/plugin-replace");

const entry = "./src/**/*.js";

const cleanEntry = "./src/config/index.js";

// 开发环境任务
function buildDev() {
  return watch(entry, { ignoreInitial: false }, () => {
    gulp
      .src(entry)
      .pipe(plumber())
      .pipe(
        babel({
          babelrc: false,
          plugins: ["@babel/plugin-transform-modules-commonjs"],
        })
      ) // 解析 ES6 import 语法
      .pipe(gulp.dest("dist"));
  });
}

// 生产环境任务
function buildProd() {
  return gulp
    .src(entry)
    .pipe(
      babel({
        babelrc: false,
        ignore: [cleanEntry],
        plugins: ["@babel/plugin-transform-modules-commonjs"],
      })
    ) // 解析 ES6 import 语法
    .pipe(gulp.dest("dist"));
}

// 对 config 进行流清洗任务
function buildConfig() {
  return gulp
    .src(entry)
    .pipe(
      rollup({
        input: cleanEntry,
        output: {
          format: "cjs",
        },
        plugins: [
          replace({
            "process.env.NODE_ENV": JSON.stringify("production"),
          }),
        ],
      })
    )
    .pipe(gulp.dest("./dist"));
}

let build = gulp.series(buildDev);

if (process.env.NODE_ENV === "production") {
  build = gulp.series(buildProd, buildConfig);
}
gulp.task("default", build);
