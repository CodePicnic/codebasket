var gulp = require('gulp'),
    browserify = require('browserify'),
    eslint = require('gulp-eslint'),
    jscs = require('gulp-jscs'),
    uglify = require('gulp-uglify'),
    source = require('vinyl-source-stream'),
    mochaPhantomJS = require('gulp-mocha-phantomjs'),
    sass = require('gulp-sass'),
    rename = require('gulp-rename'),
    files = [ './index.js', './lib/**/*.js' ],
    buildDir = './build';

gulp.task('lint', function() {
  return gulp.src(files)
    .pipe(eslint())
    .pipe(eslint.format());
});

gulp.task('jscs', function() {
  return gulp.src(files)
    .pipe(jscs());
});

gulp.task('browserify', function() {
  var browserifyBundler = browserify('./index.js', {
    debug: false,
    transform: [ 'reactify' ]
  });

  return browserifyBundler.bundle()
    .pipe(source('codebasket.js'))
    .pipe(gulp.dest(buildDir));
});

gulp.task('sass', function() {
  gulp.src('./sass/base.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(rename('codebasket.css'))
    .pipe(gulp.dest(buildDir));
});

gulp.task('copy_assets', function() {
  gulp.src('./sass/fonts/**/*')
    .pipe(gulp.dest(buildDir + '/fonts'));
});

gulp.task('dist', [ 'browserify', 'sass', 'copy_assets' ], function() {
  return gulp.src(buildDir + '/codebasket.js')
    .pipe(uglify())
    .pipe(gulp.dest(buildDir));
});

gulp.task('test', function() {
  return gulp.src('./test/runner.html')
    .pipe(mochaPhantomJS());
});

gulp.task('build', [ 'lint', 'jscs', 'browserify', 'sass', 'copy_assets' ], function() {
  var argv = require('yargs').argv;

  if (argv['copy-js']) {
    gulp.src(buildDir + '/codebasket.js')
      .pipe(gulp.dest(argv['copy-js']));
  }

  if (argv['copy-css']) {
    gulp.src(buildDir + '/codebasket.css')
      .pipe(gulp.dest(argv['copy-css']));
  }
});

gulp.task('watch', function() {
  gulp.watch(files.concat('./sass/*.scss'), [ 'build' ]);
});

gulp.task('default', [ 'build', 'watch' ]);