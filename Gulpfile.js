var gulp = require('gulp');
var less = require('gulp-less');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');

gulp.task('default', ['build'], function(){
});

gulp.task('build', ['css'], function(){
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

gulp.task('watch', ['css'], function(){
  gulp.watch('less/**/*.less', ['css']);
});

var paths = {
  
};