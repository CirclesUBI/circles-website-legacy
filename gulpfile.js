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
var runSequence = require('run-sequence');

const mainBuildDir = './build'
const donateBuildDir = './build-donate'

var subdomainList = []
var subdomainCounter = 0

function populateSubdomainList (es) {
  return es.map(function (file, cb) {
    let filename = file.path.replace(/^.*[\\/]/, '')
    let i = filename.indexOf('.html')
    if (i === -1) return cb() // skip if not .html file
    let subdomain = filename.slice(0, -5)
    console.log('adding subdomain: ' + subdomain)
    subdomainList.push({'filename': filename, 'url': 'https://' + subdomain + '.joincircles.net', 'folder': 'build-' + subdomain})
    return cb(null, file)
  })
}

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

gulp.task('files:all', function () {
  return gulp.src([
    './img//**/*',
    './mail//**/*',
    './lang//**/*',
    './subdomains//**/*',
    'index.html'
  ], {base: './'}).pipe(gulp.dest(mainBuildDir))
})

gulp.task('files:main', function () {
  return gulp.src([
    './img//**/*',
    './mail//**/*',
    './lang//**/*',
    'index.html'
  ], {base: './'}).pipe(gulp.dest(mainBuildDir))
})

gulp.task('subdomains:list', function () {
  return gulp.src([
    './subdomains//**/*'
  ], {base: './'}).pipe(populateSubdomainList(es))
})

gulp.task('subdomain:replaceUrls', function () {
  for (let i in subdomainList) {
    let sub = subdomainList[i]
    gulp.src('index.html').pipe(replace(sub.filename, sub.url)).pipe('index.html')
  }
})

function replaceSequential (subdomainList) {
  if (!subdomainList || subdomainList.length <= 0) return

  const sub = subdomainList[0]
  gulp.start('subdomain:replaceUrls2', () => {
    console.log(`${sub.name} finished`)
    replaceSequential(sub.slice(1))
  })
}

function runSequentialTask (taskName, dataArray, count) {
  console.log(taskName, dataArray, count)
  if (!dataArray || count >= dataArray.length) return
  subdomainCounter = count
  console.log('rst-', subdomainCounter)
  return gulp.start(taskName, () => {
    console.log('prob here')
    runSequentialTask(taskName, dataArray, ++count)
  })
}

gulp.task('subdomains', ['subdomains:list', 'subdomains:replaceUrls'])

gulp.task('subdomains2', function (callback) {
  runSequence('subdomains:list', 'subdomains:replaceUrls', callback)
})

gulp.task('subdomains:replaceUrls', () => runSequentialTask('subdomain:replaceUrls', subdomainList, 0))

gulp.task('subdomain:replaceUrls', function () {
  return gulp.src(['index.html', './subdomains//**/*'])
    .pipe(replace(subdomainList[subdomainCounter].filename, subdomainList[subdomainCounter].url))
    .pipe(gulp.dest(function (file) {
      return file.base
    }))
})

// gulp.task('countSubdom', function() {
//   nmFiles += gulp.src('finals/**.*')
//       .pipe(count('<%= counter %>'));
//       return true;
// });

gulp.task('files:donate', function () {
  return gulp.src([
    './build//**/*'
  ], {base: './'}).pipe(gulp.dest(donateBuildDir))
})

gulp.task('files:donateIndex', function () {
  return gulp.src([
    'donate.html'
  ], {base: './'}).pipe(rename('index.html')).pipe(gulp.dest(donateBuildDir))
})

gulp.task('files:favicons', function () {
  return gulp.src('./favicons//**/*')
    .pipe(gulp.dest(mainBuildDir))
})

// Move files to build
gulp.task('devFiles', ['files:all', 'files:favicons'])
gulp.task('buildFiles', ['files:main', 'files:favicons'])

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

// Dev task for developing
gulp.task('dev', ['css', 'js', 'vendor', 'devFiles', 'browserSync'], function () {
  gulp.watch('./scss/*.scss', ['css'])
  gulp.watch('./js/*.js', ['js'])
  gulp.watch('./*.html', ['files', browserSync.reload])
})

// Build is run on the CI
gulp.task('build', ['css', 'js', 'vendor', 'buildFiles', 'browserSync'], function () {
  gulp.watch('./scss/*.scss', ['css'])
  gulp.watch('./js/*.js', ['js'])
  gulp.watch('./*.html', ['files', browserSync.reload])
})
