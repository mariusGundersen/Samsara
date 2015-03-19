var gulp = require('gulp');


gulp.task('default', ['bower'], function(){
});

gulp.task('build', ['bower'], function(){
});

gulp.task('bower', function(){
  gulp.src(paths.bower, {base:'bower_components'})
  .pipe(gulp.dest('public/bower_components'));
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