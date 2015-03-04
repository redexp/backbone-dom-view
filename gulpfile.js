var gulp = require('gulp');
var uglify = require('gulp-uglifyjs');

gulp.task('default', function() {
    gulp.src('backbone-dom-view.js')
        .pipe(uglify('backbone-dom-view.min.js', {
            mangle: false
        }))
        .pipe(gulp.dest('./'))
    ;
});