/*eslint-env node*/
var gulp = require('gulp'),
    eslint = require('gulp-eslint');

gulp.task('default', ['eslint'], () => {
    
});

gulp.task('eslint', () => {
    return gulp.src(['./public/js/**/*.js', './*.js', './routes/**/*.js', './silo/**/*.js'])
    // eslint() attaches the lint output to the eslint property
    // of the file object so it can be used by other modules.
        .pipe(eslint({
            rulePaths: [
                './'
            ],
            rules: {
                indent: [
                    2,
                    4
                ],
                quotes: [
                    2,
                    'single'
                ],
                'linebreak-style': [
                    2,
                    'unix'
                ],
                semi: [
                    2,
                    'always'
                ]
            },
            env: {
                es6: true,
                node: true,
                browser: true
            },
            extends: 'eslint:recommended',
            'predef': ['angular']
        }))
    // eslint.format() outputs the lint results to the console.
    // Alternatively use eslint.formatEach() (see Docs).
        .pipe(eslint.format())
    // To have the process exit with an error code (1) on
    // lint error, return the stream and pipe to failAfterError last.
        .pipe(eslint.failAfterError());        
});

gulp.task('watch', () => {
    gulp.watch(['./*.js', './routes/**/*.js', './silo/**/*.js', './public/js/**/*.js'], ['eslint']);
});
