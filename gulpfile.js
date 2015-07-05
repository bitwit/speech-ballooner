var path = require('path');
var pkg = require('./package.json');
var gulp = require('gulp');
var through = require('through2');
var source = require('vinyl-source-stream');
var transform = require('vinyl-transform');

var mainBowerFiles = require('main-bower-files');
var html2js = require('gulp-ng-html2js');
var concat = require('gulp-concat');
var filter = require('gulp-filter');
var replace = require('gulp-replace');
var insert = require('gulp-insert');
var minifyCss = require('gulp-minify-css');
var compass = require('gulp-compass');
var coffee = require('gulp-coffee');
var uglify = require('gulp-uglify');
var browserify = require('browserify');
var browserifyShim = require('browserify-shim');
var coffeeify = require('coffeeify');

var src = {
  'app': 'app',
  'public': 'public',
  'out': 'out',
  'dist': 'dist'
};

gulp.task('buildCSS', function () {
  var files = [
    src.app + '/_config/_*.sass',
    src.app + '/app.sass',
    src.app + '/**/_*.sass'
  ];
  return gulp.src(files)
  .pipe(concat('styles.sass'))
  .pipe(gulp.dest(src.out))
  .pipe(compass({
    project: __dirname,
    css: src.out,
    sass: src.out
  }));
});

gulp.task('buildBower', function () {
  var bowerFiles = mainBowerFiles();
  var jsFilter = filter(['**/**.js']);
  var cssFilter = filter(['**/**.css']);
  return gulp.src(bowerFiles, {base: 'bower_components'})
  .pipe(jsFilter)
  .pipe(concat('bower.js'))
  .pipe(gulp.dest(src.out))
  .pipe(jsFilter.restore())
  .pipe(cssFilter)
  .pipe(concat('bower.css'))
  .pipe(gulp.dest(src.out))
  .pipe(cssFilter.restore());
});

gulp.task('buildTemplates', function () {
  var files = [
    src.app + '/**/**.tpl.html'
  ];
  return gulp.src(files)
  .pipe(html2js({
    moduleName: 'app-templates',
    rename: function (templateUrl) {
      console.log(templateUrl);
      return templateUrl.replace('../app/', '').replace('.html', '');
    }
  }))
  .pipe(concat('templates.js'))
  .pipe(gulp.dest(src.out));
});

gulp.task('buildApp', function () {
  var files = [
    src.app + '/app.coffee',
    src.app + '/**/**.coffee'
  ];
  return gulp.src(files)
  .pipe(concat('app.coffee'))
  .pipe(coffee())
  .pipe(gulp.dest(src.out));
});


gulp.task('makeDist', function () {
  var b = browserify(['app/speech-ballooner/index.coffee'], {
    standalone: 'SpeechBallooner'
  })
  b.transform(coffeeify);
  return b.bundle()
  .pipe(source('index.js'))
  .pipe(gulp.dest(src.dist));
});

gulp.task('build', ['buildCSS', 'buildBower', 'buildTemplates', 'buildApp']);
