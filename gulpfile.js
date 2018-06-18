'use strict';

const gulp = require('gulp'),
      sass = require('gulp-sass'),
      babel = require('gulp-babel'),
      concat = require('gulp-concat'),
      uglify = require('gulp-uglify'),
      addsrc = require('gulp-add-src'),
      autoprefixer = require('gulp-autoprefixer'),
      jshint = require('gulp-jshint'),
      cleanCSS = require('gulp-clean-css'),
      imagemin = require('gulp-imagemin'),
      connect = require('gulp-connect'),
      critical = require('critical'),
      htmlminify = require("gulp-html-minify"),
      browserSync = require('browser-sync');
 
gulp.task('webserver', () => {
  connect.server({
    root: 'src',
    livereload: true,
    port: 8000,
    host: '0.0.0.0'
  });
});

// Static server
gulp.task('browser-sync', () => {
  browserSync.create().init({
      server: {
          baseDir: 'src/'
      }
  });
});

// Development Tasks
gulp.task('dev:html', () => {
  gulp.src('src/*.html')
    .pipe(connect.reload());
});

gulp.task('dev:js', () => {
  gulp.src([
    './node_modules/vanilla-lazyload/dist/lazyload.js',
    'src/js/*.js'
  ])
    .pipe(jshint())
    .pipe(concat('script.js'))
    .pipe(gulp.dest('./src/scripts'))
    .pipe(connect.reload());
});

gulp.task('dev:sass', () => {
  return gulp.src('src/sass/**/*.scss')
    .pipe(sass({
      includePaths: 'src/sass'
    }).on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions', 'ie >= 9']
    }))
    .pipe(concat('style.css'))
    .pipe(gulp.dest('src/css'))
    .pipe(connect.reload());
});

gulp.task('watch', ['dev:sass','dev:html', 'dev:js'], () => {
  gulp.watch(['src/*.html'], ['dev:html']);
  gulp.watch(['src/sass/**/*.scss'], ['dev:sass']);
  gulp.watch(['src/js/*.js'], ['dev:js']);
});

// Production Tasks
gulp.task('prod:sass', () => {
  return gulp.src('./src/sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions', 'ie >= 9']
    }))
    .pipe(concat('style.css'))
    .pipe(cleanCSS())
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('critical',  () => {
  critical.generate({
    base: './dist/',
    src: 'index.html',
    css: ['./dist/css/style.css'],
    dimensions: [{
      width: 320,
      height: 480
    },{
      width: 768,
      height: 1024
    },{
      width: 1280,
      height: 960
    }],
    dest: './css/critical.css',
    minify: true,
    extract: true
  });
});

gulp.task('critical:dev',  () => {
  critical.generate({
    base: './src/',
    src: 'index.html',
    css: ['./src/css/style.css'],
    dimensions: [{
      width: 320,
      height: 480
    },{
      width: 768,
      height: 1024
    },{
      width: 1280,
      height: 960
    }],
    dest: './css/critical.css',
    minify: true,
    extract: true
  });
});

gulp.task('prod:js', () => {
  gulp.src(
    [
      './node_modules/babel-polyfill/dist/polyfill.js',
      'src/js/*.js'
    ])
    .pipe(babel({presets: ['es2015']}))
    .pipe(uglify())
    .pipe(addsrc.prepend('./node_modules/vanilla-lazyload/dist/lazyload.min.js'))
    .pipe(concat('script.js'))
    .pipe(gulp.dest('./dist/scripts'));
});

gulp.task('images', () =>
	gulp.src('src/img/**/*')
		.pipe(imagemin([
      imagemin.gifsicle({interlaced: true}),
      imagemin.jpegtran({progressive: true}),
      imagemin.optipng({optimizationLevel: 5}),
      imagemin.svgo({
        plugins: [
          {removeViewBox: true},
          {cleanupIDs: false}
        ]
      })
    ]))
		.pipe(gulp.dest('dist/img'))
);

gulp.task('media', () => {
  gulp.src('src/media/*')
    .pipe(gulp.dest('dist/media'));
});

gulp.task('prod:html', () => {
  gulp.src('src/index.html')
    .pipe(htmlminify())
    .pipe(gulp.dest('dist'));
});

gulp.task('default', [ 'dev:html', 'dev:sass', 'dev:js', 'webserver', 'critical:dev', 'watch' ]);
gulp.task('build', [ 'prod:sass', 'critical', 'prod:js', 'prod:html', 'images', 'media' ]);