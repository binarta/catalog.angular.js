var gulp = require('gulp'),
    minifyHtml = require('gulp-minify-html'),
    templateCache = require('gulp-angular-templatecache');

var minifyHtmlOpts = {
    empty: true,
    cdata: true,
    conditionals: true,
    spare: true,
    quotes: true
};

gulp.task('catalog-bootstrap3', function () {
    gulp.src('template/bootstrap3/*.html')
        .pipe(minifyHtml(minifyHtmlOpts))
        .pipe(templateCache('catalog-tpls-bootstrap3.js', {standalone: true, module: 'catalog.templates'}))
        .pipe(gulp.dest('src'));
});

gulp.task('catalog-unavailable-bootstrap3', function () {
    gulp.src('template/bootstrap3/unavailable/*.html')
        .pipe(minifyHtml(minifyHtmlOpts))
        .pipe(templateCache('catalog-unavailable-tpls-bootstrap3.js', {standalone: true, module: 'catalog.templates'}))
        .pipe(gulp.dest('src'));
});

gulp.task('default', ['catalog-bootstrap3', 'catalog-unavailable-bootstrap3']);