var gulp = require('gulp')
var sass = require('gulp-sass')
var header = require('gulp-header')
var cleanCSS = require('gulp-clean-css')
var rename = require('gulp-rename')
var uglify = require('gulp-uglify')

var pkg = require('./package.json')
var browserSync = require('browser-sync').create()

const mainBuildDir = './build'

// Set the banner content
var banner = ['/*!\n',
  ' * Circles Website - <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)\n',
  ' * Copyright 2018-' + (new Date()).getFullYear(), ' <%= pkg.author %>\n',
  ' * Licensed under <%= pkg.license %> (https://github.com/CirclesUBI/cafe-grundeinkommen-website/blob/master/LICENSE)\n',
  ' */\n',
  ''
].join('')

// Copy third party libraries from /node_modules into /vendor
gulp.task('vendor', function () {
  // Bootstrap
  gulp.src([
    './node_modules/bootstrap/dist/**/*',
    '!./node_modules/bootstrap/dist/css/bootstrap-grid*',
    '!./node_modules/bootstrap/dist/css/bootstrap-reboot*'
  ])
    .pipe(gulp.dest(mainBuildDir + '/vendor/bootstrap'))

  // Font Awesome
  gulp.src([
    './node_modules/font-awesome/**/*',
    '!./node_modules/font-awesome/{less,less/*}',
    '!./node_modules/font-awesome/{scss,scss/*}',
    '!./node_modules/font-awesome/.*',
    '!./node_modules/font-awesome/*.{txt,json,md}'
  ])
    .pipe(gulp.dest(mainBuildDir + '/vendor/font-awesome'))

  // jQuery
  gulp.src([
    './node_modules/jquery/dist/*',
    '!./node_modules/jquery/dist/core.js'
  ])
    .pipe(gulp.dest(mainBuildDir + '/vendor/jquery'))

  // jQuery Easing
  gulp.src([
    './node_modules/jquery.easing/*.js'
  ])
    .pipe(gulp.dest(mainBuildDir + '/vendor/jquery-easing'))
})

// Compile SCSS
gulp.task('css:compile', function () {
  return gulp.src('./scss/**/*.scss')
    .pipe(sass.sync({
      outputStyle: 'expanded'
    }).on('error', sass.logError))
    .pipe(header(banner, {
      pkg: pkg
    }))
    .pipe(gulp.dest(mainBuildDir + '/css'))
})

// Minify CSS
gulp.task('css:minify', ['css:compile'], function () {
  return gulp.src([
    mainBuildDir + '/css/*.css',
    '!' + mainBuildDir + '/css/*.min.css'
  ])
    .pipe(cleanCSS())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest(mainBuildDir + '/css'))
    .pipe(browserSync.stream())
})

// CSS
gulp.task('css', ['css:compile', 'css:minify'])

// Minify JavaScript
gulp.task('js:minify', function () {
  return gulp.src([
    './js/*.js',
    '!./js/*.min.js',
    './js/jquery_i18n/*.js',
    '!./js/jquery_i18n/*.min.js'
  ])
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(header(banner, {
      pkg: pkg
    }))
    .pipe(gulp.dest(mainBuildDir + '/js'))
    .pipe(browserSync.stream())
})

gulp.task('files:main', function () {
  return gulp.src([
    './img//**/*',
    './mail//**/*',
    './lang//**/*',
    'index.html',
    'jobs.html'
  ], { base: './' }).pipe(gulp.dest(mainBuildDir))
})

gulp.task('files:favicons', function () {
  return gulp.src('./img/favicons//**/*')
    .pipe(gulp.dest(mainBuildDir))
})

// Move files to build
gulp.task('files', ['files:main', 'files:favicons'])

// JS
gulp.task('js', ['js:minify'])

// Default task
gulp.task('build', ['css', 'js', 'vendor', 'files'])

// Configure the browserSync task
gulp.task('browserSync', function () {
  browserSync.init({
    server: {
      baseDir: mainBuildDir
    }
  })
})

// Dev task for developing
gulp.task('dev', ['css', 'js', 'vendor', 'files', 'browserSync'], function () {
  gulp.watch('./scss/*.scss', ['css'])
  gulp.watch('./js/*.js', ['js'])
  gulp.watch('./*.html', ['files', browserSync.reload])
})
