var gulp = require('gulp'),
    ugly = require('gulp-uglify'),
    name = require('gulp-rename');

gulp.task('ew', function () {
  return gulp.src('./HTTP.js')
  .pipe(ugly({
    preserveComments: 'all'
  }))
  .pipe(name('HTTP.min.js'))
  .pipe(gulp.dest('./'));
});

gulp.task('ugly', function () {
  gulp.watch('./HTTP.js', ['ew']);
});
