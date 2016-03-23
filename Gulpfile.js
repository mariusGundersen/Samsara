var gulp = require('gulp');
var less = require('gulp-less');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var babel = require('gulp-babel');
var cached = require('gulp-cached');
var concat = require('gulp-concat');
var nodemon = require('gulp-nodemon');

gulp.task('default', ['build'], function(){
});

gulp.task('build', ['css', 'babel', 'public', 'bower'], function(){
});

gulp.task('css', function() {
    return gulp.src('less/**/*.less')
      .pipe(sourcemaps.init())
      .pipe(less())
      .pipe(autoprefixer())
      .pipe(concat('style.css'))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest('dist/public/stylesheets/'));
});

gulp.task('babel', function() {
  return gulp.src(['src/**/*'])
    .pipe(cached('babel'))
    .pipe(sourcemaps.init())
    .pipe(babel({
      "presets": ["es2015-node4"],
      "plugins": [
        ["transform-async-to-module-method", {
          "module": "co",
          "method": "wrap"
        }],
        "add-module-exports",
        "transform-react-jsx"
      ]
    }))
    .pipe(sourcemaps.write('.', {includeContent: false, sourceRoot: __dirname + '/src'}))
    .pipe(gulp.dest('dist'));
});

gulp.task('public', function() {
  return gulp.src('public/**/*')
    .pipe(gulp.dest('dist/public'));
});

gulp.task('bower', function() {
  return gulp.src([
    'bower_components/cs-handjs/hand.minified.js',
    'bower_components/requirejs/require.js',
    'bower_components/pure/pure-min.css',
    'bower_components/font-awesome/css/font-awesome.min.css',
    'bower_components/font-awesome/fonts/*',
    'bower_components/es6-promise/promise.js',
    'bower_components/dependency-chain/require.plugin.chain.js',
    'bower_components/knockout/dist/knockout.js',
    'bower_components/deco/Dist/*'
  ], {base: 'bower_components'})
  .pipe(gulp.dest('dist/public/bower_components'));
})

gulp.task('watch', ['build', 'nodemon'], function(){
  gulp.watch('less/**/*.less', ['css']);
  gulp.watch('public/**/*', ['public']);
  gulp.watch('src/**/*', ['babel']);
});

gulp.task('nodemon', ['build'], function() {
  nodemon({
    script: 'dist/server.js',
    ext: 'js jsx',
    env: { 'NODE_ENV': 'development' },
    watch: [
      'dist/'
    ],
    execMap: {
      "js": "node --debug"
    },
    delay: 6
  });
});
