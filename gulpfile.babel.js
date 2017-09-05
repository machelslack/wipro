'use strict';

import gulp from 'gulp';
import browserSync from 'browser-sync';
import gulpLoadPlugins from 'gulp-load-plugins';
import webpack from 'webpack-stream';
import del from 'del';
import runSequence from 'run-sequence';

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

gulp.task('serve', ['scripts', 'styles'], () => {
  browserSync({
    notify: false,
    logPrefix: 'WSK',
    scrollElementMapping: ['main'],
    server: ['.tmp', 'app'],
    port: 3000
  });
  gulp.watch(['app/**/*.html'], reload);
  gulp.watch(['app/styles/**/*.{scss,css}'], ['styles', reload]);
  gulp.watch(['app/scripts/**/*.js','app/components/**/*.jsx'], ['lint', 'scripts', reload]);
  gulp.watch(['app/images/**/*'], reload);
});

gulp.task('styles', () => {
  const AUTOPREFIXER_BROWSERS = [
    'ie >= 10',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10'
  ];
  return gulp.src([
    'app/styles/**/*.scss',
    'app/styles/**/*.css'
  ])
    .pipe($.newer('.tmp/styles'))
    .pipe($.sourcemaps.init())
    .pipe($.sass({
      precision: 10
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
    .pipe(gulp.dest('.tmp/styles'))
    .pipe($.if('*.css', $.cssnano()))
    .pipe($.size({title: 'styles'}))
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest('dist/styles'))
    .pipe(gulp.dest('.tmp/styles'));
});

gulp.task('lint', () =>
  gulp.src(['app/scripts/**/*.js','!node_modules/**'])
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe($.if(!browserSync.active, $.eslint.failAfterError()))
);

gulp.task('scripts', () =>
    gulp.src([
      './app/scripts/main.js' 
      ])
      .pipe($.newer('.tmp/scripts'))
      .pipe($.sourcemaps.init())
      .pipe($.babel({
      presets: ['env']
      }))
      .pipe($.sourcemaps.write())
      .pipe(gulp.dest('.tmp/scripts'))
      .pipe($.concat('main.min.js'))
      .pipe($.uglify({preserveComments: 'some'}))
      .pipe($.size({title: 'scripts'}))
      .pipe($.sourcemaps.write('.'))
      .pipe(gulp.dest('dist/scripts'))
      .pipe(gulp.dest('.tmp/scripts'))
);



gulp.task('images', () =>
  gulp.src('app/images/**/*')
    .pipe($.cache($.imagemin({
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest('dist/images'))
    .pipe($.size({title: 'images'}))
);


gulp.task('copy', () =>
  gulp.src([
    'app/*',
    '!app/*.html',
    'node_modules/apache-server-configs/dist/.htaccess'
  ], {
    dot: true
  }).pipe(gulp.dest('dist'))
    .pipe($.size({title: 'copy'}))
);

gulp.task('html', () => {
  return gulp.src('app/**/*.html')
    .pipe($.useref({
      searchPath: '{.tmp,app}',
      noAssets: true
    }))
    .pipe($.if('*.html', $.htmlmin({
      removeComments: true,
      collapseWhitespace: true,
      collapseBooleanAttributes: true,
      removeAttributeQuotes: true,
      removeRedundantAttributes: true,
      removeEmptyAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      removeOptionalTags: true
    })))
    .pipe($.if('*.html', $.size({title: 'html', showFiles: true})))
    .pipe(gulp.dest('dist'));
});


gulp.task('clean', () => del(['.tmp', 'dist/*', '!dist/.git'], {dot: true}));


gulp.task('default', ['clean'], cb =>
  runSequence(
    'styles',
    ['lint', 'html', 'images', 'copy','scripts'],
    cb
  )
);



