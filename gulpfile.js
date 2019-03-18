var gulp = require('gulp'),
    minifyHtml = require('gulp-minify-html'),
    template = require('gulp-template'),
    templateCache = require('gulp-angular-templatecache');

var minifyHtmlOpts = {
    empty: true,
    cdata: true,
    conditionals: true,
    spare: true,
    quotes: true
};

gulp.task('catalog-unavailable-bootstrap3', function () { // TODO - is there a difference here with catalog-bootstrap3?
    gulp.src(['template/bootstrap3/*.html'])
        .pipe(template({shop: false}))
        .pipe(minifyHtml(minifyHtmlOpts))
        .pipe(templateCache('catalog-unavailable-tpls-bootstrap3.js', {standalone: true, module: 'catalog.templates'}))
        .pipe(gulp.dest('src'));
});

gulp.task('catalog-bootstrap3', function () {
    gulp.src(['template/bootstrap3/*.html'])
        .pipe(template({shop: false}))
        .pipe(minifyHtml(minifyHtmlOpts))
        .pipe(templateCache('catalog-tpls-bootstrap3.js', {standalone: true, module: 'catalog.templates'}))
        .pipe(gulp.dest('src'));
});

gulp.task('catalog-shop-bootstrap3', function () {
    gulp.src(['template/bootstrap3/*.html'])
        .pipe(template({shop: true}))
        .pipe(minifyHtml(minifyHtmlOpts))
        .pipe(templateCache('catalog-shop-tpls-bootstrap3.js', {standalone: true, module: 'catalog.templates'}))
        .pipe(gulp.dest('src'));
});

gulp.task('templates:all', ['catalog-bootstrap3', 'catalog-unavailable-bootstrap3', 'catalog-shop-bootstrap3']);

gulp.task('templates:watch', ['templates:all'], function () {
    gulp.watch('template/**/*.html', function () {
        gulp.start('templates:all');
    });
});

gulp.task('default', ['catalog-bootstrap3', 'catalog-unavailable-bootstrap3', 'catalog-shop-bootstrap3']);