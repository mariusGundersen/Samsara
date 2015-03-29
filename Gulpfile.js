var gulp = require('gulp');
var less = require('gulp-less');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');

gulp.task('default', ['build'], function(){
});

gulp.task('build', ['bower', 'css'], function(){
});

gulp.task('bower', function(){
  gulp.src(paths.bower, {base:'bower_components'})
  .pipe(gulp.dest('public/bower_components'));
});
 
gulp.task('css', function () {
    return gulp.src('less/**/*.less')
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(autoprefixer())
        .pipe(concat('style.css'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('public/stylesheets/'));
});

var paths = {
  bower: [
    'bower_components/pure/pure-min.css',
    'bower_components/es6-promise/promise.js',
    'bower_components/deco/Dist/*',
    'bower_components/requirejs/require.js',
    'bower_components/knockout/dist/*',
    'bower_components/cs-handjs/hand.minified.js',
    'bower_components/font-awesome/{css,fonts}/*'
  ]
};