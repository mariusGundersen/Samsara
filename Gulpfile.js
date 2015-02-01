var gulp = require('gulp');


gulp.task('default', ['bower'], function(){
});

gulp.task('build', ['bower'], function(){
});

gulp.task('bower', function(){
  gulp.src('bower_components/pure/pure-min.css')
  .pipe(gulp.dest('public/bower/pure'));
});