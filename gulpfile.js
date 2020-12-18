const gulp = require('gulp');
const cssmin = require('gulp-cssmin');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const htmlmin = require('gulp-htmlmin');
const gulpclean = require('gulp-clean');
const webserver = require('gulp-webserver');


function css() {
    return gulp
        .src('./src/css/**')
        .pipe(cssmin())
        .pipe(gulp.dest('./dist/css'))
}


function js() {
    return gulp
        .src('./src/js/**')
        .pipe(babel({
            presets: ["env"]
        }))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js'))
}

function html() {
    return gulp
        .src('./src/html/**')
        .pipe(htmlmin({
            collapseWhitespace: true, // 表示去除空格
            removeEmptyAttributes: true, // 移出空的属性
            minifyCSS: true, // 压缩 style 标签
            minifyJS: true, // 压缩 script 标签
        }))
        .pipe(gulp.dest('./dist/html'))
}

function static() {
    return gulp
        .src('./src/img/**')
        .pipe(gulp.dest('./dist/static'))
}

function clean() {
    return gulp
        .src(['./dist'])
        .pipe(gulpclean());
}

function server() {
    return gulp
        .src('./dist')
        .pipe(webserver({
            host: 'localhost',
            port: 3000,
            open: './html/page.html',
            livereload: true,
        }))
}


function watchs() {
    gulp.watch('./src/css', css);
    gulp.watch('./src/js', js);
    gulp.watch('./src/html', html);
    gulp.watch('./src/img', static);
}


exports.css = css;
exports.js = js;
exports.html = html;
exports.static = static;
exports.clean = clean;
exports.server = server;
exports.watchs = watchs;


exports.build = gulp.series(clean, gulp.parallel(css, js, html, static), server, watchs)