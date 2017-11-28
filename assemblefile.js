'use strict';

const assemble = require('assemble');

const sass = require('gulp-sass');

const replace = require('gulp-replace');

const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const eol = require('gulp-eol');
const newline = require("gulp-convert-newline");

const html = require('gulp-htmlmin');
const css = require('gulp-clean-css');
const js = require('gulp-uglify');
const img = require('gulp-imagemin');

const del = require('del');
const plumber = require('gulp-plumber');
const cache = require('gulp-cached');
const watch = require('base-watch');

const app = assemble();

cache.caches = {};

app.use(watch());

app.option('layout', 'app');

app.task('build:pages:load', function*() {
  app.layouts('src/layouts/*.hbs');
  app.partials('src/partials/*.svg');
  app.pages('src/pages/*.hbs');
});

app.task('build:pages', 'build:pages:load', function() {
  return app.toStream('pages')
    .pipe(app.renderFile())
    .pipe(html({ collapseWhitespace: true, collapseInlineTagWhitespace: true, keepClosingSlash: true }))
    .pipe(replace(/\/>/g, ' />'))
    .pipe(eol('\r\n'))
    .pipe(newline({ newline: 'crlf' }))
    .pipe(rename({ extname: '.html' }))
    .pipe(app.dest('docs'));
});

app.task('build:style', function() {
  return app.src('src/assets/styles/*.scss')
    .pipe(plumber())
    .pipe(cache('build:style'))
    .pipe(app.dest('docs/assets/styles/scss'))
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(css())
    .pipe(newline({ newline: 'crlf' }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write('.', { includeContent: false, sourceRoot: 'scss' }))
    .pipe(eol('\r\n'))
    .pipe(app.dest('docs/assets/styles'));
});

app.task('build:plugins', function() {
  return app.src('src/assets/plugins/*.js')
    .pipe(plumber())
    .pipe(cache('build:plugins'))
    .pipe(eol('\r\n'))
    .pipe(newline({ newline: 'crlf' }))
    .pipe(app.dest('docs/assets/plugins'));
});

app.task('build:scripts', function() {
  return app.src('src/assets/scripts/*.js')
    .pipe(plumber())
    .pipe(cache('build:scripts'))
    .pipe(js())
    .pipe(eol('\r\n'))
    .pipe(newline({ newline: 'crlf' }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(app.dest('docs/assets/scripts'));
});

app.task('build:images', function() {
  return app.src(['src/assets/images/*.png', 'src/assets/images/*.svg'])
    .pipe(plumber())
    .pipe(cache('build:images'))
    .pipe(img())
    .pipe(app.dest('docs/assets/images'));
});

app.task('build:remove', function() {
  return del('build/*');
 });

app.task('build', ['build:remove', 'build:pages', 'build:style', 'build:plugins', 'build:scripts', 'build:images']);

app.task('watch', function() {
  app.watch(['./src/layouts/*.hbs', './src/partials/*.svg', './src/pages/*.hbs'], 'build:pages');
  app.watch('src/assets/styles/*.scss', 'build:style');
  app.watch('src/assets/plugins/*.js', 'build:plugins');
  app.watch('src/assets/scripts/*.js', 'build:scripts');
  app.watch(['src/assets/images/*.png', 'src/assets/images/*.svg'], 'build:images');
});

app.task('default', 'watch');

module.exports = app;
