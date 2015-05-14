var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
 
gulp.task('js', function() {
  return gulp.src('./src/*.js')
    .pipe(concat('jquery.sparkline.js'))
    .pipe(gulp.dest('./dist/'));
});