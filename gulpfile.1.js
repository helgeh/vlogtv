'use strict';

var path = require('path');
var watchify = require('watchify');
var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var del = require('del'); // rm -rf
// var reactify = require('reactify');
var less = require('gulp-less');
var assign = require('lodash.assign');
var nodemon = require('gulp-nodemon');


// var sass = require('gulp-ruby-sass');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;
var javascriptWatch;


gulp.task('backend', ['clean'], function () {
  return gulp.src(['index.js', 'package.json', 'lib/**/*'])
    .pipe(gulp.dest('./dist/'));
});


gulp.task('javascript', ['clean'], function () {
  var opts = assign({}, watchify.args, {
    entries: ['./public/js/script.js'],
    debug: true
  });
  javascriptWatch = watchify(browserify(opts));
  javascriptWatch.on('update', bundle);
  javascriptWatch.on('log', gutil.log);
  return bundle();
});

function bundle() {
  return javascriptWatch.bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
        // Add transformation tasks to the pipeline here.
        .pipe(uglify())
        .on('error', gutil.log)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/public/js/'));
    // .pipe(reload);
}


// gulp.task('sass', function() {
//   return sass('scss/styles.scss')
//     .pipe(gulp.dest('dist/public/css'))
//     .pipe(reload({ stream:true }));
// });

gulp.task('nodemon', function (cb) {
  
  var started = false;
  
  return nodemon({
    script: './dist/index.js'
  }).on('start', function () {
    // to avoid nodemon being started multiple times
    // thanks @matthisk
    if (!started) {
      cb();
      started = true; 
    } 
  });
});

// watch Sass files for changes, run the Sass preprocessor with the 'sass' task and reload
gulp.task('serve', ['build', 'nodemon'], function() {
  // browserSync({
  //   server: {
  //     baseDir: 'dist'
  //   }
  // });
  browserSync.init({
    proxy: "localhost:8001"
  });

  // gulp.watch('app/scss/*.scss', ['sass']);
  gulp.watch('./public/less/**/*', ['styles']);
});



gulp.task('clean', function() {
    return del(['dist']);
});

// gulp.task('templates', ['clean'], function() {
//     var stream = gulp.src(['src/templates/*.hbs'])
//         // do some concatenation, minification, etc.
//         .pipe(gulp.dest('output/templates/'));
//     return stream; // return the stream as the completion hint

// });

var LessAutoprefix = require('less-plugin-autoprefix');
var autoprefix = new LessAutoprefix({ browsers: ['last 2 versions'] });

gulp.task('styles', ['clean'], function() {
    var stream = gulp.src('./public/less/**/*.less')
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

// gulp.task('build', ['templates', 'styles']);
gulp.task('build', ['backend', 'styles', 'javascript'], function (done) {
  return done();
});

// templates and styles will be processed in parallel.
// clean will be guaranteed to complete before either start.
// clean will not be run twice, even though it is called as a dependency twice.

gulp.task('default', ['build']);