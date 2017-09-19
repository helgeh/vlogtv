'use strict';

var path        = require('path');
var gulp        = require('gulp');
var uglify      = require('gulp-uglify');
var ngAnnotate  = require('gulp-ng-annotate');
var watchify = require('watchify');
var browserify  = require('browserify');
var browserSync = require('browser-sync').create();
var source      = require('vinyl-source-stream');
var buffer      = require('vinyl-buffer');
var sourcemaps  = require('gulp-sourcemaps');
var gutil       = require('gulp-util');
var nodemon     = require('nodemon');
var del         = require('del'); // rm -rf
var less        = require('gulp-less');
var LessAutoprefix = require('less-plugin-autoprefix');
var pug         = require('gulp-pug');
var assign = require('lodash.assign');



var config = {
  backend: {
    files: ['index.js', 'package.json', 'lib/**/*'],
    dest: 'dist/'
  },
  frontend: {
    files: ['public/index.html'],
    dest: 'dist/public/'
  },
  templates: {
    files: ['public/templates/**/*.pug'],
    dest: 'dist/'
  },
  js: {
    files: ['public/js/**/*.js'],
    dest: 'dist/'
  },
  styles: {
    files: ['./public/less/**/*.less'],
    dest: 'dist/'
  }
};


// gulp.task('clean', function() {
//     return del(['dist/*']);
// });


function cleanPart(obj) {
  return del(obj.files.map(function(glob){ return path.join(obj.dest, glob); }));
}


gulp.task('backend-clean', function () {
  return cleanPart(config.backend);
});

gulp.task('backend', ['backend-clean'], function () {
  return gulp.src(config.backend.files, { base: '.' })
    .pipe(gulp.dest(config.backend.dest));
});



gulp.task('frontend-clean', function () {
  return cleanPart(config.frontend);
});

gulp.task('frontend', function () {
  return gulp.src(config.frontend.files)
    // .pipe(pug())
    .pipe(gulp.dest(config.frontend.dest));
});




gulp.task('templates-clean', function () {
  return cleanPart(config.templates);//del(config.frontend.files.map(function(glob){ return path.join(config.frontend.dest, glob); }));
});

gulp.task('templates', ['templates-clean'], function () {
  return gulp.src(config.templates.files, { base: '.' })
    .pipe(pug())
    .pipe(gulp.dest(config.templates.dest));
});




var watcher = watchify(browserify(assign({}, watchify.args, {
  entries: './public/js/script.js',
  debug: true
})));

gulp.task('js-clean', function () {
  return cleanPart(config.js);
});

gulp.task('js', ['js-clean'], function () {
  // set up the browserify instance on a task basis

  // var b = browserify();

  return watcher.bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
        // Add transformation tasks to the pipeline here.
        .pipe(ngAnnotate())
        .pipe(uglify())
        .on('error', gutil.log)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/public/js/'));
});

// create a task that ensures the `js` task is complete before
// reloading browsers
gulp.task('js-watch', ['js'], function (done) {
    browserSync.reload();
    done();
});






gulp.task('styles-clean', function () {
  return cleanPart(config.styles);
});

var autoprefix = new LessAutoprefix({ browsers: ['last 2 versions'] });

gulp.task('styles', ['styles-clean'], function() {
    var stream = gulp.src(config.styles.files)
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(less({
          paths: [path.join(__dirname, 'public/less', 'includes')],
          plugins: [autoprefix]
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./dist/public/css/'))
        .pipe(browserSync.stream());
    return stream;
});

gulp.task('styles-watch', ['styles'], function (done) {
  // TODO: add css injection 
});






gulp.task('nodemon', ['styles', 'js'], function (done) {
  
  var started = false;
  
  return nodemon({
    script: './dist/index.js'
  }).on('start', function () {
    // to avoid nodemon being started multiple times
    // thanks @matthisk
    if (!started) {
      done();
      started = true; 
    } 
  });
});



// use default task to launch Browsersync and watch JS files
gulp.task('serve', ['templates', 'backend', 'frontend', 'nodemon'], function () {

    // Serve files from the root of this project
    browserSync.init({
        proxy: 'localhost:8001'
    });

    // add browserSync.reload to the tasks array to make
    // all browsers reload after tasks are complete.
    gulp.watch('public/js/**/*.js', ['js-watch']);
    gulp.watch('public/templates/**/*.pug', ['templates']);
});