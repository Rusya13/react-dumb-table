const gulp = require('gulp');
const babel = require('gulp-babel');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');

// production
gulp.task('build', ['js', 'scss']);

gulp.task('js', () => {
    return gulp.src('src/index.js')
        .pipe(babel({
            presets: [
                'es2015',
                'react'
            ]
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('scss', () => {
    return gulp.src('./src/style.scss')
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(gulp.dest('./dist'));
});