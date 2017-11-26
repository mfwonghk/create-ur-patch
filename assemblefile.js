'use strict';

const assemble = require('assemble');

const sass = require('gulp-sass');

const replace = require('gulp-replace');

const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const eol = require('gulp-eol');
const newline = require("gulp-convert-newline");

const html = require('gulp-htmlmin');
const img = require('gulp-imagemin');
const css = require('gulp-clean-css');

const del = require('del');
const plumber = require('gulp-plumber');
const cache = require('gulp-cached');
const watch = require('base-watch');

const app = assemble();

cache.caches = {};

app.use(watch());

app.option('layout', 'default');

app.task('dist:pages:load', function*() {
  app.layouts('./src/layouts/*.hbs');
  app.partials('./src/partials/*.svg');
  app.pages('./src/pages/*.hbs');
});

app.task('dist:pages', 'dist:pages:load', function() {
  return app.toStream('pages')
    .pipe(app.renderFile())
    .pipe(html({ collapseWhitespace: true, collapseInlineTagWhitespace: true, keepClosingSlash: true }))
    .pipe(replace(/\/>/g, ' />'))
    .pipe(eol('\r\n'))
    .pipe(newline({ newline: 'crlf' }))
    .pipe(rename({extname: '.html'}))
    .pipe(app.dest('dist'));
});

app.task('dist:style', function() {
  return app.src('src/assets/styles/*.scss')
    .pipe(plumber())
    .pipe(cache('dist:style'))
    .pipe(app.dest('./dist/assets/styles/scss'))
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(css())
    .pipe(newline({ newline: 'crlf' }))
    .pipe(rename({suffix: '.min'}))
    .pipe(sourcemaps.write('.', { includeContent: false, sourceRoot: 'scss' }))
    .pipe(eol('\r\n'))
    .pipe(app.dest('./dist/assets/styles'));
});

app.task('dist:plugins', function() {
  return app.src('src/assets/plugins/*.js')
    .pipe(plumber())
    .pipe(cache('dist:plugins'))
    .pipe(eol('\r\n'))
    .pipe(newline({ newline: 'crlf' }))
    .pipe(app.dest('./dist/assets/plugins'));
});

app.task('dist:scripts', function() {
  return app.src('src/assets/scripts/*.js')
    .pipe(plumber())
    .pipe(cache('dist:scripts'))
    .pipe(eol('\r\n'))
    .pipe(newline({ newline: 'crlf' }))
    .pipe(rename({suffix: '.min'}))
    .pipe(app.dest('./dist/assets/scripts'));
});

app.task('dist:images', function() {
  return app.src(['src/assets/images/*.png', 'src/assets/images/*.svg'])
    .pipe(plumber())
    .pipe(cache('dist:images'))
    .pipe(app.dest('./dist/assets/images'));
});

app.task('dist:remove', function() {
  return del('dist/*');
});

app.task('dist', ['dist:remove', 'dist:pages', 'dist:style', 'dist:plugins', 'dist:scripts', 'dist:images']);

app.task('watch', function() {
  app.watch(['./src/layouts/*.hbs', './src/partials/*.hbs', './src/pages/*.hbs'], 'dist:pages');
  app.watch('src/assets/styles/*.scss', 'dist:style');
  app.watch('src/assets/plugins/*.js', 'dist:plugins');
  app.watch('src/assets/scripts/*.js', 'dist:scripts');
  app.watch(['src/assets/images/*.png', 'src/assets/images/*.svg'], 'dist:images');
});

app.task('default', 'watch');

module.exports = app;
