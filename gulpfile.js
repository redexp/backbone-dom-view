var gulp = require('gulp');
var replace = require('gulp-replace');
var uglify = require('gulp-uglifyjs');

gulp.task('default', function() {
    gulp.src('backbone-dom-view.js')
        .pipe(replace('var _DEV_ = true;', ''))
        .pipe(uglify('backbone-dom-view.min.js', {
            mangle: false,
            compress: {
                global_defs: {
                    '_DEV_': false
                },
                unused: true
            }
        }))
        .pipe(gulp.dest('./'))
    ;
});