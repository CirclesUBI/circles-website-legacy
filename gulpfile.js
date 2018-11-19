var gulp = require('gulp')
var sass = require('gulp-sass')
var header = require('gulp-header')
var cleanCSS = require('gulp-clean-css')
var rename = require('gulp-rename')
var uglify = require('gulp-uglify')
var replace = require('gulp-replace')

var pkg = require('./package.json')
var browserSync = require('browser-sync').create()

var es = require('event-stream')
// var log = require('gulp-util').log
var runSequence = require('run-sequence')

const mainBuildDir = './build'

// Set the banner content
var banner = ['/*!\n',
  ' * Café Grundeinkommen Website - <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)\n',
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
    'index.html'
  ], { base: './' }).pipe(gulp.dest(mainBuildDir))
})

gulp.task('files:favicons', function () {
  return gulp.src('./img/favicons//**/*')
    .pipe(gulp.dest(mainBuildDir))
})

// Move files to build
gulp.task('devFiles', ['files:main', 'files:favicons', 'files:devSubdomains'])
gulp.task('files', ['files:main', 'files:favicons'])
gulp.task('subdomainFiles', ['files:main', 'files:favicons'])

// JS
gulp.task('js', ['js:minify'])

// Default task
gulp.task('default', ['css', 'js', 'vendor', 'files'])

// Configure the browserSync task
gulp.task('browserSync', function () {
  browserSync.init({
    server: {
      baseDir: mainBuildDir
    }
  })
})

// SUBDOMAIN STUFF
// todo: fix having to run gulp 5 times

var subdomainList = []
var subdomainRedirectList = []
var subdomainCounter = 0

function populateSubdomainList (es) {
  return es.map(function (file, cb) {
    let filename = file.path.replace(/^.*[\\/]/, '')
    let i = filename.indexOf('.html')
    if (i === -1) return cb() // skip if not .html file
    let subdomain = filename.slice(0, -5)
    subdomainList.push({ 'filename': filename, 'url': 'https://' + subdomain + '.joincircles.net', 'folder': 'build-' + subdomain })
    return cb(null, file)
  })
}

function populateSubdomainRedirectList (es) {
  return es.map(function (file, cb) {
    let filename = file.path.replace(/^.*[\\/]/, '')
    let i = filename.indexOf('.html')
    if (i === -1) return cb() // skip if not .html file
    let subdomain = filename.slice(0, -5)
    subdomainRedirectList.push({ 'filename': filename, 'url': 'https://' + subdomain + '.joincircles.net', 'folder': 'build-' + subdomain })
    return cb(null, file)
  })
}

// hacky: runs taskName on every entry in dataArray
function runSequentialTask (taskName, dataArray, count) {
  if (!dataArray || count >= dataArray.length) return
  subdomainCounter = count
  return gulp.start(taskName, () => {
    runSequentialTask(taskName, dataArray, ++count)
  })
}

// hacky: pops the subdomainList array
gulp.task('subdomains:list', function () {
  return gulp.src([
    './subdomains/full/*'
  ], { base: './' }).pipe(populateSubdomainList(es))
})

gulp.task('subdomains:redirectList', function () {
  return gulp.src([
    './subdomains/redirects/*'
  ], { base: './' }).pipe(populateSubdomainRedirectList(es))
})

// this must be run first
gulp.task('subdomains1', function (callback) {
  runSequence('subdomains:list', 'subdomains:replaceUrls', callback)
})

// this must be run second
gulp.task('subdomains2', function (callback) {
  runSequence('subdomains:list', 'subdomains:replaceIndexUrls', callback)
})

// then
gulp.task('subdomains3', function (callback) {
  runSequence('webfiles', 'subdomainFiles', callback)
})

gulp.task('webfiles', ['css', 'js', 'vendor'])

// then run this
gulp.task('subdomains4', function (callback) {
  runSequence('subdomains:list', 'subdomains:buildSubdomains', callback)
})

gulp.task('subdomains5', function (callback) {
  runSequence('subdomains:redirectList', 'subdomains:buildSubdomainRedirects', callback)
})

gulp.task('subdomains:replaceUrls', () => runSequentialTask('subdomains:replaceSubUrls', subdomainList, 0))
gulp.task('subdomains:replaceIndexUrls', () => runSequentialTask('subdomains:replaceSubIndexUrls', subdomainList, 0))
gulp.task('subdomains:buildSubdomains', () => runSequentialTask('files:buildSubdomains', subdomainList, 0))
gulp.task('subdomains:buildSubdomainRedirects', () => runSequentialTask('files:buildSubdomainRedirects', subdomainRedirectList, 0))

gulp.task('subdomains:replaceSubUrls', function () {
  return gulp.src(['index.html', './subdomains/full/*'])
    .pipe(replace(subdomainList[subdomainCounter].filename, subdomainList[subdomainCounter].url))
    .pipe(gulp.dest(function (file) {
      return file.base
    }))
})

gulp.task('subdomains:replaceSubIndexUrls', function () {
  return gulp.src('./subdomains/full/' + subdomainList[subdomainCounter].filename)
    .pipe(replace('index.html', 'https://www.joincircles.net'))
    .pipe(rename('index.html'))
    .pipe(gulp.dest(subdomainList[subdomainCounter].folder))
})

gulp.task('files:devSubdomains', function () {
  return gulp.src([
    './subdomains/full/*'
  ]).pipe(gulp.dest(mainBuildDir))
})

gulp.task('files:buildSubdomains', function () {
  return gulp.src([
    './build//**/*', '!./build/index.html'
  ]).pipe(gulp.dest(subdomainList[subdomainCounter].folder))
})

gulp.task('files:buildSubdomainRedirects', function () {
  return gulp.src([
    './subdomains/redirects/' + subdomainRedirectList[subdomainCounter].filename
  ])
    .pipe(rename('index.html'))
    .pipe(gulp.dest(subdomainRedirectList[subdomainCounter].folder))
})

// MAIN TASKS

// Dev task for developing
gulp.task('dev', ['css', 'js', 'vendor', 'devFiles', 'browserSync'], function () {
  gulp.watch('./scss/*.scss', ['css'])
  gulp.watch('./js/*.js', ['js'])
  gulp.watch('./*.html', ['files', browserSync.reload])
})
